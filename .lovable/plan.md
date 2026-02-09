# NeuraBridge Implementation Plan

## Overview
A discovery-first platform connecting retail investors with market experts across asset classes. Clean, light-themed design with dark mode support. Full functionality with expert self-service and investor subscriptions.

---

## ✅ Phase 1: Foundation & Core Pages (COMPLETE)

### 1.1 Design System & Layout ✅
- Light, clean color palette with dark teal and golden amber (from logo)
- Dark mode toggle support
- Responsive layouts (desktop-optimized, mobile-friendly)
- Global header with navigation and auth status
- Consistent card components for experts and posts

### 1.2 Home / Discovery Page ✅
- Hero section with value proposition
- "What is NeuraBridge" explainer section  
- "How it works" section for investors and experts
- **Featured Experts** carousel
- **Trending Experts** carousel  
- **Popular Markets** section (stocks, crypto, FX, bonds, commodities)
- Expert preview cards with photo, name, markets, headline, price, and "View Expert" CTA
- Link to full Experts Directory

### 1.3 Experts Directory Page ✅
- Grid/list toggle view of all experts
- Filters: Market type, Free vs Paid, Price range
- Search by expert name or market
- Click-through to individual Expert pages

---

## ✅ Phase 2: Authentication & Database (COMPLETE)

### 2.1 Database Schema ✅
- **profiles**: Basic user info (id, username, full_name, avatar_url)
- **user_roles**: Separate table for roles (investor/expert) - security best practice
- **expert_profiles**: Extended info (bio, credentials, markets, subscription_price)
- **posts**: Content with visibility (public/private)
- **subscriptions**: Investor-expert relationships with status

### 2.2 Security ✅
- Row-level security on all tables
- Security definer helper functions (has_role, is_expert, is_investor, is_subscribed)
- Private posts only visible to: post owner OR subscribed investors
- Automatic profile creation on signup via trigger

### 2.3 Authentication System ✅
- Unified login/signup page at /auth
- Role selection: Investor or Expert
- Email/password authentication with Zod validation
- AuthProvider context with role awareness
- Header updates based on auth state

---

## Phase 3: Expert Experience (Core) - NEXT

### 3.1 Public Expert Page (Two-Column Layout) ✅
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

### 3.2 Expert Dashboard (Private Area) - TODO
- Profile management (photo, bio, credentials, markets)
- Subscription pricing settings
- Post creation: asset, market, timeframe, insight, public/private toggle
- View all published posts
- Subscriber count and analytics overview

---

## Phase 4: Investor Experience - TODO

### 4.1 Public Insights Feed ✅
- Global feed of all public posts across experts
- Filters: market type, expert, timeframe
- Click expert name/avatar → opens their Expert Page
- Acts as public discovery hub

### 4.2 Investor Dashboard (Private Area) - TODO
- Private feed/inbox with all subscriber-exclusive content
- Posts grouped or filtered by expert
- Only content from subscribed experts
- Quick access to manage subscriptions

---

## Phase 5: Subscriptions - TODO

### 5.1 Subscription Flow (UI Ready)
- Subscribe button on Expert page side panel
- Subscribe CTA on locked posts
- Subscription confirmation modal
- Mock payment processing (Stripe integration ready for later)
- Auto-unlock private content on subscription

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

## Compliance Elements ✅
- Footer disclaimers on all pages
- "Educational content only" notices
- "Not financial advice" statements
- Clear separation between public and private content

