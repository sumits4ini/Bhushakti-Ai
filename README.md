# BHUSHAKTI AI (भू-शक्ति AI)

### AI-Powered Landslide Early Warning & Risk Intelligence Platform for the North Eastern Region (NER)

**Problem Statement:** SIH26001  
**Organization:** Ministry of Development of North Eastern Region (MDoNER)  
**Theme:** Disaster Management  
**Version:** `1.0.0-prototype`  

---

## 🏔️ 1. Project Overview

**BHUSHAKTI AI (भू-शक्ति AI)** is a tactical decision-support and geohazard early warning platform engineered for the complex geo-climatic terrain of North East India (*Mizoram, Meghalaya, Sikkim, Assam, Nagaland, Arunachal Pradesh, Manipur, Tripura*).

Rather than serving as a passive sensor dashboard, BHUSHAKTI AI answers four foundational operational questions for State Disaster Management Authorities (SDMAs):
1. **WHERE is the risk?** — Interactive GIS Vector Mapping with 7 real-time layers tracking national highway lifelines (NH-54, NH-10), settlements, critical bridges, and slope risk zones.
2. **WHY is the risk increasing?** — Explainable AI Risk Engine decomposing hazard scores via SHAP-style attribution points ($+29\text{ pts}$ rainfall deluge, $+24\text{ pts}$ soil saturation, $+18\text{ pts}$ slope angle, $+7.5\text{ pts}$ ground crack evidence).
3. **WHEN could it become critical?** — 24-Hour Coupled Meteorological Hazard Horizon projecting risk trajectories at $\text{Now}, +3\text{h}, +6\text{h}, +12\text{h}, +24\text{h}$.
4. **WHAT should authorities do next?** — Automated Response Priority Matrix ($P1$–$P4$) generating actionable dispatch tickets for the SDRF 1st Battalion and BRO Highway Wing.

---

## 🏗️ 2. System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │       METEOROLOGICAL TELEMETRY          │
                               │  IMD AWS • 1h/6h/24h/72h Rain • Soil %  │
                               └────────────────────┬────────────────────┘
                                                    │
                               ┌────────────────────▼────────────────────┐
                               │       GEOTECHNICAL & SPATIAL DATA       │
                               │  SRTM DEM (Slope/Elev) • GSI Clusters   │
                               └────────────────────┬────────────────────┘
                                                    │
                               ┌────────────────────▼────────────────────┐
                               │     GROUND TRUTH & AI COMPUTER VISION   │
                               │  Mobile Geo-Tagged Patrols • Crack CV   │
                               └────────────────────┬────────────────────┘
                                                    │
                               ┌────────────────────▼────────────────────┐
                               │     EXPLAINABLE AI RISK FUSION ENGINE   │
                               │  12-Feature SHAP Attribution (0-100)    │
                               └────────────────────┬────────────────────┘
                                                    │
                    ┌───────────────────────────────┴───────────────────────────────┐
                    │                                                               │
        ┌───────────▼───────────┐                                       ┌───────────▼───────────┐
        │  GIS COMMAND CENTER   │                                       │   AUTONOMOUS DISPATCH │
        │  Leaflet / PostGIS    │                                       │   P1-P4 Task Tickets  │
        │  Multi-Layer Hotspots │                                       │   SDRF / BRO Orders   │
        └───────────────────────┘                                       └───────────────────────┘
```

---

## ⚡ 3. Ten Core Implemented Features

1. **GIS Disaster Command Center (`/dashboard`):** Real-time spatial viewport tracking all 8 NER states with 6 key operational KPIs, district filtering, and zone detail drawers.
2. **Fullscreen Vector Map (`/map`):** 7 interactive vector layer toggles (*Risk Heatmap, National Highways, Settlements, Infrastructure, Historical Landslides, Field Observations, Active Red Alerts*).
3. **12-Feature Explainable AI Risk Engine (`/risk`):** Deterministic multi-factor risk inference engine with interactive feature sliders, scenario presets, and SHAP point breakdowns.
4. **Coupled 24-Hour Weather Forecast (`/forecast`):** Weather telemetry linked with predictive landslide risk curves and 1-click monsoon deluge escalation simulation.
5. **Mobile-First Field Reporting App (`/field-report`):** Sub-60-second incident submission with 1-click device GPS capture, camera input, and sample terrain photo testing.
6. **Edge AI Computer Vision Inspector (`VisionAnalysisService`):** Automated feature extraction identifying transverse tension cracks ($94\%$ conf), debris flows, and road blockages.
7. **Emergency Landslide Alerts Console (`/alerts`):** Automated severity scoring (`INFO` $\to$ `WATCH` $\to$ `WARNING` $\to$ `CRITICAL`) with multi-channel broadcast proxies.
8. **Tactical Response Dispatch Center (`/response`):** Kanban workflow (`PENDING` $\to$ `DEPLOYED` $\to$ `IN_PROGRESS` $\to$ `COMPLETED`) for SDRF, BRO, and medical rescue teams.
9. **Deterministic 8-Stage Disaster Simulation (`/simulation`):** Hackathon demonstration mode showcasing the end-to-end autonomous chain from rainfall squall to P1 highway clearance.
10. **Low-Network Offline Sync & Bilingual Support (`useI18n()`):** Full English & Hindi localization with local IndexedDB/localStorage queue and auto-synchronization banner.

---

## 🔬 4. Explainable AI Methodology

The Landslide Hazard Index ($LHI \in [0, 100]$) is computed through an explainable multi-factor formulation:

$$LHI = \min\left(100, \sum_{i=1}^{12} w_i \cdot f_i(\mathbf{x}) + \Delta_{\text{ground\_truth}}\right)$$

### Factor Weights & Categories:
| Feature | Category | Max Contribution | Description |
| :--- | :--- | :--- | :--- |
| `rainfall_24h` | Hydrological | $+24.0\text{ pts}$ | 24-hour cumulative precipitation |
| `rainfall_1h` | Hydrological | $+12.0\text{ pts}$ | High-intensity cloudburst rate |
| `soil_moisture` | Geotechnical | $+20.0\text{ pts}$ | Volumetric subsoil pore saturation |
| `slope_angle` | Topographical | $+18.0\text{ pts}$ | Critical escarpment angle ($>35^\circ$) |
| `historical_cluster` | Geological | $+10.0\text{ pts}$ | Prior GSI slide frequency in 5km buffer |
| `distance_to_road` | Infrastructure | $+8.0\text{ pts}$ | Proximity to toe road cut |
| `field_crack_signal` | Ground Truth | $+7.5\text{ pts}$ | Tension crack detected via Computer Vision |

---

## ⚖️ 5. Real vs. Simulated Components Matrix

To maintain absolute academic and operational transparency:

| Component | Status | Implementation Details |
| :--- | :--- | :--- |
| **Spatial PostGIS Schema** | **REAL** | 17 normalized tables with spatial geometry & indices in `supabase/migrations/` |
| **Next.js & Design System** | **REAL** | Full Next.js 14 App Router, Tailwind CSS, Dark-First tokens, and Radix UI primitives |
| **Bilingual Localization** | **REAL** | Complete English & Hindi central translation dictionary (`src/lib/i18n/`) |
| **Offline Sync Queue** | **REAL** | IndexedDB/localStorage queue with auto-reconnect synchronization |
| **AI Risk Fusion Engine** | **REAL / CALIBRATED** | Deterministic mathematical scoring adhering to Indian geotechnical standards |
| **AI Computer Vision** | **PROTOTYPE** | Simulated edge neural network feature extraction with explicit disclaimer tags |
| **Weather & SMS Feeds** | **SIMULATED ADAPTER** | Pluggable adapter architecture; mock sandbox log for SMS/Email dispatch |

---

## 💻 6. Quick Start & Local Setup

### Prerequisites
- **Node.js:** `v18.17.0+` or `v20.0.0+`
- **npm:** `v9.0.0+`

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-org/bhushakti-ai.git
cd bhushakti-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 7. Environment Variables

Create `.env.local` in the root directory:

```env
# Next.js Public App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase Credentials (Optional for local standalone demo mode)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Security (Never expose service role key to browser)
SUPABASE_SERVICE_ROLE_KEY=""
```

---

## 👥 8. Demo Personas & Credentials

The application includes an instant **1-Click Persona Switcher** in the top navigation bar:

* 🏛️ **SDMA State Director (ADMIN):** Full executive access to Command Center, Response Matrix, and Alert Acknowledgement.
* 🛡️ **SDRF Field Inspector (FIELD_OFFICER):** Access to Ground Truth verification inbox, mobile field form, and assigned P1 tasks.
* 👨‍🌾 **Hill Community Resident (CITIZEN):** Public warning alerts, 24h weather hazard forecast, and fast community incident reporting.

---

## 🎯 9. Recommended 3-Minute Hackathon Demo Flow for Judges

1. **Minute 1: The Problem & GIS Command Center (`/` $\to$ `/dashboard`)**
   - Open Landing Page to highlight the **SIH26001 / MDoNER** mandate.
   - Jump to Command Center: show the interactive Leaflet map of the 8 NER states.
   - Click **Aizawl (Hunthar Veng / NH-54)**: showcase the right-side **WHY** (SHAP factor point breakdown) and **WHAT** (recommended directives) panel.
2. **Minute 2: Explainable AI & Field Computer Vision (`/risk` $\to$ `/field-report`)**
   - Navigate to `/risk`: drag the **24h Rainfall** slider from $42\text{mm} \to 118\text{mm}$ to demonstrate instant $<15\text{ms}$ risk index recalculation.
   - Open `/field-report`: demonstrate mobile-first submission with 1-click device GPS capture, sample test photo, and **Prototype AI Vision** crack detection.
3. **Minute 3: Disaster Simulation & Tactical Response (`/simulation` $\to$ `/response`)**
   - Navigate to `/simulation`: hit **"START SIMULATION"** to run the deterministic 8-stage Aizawl cloudburst scenario.
   - Show the sequence: *Rainfall Surge $\to$ Soil Saturation $\to$ Field Crack $\to$ AI Recalibration ($89/100$) $\to$ P1 Red Alert $\to$ Automated SDRF Dispatch*.
   - Click the **`हिन्दी`** button in the header to demonstrate full bilingual localization.

---

## 🏛️ Government Attribution & Disclaimer

Developed for the **Smart India Hackathon 2026** under Problem Statement **SIH26001** for the **Ministry of Development of North Eastern Region (MDoNER)**.  
*Disclaimer: BHUSHAKTI AI is a decision-support prototype. Environmental thresholds and computer vision detections are calibrated for demonstration and evaluation purposes.*
