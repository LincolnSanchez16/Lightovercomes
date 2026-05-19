export const organizationName = 'Light Overcomes'

export const tagline =
  'Helping young Christians grow in confidence as they share their faith.'

export const navigationLinks = [
  { label: 'Home', path: '/' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

export const footerText =
  'Mission-centered teaching, resources, and encouragement for young Christians learning to live and share their faith.'

export const pageTitles = {
  home: 'Home',
  resources: 'Resources',
  christianValues: 'Christian Values',
  gospelCards: 'Gospel Cards',
  about: 'About',
}

export const pageDescriptions = {
  home:
    'This home page will provide a clear overview of the ministry, key resources, and next steps for visitors.',
  resources:
    'Tools and teaching built to help young Christians understand, live, and share their faith.',
  christianValues:
    'This page will outline the Christian values, beliefs, and guiding principles behind the organization.',
  gospelCards:
    'This page will showcase gospel card resources, practical tools, and future downloadable materials.',
  about:
    'This about page will share the organization story, leadership background, and ministry purpose.',
}

export const resourceCards = [
  {
    label: 'Foundation',
    title: 'Christian Values',
    description:
      'A clear look at the beliefs and convictions shaping the mission of Light Overcomes.',
    cta: 'Explore',
    path: '/christian-values',
    key: 'christian-values',
  },
  {
    label: 'Tools',
    title: 'Gospel Cards',
    description:
      'Simple visual resources designed to help start Gospel-centered conversations.',
    cta: 'View Cards',
    path: '/gospel-cards',
    key: 'gospel-cards',
  },
]

export const homeContent = {
  title: 'Light Overcomes',
  heroActions: [
    { label: 'About the Mission', path: '/about', variant: 'secondary' },
    { label: 'View Resources', path: '/resources', variant: 'primary' },
  ],
  missionTeaser:
    'Light Overcomes exists to help young Christians understand their faith, live it with conviction, and share it with clarity.',
  pillars: [
    {
      title: 'Understand',
      description:
        'Grounding young believers in clear teaching that connects biblical truth to everyday life.',
    },
    {
      title: 'Live',
      description:
        'Encouraging a faith that shapes character, habits, and courage in the world around them.',
    },
    {
      title: 'Share',
      description:
        'Equipping Gospel-centered conversations with practical tools, language, and confidence.',
    },
  ],
  resourcesCta: {
    title: 'Start with the resources.',
    description:
      'Explore teaching and tools built to support belief, discipleship, and Gospel conversations.',
    label: 'Go to Resources',
    path: '/resources',
  },
  aboutPreview: {
    title: 'A focused mission with a clear purpose.',
    description:
      'Light Overcomes is built to serve young Christians with thoughtful teaching, practical encouragement, and resources that point back to Christ.',
    label: 'Learn More About Us',
    path: '/about',
  },
}

export const christianValuesIntro = {
  eyebrow: 'Christian Values',
  title: 'Values Library',
  description:
    'These values are organized by category to help people explore practical faith, character, and daily life through a Christian lens.',
}

export const christianValueCategories = [
  {
    slug: 'personal-growth-and-education',
    title: 'Personal Growth and Education',
    rangeStart: 1,
    rangeEnd: 4,
    rangeLabel: '1-4',
    description:
      'Foundational values that shape discipline, learning, and steady growth in everyday life.',
  },
  {
    slug: 'technology-and-media',
    title: 'Technology and Media',
    rangeStart: 5,
    rangeEnd: 6,
    rangeLabel: '5-6',
    description:
      'Guidance for using media and technology with wisdom, discernment, and healthy boundaries.',
  },
  {
    slug: 'resilience-and-life-skills',
    title: 'Resilience and Life Skills',
    rangeStart: 7,
    rangeEnd: 12,
    rangeLabel: '7-12',
    description:
      'Values that strengthen endurance, practical maturity, and readiness for real life.',
  },
  {
    slug: 'faith-and-spiritual-values',
    title: 'Faith and Spiritual Values',
    rangeStart: 13,
    rangeEnd: 31,
    rangeLabel: '13-31',
    description:
      'The spiritual convictions at the heart of Christian belief, discipleship, and daily trust in God.',
  },
  {
    slug: 'work-ethic-and-responsibility',
    title: 'Work Ethic and Responsibility',
    rangeStart: 32,
    rangeEnd: 37,
    rangeLabel: '32-37',
    description:
      'Practices and character traits that shape diligence, stewardship, and reliability.',
  },
  {
    slug: 'communication-values',
    title: 'Communication Values',
    rangeStart: 38,
    rangeEnd: 39,
    rangeLabel: '38-39',
    description:
      'Values that help words become clear, truthful, gracious, and life-giving.',
  },
  {
    slug: 'relationships-and-social-values',
    title: 'Relationships and Social Values',
    rangeStart: 40,
    rangeEnd: 50,
    rangeLabel: '40-50',
    description:
      'Virtues that shape friendship, community, empathy, and how we live with others.',
  },
  {
    slug: 'health-wellness-and-balance',
    title: 'Health, Wellness, and Balance',
    rangeStart: 51,
    rangeEnd: 53,
    rangeLabel: '51-53',
    description:
      'A Christian approach to balance, care, and stewardship of body, mind, and rhythm.',
  },
  {
    slug: 'citizenship-and-social-values',
    title: 'Citizenship and Social Values',
    rangeStart: 54,
    rangeEnd: 59,
    rangeLabel: '54-59',
    description:
      'Values for living responsibly within society, community, and public life.',
  },
  {
    slug: 'moral-and-character-values',
    title: 'Moral and Character Values',
    rangeStart: 60,
    rangeEnd: 67,
    rangeLabel: '60-67',
    description:
      'Traits that shape integrity, moral clarity, and a steady Christian witness.',
  },
  {
    slug: 'financial-values',
    title: 'Financial Values',
    rangeStart: 68,
    rangeEnd: 72,
    rangeLabel: '68-72',
    description:
      'Values that prepare people to handle money, provision, and stewardship faithfully.',
  },
  {
    slug: 'marriage-and-family',
    title: 'Marriage and Family',
    rangeStart: 73,
    rangeEnd: 76,
    rangeLabel: '73-76',
    description:
      'Values that support covenant, home life, and responsibility within family relationships.',
  },
]

const createChristianValuePlaceholder = (id, category) => ({
  id,
  title: `Value ${id}`,
  category: category.title,
  categorySlug: category.slug,
  rangeLabel: category.rangeLabel,
  verses: [],
  description: 'Card content coming soon.',
  imageThumb: '',
  imageFull: '',
  link: '',
})

export const christianValuesLibraryCards = christianValueCategories.flatMap((category) =>
  Array.from({ length: category.rangeEnd - category.rangeStart + 1 }, (_, index) =>
    createChristianValuePlaceholder(category.rangeStart + index, category),
  ),
)
