# TikTok UX Demo

[English](./README.md) | [简体中文](./README.zh-CN.md)

A runnable React prototype shell built with real TUX Web components and tokens.

## Install and Run

Install dependencies:

```bash
npm i
```

Start dev server:

```bash
npm run dev
```

Build / preview:

```bash
npm run build
npm run preview
```

(`pnpm-lock.yaml` is included, so `pnpm i` / `pnpm dev` also work.)

## Agentation MCP

Development builds include the Agentation toolbar in the top-right corner.

Start the local MCP + HTTP bridge:

```bash
npm run agentation:server
```

Verify local setup:

```bash
npm run agentation:doctor
```

The toolbar connects to `http://localhost:4747` by default. Override with `VITE_AGENTATION_ENDPOINT`.

## Core Dependencies

- `@byted-tiktok/tux-web`: component library and app container via `<TUXApp />`
- `@byted-tiktok/tux-icons`: TikTok icon components
- `@byted-tiktok/tux-color`: color tokens and theme-driven CSS variables

## What Exists Now

- A mobile app shell: `src/components/app_frame.tsx`
- A 5-tab bottom navigation: `src/components/app_tab_bar_view.tsx` + `src/App.tsx`
- Five top-level pages in `src/page/*`
- A standalone page template at `/router_page` with its own `TUXApp`, `AppFrame`, and `TUXNavBar`
- A bottom-left route switcher in `src/components/route_switcher.tsx` using an icon + `TUXMenu`
- PWA support, so the app can be installed to desktop / home screen

## Routing Notes

Current navigation inside the main app is still tab-state based, not URL-route based.

- You can evolve an existing top-level page into a routed container page.
- You can add a new page under `src/page/` and host nested routes inside it.
- For a standalone route prototype, use `/router_page` as the simplest template.
- Keep routed content inside the TUX shell instead of mounting pages outside the app frame.

## Theme Notes

- Global theme state lives in `src/context/theme.tsx`
- `resolvedTheme` is passed into `<TUXApp theme={...} />`
- The global theme switcher is `src/components/theme_switcher.tsx`
- Tabs can force page theme through `themeOverride`
- `ThemeScope` can override theme locally for part of a page
