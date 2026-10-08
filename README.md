# Mago Labs trades website, ready to deploy

A complete static website: 34 pages, shared CSS and JS, SEO tags, structured data, sitemap and robots file. No build step needed.

Live address: https://trades.magolabs.in (already set in every page's SEO tags, the sitemap and robots.txt).

## 1. Deploy on Vercel
1. Drag this folder into a new Vercel project, or push it to GitHub and import it.
2. Framework preset: Other. No build command. Output directory: the root.
3. In Settings > Domains, add trades.magolabs.in. Vercel shows a DNS record to create: a CNAME with the name `trades` pointing to the value Vercel gives you, added wherever magolabs.in's DNS is managed.

## 2. Tell Google
1. Add trades.magolabs.in in Google Search Console and submit /sitemap.xml
2. Check the share preview at https://www.opengraph.xyz

## Contact form (emails via Resend)
Both forms (home page and /contact/) post to `/api/contact`, a small serverless function in the `api` folder that emails each enquiry to burhan@magolabs.in, with Reply-To set to the customer.
1. In Vercel: Project > Settings > Environment Variables, add `RESEND_API_KEY` with your Resend key. Never paste the key into any site file.
2. The emails come from `forms@magolabs.in`, so magolabs.in must be a verified domain in Resend (Resend > Domains). To use a different sender, add a `CONTACT_FROM` variable, for example `Mago Labs <hello@magolabs.in>`. To send to another inbox, add `CONTACT_TO`.
3. Redeploy after adding the variables, then send a test from the live site.
A hidden field quietly drops most spam bots.

## Pages
- Home, Work, Pricing, How it works, About, FAQ, Contact, Privacy, Terms, 404
- /services/ plus website-design, local-seo, google-business-profile, copywriting, ai-receptionist, social-media
- /trades/ plus roofers, plumbers, electricians, hvac, concreters, builders, landscapers, excavation, painters, tilers, glaziers, handymen
- Country pages with hreflang: /australia/, /usa/, /uk/, /canada/, /new-zealand/

Prices show automatically in the visitor's local money based on where they are (Australia $1,149, USA $799, UK £599, Canada $1,149, New Zealand $1,449). Visitors only ever see their own price; anyone outside these five countries sees the USA price. Country pages always show that country's price.
