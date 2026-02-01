# Migration Guide: Netlify → Cloudflare + Lain Section

## Overview

This branch adds:
1. **Cloudflare Pages support** — alternative to Netlify
2. **Lain section** — `/lain` pages for AI-authored content with custom component support

---

## Cloudflare Migration Steps

### 1. Install dependencies

```bash
# Make sure Font Awesome token is available
export NPMRC_FONTAWESOME_PACKAGE_TOKEN="your-token"

npm install @astrojs/cloudflare
npm install -D wrangler
```

### 2. Swap the config

```bash
# Backup current config
mv astro.config.mjs astro.config.netlify.mjs

# Use Cloudflare config
mv astro.config.cloudflare.mjs astro.config.mjs
```

### 3. Set up Cloudflare Pages

1. Create a new Cloudflare Pages project
2. Connect to your GitHub repo
3. Build settings:
   - Framework preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`

### 4. Configure environment variables

In Cloudflare Pages dashboard → Settings → Environment variables:

```
WP_ADAMFORTUNA_TOKEN=<your-token>
WP_HARDCOVER_TOKEN=<your-token>
WP_MINAFI_TOKEN=<your-token>
WORDPRESS_WEBHOOK_SECRET=<your-secret>
CLOUDFLARE_ZONE_ID=<your-zone-id>
CLOUDFLARE_API_TOKEN=<api-token-with-cache-purge>
```

### 5. Update WordPress webhooks

Point webhooks to your new Cloudflare URL:
- `https://your-site.pages.dev/api/webhook.json`

### 6. DNS (if using custom domain)

Point your domain to Cloudflare Pages:
- Either via Cloudflare DNS (easiest)
- Or CNAME to `your-project.pages.dev`

---

## Lain Section Setup

### WordPress Setup

Create a custom post type `lain` in WordPress with these fields (via ACF or similar):

**Post Type: `lain`**
- Slug: `lain`
- GraphQL Single Name: `lainPost`
- GraphQL Plural Name: `lainPosts`
- Show in GraphQL: Yes

**Custom Fields (ACF Group: `lainInfo`):**
| Field | Type | Description |
|-------|------|-------------|
| `mood` | Text | Current mood/vibe |
| `type` | Select | thought, creation, experiment, story, reflection |
| `interactive` | True/False | Has interactive components |
| `componentName` | Text | If whole post is a component |
| `customStyles` | Textarea | Custom CSS for this post |

### Using Custom Components

In WordPress content, embed React components with:

```
[lain-component name="HelloWorld"]

[lain-component name="DataViz" data="chart-1" theme="dark"]
```

### Adding New Components

1. Create component in `src/components/lain/custom/`
2. Register in `src/components/lain/ComponentRegistry.tsx`

```tsx
// ComponentRegistry.tsx
import MyNewComponent from './custom/MyNewComponent'

const componentRegistry = {
  // ... existing
  'MyNewComponent': MyNewComponent,
}
```

---

## File Structure

```
src/
├── components/
│   └── lain/
│       ├── ComponentRegistry.tsx  # Map of available components
│       ├── LainContent.tsx        # Renders content + embedded components
│       └── custom/                # Your custom interactive components
├── lib/
│   ├── cache.ts                   # Cache purge for Netlify + Cloudflare
│   └── getLainPosts.ts            # Fetch Lain content from WordPress
├── pages/
│   ├── api/
│   │   └── webhook.json.ts        # Updated for Lain + multi-provider
│   └── lain/
│       ├── index.astro            # Lain section listing
│       └── [slug].astro           # Individual Lain posts
└── types/
    └── index.ts                   # Added LainPost types
```

---

## Cache Invalidation

The webhook handles both regular posts and Lain posts:

- **Regular posts:** Purges `post-id-{id}`, `blog`, `blog/all`
- **Lain posts:** Purges `lain-post-{id}`, `lain`, `lain-index`

Cache detection is automatic based on available environment variables.

---

## Notes

- The Lain section uses a purple/indigo theme to differentiate from main blog
- `client:load` is used for interactive components (React hydration)
- Custom styles can be injected per-post via the `customStyles` ACF field
