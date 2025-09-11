Edaphic — micro landing

Stack: Next.js (App Router) + Tailwind CSS + Framer Motion + Vercel Analytics.

Commands

```bash
npm run dev    # start local server
npm run build  # production build
npm start      # run production server
```

Env

- NEXT_PUBLIC_SITE_URL (optional): set to `https://<your-domain>` for correct canonical/sitemap.

Deployment

1) Push this project to GitHub.
2) Import into Vercel, framework auto-detected.
3) Set `NEXT_PUBLIC_SITE_URL` in Vercel Project Settings → Environment Variables.
4) Assign domain when ready (e.g., edaphic.xyz).

Content

- Hero copy and rotating definition live in `src/app/page.tsx`.
- Logo assets are under `public/brand/`.

Social/SEO

- Open Graph image at `src/app/opengraph-image.tsx`.
- `robots.txt` and `sitemap.xml` auto-generated.
