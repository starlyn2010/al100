# Task 1: Setup Next.js 15 with shadcn/ui + Tailwind + Mapbox

**Context:** We need to create the Next.js app with all frontend dependencies.

**Working directory:** `/home/starlyn/Escritorio/AL100`

## Steps

1. Create Next.js 15 app in `apps/web` with TypeScript, Tailwind, ESLint, App Router, src directory, import alias `@/*`, npm:
   ```bash
   npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
   ```

2. Install dependencies:
   ```bash
   cd apps/web
   npm install @supabase/supabase-js @supabase/ssr react-map-gl mapbox-gl lucide-react class-variance-authority clsx tailwind-merge next-themes
   npm install -D @types/mapbox-gl
   ```

3. Initialize shadcn/ui with default config:
   ```bash
   cd apps/web
   npx shadcn@latest init -d --force
   ```

4. Add shadcn/ui components:
   ```bash
   cd apps/web
   npx shadcn@latest add button card dialog form input label select table tabs toast sheet dropdown-menu avatar badge separator skeleton progress
   ```

5. Update `apps/web/src/app/globals.css` with dark theme using these CSS variables:
   - --background: #0F172A
   - --foreground: #F8FAFC  
   - --primary: #1E293B
   - --accent: #22C55E
   - --muted: #272F42
   - --border: #475569
   - --destructive: #EF4444
   - --card: #1E293B
   - Google Fonts: Poppins (headings) + Open Sans (body)
   - Import fonts via @import url()

6. Update `apps/web/src/app/layout.tsx`:
   - Import font via next/font (Poppins for headings, Open Sans for body)
   - Add ThemeProvider (next-themes) wrapping children
   - Add Toaster (from shadcn/ui sonner)
   - Set lang="es", defaultTheme="dark"
   - Set metadata title: "AL100 - Recolección Inteligente"

7. Create files:
   - `apps/web/src/lib/utils.ts` (standard shadcn cn() helper)
   - `apps/web/src/lib/supabase.ts` (Supabase browser client using createBrowserClient from @supabase/ssr)
   - `apps/web/src/lib/mapbox.ts` (Mapbox config: token from env, style dark-v11, defaultCenter [-69.889, 18.486], defaultZoom 12)
   - `apps/web/src/types/index.ts` (all types from the spec: UserRole, User, Truck, Route, GPSLog, Incident, Sector, Prediction, Notification)

8. Create `apps/web/.env.local.example`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   ```

9. Make sure `apps/web/next.config.ts` has `output: undefined` (default Vercel config)

**Report file:** `.superpowers/sdd/task-1-report.md`
Write here after completion.

**Global constraints:**
- Node >= 22
- Dark mode theme (never light mode)
- All UI text in Spanish
- Lucide icons (no emojis)
- Poppins for headings, Open Sans for body
