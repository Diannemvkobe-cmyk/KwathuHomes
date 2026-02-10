PHASE 0: INTENT LOCK (Non-negotiable)

Before touching Next.js like an excited toddler.

Goal
Build a simple, trustworthy Zambian real-estate app. Browsing listings should feel calm, not like gambling.

Rules

No feature unless it solves friction.

No “future ideas” folder. Lies.

If it feels clever, it’s probably wrong.

Think: Airbnb browsing + local context. Simple. Ngqo.

PHASE 1: PRODUCT SHAPE (What exists, nothing more)

This is where most devs already mess up.

Core users

Guest: Browses listings

Agent/Owner: Posts listings

Admin: Moderates listings

That’s it. No “super agents”, no NFTs, no AI valuation nonsense.

Core actions

Browse properties

Filter by location, price, type

View single property

Contact agent (no chat system yet)

Agent can post/edit/delete listings

If it’s not here, it waits. Patience is architecture.

PHASE 2: INFORMATION ARCHITECTURE (Silent killer phase)

This is where “AI-made” apps expose themselves.

Pages map (frontend)

/ Home (search + featured)

/listings All properties

/listings/[id] Property detail

/post Add property

/dashboard Agent listings

/login / /register

No infinite scrolling ego trips. Predictable paths. Users relax when they recognize structure.

PHASE 3: UI SYSTEM (Modern but not screaming)

You said Aceternity UI, so good taste detected. 👀✨

Frontend stack

Next.js (App Router, TSX only)

Aceternity UI for components

Tailwind CSS for layout control

Framer Motion for subtle motion

Lucide Icons clean, neutral

Zustand for simple global state

UI principles

Large spacing

Soft shadows

No neon

Neutral colors + one accent

Animations only on intent, not flexing

If someone says “this feels calm”, you won.

PHASE 4: DATA MODELING (Mongo, but disciplined)

Mongo doesn’t mean chaos. Relax.

Core collections

users

properties

locations

images

Each property:

title

price

type (rent/sale)

location

images

description

ownerId

createdAt

No embedded philosophical essays. Data stays boring. That’s power.

PHASE 5: BACKEND FOUNDATION (Node + Express, boring on purpose)

Backend should feel invisible.

Stack

Node.js

Express

MongoDB (Mongoose)

JWT auth

Multer or Cloudinary for images

Zod for validation

API groups

/auth

/users

/properties

/locations

RESTful, predictable, testable. If your routes feel poetic, you’ve failed.

PHASE 6: AUTH & TRUST (Soft security)

Not Fort Knox. Just enough.

Email + password

JWT

Role-based access

Property ownership checks

No OAuth circus yet. Zambia first, Silicon Valley later.

Trust beats complexity. Always.

PHASE 7: PROPERTY FLOW (Core magic)

This is the heartbeat.

Agent posts property

Admin approves

Property goes live

Guests browse

Contact via WhatsApp / phone link

Notice: no internal chat. That’s intentional. Real-world friction reduction.

Ukuphila kulula when you respect reality.

PHASE 8: SEARCH & FILTERING (Feels smart, not flashy)

Price range

Location

Type

Bedrooms

Indexed properly. Fast responses. Users forgive ugly before slow.

PHASE 9: POLISH (This is where AI apps die)

Skeleton loaders

Empty states

Error messages that sound human

Responsive design done properly

This phase separates “built” from “crafted”.

PHASE 10: DEPLOYMENT & REALITY CHECK

Frontend: Vercel

Backend: Railway / Render

DB: Mongo Atlas

Then:

Give it to real users

Watch them struggle

Fix silently

Repeat