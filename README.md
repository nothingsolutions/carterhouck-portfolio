# Portfolio

Monospaced portfolio site built with Next.js 15, Tailwind CSS, and IBM Plex Mono.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customising content

### Your info
Edit `components/SiteHeader.tsx` to update:
- The title slug (e.g. `Dmo/Prvw_F329_47`)
- Bio paragraph
- Contact email (`href="mailto:..."`)
- Instagram URL (`href="https://instagram.com/..."`)

### Projects
Edit `lib/projects.ts` to update the project list. Each project has:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `code` | string | Catalog number shown below the image |
| `title` | string | Project title |
| `orientation` | `"vertical"` \| `"square"` \| `"horizontal"` | Controls image aspect ratio |
| `imageSrc` | string (optional) | Path to image in `public/images/` |
| `href` | string (optional) | Link for the SRC label |
| `group` | number | Row group number (1, 2, 3...) |

### Adding images
Drop images into `public/images/` and reference them as:
```ts
imageSrc: "/images/your-image.jpg"
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — click **Deploy**.

Every push to `main` will auto-deploy to production.
