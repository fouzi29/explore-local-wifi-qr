# 📡 'Explore Local' QR Wi-Fi Lead Capture System

A modern, high-converting **QR Wi-Fi Lead Capture & Local Recommendation Web Application** built with Next.js 14, Tailwind CSS, TypeScript, Nodemailer, and QR code generation.

Designed for cafes, restaurants, hotels, retail stores, festivals, and local venues. Guests scan tabletop QR codes, enter basic details to get instant Wi-Fi access & local deals, while business owners get lead management, CSV export, custom SMTP email alerts, and printable acrylic stand templates.

---

## 🌟 Key Features

1. **Guest Portal (Front-of-House)**:
   - Mobile-first, hyper-fast landing page.
   - Lead capture form (Name, Email/Phone, Local Interest chips, Marketing consent).
   - Instant Wi-Fi unlock with 1-click Password Copy & Camera Auto-Connect QR code (`WIFI:S:SSID;T:WPA;P:Password;;`).
   - Unlocked local recommendations & venue specials.

2. **Self-Service Multi-Tenant Onboarding (`/onboard`)**:
   - Anyone can launch their own venue portal in 60 seconds without developer touch!

3. **Optional Custom SMTP Email Integration**:
   - Venue owners can optionally connect their outgoing/incoming email server (Gmail, SendGrid, custom cPanel SMTP).
   - Automated email notifications sent to the owner on every lead capture.
   - Includes live "Send Test Email" diagnostic tool.

4. **Master Creator Telemetry (`/admin?tab=master`)**:
   - Platform owner dashboard tracking total created venues, active system usage, and overall platform leads captured across all venues.

5. **Tabletop QR Studio & Print Stand Generator**:
   - Live QR code generator for portal links & Wi-Fi auto-connect.
   - Print-ready acrylic display stand template (`window.print()`).

6. **Leads Management & CRM Export**:
   - Filterable, searchable lead table.
   - 1-click CSV Export for CRM integration (Mailchimp, HubSpot, Klaviyo).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

- **Guest Portal Demo**: `http://localhost:3000/?venueId=venue_default`
- **Admin Dashboard**: `http://localhost:3000/admin?venueId=venue_default`
- **Self-Service Onboarding**: `http://localhost:3000/onboard`

---

## 🐙 GitHub Repository

Your project is now live on GitHub:
**Repository**: [https://github.com/fouzi29/explore-local-wifi-qr](https://github.com/fouzi29/explore-local-wifi-qr)

---

## ⚡ How to Deploy Live on Vercel

### 1-Click Deployment on Vercel:
1. Open [vercel.com/new](https://vercel.com/new).
2. Select your GitHub account `fouzi29`.
3. Import the repository **`explore-local-wifi-qr`**.
4. Framework Preset will automatically select **Next.js**.
5. Click **"Deploy"**. Your live web app will be published on Vercel in ~30 seconds!

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy directly from terminal
vercel
```

---

## 📄 License
MIT License. Built for seamless zero-config deployment.
