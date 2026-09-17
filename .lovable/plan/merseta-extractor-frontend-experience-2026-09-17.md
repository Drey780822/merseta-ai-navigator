# merSETA Extractor frontend experience

## Goal
Build a complete, frontend-only product prototype that feels like a quiet institutional research instrument rather than a dashboard or marketing site. All data, uploads, extraction, processing, chat, search, and settings behavior will be simulated locally.

## Product structure
- Create one cohesive application shell with a collapsible desktop sidebar, mobile drawer, compact header, profile menu, global search, theme control, and persistent bottom composer where relevant.
- Connect the requested experiences through mock navigation: welcome, new session, research chat, document intake, upload states, processing, document viewer, extracted knowledge, skill intelligence, settings, evidence, and empty/error/loading states.
- Use responsive page recomposition rather than shrinking desktop layouts: single-column mobile reading, drawer navigation, bottom-sheet secondary panels, and touch-safe controls.

## Visual system
- Carry the exact supplied palette into semantic light and deliberately designed dark tokens, with `#FBFAF7` as the primary light canvas.
- Use Open Sans throughout with editorial hierarchy, compact metadata, restrained uppercase eyebrows, architectural hairlines, 6–10px working radii, and minimal shadows.
- Reserve navy for structure, gold for selective emphasis, amber for attention/information, and green for verified confidence.
- Add subtle 180–420ms motion with reduced-motion fallbacks, visible keyboard focus, AA contrast, semantic landmarks, labels, and no horizontal overflow.

## Core components
- Build reusable brand, shell, navigation, header, breadcrumb, command search, modal/drawer, tooltip, dropdown, tabs, segmented controls, toast, skeleton, and state components.
- Build reusable document intake, document list, extraction progress, document reader, outline, evidence, skill tag, confidence, intelligence, and knowledge components.
- Build the conversation surface from AI Elements primitives for transcript, messages, response rendering, composer, loading shimmer, and tool/result presentation; preserve the requested editorial no-bubble assistant style.

## Screen details
- **Welcome:** spacious research-oriented empty state with the exact “Turn documents into knowledge.” hierarchy and restrained upload/session/workspace actions.
- **Upload and processing:** compact intake surface plus idle, hover, drag-over, uploading, reading, structuring, ready, complete, and failed mock states.
- **Research session:** realistic merSETA skills analysis, evidence, citations, tables, tags, hover-only message actions, and a premium grounded composer.
- **Document reader:** outline, report-like paper view, search/zoom controls, highlighted extraction evidence, and mobile single-column mode.
- **Knowledge and skills:** overview, skills, competencies, occupations, qualifications, technologies, sectors, evidence, confidence, and related-capability views using thin editorial dividers rather than dashboard cards.
- **Search and settings:** keyboard-accessible grouped command search and a complete category/settings workspace with mock controls.

## Branding and assets
- Use the supplied merSETA Extractor icon and lockup without alteration.
- Keep an exact co-branding slot for the official Wits and merSETA logos, preserving aspect ratio and clear space.
- The two separately supplied official institutional logo files are still required before the final branding check; the current uploads are the Extractor icon and Extractor lockup only.
- Create a real favicon from the supplied Extractor icon.

## Technical approach
- Keep the existing TanStack Start, Tailwind v4, shadcn/Radix, and Lucide stack.
- Implement the experience as a focused mock product with reusable React components and local UI state only—no Cloud, authentication, database, OCR, RAG, AI service, or real file processing.
- Give the home route complete product metadata and remove all starter branding.

## Verification
- Check compilation/lint, current diagnostics, keyboard interactions, theme behavior, and all mock navigation paths.
- Verify rendered desktop (1280px) and mobile (375px) views with screenshots, including sidebar/drawer, composer spacing, reader layout, search, settings, light/dark modes, and overflow.
- Confirm the final screen against the brief’s pre-flight checklist; record the missing institutional logo assets as the only external blocker if they have not been supplied.
