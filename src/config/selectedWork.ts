import { reel, riccis, still, type CaseStudy } from './work'

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
    client: 'Caffe Riccis',
    category: 'Client',
    sector: 'Food & Beverage',
    theory: 'Sell the making, not the menu.',
    body: 'An espresso bar in a category where every feed looks the same — the finished cup, lit and styled. The theory: what actually separates one cafe from the next is visible in the making. The work leads with hands, steam and the people behind the counter, so the room is sold before the drink is.',
    // Craft first, then the room, then the people — the order the theory argues
    // for. The Tiramisu reel's stock map and aerial cutaways are left out.
    media: [
      riccis('espresso-martini'),
      riccis('coffee-cup'),
      riccis('evening'),
      riccis('island'),
      riccis('manager-away'),
    ],
    live: 'https://www.instagram.com/caffericcis',
  },
]
