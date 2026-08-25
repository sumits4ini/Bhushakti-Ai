# BHUSHAKTI AI (भू-शक्ति AI)

### AI-Powered Landslide Early Warning & Risk Intelligence Platform for North Eastern Region (NER)

**Problem Statement:** SIH26001  
**Organization:** Ministry of Development of North Eastern Region (MDoNER)  
**Theme:** Disaster Management  
**Version:** `1.0.0-prototype`

---

## 🏔️ Product Overview

**BHUSHAKTI AI** is a state-of-the-art decision-support and geohazard risk intelligence platform engineered specifically for the complex geo-climatic conditions of North East India (Mizoram, Meghalaya, Sikkim, Assam, Nagaland, Arunachal Pradesh, Manipur, Tripura).

Rather than serving as a passive telemetry dashboard, BHUSHAKTI AI answers four critical operational questions:
1. **WHERE is the risk?** (GIS Heatmap, District/Zone GeoJSON, National Highway corridors like NH-54 & NH-10).
2. **WHY is the risk increasing?** (Multi-factor AI Risk Fusion combining 1h/6h/24h/72h rainfall, soil saturation, slope angles, and ground truth crack reports).
3. **WHEN could the risk become critical?** (24-hour predictive forecast curves at +3h, +6h, +12h, and +24h).
4. **WHAT should authorities do next?** (Automated Emergency Response Prioritization P1 to P4 and task allocation).

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Radix/shadcn-inspired accessible UI tokens
- **GIS Engine:** Leaflet / MapLibre GL with PostGIS spatial geometry
- **AI / ML Layer:** Pluggable Tabular Risk Fusion Model + Computer Vision Crack Inspection Adapter
- **Database:** Supabase (PostgreSQL 16 + PostGIS 3.4) with offline IndexedDB fallback
- **Icons & Visualization:** Lucide React + Recharts

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/bhushakti-ai.git
cd bhushakti-ai

# Install dependencies
npm install
```

### 3. Environment Setup
```bash
# Copy example environment configuration
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Architecture & Folder Structure

```
src/
├── app/                  # Next.js App Router routes (/dashboard, /map, /risk, /alerts, /reports, /response, /forecast, /field-report)
├── components/
│   ├── ui/               # Reusable accessible primitives (Button, Card, Badge, Skeleton)
│   ├── common/           # Shared components (RiskBadge, LoadingSpinner, ErrorBoundary, EmptyState)
│   └── layout/           # Header, Sidebar, PageShell, RoleSwitcher, ThemeToggle
├── features/             # Domain-specific feature modules
├── lib/
│   ├── ai/               # Risk engine & model services
│   ├── gis/              # Geospatial calculations & layer handlers
│   ├── risk/             # Reusable Risk-Status system (Low, Moderate, High, Critical)
│   ├── simulation/       # Live disaster scenario engine
│   ├── supabase/         # Supabase client & PostGIS queries
│   └── demo/             # Isolated mock data for offline/standalone execution
├── types/                # Strict TypeScript type definitions
hooks/                    # Custom React hooks
services/                 # Business logic & integration services
supabase/migrations/      # PostGIS SQL DDL schema
scripts/                  # Data seeding & utilities
```

---

## 🧪 Verification & Build Checks

```bash
# Typecheck TypeScript files
npm run typecheck

# Lint codebase
npm run lint

# Production build
npm run build
```

---

## 🏛️ Government & Academic Attribution

Developed for the **Smart India Hackathon 2026** under the auspices of the **Ministry of Development of North Eastern Region (MDoNER)**.  
*Disclaimer: All thresholds and predictions are engineered for prototype decision support and demonstration purposes.*
