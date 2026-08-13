import { huft, mason, munchies, type CaseStudy } from './work'

/**
 * Case Studies — the three engagements shown on the horizontal track.
 *
 * Their own list, in the order they are presented. The feature section used to
 * pick them out of the Selected Work array by matching client names against a
 * hardcoded order, which is how the section came to render empty: the three
 * names were removed from that array and the lookup quietly returned nothing,
 * leaving the headings standing over a blank track and a counter reading
 * 01 / 00. Nothing threw and nothing logged.
 *
 * Ordering is the array's job now. There is no list of names to fall out of
 * step with, so the section shows what is here or it shows nothing — and if it
 * shows nothing it is because this file is empty, which is findable.
 *
 * Numbered from 01 in their own right: they are a set of three, not entries
 * four through six of something else.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    index: '01',
    client: 'Super Munchies',
    category: 'Client',
    sector: 'Food & Beverage',
    theory: 'Turning social performance into a clearer content system.',
    body: 'Across India, the UK and Germany, the December 2024 work paired organic social content with audience and post-level analysis. India closed the month at 3,519 followers, 3,720 reach and 12,839 impressions, while the learnings around context, timing and audience behaviour shaped the next phase across content, paid media, website optimisation and influencer marketing.',
    media: [
      munchies('01'),
      munchies('02'),
      munchies('03'),
      munchies('04'),
      munchies('05'),
    ],
  },
  {
    index: '02',
    client: 'HUFT',
    category: 'Client',
    sector: 'Pet Care & Lifestyle',
    theory: 'Paid media built around the full pet-parent journey.',
    body: 'The work mapped HUFT’s funnel from discovery to return visits, shaping campaigns for store awareness, website traffic, app installs, LinkedIn education and remarketing. Competitor, audience and channel analysis informed distinct objectives across Instagram, Facebook and LinkedIn, creating a connected plan for pet parents and the wider pet-care community.',
    media: [huft('01'), huft('02'), huft('03'), huft('04'), huft('05')],
  },
  {
    index: '03',
    client: 'Mason Home',
    category: 'Client',
    sector: 'Home Décor & Lifestyle',
    theory: 'Make the home a signature, not a showroom.',
    body: 'For Mumbai-based Mason Home, #YourSignatureSpace turns modern luxury décor into an expression of individuality. The next growth phase brings that idea across a three-month media plan spanning Meta, Google and YouTube, supported by website and SEO optimisation designed to make Mason Home a trusted destination for considered, high-quality interiors.',
    media: [mason('01'), mason('02'), mason('03')],
  },
]
