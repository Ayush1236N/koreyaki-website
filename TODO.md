# Koreyaki implementation outcomes

- **Premium responsive restaurant shell:** Preserve Koreyaki’s verified Korean restaurant identity, Indiranagar location, phone, email, daily hours and reservation paths; provide a polished home page, menu, dish detail/configurator, cart, assistant and footer with responsive desktop/tablet/mobile layouts, readable contrast, focus states, loading/error/empty feedback and accessible labels.

- **Menu registry and coverage:** Keep menu items in a centralized registry with stable IDs, category, description, image, preview price state, availability, customization rules, dietary/allergen verification state, ordering readiness and explicit `MODEL_PARTIAL` / `IMAGE_FALLBACK` / unavailable asset status. Do not claim a model or verified price exists when it has not been supplied by the restaurant.

- **Interactive dish experience:** Provide a meaningful layered dish stage for the signature dish with rotate, zoom, reset, assembled/exploded modes, component labels, ingredient summary and a fallback notice when a real separate GLB asset is not available. The 3D experience must never block adding the item to the cart.

- **Customization and price engine:** Validate supported options against the selected item, update ingredient summary and preview total immediately, support reset-to-default, preserve customized entries separately in the cart, and calculate money using integer minor units with explicit base/add-on/subtotal/preview-confirmation states.

- **Cart and ordering handoff:** Add, remove and adjust configured items; prevent unavailable items; persist the cart; show itemized pricing and customization summary; and route the user to Koreyaki’s verified phone/email/visit workflow without collecting raw card details or claiming an unconfirmed order.

- **Grounded assistant:** Provide a compact assistant launcher and chat panel with menu, customization, dish, location, hours and alternative prompts. Responses must be grounded in the local registry and verified business context, must not invent allergy safety or order status, and must ask for explicit confirmation before a cart/order mutation.

- **Managed delivery:** Serve `public/manus-routes.json`, pass TypeScript diagnostics, pass `pnpm check`, pass production build, start the managed preview on port 3000, verify the route manifest and rendered home/menu/cart states, and save the working implementation to the managed repository.
