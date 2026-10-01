// Mirrors the copy in client/src/App.tsx. The API serves this until it is edited via PUT /api/content.
export const defaultContent = {
  site: {
    name: 'Alizey Ali',
    email: 'alizeyaliiiii@gmail.com',
    linkedin: 'https://linkedin.com/in/alizey-ali-17271b286',
    footer: '© 2025 · Brand & Content Strategy · Lahore',
  },
  hero: {
    overline: 'Portfolio',
    tagline: 'Brand & Content Strategist',
    positioning:
      'I turn brand objectives into scroll-stopping, platform-native content — from strategy to execution.',
  },
  about: {
    headline: 'Strategy lives\nwhere story meets\ndata.',
    paragraphs: [
      "I'm Alizey currently completing a BSc in Economics & Political Science at LUMS (2023–2027) while building platform-native content strategy for brands that actually want to connect with people.",
      "I work across Instagram, TikTok, LinkedIn, and YouTube, translating brand objectives into scroll-stopping content through creative direction and data-driven iteration. The goal is never just reach. It's resonance.",
    ],
    capabilities: [
      'Social Media Strategy',
      'Content Creation & Copywriting',
      'Brand Voice Development',
      'Campaign Planning & Execution',
      'Analytics & Performance',
    ],
    tools: ['Canva', 'Adobe Creative Suite', 'Meta Business Suite', 'Instagram', 'TikTok', 'LinkedIn', 'YouTube'],
    photoCaption: 'from strategy to execution.',
    location: "LUMS '27 · Lahore",
  },
  pillars: [
    {
      title: 'Brand & Campaign Strategy',
      subtitle: 'Todlem · National Foods QuickCook Kits',
      paragraphs: [
        "Every campaign I've built starts with listening — not to briefs, but to audiences. At Todlem, that meant coordinating end-to-end campaign production from creative direction and moodboarding all the way through to multi-platform publishing across Instagram, TikTok, and LinkedIn. Managing the handoff between creative teams, vendors, and clients is where strategy either holds or falls apart.",
        'For the National Foods QuickCook Kits project, the strategy came from the ground up. Primary interviews and a 30+ response survey uncovered a real gap: authentic Pakistani home-style food, but nothing convenient for people cooking for one. That insight shaped a full positioning statement anchored by the concept *"Ghar Ka Zaayqa"* — taste of home — spanning pricing, distribution phasing, and a multi-channel promotion strategy.',
      ],
      process: ['Insight', 'Moodboard', 'Concept', 'Execution', 'Iterate'],
      photoCaption: 'the brief begins here',
      badge: 'insight → concept → execution → measure',
    },
    {
      title: 'Narrative & Content Storytelling',
      subtitle: 'The Algorithm Is Lying · Todlem',
      paragraphs: [
        "Brand voice is the one thing an algorithm can't replicate. At The Algorithm Is Lying, I produced narrative-driven content specifically built to strengthen the publication's distinct voice — not chasing reach, but growing a readership that actually engaged. I tracked impressions, reach, saves, and follower growth to see which storytelling approaches actually landed.",
        "At Todlem, the lesson was that the same idea posted everywhere is dead content. Tone, format, pacing — all of it differs between Instagram and TikTok and LinkedIn because the audiences behave differently. I treated each platform's audience behaviour as its own creative brief.",
      ],
      tags: ['Instagram — storytelling', 'TikTok — hooks & pacing', 'LinkedIn — authority + warmth'],
      photoCaption: 'voice first, always',
      pullquote: '"Same idea, three different creative briefs."',
    },
    {
      title: 'Platform Growth & Analytics',
      subtitle: 'Bean Machine · The Algorithm Is Lying · Todlem',
      paragraphs: [
        "Content isn't finished once it's posted. It's the start of a read on what to do next. At Bean Machine, targeted content campaigns and audience segmentation proved what happens when content strategy is tied directly to a business outcome — not just a follower count.",
        'Across all of my roles, I use engagement analytics — impressions, reach, saves, follower growth — not just to report performance, but to actively reshape what gets made next. The feedback loop is the strategy.',
      ],
      stats: [
        { stat: '30%', label: 'Social following growth' },
        { stat: '20%', label: 'Event attendance lift' },
        { stat: '15%', label: 'Monthly sales increase' },
      ],
      statNote: 'Bean Machine — content strategy + audience segmentation',
      photoCaption: 'Bean Machine ☕',
    },
  ],
  contact: {
    heading: "Let's Work\nTogether.",
    script: "strategy, content, campaigns — let's talk",
    body: "Whether you're looking for a full-time brand strategist or a freelance creative partner, I'd love to hear what you're building.",
    closing: 'No decks. Just a real conversation.',
  },
};
