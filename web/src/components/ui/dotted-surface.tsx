'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  speed?: number;
};

export function DottedSurface({ className, speed = 0.02, ...props }: DottedSurfaceProps) {
	const { resolvedTheme } = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const SEPARATION = 90;
		const AMOUNTX = 70;
		const AMOUNTY = 100;

		// Scene setup
		const scene = new THREE.Scene();
		const isDark = resolvedTheme === 'dark';
		// Resolve brand color from CSS variable so it matches the rest of the content
		const brandPrimary = (() => {
			try {
				const v = getComputedStyle(document.documentElement)
					.getPropertyValue('--primary')
					.trim();
				return v || '#B2E67A';
			} catch {
				return '#B2E67A';
			}
		})();
		// Stronger fog to increase depth disappearance; match theme background
		scene.fog = new THREE.Fog(isDark ? 0x12332a : 0xffffff, 800, 3500);

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(scene.fog.color, 0);

		containerRef.current.appendChild(renderer.domElement);
		// Ensure the canvas never captures touch/scroll events on mobile
		renderer.domElement.style.pointerEvents = 'none';
		renderer.domElement.setAttribute('aria-hidden', 'true');
		const containerEl = containerRef.current;

		// Create particles
		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		// Generate a circular sprite texture so points render as circles
		const generateCircleTexture = () => {
			const size = 64;
			const canvas = document.createElement('canvas');
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d');
			if (!ctx) return null;
			ctx.clearRect(0, 0, size, size);
			ctx.beginPath();
			ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
			ctx.closePath();
			// White mask so material.color controls tint uniformly
			ctx.fillStyle = '#ffffff';
			ctx.fill();
			const texture = new THREE.CanvasTexture(canvas);
			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.generateMipmaps = false;
			return texture;
		};

		const dotTexture = generateCircleTexture();

		// Determine brightness range and curve based on theme
		const minBrightness = isDark ? 0.06 : 0.12; // 0..1
		const maxBrightness = isDark ? 1.0 : 0.95;  // 0..1
		const gamma = 1.6; // non-linear curve to accentuate fade with depth

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				// Depth-based brightness with non-linear mapping.
				// Light theme: farther -> brighter (toward white). Dark theme: farther -> darker (toward black).
				const depthNormalized = iy / (AMOUNTY - 1); // 0..1 front->back
				const t = Math.pow(depthNormalized, gamma);
				const brightness = isDark
					? maxBrightness - t * (maxBrightness - minBrightness)
					: minBrightness + t * (maxBrightness - minBrightness);
				colors.push(brightness, brightness, brightness); // 0..1 range for Float32 buffer
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 10,
			vertexColors: false,
			map: dotTexture ?? undefined,
			color: new THREE.Color(brandPrimary),
			alphaTest: 0.1,
			transparent: true,
			opacity: 1,
			fog: true,
			depthWrite: false,
			sizeAttenuation: true,
		});

		// Create points object
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId: number = 0;

		// Animation function
		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

					// Animate Y position with sine waves
					positions[index + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;

					i++;
				}
			}

			positionAttribute.needsUpdate = true;

			// For dynamic size changes, a custom shader would be required; keeping constant size for performance

			renderer.render(scene, camera);
			count += speed;
		};

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		// Start animation
		animate();

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);

			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);

				// Clean up Three.js objects
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerEl && sceneRef.current.renderer.domElement) {
					containerEl.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, [resolvedTheme, speed]);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none fixed inset-0 z-0', className)}
			{...props}
		/>
	);
}
