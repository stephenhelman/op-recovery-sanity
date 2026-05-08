# op-recovery-sanity

A reusable Next.js 14 + Sanity landing page template for surplus funds recovery companies. Deploy once per client with different environment variables. The site renders a full default template when Sanity has no data, and dynamically switches to Sanity-managed content when available.

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Framer Motion · Sanity · Resend · Vercel

---

## How It Works

```
Sanity Studio (sanity.io)
        ↓
getSiteContent()  ← GROQ query
        ↓
mergeContent()    ← deep merge: Sanity wins field-by-field, falls back to defaultContent
        ↓
page.tsx          ← injects CSS variables, maps sections
        ↓
SectionRenderer   ← routes _type → component
        ↓
Section components (Hero, FAQ, ContactForm, etc.)
        ↓
Footer (always rendered, pulled from siteConfig)
```

Each client deployment is a **Vercel project** pointing at this same repo with different env vars. Changing those vars + filling the Sanity Studio gives a completely different branded site — no code changes needed.

---

## New Client Deployment

### 1. Create a Sanity Project

Go to [sanity.io](https://sanity.io), create a new project, note the **Project ID**.

### 2. Fill in the Studio

In Sanity Studio at sanity.io, create a `siteConfig` document and configure:

- **Company Name** — client's legal or trade name
- **Tagline** — one-line value proposition
- **Logo** — upload client's logo
- **Contact Email** — where inquiries are forwarded
- **Colors** — hex values for `primary`, `accent`, `background`, `text`
- **Font Pairing** — one of: `authority`, `professional`, `modern`, `clean`
- **Sections** — build the ordered section array using available section types

Available section types:

| Type | Purpose |
|---|---|
| `heroSection` | Full-height headline + CTA |
| `problemSection` | Problem statement with bullets |
| `impactNumbers` | Animated stat tiles |
| `serviceBlock` | Service description with bullets (can add multiple — renders side-by-side on desktop) |
| `howItWorks` | Numbered steps |
| `whyChooseUs` | Checkmark bullet list |
| `statesServed` | State badge grid |
| `aboutSection` | About paragraph |
| `faqSection` | Accordion FAQ |
| `contactForm` | Dynamic form builder (text, email, phone, dropdown, textarea fields) |
| `disclaimerSection` | Legal disclaimer text |

### 3. Create Vercel Project

Import the `op-recovery-sanity` repo, set environment variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=    <from sanity.io>
NEXT_PUBLIC_SANITY_DATASET=       production
NEXT_PUBLIC_SANITY_API_VERSION=   2024-01-01
RESEND_API_KEY=                   <your Resend key>
NEXT_PUBLIC_NOTIFY_EMAIL=         <email that receives inquiry notifications>
NEXT_PUBLIC_COMPANY_NAME=         <optional — overrides Sanity companyName>
```

### 4. Domain & DNS

1. Add client domain in Vercel
2. Update client nameservers → Cloudflare
3. Add client domain to your Resend account
4. Add SPF, DKIM, DMARC, MX records in Cloudflare
5. Verify domain in Vercel — SSL auto-provisions

### 5. Smoke Test

- Full page renders with correct branding
- Contact form submits → notification email to `NEXT_PUBLIC_NOTIFY_EMAIL`
- Contact form submits → confirmation email to the submitter
- ISR works: update a field in Sanity, confirm site reflects it within 60 seconds

---

## Font Pairings

| Key | Heading | Body |
|---|---|---|
| `authority` | Black Ops One | Barlow Condensed |
| `professional` | Playfair Display | DM Sans |
| `modern` | Syne | Inter |
| `clean` | DM Serif Display | Nunito |

---

## CSS Variable System

All colors and fonts are injected as CSS variables on the page wrapper in `app/page.tsx`. Every component uses these variables — never hardcoded values.

| Variable | Source |
|---|---|
| `--color-primary` | `siteConfig.colors.primary` |
| `--color-accent` | `siteConfig.colors.accent` |
| `--color-bg` | `siteConfig.colors.background` |
| `--color-text` | `siteConfig.colors.text` |
| `--font-heading` | `fontPairings[siteConfig.fontPairing].heading` |
| `--font-body` | `fontPairings[siteConfig.fontPairing].body` |

---

## Default Fallback

If Sanity returns `null` or an empty sections array, the site renders a complete default template from `lib/defaultContent.ts`. The default is brand-neutral and production-ready — it will not show a broken page.

**siteConfig defaults:** `#DABD59` primary · `#0A0A0A` background · `authority` font pairing · "Your Company Name"

---

## Project Structure

```
app/
  page.tsx               ← Server component, ISR (revalidate: 60)
  layout.tsx             ← Google Fonts, metadata
  api/contact/route.ts   ← Resend email handler

components/sections/
  Hero.tsx
  Problem.tsx
  ImpactNumbers.tsx
  ServiceBlock.tsx
  HowItWorks.tsx
  WhyChooseUs.tsx
  StatesServed.tsx
  About.tsx
  FAQ.tsx
  ContactForm.tsx
  Disclaimer.tsx
  Footer.tsx
  SectionRenderer.tsx    ← _type → component router

lib/
  defaultContent.ts      ← Full default template
  mergeContent.ts        ← Sanity + default merge logic
  statesData.ts          ← Array of 45 states
  fontPairings.ts        ← Font pairing map

sanity/
  client.ts              ← Sanity client (env-driven)
  queries.ts             ← getSiteContent() GROQ query
  sanity.config.ts       ← Studio config (no /studio route in app)
  schema/
    siteConfig.ts        ← Singleton document type
    sections/            ← One schema file per section type

types/
  content.ts             ← All TypeScript types
```

---

## Local Development

```bash
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SANITY_PROJECT_ID and other vars
npm install --legacy-peer-deps
npm run dev
```

The site renders with full default content even without a Sanity connection. To see Sanity data, point `NEXT_PUBLIC_SANITY_PROJECT_ID` to a live project with a `siteConfig` document.
