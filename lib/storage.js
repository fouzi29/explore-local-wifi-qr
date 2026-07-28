"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVenueSettings = getVenueSettings;
exports.getVenueBySlug = getVenueBySlug;
exports.getAllVenues = getAllVenues;
exports.saveVenueSettings = saveVenueSettings;
exports.getVenueLeads = getVenueLeads;
exports.addCapturedLead = addCapturedLead;
exports.getPlatformTelemetry = getPlatformTelemetry;
exports.updatePlatformTelemetry = updatePlatformTelemetry;
var DEFAULT_VENUE = {
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
var DEFAULT_LEADS = [
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
var memoryVenues = {
    venue_default: DEFAULT_VENUE
};
var memoryLeads = __spreadArray([], DEFAULT_LEADS, true);
var memoryTelemetry = {
    totalVenuesCreated: 1,
    totalLeadsCaptured: DEFAULT_LEADS.length,
    activeVenuesCount: 1,
    creatorNotificationEmail: 'fouzi.cse@gmail.com',
    lastLeadTimestamp: new Date().toISOString()
};
function getVenueSettings(venueId) {
    if (venueId === void 0) { venueId = 'venue_default'; }
    if (typeof window !== 'undefined') {
        var stored = localStorage.getItem("venue_settings_".concat(venueId));
        if (stored) {
            try {
                return JSON.parse(stored);
            }
            catch (e) {
                console.error('Failed to parse venue settings from storage', e);
            }
        }
    }
    return memoryVenues[venueId] || DEFAULT_VENUE;
}
function getVenueBySlug(slug) {
    if (typeof window !== 'undefined') {
        var venueListRaw = localStorage.getItem('venue_ids_list');
        var venueList = venueListRaw ? JSON.parse(venueListRaw) : ['venue_default'];
        for (var _i = 0, venueList_1 = venueList; _i < venueList_1.length; _i++) {
            var vid = venueList_1[_i];
            var v = getVenueSettings(vid);
            if (v && v.slug.toLowerCase() === slug.toLowerCase()) {
                return v;
            }
        }
    }
    var found = Object.values(memoryVenues).find(function (v) { return v.slug.toLowerCase() === slug.toLowerCase(); });
    return found || DEFAULT_VENUE;
}
function getAllVenues() {
    if (typeof window !== 'undefined') {
        var venueListRaw = localStorage.getItem('venue_ids_list');
        var venueList = venueListRaw ? JSON.parse(venueListRaw) : ['venue_default'];
        return venueList.map(function (vid) { return getVenueSettings(vid); }).filter(Boolean);
    }
    return Object.values(memoryVenues);
}
function saveVenueSettings(settings) {
    memoryVenues[settings.id] = settings;
    if (typeof window !== 'undefined') {
        localStorage.setItem("venue_settings_".concat(settings.id), JSON.stringify(settings));
        var venueListRaw = localStorage.getItem('venue_ids_list');
        var venueList = venueListRaw ? JSON.parse(venueListRaw) : ['venue_default'];
        if (!venueList.includes(settings.id)) {
            venueList.push(settings.id);
            localStorage.setItem('venue_ids_list', JSON.stringify(venueList));
            memoryTelemetry.totalVenuesCreated = venueList.length;
            memoryTelemetry.activeVenuesCount = venueList.length;
        }
    }
}
function getVenueLeads(venueId) {
    if (venueId === void 0) { venueId = 'venue_default'; }
    if (typeof window !== 'undefined') {
        var stored = localStorage.getItem("venue_leads_".concat(venueId));
        if (stored) {
            try {
                return JSON.parse(stored);
            }
            catch (e) {
                console.error('Failed to parse leads from storage', e);
            }
        }
    }
    return memoryLeads.filter(function (l) { return l.venueId === venueId; });
}
function addCapturedLead(leadData) {
    var newLead = __assign(__assign({}, leadData), { id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6), createdAt: new Date().toISOString() });
    memoryLeads.unshift(newLead);
    memoryTelemetry.totalLeadsCaptured += 1;
    memoryTelemetry.lastLeadTimestamp = newLead.createdAt;
    if (typeof window !== 'undefined') {
        var currentLeads = getVenueLeads(leadData.venueId);
        var updated = __spreadArray([newLead], currentLeads, true);
        localStorage.setItem("venue_leads_".concat(leadData.venueId), JSON.stringify(updated));
        var storedTelem = localStorage.getItem('platform_telemetry');
        var telem = storedTelem ? JSON.parse(storedTelem) : memoryTelemetry;
        telem.totalLeadsCaptured = (telem.totalLeadsCaptured || 0) + 1;
        telem.lastLeadTimestamp = newLead.createdAt;
        localStorage.setItem('platform_telemetry', JSON.stringify(telem));
    }
    return newLead;
}
function getPlatformTelemetry() {
    if (typeof window !== 'undefined') {
        var stored = localStorage.getItem('platform_telemetry');
        if (stored) {
            try {
                return JSON.parse(stored);
            }
            catch (e) {
                console.error('Failed to parse telemetry', e);
            }
        }
    }
    return memoryTelemetry;
}
function updatePlatformTelemetry(update) {
    memoryTelemetry = __assign(__assign({}, memoryTelemetry), update);
    if (typeof window !== 'undefined') {
        localStorage.setItem('platform_telemetry', JSON.stringify(memoryTelemetry));
    }
    return memoryTelemetry;
}
