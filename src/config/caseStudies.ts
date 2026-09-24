import { huft, mason, munchies, type CaseStudy } from './work'

/**
 * Case Studies — the engagements shown on the horizontal track.
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
 * Numbered in their own right, from 01: they are their own set, not entries of
 * something else.
 *
 * Each study's media is a list of images (or reel(), still(), etc. from
 * ./work for a client with its own asset folder) — the first item is always
 * the hero plate shown large on the card, the rest fill in as the smaller
 * supporting plates behind it.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    index: '01',
    client: 'Super Munchies',
    category: 'Client',
    sector: 'Food & Beverage',
    theory: 'Turning social performance into a clearer content system.',
    body: 'Across India, the UK and Germany, the December 2024 work paired organic social content with audience and post-level analysis. The learnings around context, timing and audience behaviour shaped the next phase across content, paid media, website optimisation and influencer marketing.',
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
  {
    index: '04',
    client: 'Suta',
    category: 'Client',
    sector: 'Ethnic Wear & Sustainable Fashion',
    theory: 'Bridging traditional Indian craftsmanship with a modern D2C growth strategy.',
    body: 'The strategy positions ethnic wear brand Suta at the intersection of artisanal heritage and D2C digital performance. By mapping the consumer funnel for eco-conscious Millennials and Gen Z professionals, the multi-channel framework pairs authentic community storytelling with high-profile cultural collaborations across Meta and YouTube. Backed by a Caregiver brand archetype and ethical artisan empowerment, the connected media and content plan scales brand awareness while driving online traffic and retail store visits.',
    // Saree photo as the hero, weaving close-up and the title card as the
    // two smaller plates behind it — with only two images the second plate
    // was repeating the first, so the title card fills that slot instead.
    media: [
      { type: 'image', src: '/images/suta/suta-saree.jpg' },
      { type: 'image', src: '/images/suta/suta-weaving.jpg' },
      // Contain: a text title card, not a photo — cover was cropping into
      // the wordmark and tagline to fill the square plate.
      { type: 'image', src: '/images/suta/suta-title.jpg', fit: 'contain' },
    ],
  },
  {
    index: '05',
    client: 'LoveChild by Masaba',
    category: 'Client',
    sector: 'Beauty & Cosmetics',
    theory: 'Turning brand values into an emotionally resonant, multi-channel growth engine.',
    body: 'The paid media strategy positions LoveChild by Masaba—a vegan, cruelty-free beauty and cosmetics brand founded by Masaba Gupta—at the intersection of self-love and performance marketing. Centered on the #MyLoveChildStory campaign, the multi-phase framework spans Meta (Facebook & Instagram), LinkedIn, and precision remarketing across Teaser, Launch, Amplification, and Culmination stages. By pairing authentic user-generated storytelling and founder-led live sessions with pixel tracking, dynamic product reminders, and tiered audience retargeting, the connected media plan scales brand awareness while accelerating website traffic and e-commerce sales conversions.',
    // Title banner as the hero, in the order sent — lipstick and the
    // campaign portrait fill the two smaller plates behind it.
    media: [
      // Contain: this is the hero slot and the banner is a text-and-photo
      // collage rather than campaign photography — cover was cropping the
      // "LOVECHILD masaba" wordmark at the edges to fill the frame.
      { type: 'image', src: '/images/lovechild/lovechild-banner.jpg', fit: 'contain' },
      // Contain, not cover: the tube is a tall cutout on a transparent
      // ground, not a full-bleed photo — cover was cropping straight
      // through it to fill the square plate.
      { type: 'image', src: '/images/lovechild/lovechild-lipstick.png', fit: 'contain' },
           { type: 'image', src: '/images/lovechild/lovechild-campaign.jpg' },
    ],
  },
  {
    index: '06',
    client: 'Shapoorji Pallonji',
    category: 'Client',
    sector: 'Real Estate & Luxury Lifestyle',
    theory: 'Transforming iconic real estate developments into emotional, community-driven living experiences.',
    body: 'Backed by a long-standing global heritage and operations in 50+ countries, Shapoorji Pallonji’s integrated media strategy elevates real estate marketing beyond traditional property listings. Centered on the "Home Beyond Walls" campaign, the multi-channel framework targets affluent urban professionals and entrepreneurs seeking luxury lifestyle amenities, community, and long-term value. By combining performance-driven Google Search and Display ads with Meta Reels, YouTube video formats, LinkedIn outreach, and strategic OOH billboards, the connected campaign drives lead generation, virtual walkthroughs, and brand affinity.',
    // Tower flyer as the hero, in the order sent — the minimalist-suite
    // flyer and the OOH billboard fill the two smaller plates behind it.
    media: [
      // Contain: a text-and-photo collage flyer, not full-bleed campaign
      // photography — cover was cropping the headline and the amenity icon
      // row to fill the hero frame.
      { type: 'image', src: '/images/shapoorji/shapoorji-flyer-tower.jpg', fit: 'contain' },
      // Contain: same reason — the "Call Us Now" line and phone number sit
      // right at the bottom edge of this flyer.
      { type: 'image', src: '/images/shapoorji/shapoorji-flyer-suite.jpg', fit: 'contain' },
      { type: 'image', src: '/images/shapoorji/shapoorji-billboard.jpg' },
    ],
  },
]
