## Uniform vNext Sales Demo

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

- A Uniform account with the ability to create a new empty project. If you don't have a Uniform account, you can request a trial account [here](https://uniform.dev/try).

#include "npm-token.md"

### Environment Variables

- `UNIFORM_API_KEY`: your uniform api key
  > ⚠️ For the initial setup, this API key needs the Developer role assigned to it.
- `UNIFORM_PROJECT_ID`: your uniform project
- `GOOGLE_ANALYTICS_ID`: optional, for [ga-plugin](https://docs.uniform.app/integrations/data/google-analytics#activate-ga-plugin)

### Redirect Management

By default, redirects are configured during the build stage. This process involves retrieving the current redirects at build time, which are then passed to the next configuration.

### Init and start Sales Demo

1. In your terminal, from the project root, run the following command:

```bash
npm i
```

2. Navigate to `/apps/sales-demo` folder:

```bash
cd apps/sales-demo/
```

3. In your code editor and rename `.env.example` to `.env` file and add your `UNIFORM_API_KEY` and `UNIFORM_PROJECT_ID` variables
   > ⚠️ For the initial setup, this API key needs the Developer role assigned to it.
4. This command pushes all configurations to your new Uniform project.

```bash
npm run push
```

5. Run the production server:

```bash
npm run build && npm run start
```

or development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Supported features

- Top navigation based on project map
- Article detail and Product detail override
- Beans && Coffee makers pages and personalized search based on enrichments
- Product detail page
- Local storage based cart functionality
- Visual Canvas & Project Map & Project Map Links
- [Static page generation based on project map canvas API](https://docs.uniform.app/reference/packages/uniformdev-project-map#projectmapclient)
- Canvas components with default Title Parameter and Screenshot for better Visual Canvas experience
- Next SDK for components registration [DRAFT: Canvas + Next.js Getting Started Optimization](https://www.notion.so/DRAFT-Canvas-Next-js-Getting-Started-Optimization-579fa27b2ad0428392d19b7db2912aa8)
- Standard context output type (client side personalization)

### Components

- Add to cart
- Call to action
- Container / Section - Two Columns (advanced usage example)
- Featured Products (default / dark variants)
- Recommended Products (default / dark variants)
- Recommended Articles (default / dark variants)
- Instant Search
- Hit Product
- Hits
- Refinement List
- Search Box
- Hero (2 variants)
- Page (composition component)
- Product (Template)
- Product Description
- Image Gallery
- Product Info

### Compositions

- Home page
  - project map based navigation menu
  - hero component
  - call to action
  - featured products (default variant)
  - recommended products (dark variant)
  - hardcoded footer
- Coffee-makers Products page
  - project map based navigation menu
  - hero
  - instant search (personalized search based on enrichments)
  - search box
  - section two columns
  - refinement list
  - hits/hit
  - hardcoded footer
- Beans Products page
  - project map based navigation menu
  - hero
  - instant search (personalized search based on enrichments)
  - search box
  - section two columns
  - refinement list
  - hits/hit
  - hardcoded footer
- Product (Template)
  - project map based navigation menu
  - product (template)
  - recommended products
- Articles
  - project map based navigation menu
  - article list
  - hardcoded footer
- Article (Template)
  - project map based navigation menu
  - article (template)
  - recommended article
  - hardcoded footer
