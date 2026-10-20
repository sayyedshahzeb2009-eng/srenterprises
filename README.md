# SR Enterprises — Considered Furniture

A responsive, editorial-style furniture showcase for SR Enterprises, Mumbai. Built as a static website for GitHub Pages, with product-detail routing, responsive navigation, scroll reveals, subtle 3D hover movement, FAQ accordions and enquiry links.

## Pages
- `index.html` — Brand homepage, category discovery, featured pieces, story, FAQ and enquiry CTA
- `collections.html` — Filterable catalogue with sofas, chairs, beds, tables and storage
- `product.html?id=atelier-sofa` — Reusable product detail template. Change the `id` to open another item
- `about.html` — Brand approach and design values
- `contact.html` — Contact details and an enquiry form that prepares an email in the visitor's email application

## Product catalogue
Product data lives in `assets/products.js`. Each entry contains an ID, title, category, images, descriptive copy, materials guidance, dimension notes, finish options, care guidance and enquiry notes. Add or edit items in this file to update the homepage, collections grid and product-detail page together.

Example product URLs:
- `product.html?id=atelier-sofa`
- `product.html?id=arc-lounge-chair`
- `product.html?id=solace-bed`
- `product.html?id=forma-dining-table`

## Email and SR Concierge
- Official contact email: srenterprises05050@gmail.com
- The floating **SR Concierge** widget appears across the site and answers common website-related questions about the product catalogue, material notes, dimensions, care, enquiries and contact information. It intentionally declines unrelated topics.
- This first version runs locally in the browser from the published catalogue and fixed website knowledge. It does not send visitor chats to a server and does not require an API key. It is a guided website assistant, not a connected generative AI model; a true LLM-powered agent needs a secure server/API route and protected API key, which cannot be safely embedded in a public GitHub Pages frontend.

## Design / interaction
- Shared responsive styling in `assets/site.css`
- Shared behaviour in `assets/site.js`
- Editorial serif typography, warm neutral palette, subtle texture, scroll progress, reveal-on-scroll, reduced-motion support, responsive mobile navigation, hover tilt, FAQ accordions and back-to-top control
- Product enquiry links to the official Instagram profile: https://www.instagram.com/srenterprises.india/

## Publish with GitHub Pages
1. Open the repository: https://github.com/sayyedshahzeb2009-eng/srenterprises
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)`, then save.
5. Wait for GitHub Pages to finish deploying.

Expected site URL: https://sayyedshahzeb2009-eng.github.io/srenterprises/

## Important before accepting orders
- **Product content is a showcase draft.** The names, descriptions and images are concept presentation content, not a verified inventory. Confirm every actual SKU, fabric composition, frame / filling construction, dimensions, finish, price, availability and warranty with the business.
- Images are externally hosted visual references. Replace them with SR Enterprises' approved product photography before launch.
- The website does not currently process payments, manage stock, or create orders.
- The contact form prepares an enquiry message on-screen and opens the official Instagram profile in a new tab. It does not send automatically or store form data; the visitor must copy the message into Instagram and send it. The profile is the available contact route until a business email / phone number is supplied.
- Phone / WhatsApp details have not been added yet.
- Confirm the exact visit address, appointment process, delivery zones, charges, installation scope, lead times, cancellation and return policy before publishing those claims.
- External images and Google Fonts require an internet connection.

## Brand details
- Brand: SR Enterprises
- Instagram: https://www.instagram.com/srenterprises.india/
- Location supplied for the site: Sakinaka / Tilak Nagar, Mumbai, Maharashtra 400072
