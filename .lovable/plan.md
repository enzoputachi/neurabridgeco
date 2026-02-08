

# NeuraBridge Implementation Plan

## Overview
A discovery-first platform connecting retail investors with market experts across asset classes. Clean, light-themed design with dark mode support. Full functionality with expert self-service and investor subscriptions.

---

## Phase 1: Foundation & Core Pages

### 1.1 Design System & Layout
- Light, clean color palette with professional blues and soft neutrals
- Dark mode toggle support
- Responsive layouts (desktop-optimized, mobile-friendly)
- Global header with navigation and auth status
- Consistent card components for experts and posts

### 1.2 Home / Discovery Page
- Hero section with value proposition
- "What is NeuraBridge" explainer section  
- "How it works" section for investors and experts
- **Featured Experts** carousel
- **Trending Experts** carousel  
- **Popular Markets** section (stocks, crypto, FX, bonds, commodities)
- Expert preview cards with photo, name, markets, headline, price, and "View Expert" CTA
- Link to full Experts Directory

### 1.3 Experts Directory Page
- Grid/list toggle view of all experts
- Filters: Market type, Free vs Paid, Price range
- Search by expert name or market
- Click-through to individual Expert pages

---

## Phase 2: Expert Experience (Core)

### 2.1 Public Expert Page (Two-Column Layout)
**Main Feed (Left/Center):**
- Chronological feed of expert's posts
- Public posts fully visible
- Private posts shown locked/blurred with "Subscribers Only" label
- Each post shows: asset, market, timeframe, insight, visibility label

**Expert Panel (Right/Sticky):**
- Expert photo, bio, credentials
- Markets covered badges
- Subscription price & benefits
- Primary CTA: "Subscribe for Private Insights"

### 2.2 Expert Dashboard (Private Area)
- Profile management (photo, bio, credentials, markets)
- Subscription pricing settings
- Post creation: asset, market, timeframe, insight, public/private toggle
- View all published posts
- Subscriber count and analytics overview

---

## Phase 3: Investor Experience

### 3.1 Public Insights Feed
- Global feed of all public posts across experts
- Filters: market type, expert, timeframe
- Click expert name/avatar → opens their Expert Page
- Acts as public discovery hub

### 3.2 Investor Dashboard (Private Area)
- Private feed/inbox with all subscriber-exclusive content
- Posts grouped or filtered by expert
- Only content from subscribed experts
- Quick access to manage subscriptions

---

## Phase 4: Authentication & Subscriptions

### 4.1 Authentication System
- Unified login/signup page
- Role selection: Investor or Expert
- Email/password authentication
- Profile creation flow based on role

### 4.2 Subscription Flow (UI Ready)
- Subscribe button on Expert page side panel
- Subscribe CTA on locked posts
- Subscription confirmation modal
- Mock payment processing (Stripe integration ready for later)
- Auto-unlock private content on subscription

---

## Phase 5: Backend & Data

### 5.1 Database Structure
- **Users/Profiles**: role (investor/expert), profile data
- **Expert Profiles**: bio, credentials, markets, subscription price
- **Posts**: content, asset, market, timeframe, visibility (public/private), expert reference
- **Subscriptions**: investor-expert relationships, status
- **Markets**: predefined list (stocks, crypto, FX, bonds, commodities)

### 5.2 Security
- Row-level security for private posts
- Experts can only edit their own content
- Investors only see private posts from subscribed experts
- Proper role-based access controls

---

## Key Features Summary

| Feature | Investor | Expert |
|---------|----------|--------|
| Browse experts & public posts | ✅ | ✅ |
| Subscribe to experts | ✅ | - |
| View private insights | ✅ (subscribed) | ✅ (own) |
| Create posts | - | ✅ |
| Set subscription pricing | - | ✅ |
| Dashboard with private feed | ✅ | ✅ |

---

## Compliance Elements
- Footer disclaimers on all pages
- "Educational content only" notices
- "Not financial advice" statements
- Clear separation between public and private content

