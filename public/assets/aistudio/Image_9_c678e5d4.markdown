---
name: FarmaCare
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4942'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7a71'
  outline-variant: '#bdcac0'
  surface-tint: '#006c47'
  primary: '#006b47'
  on-primary: '#ffffff'
  primary-container: '#00875a'
  on-primary-container: '#ffffff'
  inverse-primary: '#71dba6'
  secondary: '#006781'
  on-secondary: '#ffffff'
  secondary-container: '#8fdfff'
  on-secondary-container: '#00647d'
  tertiary: '#006b49'
  on-tertiary: '#ffffff'
  tertiary-container: '#00875d'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#8df7c1'
  primary-fixed-dim: '#71dba6'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005235'
  secondary-fixed: '#b9eaff'
  secondary-fixed-dim: '#81d1f0'
  on-secondary-fixed: '#001f29'
  on-secondary-fixed-variant: '#004d62'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a clinical yet deeply empathetic healthtech environment. It reconciles precision medicine with human warmth, transforming stressful pharmaceutical interactions—such as refilling prescriptions, tracking dosages, and consulting clinical staff—into intuitive, calm, and reassuring experiences.

The design movement combines **Modern Clinical Minimalism** with soft, human-centric tactile qualities:
- **Clinical Confidence:** High-legibility typography, deliberate structure, strict contrast ratios meeting WCAG AAA compliance for body text, and purposeful semantic indicators.
- **Empathetic Warmth:** Softened surface radiuses, soothing ambient elevation, gentle mint and cyan washes, and clear visual signifiers that eliminate cognitive friction.
- **Visual Restraint:** Surfaces remain pristine and decluttered. Visual complexity is reserved strictly for critical medical data (dosage metrics, interaction warnings, prescription authentication).

## Colors

The palette balances pharmaceutical authority with energetic wellness.

- **Primary (`#00875A` - Deep Health Emerald):** The foundational brand anchor. Evokes botanical balance, trusted clinical oversight, and life sciences. Used for key actions, primary buttons, active state indicators, and verified pharmacy badges.
- **Secondary (`#0E7490` - Deep Medical Cyan):** Represents diagnostic precision and technology. Applied to secondary interactive elements, informational banners, tele-health triggers, and technical details.
- **Tertiary (`#10B981` - Fresh Mint):** Vitality and progress. Reserved for success confirmations, verification tags, dosage completion, and positive health metrics.
- **Neutral (`#0F172A` - Slate Ink):** Deepest textual hierarchy (`#0F172A`) paired with supporting secondary slate (`#334155`) and muted clinical meta-text (`#64748B`).
- **Canvas & Surface System:** 
  - Base Canvas: `#F8FAFC` (Slate 50), offering a glare-free, comforting backdrop.
  - Surface Raised: `#FFFFFF` (Pure Medical White) for elevated interactive cards.
  - Borders: Crisp, soft dividers utilizing `#E2E8F0` (Slate 200).
- **Specialty Health Accents:**
  - Prescription Required (`Rx`): Warm Gold/Amber (`#D97706` text with `#FEF3C7` background).
  - Verification & Safety: Crisp Teal-Green (`#047857` text with `#ECFDF5` background).
  - High-Alert Warning / Contraindication: Crimson Alert (`#DC2626` text with `#FEF2F2` background).

## Typography

Typography pairs **Plus Jakarta Sans** for structure, display titles, and UI wayfinding with **Inter** for dense instructional data, drug descriptions, and dosage schedules.

- **Plus Jakarta Sans (Headings & Labels):** Provides rounded geometry, geometric terminals, and approachable clinical authority. Eliminates the coldness common in legacy medical interfaces.
- **Inter (Body & Specifications):** Ensures neutral clarity, tabular numeral alignment for dosage quantities (`mg`, `ml`, daily intervals), and uncompromised optical legibility at small sizes (`12px` and `14px`).

## Layout & Spacing

The layout is built primarily around a mobile-first fluid grid, enforcing strict touch ergonomics:

- **Mobile Viewports (< 640px):** 4-column fluid layout with `16px` (`1rem`) outer margins and `16px` gutters. Critical actions occupy the thumb-accessible bottom quadrant. Sticky action drawers maintain bottom clearance with safe-area insets.
- **Tablet Viewports (640px – 1024px):** 8-column layout with `32px` outer margins. Content groups into dual-column cards (e.g., medication profile side-by-side with refill schedule).
- **Desktop/Clinical Dashboard (> 1024px):** 12-column layout max-width capped at `1200px` centered, allowing structured side-by-side management for multi-patient records.
- **Rhythm:** Spacing follows an 8pt base grid (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 32px), ensuring consistent vertical scanning for medical records and medication inventories.

## Elevation & Depth

Visual hierarchy uses **tonal surfaces and soft ambient shadows** rather than harsh outlines or deep drop-shadows. This preserves a sterile, pristine, and light aesthetic.

- **Level 0 (Base):** `#F8FAFC` flat canvas for full-screen backgrounds.
- **Level 1 (Card & Module Surface):** `#FFFFFF` paired with an ultra-subtle tinted shadow: `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)` and a delicate outline border `1px solid #E2E8F0`.
- **Level 2 (Interactive Floating Elements & Navigation):** `0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)` with border `1px solid #E2E8F0`. Used for mobile navigation bars, bottom sheets, and floating prescription status cards.
- **Level 3 (Modals & Drug Interaction Overlays):** `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04)`.
- **Glass Accents:** For sticky headers and blur-backed navigation bars, surfaces utilize `rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(12px)` and a subtle bottom border `#E2E8F0`.

## Shapes

The design uses balanced, rounded geometries (Level 2) that feel organic, safe, and modern:
- **Card containers & surface modules:** Enforce a uniform `16px` (`rounded-lg`) corner radius, softening the presentation of medical equipment and pharmaceuticals.
- **Buttons and inputs:** Standardized at `12px` to preserve structured tap targets.
- **Pills, status tags, and chips:** Styled with fully rounded capsules (`rounded-full` / `9999px`) to distinguish categorical metadata from interactive cards.
- **Badges and alert markers:** `8px` corner radius for structured callouts, contrasting with fluid status tags.

## Components

### Buttons
- **Primary:** Background `#00875A`, text `#FFFFFF`, radius `12px`, height `48px` (mobile touch target). States: Active/Hover `#00734D`, Focus-ring `3px` offset tinted `#10B981`.
- **Secondary (Clinical Accent):** Background `#ECFDF5`, text `#00875A`, border `1px solid rgba(0, 135, 90, 0.2)`.
- **Outline / Ghost:** Background `transparent`, text `#0E7490`, border `1px solid #E2E8F0`.

### Cards & Prescription Modules
- Constructed on pure white (`#FFFFFF`) with a `16px` border-radius and `1px solid #E2E8F0` border.
- **Medication Card Structure:** Top row displays the drug name in `headline-sm` with dosage metadata in `body-sm` (`#64748B`), paired with an absolute right-aligned status chip (e.g., "Active Refill"). Center section hosts clear scheduling rules, while the bottom anchors primary actions (e.g., "Order Refill", "Log Dose").

### Healthcare Badges & Status Chips
- **Prescription Required (`Rx Required`):** Background `#FEF3C7`, text `#B45309`, border `1px solid #FDE68A`, shape `rounded-full`, padding `4px 10px`, typography `label-sm`.
- **Verified Clinical Tag:** Background `#ECFDF5`, text `#047857`, border `1px solid #A7F3D0`, includes a miniature check icon.
- **Telemetry / Lab Status:** Background `#EFF6FF`, text `#1D4ED8`, border `1px solid #BFDBFE`.

### Input Fields & Selectors
- Height `48px`, background `#FFFFFF`, border `1px solid #CBD5E1`, corner radius `12px`, typography `body-md` (`#0F172A`).
- Focus state: Border transitions to `#00875A` with a soft halo `0 0 0 3px rgba(0, 135, 90, 0.15)`.
- Helper & warning text: Accompanied by inline clinical icons in `#DC2626` (errors) or `#0E7490` (guidance).

### Checkboxes & Radio Controls
- Minimum touch area `44px x 44px`. Indicator box `20px x 20px` with `6px` radius (checkbox) or circular (radio).
- Unchecked: `1.5px solid #94A3B8`.
- Checked: Background `#00875A` featuring a crisp white SVG checkmark.

### Mobile Navigation Bar
- Fixed bottom placement, height `64px` plus safe-area-inset. Background `rgba(255, 255, 255, 0.92)` with `backdrop-filter: blur(16px)` and top border `1px solid #E2E8F0`.
- Icon items feature a dual-tone style: inactive `#64748B`, active `#00875A` accompanied by an active indicator pip underneath.