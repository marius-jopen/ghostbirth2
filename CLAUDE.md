# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page website for the horror film "Ghost Birth 2" by Marius Jopen. Brutalist, minimal, dark aesthetic. Built with Next.js (App Router), TypeScript, CSS Modules.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — serve production build

## Architecture

- **Next.js App Router** with a single route (`app/page.tsx`) that composes section components
- **Styling:** CSS Modules per component + `app/globals.css` for shared styles (`.section`, `.section-title`, `.section-text`)
- **Fonts:** Two custom fonts loaded via `next/font/local` in `app/layout.tsx`:
  - `ABCGravity-ExtraCondensed.otf` → `--font-gravity` (display/headers)
  - `GT-Pressura-Mono-Regular.otf` → `--font-mono` (body text)
  - Font files live in `app/fonts/`
- **Components** in `components/`: Hero, Logline, About, Story, Director, Gallery, Status, Footer — each is a standalone section
- **Gallery** is the only client component (`"use client"`) — handles lightbox state and keyboard navigation
- **Images** served from `public/images/` (gallery) and `public/poster-background.jpg` (hero)
- **Original assets** preserved in `content/` (fonts, images, poster)

## Design Constraints

- Black background, white text, red accents (`#ff0000`)
- No rounded corners, gradients, shadows, or decorative elements
- No Tailwind — raw CSS Modules only
- No UI libraries or component frameworks
- Mobile-first, max-width ~900px for text content
