export const BRAND = {
  name: 'Brief Theory',
  tagline: 'Where every brief finds its theory',
  email: 'hello@brieftheory.com',
  site: 'brieftheory.com',
  instagram: '@brief_theory',
  instagramUrl: 'https://www.instagram.com/brief_theory',
  linkedin: 'www.linkedin.com/company/brief-theory',
  linkedinUrl: 'https://www.linkedin.com/company/brief-theory',
  location: 'Surat, India',
}

export const NAV_LINKS = [
  { label: 'Work', href: '#expression' },
  { label: 'Services', href: '#services' },
  { label: 'Method', href: '#method' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#invitation' },
]

/** Beat 0 — the cold open. A vague brief resolves into a theory. */
export const COLD_OPEN = {
  brief: 'We need more customers.',
  label: 'The brief',
  resolve: 'Every brief contains a theory.',
}

export const HERO = {
  headline: 'Brief Theory',
  intro:
    'A strategy-led creative practice for brands that intend to last. No trends. No assumptions. No noise.',
  cta: 'Send us the brief',
}

/** Beat 2 — the four questions beneath every engagement. */
export const QUESTIONS = [
  {
    index: '01',
    title: 'The Question',
    body: 'What must be true for this brand to win?',
  },
  {
    index: '02',
    title: 'The Context',
    body: 'What does the category reward, and what does it ignore?',
  },
  {
    index: '03',
    title: 'The Theory',
    body: 'The single idea everything else must serve.',
  },
  {
    index: '04',
    title: 'The Expression',
    body: 'Where thinking becomes visible, audible, usable.',
  },
]

/**
 * Beat 1 — the opening letter, section 01 of the brand profile. Prose, not a
 * headline: the paragraphs are separate so the measure can be set for reading
 * rather than for display.
 *
 * The profile's closing line reads "This document is not a portfolio" — on a
 * page rather than a bound document, "This" carries it without the noun.
 */
export const LETTER = {
  eyebrow: '01 — A letter',
  heading: 'Why we exist.',
  lede: 'Every brand we admire began the same way: someone chose to think before they made.',
  body: [
    'The industry inverted this. Output became the measure. Speed became the strategy. Briefs became formalities read once, answered with noise.',
    'Brief Theory began with a quieter conviction: that inside every brief is a theory of the business. Why it should win. Whom it should matter to. What it should never say.',
    'Our work is to find that theory and to build everything else upon it.',
  ],
  close: 'This is not a portfolio. It is a way of thinking, set in type.',
}

/** Beat 4 — the five disciplines where strategy becomes tangible. */
export const PRACTICE = {
  headline: 'Practice',
  lede: 'We don’t create deliverables. We build brand systems.',
  pillars: [
    {
      index: '01',
      name: 'Strategy',
      body: 'Brand strategy, positioning, messaging and naming — the thinking every other decision has to answer to.',
      items: ['Brand strategy', 'Positioning', 'Messaging', 'Naming'],
    },
    {
      index: '02',
      name: 'Identity',
      body: 'Visual identity, logo design, brand guidelines and packaging. The theory, made visible.',
      items: ['Visual identity', 'Logo design', 'Brand guidelines', 'Packaging'],
    },
    {
      index: '03',
      name: 'Digital',
      body: 'Website design, UI & UX, web development and landing pages built around how people actually decide.',
      items: ['Website design', 'UI & UX', 'Web development', 'Landing pages'],
    },
    {
      index: '04',
      name: 'AI Systems',
      body: 'Workflows, business and CRM automation, WhatsApp systems and assistants that remove friction quietly.',
      items: [
        'AI workflows',
        'Business automation',
        'WhatsApp automation',
        'CRM automation',
        'AI assistants',
      ],
    },
    {
      index: '05',
      name: 'Growth',
      body: 'Marketing and content strategy, social, creative production and performance — compounding, not scattering.',
      items: [
        'Marketing strategy',
        'Content strategy',
        'Social media',
        'Creative production',
        'Content systems',
        'Performance marketing',
      ],
    },
  ],
}

/**
 * Beat 3 — one engagement reduced to its logic, revealed a line at a time over
 * the held frame. The theory step is the turn the whole sequence builds to.
 */
export const CASE_LOGIC = {
  eyebrow: '02 — Thinking in practice',
  heading: 'From brief to theory.',
  lede: 'One engagement, reduced to its logic.',
  steps: [
    { index: '01', label: 'The brief', line: '“We need more customers.”' },
    { index: '02', label: 'Our first question', line: 'Why aren’t the current ones staying?' },
    { index: '03', label: 'The insight', line: 'The problem isn’t awareness. It’s trust.' },
    {
      index: '04',
      label: 'The theory',
      line: 'Position around expertise, not price.',
      turn: true,
    },
    { index: '05', label: 'The result', line: 'Every creative decision now serves one idea.' },
  ],
}

/**
 * The three stages of the pinned method section — beliefs, then the questions
 * beneath every engagement, then how an engagement actually unfolds. Lifted
 * from the brand profile, which presents them as three consecutive spreads.
 *
 * Stage two reuses QUESTIONS rather than restating it, so the four questions
 * can never drift out of sync with the sequence earlier in the page.
 */
export const METHOD_STAGES = [
  {
    eyebrow: 'Core beliefs',
    heading: 'Six things we hold to.',
    columns: 'sm:grid-cols-2 lg:grid-cols-3',
    items: [
      {
        index: '01',
        title: 'Think before you make',
        body: 'Strategy isn’t a phase. It is the foundation of everything that follows.',
      },
      {
        index: '02',
        title: 'Depth creates distinction',
        body: 'Great brands aren’t built through volume. They’re built through understanding.',
      },
      {
        index: '03',
        title: 'Purpose before popularity',
        body: 'We don’t reject trends. We make sure strategy leads them.',
      },
      {
        index: '04',
        title: 'Partnership over projects',
        body: 'Long-term partners. Never short-term vendors.',
      },
      {
        index: '05',
        title: 'Stay curious',
        body: 'Curiosity expands perspective. Perspective improves the work.',
      },
      {
        index: '06',
        title: 'Clarity creates confidence',
        body: 'When a brand knows who it is, every decision becomes easier.',
      },
    ],
  },
  {
    eyebrow: 'How we think',
    heading: 'Before process, perspective.',
    lede: 'Four questions sit beneath every engagement.',
    columns: 'sm:grid-cols-2 lg:grid-cols-4',
    items: QUESTIONS.map((q) => ({ index: q.index, title: q.title, body: q.body })),
  },
  {
    eyebrow: 'Our process',
    heading: 'How an engagement unfolds.',
    columns: 'sm:grid-cols-2 lg:grid-cols-5',
    items: [
      {
        index: '01',
        title: 'Immersion',
        body: 'We learn the business before we touch the brand.',
      },
      {
        index: '02',
        title: 'Strategy',
        body: 'Positioning, narrative and the theory itself.',
      },
      { index: '03', title: 'Identity', body: 'The theory made visible.' },
      {
        index: '04',
        title: 'Experience',
        body: 'Digital, print and everywhere between.',
      },
      {
        index: '05',
        title: 'Stewardship',
        body: 'Systems, guidelines and long-term partnership.',
      },
    ],
  },
]

export type Media = { type: 'video' | 'image'; src: string; poster?: string }

export type CaseStudy = {
  index: string
  client: string
  category: string
  sector: string
  theory: string
  body: string
  media: Media[]
  live?: string
}

const reel = (name: string): Media => ({
  type: 'video',
  src: `/video/cafe-pulp/${name}.mp4`,
  poster: `/video/cafe-pulp/${name}.jpg`,
})

const still = (name: string): Media => ({
  type: 'image',
  src: `/images/skin-world/${name}.webp`,
})

const riccis = (name: string): Media => ({
  type: 'video',
  src: `/video/riccis/${name}.mp4`,
  poster: `/video/riccis/${name}.jpg`,
})

const munchies = (n: string): Media => ({ type: 'image', src: `/images/super-munchies/${n}.webp` })
const huft = (n: string): Media => ({ type: 'image', src: `/images/huft-work/${n}.webp` })
const mason = (n: string): Media => ({ type: 'image', src: `/images/mason-home/${n}.webp` })

/**
 * Clean plates with no burned-in captions — the only clips that work as
 * background texture behind headlines. The captioned reels stay in the case
 * card, where the caption is the work being shown.
 */
export const BACKGROUND_PLATES = {
  wide: reel('orange-matcha'),
  portrait: reel('strawberry-matcha'),
}

/** Beat 5 — where thinking becomes visible. */
export const CASE_STUDIES: CaseStudy[] = [
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
  }
]

export const INVITATION = {
  eyebrow: '08 — An invitation',
  headline: 'Let’s build something thoughtful.',
  body: 'If you’re launching, repositioning, or ready for clarity — send us the brief.',
  cta: 'Start the conversation',
  closing: ['Nothing before the thinking.', 'Everything after it.'],
  audience: [
    'Founders launching something new',
    'Businesses ready for reinvention',
    'Funded startups defining their category',
    'Established houses seeking clarity',
  ],
}

/**
 * Chapter 08 as a spread of its own. The kicker and the long line come from
 * QUESTIONS so the two presentations can never drift apart; only the short
 * headline — the thing you can read across a room — is stated here.
 */
export const PERSPECTIVE_TITLES = [
  'What must be true?',
  'What does the category reward?',
  'The single idea',
  'Where thinking becomes visible',
]

/** Marginal letters for the chapter-09 timeline: brief, question, insight, theory, result. */
export const CASE_LOGIC_LETTERS = ['B', 'Q', 'I', 'T', 'R']

/**
 * The sectors the practice works across. Each carries its own card face and its
 * own backdrop film, so the opening screen changes stock as the arch turns.
 * Swap the two paths here and the whole section follows — nothing else
 * references the files.
 *
 * Both sets are stand-ins pulled from existing client work. Replace them with
 * the industry set when it lands: one portrait still and one landscape film per
 * sector, plus a poster frame for the film.
 */
export const INDUSTRIES = [
  {
    index: '01',
    name: 'Luxury',
    image: '/images/skin-world/womens-day-static.webp',
    video: '/video/riccis/evening.mp4',
    poster: '/video/riccis/evening.jpg',
  },
  {
    index: '02',
    name: 'Fashion',
    image: '/images/skin-world/lip-filler-story.webp',
    video: '/video/riccis/espresso-martini.mp4',
    poster: '/video/riccis/espresso-martini.jpg',
  },
  {
    index: '03',
    name: 'Hospitality',
    image: '/video/riccis/evening.jpg',
    video: '/video/riccis/island.mp4',
    poster: '/video/riccis/island.jpg',
  },
  {
    index: '04',
    name: 'Food & Beverage',
    image: '/video/cafe-pulp/sushi.jpg',
    video: '/video/cafe-pulp/sushi.mp4',
    poster: '/video/cafe-pulp/sushi.jpg',
  },
  {
    index: '05',
    name: 'Lifestyle',
    image: '/video/cafe-pulp/evening.jpg',
    video: '/video/cafe-pulp/evening.mp4',
    poster: '/video/cafe-pulp/evening.jpg',
  },
  {
    index: '06',
    name: 'Real Estate',
    image: '/video/riccis/island.jpg',
    video: '/video/riccis/manager-away.mp4',
    poster: '/video/riccis/manager-away.jpg',
  },
  {
    index: '07',
    name: 'Healthcare',
    image: '/images/skin-world/benefits-of-vitamin-c.webp',
    video: '/video/riccis/matcha.mp4',
    poster: '/video/riccis/matcha.jpg',
  },
  {
    index: '08',
    name: 'Professional Services',
    image: '/video/riccis/coffee-cup.jpg',
    video: '/video/riccis/coffee-cup.mp4',
    poster: '/video/riccis/coffee-cup.jpg',
  },
  {
    index: '09',
    name: 'Startups',
    image: '/video/cafe-pulp/kitchen.jpg',
    video: '/video/cafe-pulp/kitchen.mp4',
    poster: '/video/cafe-pulp/kitchen.jpg',
  },
]

/**
 * Section 14 of the brand profile. The PDF's line break drops the dash in
 * "into practice — an agency"; restored here, since on a page the sentence has
 * to hold on its own rather than across a column break.
 */
export const FOUNDER = {
  eyebrow: '06 — The founder',
  name: 'Khushali Bochiwal',
  role: 'Founder & Creative Director',
  quote: 'Clarity is a competitive advantage. It can be designed.',
  body: [
    'A strategist first and a designer second, on principle. Years spent inside branding, digital and marketing taught one durable lesson: the brands that endure decide who they are before deciding how they look.',
    'Brief Theory was founded to put that belief into practice — an agency where thinking is the product, and design is its proof.',
  ],
  portrait: '/images/founder/khushali.webp',
  portraitSmall: '/images/founder/khushali-600.webp',
}

/**
 * Placeholder testimonials — not from the brand profile. Attributed by role and
 * sector rather than an invented name: signing a fabricated quote to a named
 * person at a real business would read as a genuine endorsement once live.
 * Replace with real client words before launch.
 */
export const TESTIMONIALS = [
  {
    quote:
      'Brief Theory didn’t just redesign how we look — they redesigned how we think about the business. Every decision has a reason behind it now.',
    role: 'Founder',
    sector: 'Food & Beverage',
  },
  {
    quote:
      'They asked harder questions than any agency before them. The strategy came before a single mockup, and it shows in every piece of work since.',
    role: 'Co-Founder',
    sector: 'Healthcare & Aesthetics',
  },
  {
    quote:
      'What stood out wasn’t the visuals. It was that they understood our category better than we did, and built the brand around that.',
    role: 'Owner',
    sector: 'Home & Interiors',
  },
]
