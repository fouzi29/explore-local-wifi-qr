export interface SmtpConfig {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  notifyEmail: string;
}

export interface VenueDeal {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  badge: string;
  iconName: string;
}

export interface VenueSettings {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  welcomeMessage: string;
  accentColor: string;
  logoUrl?: string;
  wifi: {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
  };
  deals: VenueDeal[];
  smtp: SmtpConfig;
}

export interface CapturedLead {
  id: string;
  venueId: string;
  name: string;
  emailOrPhone: string;
  interests: string[];
  marketingConsent: boolean;
  createdAt: string;
  deviceType?: string;
}

export interface PlatformTelemetry {
  totalVenuesCreated: number;
  totalLeadsCaptured: number;
  creatorNotificationEmail: string;
  activeVenuesCount: number;
  lastLeadTimestamp?: string;
}

const DEFAULT_VENUE: VenueSettings = {
  id: 'venue_default',
  name: 'The Rustic Roaster Cafe',
  slug: 'rustic-roaster',
  tagline: 'Artisanal Coffee & Fresh Baked Goods',
  welcomeMessage: 'Connect to our Ultra-Fast Guest Wi-Fi & unlock 15% OFF your next espresso!',
  accentColor: '#16a34a',
  logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=120&q=80',
  wifi: {
    ssid: 'RusticRoaster_FreeWiFi',
    password: 'CoffeeDeals2026',
    encryption: 'WPA2'
  },
  deals: [
    {
      id: 'd1',
      title: '15% Off Any Coffee & Pastry',
      description: 'Show this coupon code at the counter during your visit today.',
      discountCode: 'WIFI15OFF',
      badge: 'Venue Special',
      iconName: 'Coffee'
    },
    {
      id: 'd2',
      title: 'Local Art Walk Guide',
      description: 'Explore 8 boutique galleries and hidden murals within 3 blocks.',
      discountCode: 'EXPLORELOCAL',
      badge: 'Local Guide',
      iconName: 'MapPin'
    },
    {
      id: 'd3',
      title: 'Free Artisan Muffin on Birthdays',
      description: 'Join our VIP loyalty club and get free treats every birthday week.',
      discountCode: 'VIPGUEST',
      badge: 'VIP Perk',
      iconName: 'Gift'
    }
  ],
  smtp: {
    enabled: true,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'fouzi.cse@gmail.com',
    pass: 'fzfemass@21@(fzm)@g1#f1',
    fromName: 'Explore Local Wi-Fi SaaS',
    fromEmail: 'fouzi.cse@gmail.com',
    notifyEmail: 'fouzi.cse@gmail.com'
  }
};

const DEFAULT_LEADS: CapturedLead[] = [
  {
    id: 'lead_1',
    venueId: 'venue_default',
    name: 'Sarah Jenkins',
    emailOrPhone: 'sarah.j@example.com',
    interests: ['Coffee Specials', 'Local Events'],
    marketingConsent: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    deviceType: 'iPhone (iOS)'
  },
  {
    id: 'lead_2',
    venueId: 'venue_default',
    name: 'Marcus Chen',
    emailOrPhone: '+1 (555) 234-5678',
    interests: ['Discounts & Coupons'],
    marketingConsent: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    deviceType: 'Samsung Galaxy (Android)'
  },
  {
    id: 'lead_3',
    venueId: 'venue_default',
    name: 'Elena Rostova',
    emailOrPhone: 'elena.r@example.com',
    interests: ['Food & Drink', 'Local Events'],
    marketingConsent: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    deviceType: 'MacBook Air'
  }
];

let memoryVenues: Record<string, VenueSettings> = {
  venue_default: DEFAULT_VENUE
};

let memoryLeads: CapturedLead[] = [...DEFAULT_LEADS];

let memoryTelemetry: PlatformTelemetry = {
  totalVenuesCreated: 1,
  totalLeadsCaptured: DEFAULT_LEADS.length,
  activeVenuesCount: 1,
  creatorNotificationEmail: 'fouzi.cse@gmail.com',
  lastLeadTimestamp: new Date().toISOString()
};

export function getVenueSettings(venueId: string = 'venue_default'): VenueSettings {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`venue_settings_${venueId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse venue settings from storage', e);
      }
    }
  }
  return memoryVenues[venueId] || DEFAULT_VENUE;
}

export function getVenueBySlug(slug: string): VenueSettings | null {
  if (typeof window !== 'undefined') {
    const venueListRaw = localStorage.getItem('venue_ids_list');
    const venueList: string[] = venueListRaw ? JSON.parse(venueListRaw) : ['venue_default'];
    for (const vid of venueList) {
      const v = getVenueSettings(vid);
      if (v && v.slug.toLowerCase() === slug.toLowerCase()) {
        return v;
      }
    }
  }
  
  const found = Object.values(memoryVenues).find(v => v.slug.toLowerCase() === slug.toLowerCase());
  return found || DEFAULT_VENUE;
}

export function getAllVenues(): VenueSettings[] {
  if (typeof window !== 'undefined') {
    const venueListRaw = localStorage.getItem('venue_ids_list');
    const venueList: string[] = venueListRaw ? JSON.parse(venueListRaw) : ['venue_default'];
    return venueList.map(vid => getVenueSettings(vid)).filter(Boolean);
  }
  return Object.values(memoryVenues);
}

export function saveVenueSettings(settings: VenueSettings): void {
  memoryVenues[settings.id] = settings;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`venue_settings_${settings.id}`, JSON.stringify(settings));
    const venueListRaw = localStorage.getItem('venue_ids_list');
    const venueList: string[] = venueListRaw ? JSON.parse(venueListRaw) : ['venue_default'];
    if (!venueList.includes(settings.id)) {
      venueList.push(settings.id);
      localStorage.setItem('venue_ids_list', JSON.stringify(venueList));
      memoryTelemetry.totalVenuesCreated = venueList.length;
      memoryTelemetry.activeVenuesCount = venueList.length;
    }
  }
}

export function getVenueLeads(venueId: string = 'venue_default'): CapturedLead[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`venue_leads_${venueId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse leads from storage', e);
      }
    }
  }
  return memoryLeads.filter(l => l.venueId === venueId);
}

export function addCapturedLead(leadData: Omit<CapturedLead, 'id' | 'createdAt'>): CapturedLead {
  const newLead: CapturedLead = {
    ...leadData,
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString()
  };

  memoryLeads.unshift(newLead);
  memoryTelemetry.totalLeadsCaptured += 1;
  memoryTelemetry.lastLeadTimestamp = newLead.createdAt;

  if (typeof window !== 'undefined') {
    const currentLeads = getVenueLeads(leadData.venueId);
    const updated = [newLead, ...currentLeads];
    localStorage.setItem(`venue_leads_${leadData.venueId}`, JSON.stringify(updated));

    const storedTelem = localStorage.getItem('platform_telemetry');
    const telem: PlatformTelemetry = storedTelem ? JSON.parse(storedTelem) : memoryTelemetry;
    telem.totalLeadsCaptured = (telem.totalLeadsCaptured || 0) + 1;
    telem.lastLeadTimestamp = newLead.createdAt;
    localStorage.setItem('platform_telemetry', JSON.stringify(telem));
  }

  return newLead;
}

export function getPlatformTelemetry(): PlatformTelemetry {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('platform_telemetry');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse telemetry', e);
      }
    }
  }
  return memoryTelemetry;
}

export function updatePlatformTelemetry(update: Partial<PlatformTelemetry>): PlatformTelemetry {
  memoryTelemetry = { ...memoryTelemetry, ...update };
  if (typeof window !== 'undefined') {
    localStorage.setItem('platform_telemetry', JSON.stringify(memoryTelemetry));
  }
  return memoryTelemetry;
}
