# VoidMap Social Globe PRD v0.2

> Status: Draft  
> Owner: Zita  
> Agent: voidmap  
> Last updated: 2026-07-10  
> File purpose: define VoidMap as a social 3D particle-globe product for urbex, niche check-ins, and personal exploration proof.

---

## 1. Product Summary

VoidMap is a 3D particle-globe platform where users light up places they have explored, attach optional photos/videos/stories, and generate a unique personal globe page they can share.

The core idea is not just “I went somewhere.” It is:

> I can prove I was there, choose what to reveal, and turn my exploration into a collectible personal world.

VoidMap combines three things:

- a global 3D discovery globe;
- a personal globe/profile page;
- a social layer for sharing, proof, and prestige.

---

## 2. Product Positioning

### 2.1 Category

VoidMap sits between:

- urbex / exploration logs;
- niche travel check-ins;
- personal map portfolios;
- lightweight creator pages.

### 2.2 Core Differentiation

VoidMap is different from a normal map app because:

- it is visual-first, not list-first;
- it is personal-first, not feed-first;
- it emphasizes proof, rarity, and identity;
- each user gets a unique globe page rather than being one post in a crowded feed.

### 2.3 One-line Positioning

A personal and social 3D globe for people who want to light up the places they have explored, show what they want to reveal, and share a unique proof-of-visit page.

---

## 3. Target Users

### 3.1 Primary Users

- urbex / urban explorer communities;
- people who like climbing, rooftops, abandoned places, and off-the-beaten-path locations;
- users who enjoy check-ins, collecting badges, and showing off achievements;
- niche travel and exploration enthusiasts.

### 3.2 Secondary Users

- travel creators and micro-creators;
- users who want a stylish personal map page;
- people who want to document trips with photos, short notes, and links;
- users who want AI-generated route suggestions later.

### 3.3 User Motivation

Users come to VoidMap because they want:

- to show where they have been;
- to prove they were really there;
- to collect visible achievements;
- to share a polished personal page;
- to discover other people’s exploration style.

---

## 4. Product Principles

### 4.1 Personal First

Each globe should primarily represent one person’s story. The product should not become a noisy mixed feed by default.

### 4.2 Social Through Sharing

Social behavior should happen through:

- shareable links;
- discovery pages;
- comparisons;
- comments / likes later;
- public proof of exploration.

### 4.3 Reveal by Choice

Users decide what to disclose:

- just a check-in;
- check-in + photo;
- check-in + note;
- check-in + route tips;
- check-in + video + social links.

### 4.4 Rarity Matters

Some locations should feel special. Rare or iconic places can have stronger identity, badges, or claim mechanics.

### 4.5 Globes Should Stay Clean

The global globe should stay readable. It should not show too much detail at once.

---

## 5. Product Structure

VoidMap should have three main surfaces:

1. Global discovery globe.
2. Personal globe page.
3. Spot detail / check-in card.

### 5.1 Global Discovery Globe

Purpose:

- attract users;
- show the existence of lighted places;
- drive curiosity;
- route users into a personal page or spot detail.

Rules:

- show sparse, high-signal dots;
- avoid clutter;
- make dots clickable;
- show only limited metadata on the surface.

### 5.2 Personal Globe Page

Purpose:

- show one user’s exploration history;
- display their chosen color and identity;
- show their checked-in places as a rotating globe;
- serve as the user’s shareable profile.

Rules:

- each user has a unique URL;
- the page should feel like a portfolio / trophy case;
- the page should be the main share destination.

### 5.3 Spot Detail Card

Purpose:

- reveal the context behind a lighted place;
- show uploaded media and optional links;
- explain the visit in a compact, elegant way.

---

## 6. Core User Story

### Story 1: Light Up a Place

As a user, I want to check in at a place I explored so that it becomes part of my personal globe.

### Story 2: Control Disclosure

As a user, I want to choose how much to reveal so that I can share selectively.

### Story 3: Show Proof

As a user, I want a shareable page that proves I visited a place so that I can show it to friends or followers.

### Story 4: Discover Others

As a viewer, I want to click a dot and see the story behind it so that I can discover interesting places and creators.

### Story 5: Feel Achievement

As a user, I want badges, counts, and rarity signals so that the product feels like progress, not just storage.

---

## 7. Interaction Model

### 7.1 Globe Interaction

The globe should support:

- drag to rotate;
- pinch / wheel to zoom;
- click a dot to open detail;
- hover a dot for quick preview;
- locate a region and focus it.

### 7.2 Hand Gesture Direction

Long term, the product can explore hand gestures such as:

- open hand = expand media / open memory;
- closed hand = collapse view;
- swipe left / right = rotate the globe;
- swipe up / down = zoom or jump between regions.

This should be treated as a future interaction layer, not a hard MVP requirement.

### 7.3 Dot Behavior

A dot can represent:

- a place the user visited;
- a rare claim location;
- a route checkpoint;
- a social landmark.

When selected, the dot can reveal:

- a photo or video;
- a short note;
- map link;
- social link;
- date / time;
- privacy level.

---

## 8. Social Mechanics

### 8.1 Unique Personal URLs

Each user should have a unique page URL.

Example:

- `voidmap.app/u/zita`
- `voidmap.app/@username`

### 8.2 Shareable Proof Page

Every check-in can generate a shareable card or link.

This should help users:

- post on social media;
- prove they were there;
- show off their achievement;
- drive inbound curiosity.

### 8.3 Optional Public Visibility

Users can choose whether a spot is:

- private;
- friends-only;
- public;
- public with limited details.

### 8.4 Community Discovery

Users should be able to discover:

- who lit up a location first;
- what content is attached to a place;
- which places are rare or trending;
- which users have an interesting exploration style.

### 8.5 Comments / Likes Later

Comments and likes are useful, but they are not the first thing the product should depend on.

---

## 9. Place Claiming and Rarity

### 9.1 Default Rule

By default, multiple users can check in to the same area.

### 9.2 Rare Claim Rule

Some locations can be treated as rare or claimed:

- first user to light it gets special ownership signals;
- later users can still view it, but not override the original spot identity;
- optional “first seen” badge can increase prestige.

### 9.3 Geographic Precision

The product can use different precision levels:

- city level;
- neighborhood level;
- exact place level;
- 0.5km or 1km grid tile for special modes.

### 9.4 Recommendation

For MVP, do not hard-enforce exclusive 0.5km blocking everywhere.
Instead:

- keep normal check-ins open;
- add rarity only for selected places or special campaigns.

This keeps the product usable while still preserving competition and prestige.

---

## 10. Achievement System

VoidMap should reward users beyond posting.

### 10.1 Metrics

- total check-ins;
- total cities;
- total countries;
- rare locations visited;
- first claim count;
- consecutive active days;
- route completions.

### 10.2 Badge Types

- first light;
- rare finder;
- rooftop collector;
- abandoned explorer;
- night traveler;
- route finisher;
- city master.

### 10.3 Why It Matters

The achievement system gives users a reason to keep exploring even if they do not post every time.

---

## 11. Content Types

Each check-in can support one or more of the following:

- title;
- photo;
- video;
- short note;
- route notes;
- map link;
- social link;
- privacy label;
- timestamp.

### 11.1 Content Disclosure Levels

- level 1: name only;
- level 2: name + note;
- level 3: name + media;
- level 4: name + media + links;
- level 5: full showcase.

This should be controlled by the user.

---

## 12. AI Opportunities

AI should be a later-layer feature, not the starting point.

Possible AI uses:

- recommend routes based on prior behavior;
- suggest similar locations;
- help users summarize a visit;
- classify exploration themes;
- generate a personal trip / explore recap.

### AI Principle

AI should help users explore and organize, not replace the social proof layer.

---

## 13. MVP Scope

### 13.1 MVP Must Have

- a 3D particle globe;
- drag / rotate interaction;
- clickable dots;
- personal globe page;
- user color selection;
- place check-in card;
- photo or media attachment;
- unique profile page link;
- basic privacy controls;
- simple achievement counters.

### 13.2 MVP Should Have

- shareable profile page;
- spot detail modal / card;
- basic place claim / rare tag;
- dot hover preview;
- mobile-friendly viewing.

### 13.3 MVP Could Have Later

- comments;
- likes;
- route recommendations;
- AI summaries;
- gesture controls;
- advanced rarity logic;
- creator / pro membership.

### 13.4 Out of Scope for MVP

- heavy social feed;
- full real-time chat;
- complex moderation tools;
- massive multiplayer map editing;
- deep gamification economy.

---

## 14. Layout Direction

### 14.1 Global Page

The global page should feel like:

- a dark showroom;
- a discovery map;
- a clean entry point;
- a teaser for the product.

### 14.2 Personal Page

The personal page should feel like:

- a personal museum;
- a trophy wall;
- a map portfolio;
- a private but shareable identity page.

### 14.3 Visual Tone

Recommended tone:

- dark;
- black-and-white first;
- restrained neon accents;
- premium and cinematic;
- not childish, not gamey.

---

## 15. Data Model

### 15.1 User

```ts
export type User = {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  color: string;
  avatarUrl?: string;
  profileSlug: string;
};
```

### 15.2 Place

```ts
export type Place = {
  id: string;
  name: string;
  city: string;
  country?: string;
  lat: number;
  lng: number;
  tileKey?: string;
  rarity?: "normal" | "rare" | "claimed";
};
```

### 15.3 Check-in

```ts
export type CheckIn = {
  id: string;
  userId: string;
  placeId: string;
  createdAt: string;
  title?: string;
  note?: string;
  photoUrls?: string[];
  videoUrls?: string[];
  socialLinks?: string[];
  privacyLevel: "private" | "friends" | "public";
};
```

### 15.4 Badge

```ts
export type Badge = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
};
```

---

## 16. Success Metrics

### 16.1 Activation Metrics

- profile creation rate;
- first check-in completion rate;
- first share rate;
- first media upload rate.

### 16.2 Engagement Metrics

- check-ins per user;
- dots clicked per session;
- average time on personal globe page;
- share link open rate.

### 16.3 Social Metrics

- profile link shares;
- visits from shared pages;
- follow / save / comment interactions later.

---

## 17. Risks and Constraints

### 17.1 Risk: Too Much Visual Noise

If the globe shows too many people at once, it will become unreadable.

Mitigation:

- one person per globe page;
- sparse global view;
- reveal detail only on click.

### 17.2 Risk: Low Trust / Safety Concerns

Some urbex content may involve sensitive or unsafe locations.

Mitigation:

- optional privacy;
- redaction controls;
- content reporting;
- location precision controls.

### 17.3 Risk: Users Only Post Once

If the product only supports one-off posting, retention may be weak.

Mitigation:

- achievements;
- rarity;
- personal progression;
- route streaks;
- discovery loops.

### 17.4 Risk: Too Much Like a Feed

If it becomes a crowded content feed, it loses the core identity.

Mitigation:

- keep globe as the main metaphor;
- keep profiles personal;
- avoid heavy feed-first structure.

---

## 18. Commercialization Ideas

### 18.1 Membership

Membership can unlock:

- more customization;
- custom globe colors;
- more uploads;
- advanced privacy;
- richer profile pages;
- premium routes or analytics.

### 18.2 Creator Tools

Paid tools could include:

- custom domain or subdomain;
- branded profile pages;
- exportable share cards;
- route summary pages.

### 18.3 Community / Guide Economy

Later, VoidMap can support:

- paid route bundles;
- featured exploration packs;
- creator-made guides;
- specialized niche communities.

---

## 19. Recommended MVP Decision

For the first build, VoidMap should be:

- one person’s globe first;
- social through sharing, not through a crowded feed;
- optimized for check-in proof and personal identity;
- visual enough to be memorable;
- simple enough to ship.

The product should answer three questions very clearly:

1. Have I been there?
2. Can I show it?
3. Does it feel special?

If the answer is yes, the product works.

---

## 20. Open Questions

- Should rare locations be globally unique or only unique within a tile/grid?
- Should users be able to merge multiple check-ins into one route story?
- What level of location precision should be visible by default?
- Should social links be public by default or opt-in only?
- Should the first version support anonymous posting?

---

## 21. Next Document to Write

After this PRD, the next useful doc is:

- a feature spec for the global globe vs personal globe;
- or a UX flow for “check in -> attach media -> publish -> share”.
