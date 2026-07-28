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

## 🐙 How to Push to GitHub

Run the following terminal commands to publish your repository to GitHub:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files and make initial commit
git add .
git commit -m "Initial commit - Explore Local QR Wi-Fi Lead Capture SaaS"

# 3. Create a new repository on GitHub (via GitHub website or GitHub CLI)
# GitHub CLI command (if installed):
gh repo create explore-local-qr-wifi --public --source=. --remote=origin --push

# Or manual git remote command:
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/explore-local-qr-wifi.git
git push -u origin main
```

---

## ⚡ How to Deploy Live on Vercel

### Option A: Vercel Web Dashboard (1-Click Deployment)
1. Push code to GitHub (as shown above).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository `explore-local-qr-wifi`.
4. Leave framework settings as **Next.js** (Zero configuration needed!).
5. Click **"Deploy"**. Your live URL will be active in ~45 seconds (e.g. `https://explore-local-qr-wifi.vercel.app`).

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
