# SR Enterprises — Considered Furniture

A responsive, editorial-style furniture showcase for SR Enterprises, Mumbai. Built as a static website for GitHub Pages, with product-detail routing, responsive navigation, scroll reveals, subtle 3D hover movement, FAQ accordions and enquiry links.

## Pages
- `index.html` — Brand homepage, category discovery, featured pieces, story, FAQ and enquiry CTA
- `collections.html` — Filterable catalogue with sofas, chairs, beds, tables and storage
- `product.html?id=atelier-sofa` — Reusable product detail template. Change the `id` to open another item
- `about.html` — Brand approach and design values
- `contact.html` — Contact details and an enquiry form that prepares an email in the visitor's email application

## Product catalogue
Product data lives in `assets/products.js`. Each entry contains an ID, title, category, images, descriptive copy, materials guidance, dimension notes, finish options, care guidance and enquiry notes. Add or edit items in this file to update the homepage, collections grid and product-detail page together. Follow the Add a product guide below.

Example product URLs:
- `product.html?id=atelier-sofa`
- `product.html?id=arc-lounge-chair`
- `product.html?id=solace-bed`
- `product.html?id=forma-dining-table`

### Add a product (no admin panel yet)
1. Open assets/products.js on GitHub and click Edit this file.
2. Copy one complete product object, paste it inside the window.SR_PRODUCTS array, and put a comma between objects.
3. Give it a unique, URL-friendly id in lowercase with hyphens, such as oak-coffee-table. Its page will be product.html?id=oak-coffee-table.
4. Replace the name, category, descriptions, materials, dimensions, finish, care notes, lead time, features and all three image URLs. Use approved HTTPS product photos and only publish verified claims.
5. Click Commit changes. GitHub Pages should publish the update after its build completes.

Each product needs: id, name, category, tag, subtitle, price, hero, image2, image3, short, description, materials, dimensions, finish, comfort, care, lead and features (an array of short strings). Keep IDs unique. Current categories include Sofas, Chairs, Beds, Tables and Storage; check the filter controls in collections.html before adding a new category.

Example product object (replace all placeholder content with verified details):
    {
      id: "oak-coffee-table", name: "Oak Coffee Table", category: "Tables",
      tag: "New arrival", subtitle: "A considered centrepiece.", price: "Request a quote",
      hero: "https://your-approved-image-url.example/main.jpg",
      image2: "https://your-approved-image-url.example/detail-1.jpg",
      image3: "https://your-approved-image-url.example/detail-2.jpg",
      short: "A concise one-line introduction.", description: "A fuller product description.",
      materials: "Add verified materials.", dimensions: "Add verified width × depth × height.",
      finish: "List actual finish options.", comfort: "Describe intended use.",
      care: "Add approved care instructions.", lead: "Confirm current availability and lead time.",
      features: ["Verified feature one", "Verified feature two"]
    }

A GitHub Pages site has no private admin database or protected store dashboard. Product edits made in GitHub are public code changes. To add products from a phone without editing code, the site needs a backend/database and authenticated admin panel.

## Email and SR Concierge
- Official contact email: srenterprises05050@gmail.com
- The floating **SR Concierge** widget appears across the site and answers common website-related questions about the product catalogue, material notes, dimensions, care, enquiries and contact information. It intentionally declines unrelated topics.
- This first version runs locally in the browser from the published catalogue and fixed website knowledge. It does not send visitor chats to a server and does not require an API key. It is a guided website assistant, not a connected generative AI model; a true LLM-powered agent needs a secure server/API route and protected API key, which cannot be safely embedded in a public GitHub Pages frontend.

## Security and privacy
- This is a public static website. Never commit API keys, passwords, private tokens or customer lists to this repository.
- A restrictive Content Security Policy meta tag is included to limit scripts to the same origin, disallow plugins and restrict base URLs. GitHub Pages does not let this project set every HTTP response security header; full server-side controls require suitable hosting/backend configuration.
- Product catalogue text is escaped where inserted into HTML, feature text uses text nodes, and product images are restricted to HTTPS in the browser. This is defence-in-depth, not a substitute for server-side validation if a backend is added.
- The current contact flow does not submit personal details to a server. A future contact endpoint or AI model should use server-side validation, rate limiting, spam protection and API keys stored only in deployment environment variables.

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
