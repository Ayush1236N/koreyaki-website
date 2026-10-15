# Koreyaki implementation plan

## Scope

Build a premium responsive Koreyaki restaurant experience in the initialized React/Express/tRPC/Drizzle starter. No existing repository was present in the sandbox. The public Koreyaki site was inspected at https://koreyaki.co/ and supplied the verified brand context: authentic Korean cuisine in Indiranagar, Bengaluru; Korean fried chicken, ramen, bibimbap, tteokbokki, dumplings and bubble tea; address, phone, email, daily hours, and a WhatsApp/phone reservation workflow. The live source did not expose a machine-readable menu or verified prices in the inspected page, so the demo clearly labels menu prices as preview values pending restaurant data connection and preserves phone/email reservation paths.

## Implementation approach

- React + TypeScript + Vite client using the existing starter and Wouter routing.
- Client-side menu registry with stable IDs, categories, preview pricing in minor units, availability, image paths, customization rules, and 3D asset status.
- Centralized integer-minor-unit pricing helpers; cart state persisted to localStorage; each configured variation remains a separate line item.
- Interactive CSS/WebGL-ready dish stage: the signature view uses layered component transforms with assembled/exploded modes, rotate/zoom controls, labels, and a visible `MODEL_PARTIAL` / image fallback notice instead of claiming a real GLB exists.
- AI assistant UI is grounded in the local verified content model for this build. The server integration seam is kept explicit so a protected platform LLM route can be wired without exposing credentials; the assistant never changes cart state without user confirmation.
- No raw card collection. “Continue to restaurant” preserves the verified phone/email workflow and explains that final availability/pricing is confirmed by Koreyaki.
- `public/manus-routes.json` documents `/`, `/menu`, `/cart`, `/dish/:id`, and `/admin` entry points.

## Design direction

- **Movement:** editorial Korean dining / tactile product configurator.
- **Principles:** restrained luxury, warm hospitality, ingredient transparency, conversion-first clarity.
- **Palette:** ink black for depth, rice cream for calm reading surfaces, vermilion as Koreyaki’s ownable appetite cue, and sesame gold for small moments of warmth.
- **Layout:** asymmetrical editorial compositions with an oversized hero stage, offset content columns, and a horizontal category rail instead of a generic centered grid.
- **Signature elements:** clipped vermilion corner marks, ingredient chips, and a circular “dish orbit” control motif.
- **Interaction:** every motion communicates food structure or ordering state; no decorative animation blocks the task.
- **Animation:** 180–420ms ease-out transitions, slow ambient hero drift, and a spring-like exploded component separation.
- **Typography:** Cormorant Garamond for display warmth paired with Inter for UI legibility.
- **Brand essence:** authentic Korean comfort, composed like a premium product experience; warm, precise, curious.
- **Voice:** concise, sensory, quietly confident. Example lines: “See what you’re about to crave.” and “Built from bold layers.”
- **Wordmark:** lowercase wordmark with a vermilion chop-mark square replacing the dot of the first “i”.
- **Signature color:** vermilion `#F05A3C`.

## Project structure

- `client/src/pages/Home.tsx`: application shell, home/menu/cart/admin states, configurator modal, assistant panel and footer.
- `client/src/index.css`: full visual system, responsive layout, 3D stage, modal/drawer states.
- `client/src/App.tsx`: route manifest wiring and providers.
- `public/manus-routes.json`: route declarations for managed preview.
- `server/`: existing Express/tRPC foundation retained for future protected pricing, ordering and LLM endpoints.
- `drizzle/`: existing auth schema retained; no destructive database changes made.

## Delivery workflow

1. Implement the core experience against the existing starter.
2. Run typecheck and production build.
3. Start the managed preview on port 3000 and verify route manifest plus rendered page.
4. Fix actionable diagnostics and commit the working version to the managed repository.
5. Preserve external ordering limitations and pending 3D/menu assets in the coverage report instead of fabricating support.
