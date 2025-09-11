"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import Lenis from "lenis";
import { DefinitionRotator } from "../components/definition-rotator";
import { LogoMark } from "../components/logo-mark";

export default function Home() {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy?.();
    };
  }, [prefersReduced]);

  return (
    <main className="min-h-[100svh] flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-16 w-full">
        <div className="w-full max-w-[64ch] mx-auto select-none">
        <div className="mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.0 }}
            className="inline-block text-neutral-900 dark:text-neutral-100"
          >
            <LogoMark size={64} />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="text-base font-medium tracking-tight"
        >
          edaphic
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 text-base text-neutral-500 dark:text-neutral-400"
          aria-label="Pronunciation of Edaphic"
        >
          e·daph·ic <span className="mx-1">/</span>
          <span className="font-normal">əˈdafik</span>
          <span className="mx-1">/</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2"
        >
          <DefinitionRotator
            items={[
              "of, produced by, or influenced by the soil.",
              "AI-native venture studio.",
            ]}
          />
        </motion.div>

        </div>
      </div>
      <motion.footer
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="px-6 pb-8"
      >
        <div className="w-full max-w-[64ch] mx-auto text-base text-neutral-400">
          <a
            href="mailto:contact@edaphic.xyz"
            className="underline-offset-4 hover:underline focus-visible:underline outline-none"
          >
            contact@edaphic.xyz
          </a>
        </div>
      </motion.footer>
    </main>
  );
}
