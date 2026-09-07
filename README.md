# Smart Call Trust Score 🛡️📞

> **Context-Aware Spam Call Re-Evaluation System**  


![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)

---

## 📌 Problem Statement

Traditional telecom spam-detection systems (such as Airtel's AI spam network, Truecaller, or Hiya) rely heavily on **static crowd-tagged labels**. Once a phone number is flagged as spam by users, it remains permanently tagged in central telecom databases.

This causes **critical false positives**:
1. **Recycled Phone Numbers**: Telecom providers reassign inactive SIM cards after 90–180 days. A new legitimate user gets a recycled number that was once flagged as spam, causing their calls to be permanently ignored or silenced.
2. **Outdated Spam Flags**: A number tagged as spam 9 months ago during a telemarketing campaign might now be used by a legitimate delivery agent, school, or clinic.
3. **Emergency Call Silencing**: A family member or doctor calling repeatedly from an unfamiliar or legacy-tagged number gets blocked during urgent emergencies.

### 💡 The Solution: Dynamic Context-Aware Trust Scoring Engine

**Smart Call Trust Score** adds a dynamic, behavioral layer on top of legacy static spam tags. Instead of a binary `IsSpam: True/False`, every incoming call is assigned a **0–100 Trust Score** evaluated on-the-fly using:
- **Spam Tag Age Decay**: Older spam tags decay exponentially ($e^{-\lambda t}$), allowing recycled numbers to recover trust.
- **Historical Interpersonal Relationship Signals**: Rewards past 2+ minute answered conversations (+35 pts) and address book presence.
- **Behavioral Anomaly Penalties**: Penalizes high call velocity (>15 calls/24h) and micro-durations (<10s).
- **Repeat-Call Urgency Burst Override**: 3+ calls within a 10-minute window instantly triggers a **"Possibly Urgent"** classification override regardless of static spam tags.

---

## 📐 Mathematical Model Formulation

The Trust Score $S \in [0, 100]$ is calculated deterministically in [`lib/scoring.ts`](file:///c:/Users/SANGAMI%20NANDAGOPAL/Downloads/Smart-call-trust-score/lib/scoring.ts):

$$\text{TrustScore} = \text{Clamp}_{0}^{100}\Big(\text{BaseScore} + D_{\text{tag}} + H_{\text{trust}} + U_{\text{burst}} - P_{\text{freq}} - P_{\text{dur}}\Big)$$

### Key Mathematical Components

1. **Tag Age Exponential Decay ($D_{\text{tag}}$)**:
   $$D_{\text{tag}} = 45 \times \left(1 - e^{-\lambda \cdot t_{\text{age}}}\right) \quad \text{where } \lambda = 0.012 \quad (t_{1/2} \approx 58 \text{ days})$$
   *A static spam tag that is 270 days old (9 months) recovers $+43.2$ points because the probability of SIM recycling exceeds 85%.*

2. **Urgency Burst Override ($U_{\text{burst}}$)**:
   $$\text{If } \text{BurstCount} \ge 3 \text{ in } 10 \text{ mins} \implies U_{\text{burst}} = +45 \text{ pts} \quad \& \quad \text{Category} \to \text{"Possibly Urgent"}$$

3. **Classification Tiers**:
   - **Likely Safe (70 – 100)**: 🛡️ Green Shield
   - **Uncertain (40 – 69)**: ⚠️ Amber Warning
   - **Likely Spam (0 – 39)**: 🚫 Red Ban
   - **Possibly Urgent**: 🚨 Special Purple Pulse Badge (Override)

---
**How to Run**:
1. Run npm install
2. Run npm run dev
3.Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🎯 Key Features & Dashboard Walkthrough

1. **Live Incoming Call Simulator (Centerpiece)**
   - Interactive animated phone UI with incoming call ring pulse animation.
   - Quick preset edge-case buttons: *Recycled Number*, *Urgent Burst*, *Clean Contact*, *Aggressive Spammer*.
   - Live **Force 4-Call Burst Toggle** to demo real-time Urgency Override.
   - Expandable **Mathematical Formula Breakdown** showing exact parameter terms.

2. **Analytics Summary Panel**
   - 4 Stat Cards: Total Calls, % Flagged Static Spam, % Rescued/Urgent, Mean Trust Score.
   - **Recharts Visualizers**: Category Breakdown Donut Chart, Trust Score Distribution Bar Chart, 7-Day Timeline Area Chart.

3. **Call History Table**
   - Filterable by Category (*Likely Safe*, *Uncertain*, *Likely Spam*, *Possibly Urgent*, *Rescued Only*).
   - Search bar by caller number or name.
   - Deep inspection drawer for inspecting individual call records.

4. **Custom Number Inspector**
   - Input custom phone numbers, tag ages, and call frequencies to test the algorithm live.

---

## 🛠️ Project Architecture

```
smart-call-trust-score/
├── app/
│   ├── globals.css         # Tailwind directives & dark mode variables
│   ├── layout.tsx          # Root layout & SEO metadata
│   └── page.tsx            # Main dashboard container
├── components/
│   ├── Navbar.tsx          # Navigation header & theme switcher
│   ├── LiveCallSimulator.tsx # Animated phone call centerpiece UI
│   ├── AnalyticsSummary.tsx# Recharts visualizers & stat cards
│   ├── CallHistoryTable.tsx# Filterable data table & detail inspection
│   ├── AcademicModal.tsx   # Algorithm math & paper overview modal
│   └── AddCustomCallModal.tsx # Custom number live inspector modal
├── lib/
│   ├── scoring.ts          # Core Trust Score Engine (Academic logic)
│   ├── seedData.ts         # 500 synthetic call record generator & presets
│   ├── storage.ts          # LocalStorage persistence & analytics metrics
│   └── types.ts            # TypeScript interfaces & types
└── public/
```



## 📄 License
Academic Research & Demonstration Project
