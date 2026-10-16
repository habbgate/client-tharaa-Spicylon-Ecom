# Spicylon visual system

The existing orange and charcoal brand palette is retained. Manrope (400/500/600/700) is self-hosted and used throughout headings, navigation, body text, forms and prices. The announcement uses two aligned text items separated by a fine vertical rule. Navigation floats over page content in a rounded translucent card, with a 16px top gap while scrolling on desktop and 12px on mobile. Font files and the OFL license are in `public/fonts`.

All page introductions use `PageHero`; contextual account and checkout introductions use the same component through `RouteIntro`. Copy and imagery occupy separate panels, with one responsive type scale and a continuous warm-white base for content. The homepage uses a larger split campaign hero, a four-product collection, three image-led discovery links, cooking and gifting features, an origin landscape, and a compact newsletter.

The four additional editorial assets, exact generation prompts, and usage notes are recorded in [editorial-image-prompts.md](editorial-image-prompts.md). Existing catalog product photographs remain unchanged. The catalog uses `CatalogBrowser` for immediate local search, price range, availability, and sorting over the loaded public product collection. Filter state is reflected in the URL, restored on reload, and reset to page one when criteria change. Desktop uses a filter sidebar; mobile uses an accessible collapsible panel. Product cards use explicit type classes so page-level heading rules cannot alter their sizes.

## Generated assets

Generated using the built-in image generation tool, then saved as optimized WebP files in the project. These are editorial illustrations of spice ingredients and craft, not photographs documenting a particular supplier or farm.

- `public/images/ceylon-spices.webp`: homepage, collection and supporting page heroes.
- `public/images/ceylon-origin.webp`: story and contact heroes, profile introduction and homepage story section.

### Final prompt: spice still life

Use case: photorealistic-natural. Asset type: wide website hero photograph for Spicylon, Ceylon spices shop, charcoal and burnt orange brand. Create an elegant editorial food photograph, wide 3:2 landscape. On the RIGHT half, small weathered black ceramic bowls with true Ceylon cinnamon quills, whole black peppercorns, cloves and turmeric powder, casually arranged with a wooden scoop on dark charcoal stone. Fine dust, authentic natural textures, warm side lighting, deep shadows, rich amber and burnt orange spices. LEFT half is mostly empty dark stone for high contrast HTML headlines. Photography, real tactile materials, premium but understated, shallow depth of field. No typography, no text, no packaging, no logos, no icons, no collage. Entire frame dark warm charcoal; no white backgrounds.

### Final prompt: cinnamon craft

Use case: photorealistic-natural. Asset type: wide editorial website hero photograph for a Sri Lankan spice brand story and contact pages. Wide landscape 3:2. Close view of a Sri Lankan cinnamon grower's hands sorting thin true Ceylon cinnamon quills over an aged dark wooden work table, woven basket and soft lush tropical foliage out of focus in the upper right background. Hands and cinnamon occupy RIGHT half; LEFT half is dark defocused workspace with ample natural negative space for HTML headline. Natural documentary photography, soft late afternoon amber light, warm charcoal shadows, earthy orange-brown palette, nuanced real skin, no face required. No text, no branding, no logos, no watermarks, no illustration.
