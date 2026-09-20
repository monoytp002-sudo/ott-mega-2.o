import { OTTPlan, Order, ContactInquiry } from '../types.ts';

export const INITIAL_PLANS: OTTPlan[] = [
  {
    id: 'prod-netflix-premium-4k',
    slug: 'netflix-premium-4k',
    title: 'Netflix Premium 4K UHD',
    platform: 'Netflix',
    badge: 'Best Seller',
    imageUrl: '/logos/netflix.svg',
    duration: '1 Month',
    originalPrice: 649,
    discountedPrice: 199,
    durationOptions: [
      { duration: '1 Month', originalPrice: 649, discountedPrice: 199, badge: 'Popular' },
      { duration: '2 Months', originalPrice: 1298, discountedPrice: 349, badge: 'Save 73%' },
      { duration: '3 Months', originalPrice: 1947, discountedPrice: 499, badge: 'Save 74%' },
      { duration: '6 Months', originalPrice: 3894, discountedPrice: 899, badge: 'Super Saver' },
      { duration: '1 Year', originalPrice: 7788, discountedPrice: 1699, badge: 'Mega Value - 78% OFF' }
    ],
    currency: 'INR',
    features: [
      'Private Profile with Custom PIN Lock',
      'Ultra HD 4K + HDR Streaming with Dolby Atmos',
      'Works on Smart TV, Firestick, PC, Tablet & Mobile',
      'Download Movies & Series for Offline Watching',
      'Instant Credential Delivery & 100% Replacement Warranty'
    ],
    screens: 1,
    resolution: '4K UHD + HDR',
    deviceSupport: 'All Devices (TV, Mobile, PC, Tablet)',
    isPopular: true,
    inStock: true,
    description: 'Enjoy unlimited Netflix originals, blockbuster Hollywood & regional movies, and trending series with your own private PIN-protected 4K UHD profile.',
    iconColor: '#E50914'
  },
  {
    id: 'prod-amazon-prime-video',
    slug: 'amazon-prime-video',
    title: 'Amazon Prime Video (Ad-Free)',
    platform: 'Amazon Prime',
    badge: 'Popular',
    imageUrl: '/logos/amazon-prime.svg',
    duration: '1 Month',
    originalPrice: 299,
    discountedPrice: 99,
    durationOptions: [
      { duration: '1 Month', originalPrice: 299, discountedPrice: 99 },
      { duration: '3 Months', originalPrice: 499, discountedPrice: 149, badge: 'Most Popular' },
      { duration: '6 Months', originalPrice: 899, discountedPrice: 249, badge: 'Save 72%' },
      { duration: '1 Year', originalPrice: 1499, discountedPrice: 399, badge: '75% OFF' }
    ],
    currency: 'INR',
    features: [
      'Private Screen with Personalized Watchlist',
      'Ad-Free 4K HDR Streaming with X-Ray',
      'Prime Music & Instant Delivery Benefits',
      'Smart TV, FireTV Stick, Android & iOS Support',
      'Continuous Active Warranty with Instant Replacement'
    ],
    screens: 1,
    resolution: '4K UHD + HDR10+',
    deviceSupport: 'TV, Firestick, Mobile, PC',
    isPopular: true,
    inStock: true,
    description: 'Watch Prime Video exclusive originals like The Boys, Mirzapur, Panchayat, and Lord of the Rings alongside hundreds of live channels and global blockbusters.',
    iconColor: '#00A8E1'
  },
  {
    id: 'prod-disney-hotstar-premium',
    slug: 'disney-hotstar-premium',
    title: 'Disney+ Hotstar Premium 4K',
    platform: 'Disney+ Hotstar',
    badge: 'Live Sports + 4K',
    imageUrl: '/logos/jiohotstar-white.png',
    duration: '3 Months',
    originalPrice: 499,
    discountedPrice: 199,
    durationOptions: [
      { duration: '1 Month', originalPrice: 299, discountedPrice: 99 },
      { duration: '3 Months', originalPrice: 499, discountedPrice: 199, badge: 'Cricket Special' },
      { duration: '6 Months', originalPrice: 899, discountedPrice: 299, badge: 'Save 67%' },
      { duration: '1 Year', originalPrice: 1499, discountedPrice: 449, badge: 'Best Seller' }
    ],
    currency: 'INR',
    features: [
      'Live Cricket, Premier League, F1, & Tennis in 4K',
      'Disney, Marvel, Star Wars & Pixar Studios Library',
      'Ad-Free Movies & Exclusive Web Series',
      'Dolby Vision & 5.1 Surround Sound Support',
      'Full Active Period Warranty Assurance'
    ],
    screens: 1,
    resolution: '4K Dolby Vision',
    deviceSupport: 'Smart TV, Mobile, Laptop, Console',
    isPopular: true,
    inStock: true,
    description: 'Catch every international and domestic live cricket match, ICC tournaments, IPL, Marvel cinematic blockbusters, and Disney classics in true 4K Dolby Vision.',
    iconColor: '#113CCF'
  },
  {
    id: 'prod-sonyliv-premium',
    slug: 'sonyliv-premium',
    title: 'SonyLIV Premium (All Access)',
    platform: 'SonyLIV',
    badge: 'Sports & Originals',
    imageUrl: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=500&auto=format&fit=crop&q=80',
    duration: '1 Month',
    originalPrice: 299,
    discountedPrice: 89,
    durationOptions: [
      { duration: '1 Month', originalPrice: 299, discountedPrice: 89 },
      { duration: '3 Months', originalPrice: 499, discountedPrice: 149 },
      { duration: '6 Months', originalPrice: 699, discountedPrice: 199, badge: 'Save 70%' },
      { duration: '1 Year', originalPrice: 999, discountedPrice: 299, badge: 'Best Value' }
    ],
    currency: 'INR',
    features: [
      'Live UEFA Champions League, WWE, UFC & Tennis Grand Slams',
      'Acclaimed Originals (Scam 1992, Gullak, Rocket Boys)',
      'Ad-Free Full HD 1080p Streaming',
      'Smart TV, Web & Mobile Compatible',
      'Guaranteed Instant Activation'
    ],
    screens: 1,
    resolution: '1080p FHD',
    deviceSupport: 'TV & Mobile',
    isPopular: false,
    inStock: true,
    description: 'Stream thrilling live sports, acclaimed Indian series, Sony entertainment channels, and blockbuster movies without commercials.',
    iconColor: '#2563EB'
  },
  {
    id: 'prod-zee5-vip',
    slug: 'zee5-all-access-vip',
    title: 'Zee5 All-Access VIP',
    platform: 'Zee5',
    badge: 'Budget Pick',
    imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=500&auto=format&fit=crop&q=80',
    duration: '1 Month',
    originalPrice: 249,
    discountedPrice: 79,
    durationOptions: [
      { duration: '1 Month', originalPrice: 249, discountedPrice: 79 },
      { duration: '3 Months', originalPrice: 399, discountedPrice: 129 },
      { duration: '6 Months', originalPrice: 599, discountedPrice: 179 },
      { duration: '1 Year', originalPrice: 899, discountedPrice: 249, badge: 'Save 72%' }
    ],
    currency: 'INR',
    features: [
      'Over 2,800+ Movies & 150+ Web Series',
      'Regional Content in 12 Indian Languages',
      'Ad-Free High Definition Streaming',
      'Simultaneous Watching on 2 Devices',
      'Immediate Account Setup'
    ],
    screens: 2,
    resolution: '1080p FHD',
    deviceSupport: 'TV, Mobile, Web',
    isPopular: false,
    inStock: true,
    description: 'Access the largest regional Indian content library with top blockbuster releases in Hindi, Tamil, Telugu, Marathi, and more.',
    iconColor: '#800080'
  },
  {
    id: 'prod-jiocinema-premium-4k',
    slug: 'jiocinema-premium-4k',
    title: 'JioCinema Premium 4K',
    platform: 'JioCinema',
    badge: 'HBO & Peacock',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80',
    duration: '1 Month',
    originalPrice: 149,
    discountedPrice: 49,
    durationOptions: [
      { duration: '1 Month', originalPrice: 149, discountedPrice: 49 },
      { duration: '3 Months', originalPrice: 349, discountedPrice: 119 },
      { duration: '6 Months', originalPrice: 599, discountedPrice: 189 },
      { duration: '1 Year', originalPrice: 999, discountedPrice: 299, badge: 'Save 70%' }
    ],
    currency: 'INR',
    features: [
      'HBO Max Originals (House of the Dragon, Succession, Euphoria)',
      'Universal, Paramount & Warner Bros Films',
      'Live Sports in 4K Ultra HD',
      'Smart TV, Tablet & Smartphone Access',
      'Zero Advertisements'
    ],
    screens: 1,
    resolution: '4K Ultra HD',
    deviceSupport: 'TV, Mobile, Tablet',
    isPopular: false,
    inStock: true,
    description: 'Stream all top Hollywood HBO Max shows, live sporting events, and newly premiered digital movies in ultra high definition.',
    iconColor: '#E11D48'
  },
  {
    id: 'prod-crunchyroll-mega-fan',
    slug: 'crunchyroll-mega-fan',
    title: 'Crunchyroll Mega Fan',
    platform: 'Crunchyroll',
    badge: 'Anime Lovers',
    imageUrl: '/logos/crunchyroll.svg',
    duration: '1 Month',
    originalPrice: 199,
    discountedPrice: 69,
    durationOptions: [
      { duration: '1 Month', originalPrice: 199, discountedPrice: 69 },
      { duration: '3 Months', originalPrice: 449, discountedPrice: 149 },
      { duration: '6 Months', originalPrice: 799, discountedPrice: 229, badge: 'Save 71%' },
      { duration: '1 Year', originalPrice: 1299, discountedPrice: 349, badge: 'Best Anime Deal' }
    ],
    currency: 'INR',
    features: [
      'Ad-Free Simulcasts 1 Hour After Japan Broadcast',
      'Offline Viewing on Phones & Tablets',
      'Full Anime & Manga Library Access',
      'English & Hindi Dubbed + Japanese Subbed',
      'Works on Consoles, Smart TV & Mobile'
    ],
    screens: 2,
    resolution: '1080p FHD',
    deviceSupport: 'TV, Phone, Consoles, PC',
    isPopular: false,
    inStock: true,
    description: 'The ultimate anime streaming destination with thousands of subbed and dubbed anime episodes (Attack on Titan, Jujutsu Kaisen, Demon Slayer).',
    iconColor: '#F47521'
  },
  {
    id: 'prod-youtube-premium',
    slug: 'youtube-premium-music',
    title: 'YouTube Premium + Music',
    platform: 'YouTube Premium',
    badge: 'Zero Ads',
    imageUrl: '/logos/youtube.svg',
    duration: '1 Month',
    originalPrice: 149,
    discountedPrice: 79,
    durationOptions: [
      { duration: '1 Month', originalPrice: 149, discountedPrice: 79 },
      { duration: '3 Months', originalPrice: 399, discountedPrice: 169 },
      { duration: '6 Months', originalPrice: 790, discountedPrice: 279, badge: 'Save 65%' },
      { duration: '1 Year', originalPrice: 1490, discountedPrice: 449, badge: '70% OFF' }
    ],
    currency: 'INR',
    features: [
      'Completely Ad-Free YouTube Videos on all devices',
      'Background Play & Picture-in-Picture (PiP)',
      'YouTube Music Premium App Included Free',
      'Offline Video Downloads & Highest Bitrate Audio',
      'Direct Activation on Customer Google/Gmail ID'
    ],
    screens: 1,
    resolution: '4K UHD + 1080p Enhanced',
    deviceSupport: 'All Devices & Smart TVs',
    isPopular: true,
    inStock: true,
    description: 'Say goodbye to interruptions. Enjoy completely ad-free YouTube streaming, background playback when your phone screen is off, and YouTube Music Premium.',
    iconColor: '#FF0000'
  },
  {
    id: 'prod-ott-mega-combo',
    slug: 'ott-mega-8-in-1-combo',
    title: 'OTT Mega 8-in-1 All-Access Combo',
    platform: 'Combo Pack',
    badge: 'ULTIMATE DEAL - 85% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&auto=format&fit=crop&q=80',
    duration: '3 Months',
    originalPrice: 4999,
    discountedPrice: 999,
    durationOptions: [
      { duration: '1 Month', originalPrice: 1999, discountedPrice: 499, badge: 'Starter Combo' },
      { duration: '3 Months', originalPrice: 4999, discountedPrice: 999, badge: 'Huge Value' },
      { duration: '6 Months', originalPrice: 8999, discountedPrice: 1599, badge: 'Save 82%' },
      { duration: '1 Year', originalPrice: 16999, discountedPrice: 2499, badge: 'VIP All-Access (85% OFF)' }
    ],
    currency: 'INR',
    features: [
      'Netflix 4K + Amazon Prime + Disney+ Hotstar',
      'SonyLIV + Zee5 + JioCinema + YouTube Premium + Crunchyroll',
      'Private Profiles & Screen Locks Included',
      'Unconditional Replacement Guarantee throughout validity',
      'VIP Priority 5-Minute WhatsApp Support Desk',
      'Free Renewal Bonus & Cloud Backup'
    ],
    screens: 4,
    resolution: '4K UHD Dolby Vision',
    deviceSupport: 'All Devices (Multiple Simultaneous Screens)',
    isPopular: true,
    inStock: true,
    description: 'The King of all streaming packages. All 8 premium OTT platforms bundled together with private screens, personal PIN locks, and continuous guarantee.',
    iconColor: '#ec4899'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'OTT-78210',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.verma@example.com',
    customerPhone: '+919876543210',
    planId: 'plan-netflix-1m',
    planTitle: 'Netflix Premium 4K UHD',
    platform: 'Netflix',
    duration: '1 Month',
    amount: 199,
    currency: 'INR',
    status: 'Completed',
    paymentMethod: 'UPI (GPay)',
    paymentRef: 'UPI-REF-9082348123',
    credentials: {
      email: 'vip.ottmega.stream32@gmail.com',
      password: 'StreamMega#2026',
      profilePin: '4821',
      screenNumber: 'Screen 2 (Rahul)',
      expiryDate: '2026-10-19',
      notes: 'Please do not change password or profile name. Enjoy your 4K UHD streaming!',
      assignedAt: '2026-09-19T10:15:00Z'
    },
    createdAt: '2026-09-19T10:05:00Z',
    updatedAt: '2026-09-19T10:15:00Z',
    adminNotes: 'Verified UPI payment via screenshot, credentials sent to WhatsApp.'
  },
  {
    id: 'ord-102',
    orderNumber: 'OTT-89341',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@example.com',
    customerPhone: '+919811223344',
    planId: 'plan-prime-3m',
    planTitle: 'Amazon Prime Video (Ad-Free)',
    platform: 'Amazon Prime',
    duration: '3 Months',
    amount: 149,
    currency: 'INR',
    status: 'Pending',
    paymentMethod: 'UPI (PhonePe)',
    paymentRef: 'UTR-8273491028',
    createdAt: '2026-09-19T12:45:00Z',
    updatedAt: '2026-09-19T12:45:00Z',
    adminNotes: 'Payment UTR received. Pending credential generation.'
  },
  {
    id: 'ord-103',
    orderNumber: 'OTT-92044',
    customerName: 'Amit Patel',
    customerEmail: 'amit.patel99@example.com',
    customerPhone: '+919900112233',
    planId: 'plan-mega-combo-1y',
    planTitle: 'OTT Mega 8-in-1 All-Access Combo',
    platform: 'Combo Pack',
    duration: '1 Year',
    amount: 2499,
    currency: 'INR',
    status: 'Pending',
    paymentMethod: 'Net Banking / UPI',
    paymentRef: 'UPI-REF-1102938475',
    createdAt: '2026-09-19T13:00:00Z',
    updatedAt: '2026-09-19T13:00:00Z',
    adminNotes: 'High-value combo order. Prepare 8-platform credential pack.'
  }
];

export const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-1',
    name: 'Siddharth Roy',
    email: 'siddharth.roy@example.com',
    phone: '+919876500001',
    subject: 'Can I use Netflix on my Samsung Smart TV?',
    message: 'Hello, I want to purchase the Netflix 4K 3 Months plan. Will it work directly on my Samsung Smart TV app without needing any VPN?',
    createdAt: '2026-09-19T09:30:00Z',
    status: 'Unread'
  },
  {
    id: 'inq-2',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '+919876500002',
    subject: 'Custom Combo Request',
    message: 'Can I combine only Netflix and Disney+ Hotstar for 1 year? What would be the price for this custom bundle?',
    createdAt: '2026-09-19T11:10:00Z',
    status: 'Unread'
  }
];
