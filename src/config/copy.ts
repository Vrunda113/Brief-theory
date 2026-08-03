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
  { label: 'Thinking', href: '#question' },
  { label: 'Beliefs', href: '#context' },
  { label: 'Work', href: '#expression' },
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

/** Beat 3 — six core beliefs, revealed one at a time. */
export const BELIEFS = [
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
]

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

/** Beat 4b — one engagement, reduced to its logic. */
export const CASE_LOGIC = [
  { label: 'The brief', value: '“We need more customers.”' },
  { label: 'Our first question', value: 'Why aren’t the current ones staying?' },
  { label: 'The insight', value: 'The problem isn’t awareness. It’s trust.' },
  { label: 'The theory', value: 'Position around expertise, not price.', accent: true },
  { label: 'The result', value: 'Every creative decision now serves one idea.' },
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
    media: [],
    live: 'https://www.instagram.com/skin_world_thane',
  },
  {
    index: '03',
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
