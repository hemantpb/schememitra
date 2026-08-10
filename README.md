# SchemeMitra — Government Scheme Discovery Platform for MSMEs

> **PM Portfolio & Full-Stack Case Study**

SchemeMitra helps Indian MSMEs and entrepreneurs discover government schemes relevant to their business through a transparent, explainable, rule-based recommendation engine.

---

## 1. Problem Statement & Persona

### Core Problem
Indian MSME owners know they need funding, machinery subsidies, export support, or expansion capital, but they struggle to navigate hundreds of scattered government portals, complex eligibility rules, and opaque criteria.

### Target Persona
**Indian MSME / Small Business Owner**
*Example*: A small food-processing business in Nagpur, Maharashtra seeking ₹25 Lakh for machinery upgrade and factory expansion.

---

## 2. Product Features & User Journey

SchemeMitra implements the full discovery-to-action flow:

```
Landing Page ──> Business Profile Wizard (5 steps) ──> Recommendation Engine
                        │
                        ├──> Top Matching Schemes (Match Score + Reasons)
                        ├──> "Why Not This Scheme?" (Lower matches & missing criteria)
                        ├──> Scheme Details & Verification (Official URLs)
                        └──> Saved Schemes & Side-by-Side Comparison ──> Custom Action Plan
```

### Core Capabilities
1. **5-Step Onboarding Wizard** (Sector, Location, Scale & Metrics, Registrations, Help Objectives).
2. **Transparent Recommendation Engine** (Deterministic 100-point scoring algorithm with explainable reasons and warnings).
3. **Verified Scheme Cards & Detail Pages** (Official Ministry URLs, guidelines, required document lists, and application steps).
4. **Side-by-Side Comparison & Action Plan** (Compare up to 3 schemes with custom roadmap execution steps).
5. **Explore & Search Catalog** (Real-time keyword search by machinery, subsidy, ministry, and sector filters).
6. **Admin Panel & Verification Tracker** (Monitor verified vs unverified schemes and track product metrics).

---

## 3. Recommendation Scoring Architecture

The recommendation engine uses **zero black-box AI**, ensuring 100% deterministic transparency:

$$\text{Total Match Score} = S_{\text{Sector}} + S_{\text{Location}} + S_{\text{Scale}} + S_{\text{Objective}} + S_{\text{Registration}}$$

- **Sector Match (30 pts)**: Matches target sector or general MSME eligibility.
- **Location Match (20 pts)**: Verified against state availability (e.g. Maharashtra PSI incentives vs Central schemes).
- **Enterprise Size Match (20 pts)**: Micro, Small, or Medium scale bounds.
- **Objective Match (20 pts)**: Proportional match across selected needs (Funding, Machinery, Export, etc.).
- **Registration Match (10 pts)**: Udyam, GST, FSSAI, IEC active status check.

---

## 4. Primary Product Metric

### Qualified Scheme Actions (QSA)
**Definition**: The total number of users who discover a relevant scheme and perform a high-intent decision action (saving a scheme, comparing schemes, or clicking through to the official application portal).

---

## 5. Technical Stack & Local Setup

- **Frontend & App Router**: Next.js 16, React 19, TypeScript
- **Styling & UI**: Tailwind CSS, Lucide Icons
- **Data Layer**: Structured local JSON seed (`schemes.json`) with Supabase PostgreSQL migration readiness
- **Execution**: Run `npm run dev` and navigate to `http://localhost:3000`

---

## 6. Verification & Quality Assurance

- Run TypeScript build check: `npm run build`
- Run integration testing suite: `npm test`
