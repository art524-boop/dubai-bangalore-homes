# Bangalore Dubai Estates

Build a premium, luxury real estate catalogue and custom construction website for a

property firm operating in Bangalore, India and Dubai, UAE. Tone: high-end,

trustworthy, architectural, modern, uncluttered.

STACK: React + Supabase (use Supabase for the database, auth, and file storage).

COLORS: Primary deep navy blue #0F172A, secondary slate/charcoal gray #334155,

accent/CTA luxury gold/amber #D97706, background off-white #F8FAFC. Modern serif

headings, clean sans-serif body text.

DATABASE — create these Supabase tables:

1. "projects": id, slug, name, city, property_type, bhk, price_inr, price_aed,

   possession_status, developer, rera_dld_number, cover_image_url, gallery_urls

   (array), amenities (array), floor_plan_url, brochure_url, map_lat, map_lng,

   description, featured (boolean), created_at.

2. "leads": id, name, phone, email, country, is_nri (boolean), project_id

   (nullable FK to projects), source_cta, message, created_at.

PAGES:

1. Home — split hero "Find Your Dream Home (Bangalore & Dubai)" vs "Build Your

   Dream Home (Custom Construction in Bangalore)", a featured projects carousel

   pulling from projects where featured = true, and a credibility bar (RERA

   Certified, ISO Certified, Bank Loan Partners, 10-Year Structural Warranty,

   FEMA-Compliant Transactions, Dedicated NRI Desk). Include an INR/AED and

   Resident/NRI toggle in the header.

2. Real Estate Catalogue (/projects) — reads from the projects table. Sidebar

   filters for city, property_type, bhk, price range, possession_status,

   developer. Cards show cover_image_url, developer, city, starting price

   (switches INR/AED with the header toggle), and a "View Project" button linking

   to /projects/:slug. NO cart, NO checkout, NO payment integration anywhere.

3. Project Detail Page (/projects/:slug, dynamic route reading one row from

   projects by slug) — image gallery, rera_dld_number, amenities, embedded Google

   Map using map_lat/map_lng, downloadable floor_plan_url and brochure_url, and a

   sticky panel with four actions: Enquire Now, WhatsApp Chat, Download Brochure,

   Schedule Site Visit. Each action writes a row to the leads table with the

   appropriate source_cta and this project's id.

4. Custom Construction (Bangalore) (/construction) — turnkey services overview, a

   6-step workflow (Consultation, Design & Approval, Costing, Construction,

   Quality Checks, Handover), Basic/Premium/Luxury pricing tiers comparison, and

   a "Get a Free Estimate" calculator (plot size, floors, tier, city inputs →

   estimated range) that submits a lead to the leads table with source_cta =

   "Free Estimate".

5. Construction Portfolio (/portfolio) — gallery of completed villas/homes with

   before-and-after image sliders.

6. About Us & NRI Advisory (/about) — team background and a dedicated NRI section

   covering cross-border investment guidance, POA-assisted purchase support, and

   a note directing NRI visitors to book a virtual consultation.

7. Contact Us (/contact) — a general enquiry form (writes to leads with an

   is_nri checkbox), and two office cards (Bangalore, Dubai) each with an

   embedded Google Map and office hours shown in local time plus GST/IST.

ADMIN PANEL (/admin, protected by Supabase Auth login):

- Table view of all projects with add/edit/delete, and image upload fields

  (via Supabase Storage) for cover image, gallery, floor plan PDF, and brochure

  PDF instead of raw URL entry.

- Table view of all leads, filterable by date, source_cta, and is_nri, with

  CSV export.

- Only authenticated admin users can access /admin; all other pages stay public.

FUNCTIONALITY:

- No payment processing anywhere — all revenue is handled offline, directly with

  clients.

- Sticky "Chat on WhatsApp" button on every page (mobile and desktop), linking to

  a WhatsApp Business number via a wa.me link.

- For NRI consultation and virtual site visit booking, embed a Cal.com scheduling

  widget on the About Us & NRI Advisory page and on the Contact page, so visitors

  can self-schedule in their own timezone without building custom booking logic.

- Mobile-first, fast-loading, minimal clutter, generous white space, large

  high-resolution architectural imagery.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dubai-bangalore-homes.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e57add09-868d-4f06-9be1-b714c54883da).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
