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
  founder: 'Khushali Bochiwal',
  founderRole: 'Founder & Creative Director',
  founderQuote: 'Clarity is a competitive advantage. It can be designed.',
}

export const NAV_LINKS = [
  { label: 'Thinking', href: '#thinking' },
  { label: 'Practice', href: '#practice' },
  { label: 'Work', href: '#expression' },
  { label: 'Method', href: '#method' },
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

export const QUESTION_INTRO = {
  eyebrow: 'Before process, perspective',
  headline: 'Most brands don’t fail from a lack of creativity.',
  emphasis: 'They fail from a lack of clarity.',
  body: 'Trends move faster than judgement. Assumptions replace understanding. And a brand built on noise is rebuilt every eighteen months.',
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
  eyebrow: 'Thinking in practice',
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
  placeholder?: boolean
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
  },
  {
    index: '04',
    client: 'Selected Work',
    category: 'Archive',
    sector: 'Automotive · Luxury Beauty · Lifestyle',
    theory: 'Experience precedes the name.',
    body: 'Work led by our founder in the years before Brief Theory — Škoda, Nykaa Luxe, and ambitious businesses across multiple industries. The practice existed long before the brand did.',
    media: [],
    placeholder: true,
  },
]

export const INVITATION = {
  eyebrow: 'An invitation',
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
