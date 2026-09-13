import { other, reel, still, type CaseStudy } from './work'

/**
 * Selected Work — the pieces shown as stacked cards in the Expression section.
 *
 * These three and the three in `caseStudies.ts` used to be one array, which
 * meant Selected Work rendered every entry it contained: adding a case study
 * silently added a card here too, and the same client appeared twice on one
 * page under two different headings. They are separate bodies of work and are
 * now separate lists, so neither can pull the other in.
 */
export const SELECTED_WORK: CaseStudy[] = [
  {
    index: '01',
    client: 'Cafe Pulp',
    category: 'Client',
    sector: 'Food & Beverage',
    theory: 'Sell the pause, not the plate.',
    body: 'A neighbourhood cafe competing on menu photos like everyone else. The theory: people don’t book a table for food, they book it for a moment away from the day. Every frame became an invitation to stop — asked as a question, never as an ad.',
    media: [reel('evening'), reel('kitchen'), reel('sushi'), reel('trend-1'), reel('north-indian')],
    live: 'https://www.instagram.com/cafepulp__',
  },
  {
    index: '02',
    client: 'Dr Sonam’s Skin World',
    category: 'Client',
    sector: 'Healthcare & Aesthetics',
    theory: 'Position around expertise, not price.',
    body: 'A dermatology practice in a category that shouts discounts. The theory: in medicine, trust outsells offers. The work leads with the doctor’s judgement — correcting myths, explaining mechanisms, showing the reasoning — so the practice is chosen for what it knows.',
    // Ordered so the strip alternates in tone rather than running warm-on-warm.
    // The discount promo in the source folder is deliberately left out: this
    // card argues against competing on price.
    media: [
      still('myth-and-fact'),
      still('benefits-of-vitamin-c'),
      still('benefits-of-micro-needling-instagram-story'),
      still('lip-filler-story'),
      still('laser-hair-removal-instagram-story'),
    ],
    live: 'https://www.instagram.com/skin_world_thane',
  },
  {
    index: '03',
    // Titled plainly rather than given a client's name: the five clips in this
    // strip are a kitchen, a product shot and a garage, not one story. Forcing
    // a single theory and body over three unrelated businesses would read as
    // one of them when it is none of them — so the card says what it is.
    client: 'Other',
    category: 'Selected clips',
    sector: 'Assorted work',
    theory: 'Not every piece needs its own case study.',
    body: 'Shorter engagements collected here rather than pulled apart into cards of their own — a kitchen, a product, a launch.',
    media: [other('v1'), other('v2'), other('v3'), other('v4'), other('v5')],
  },
]
