# 🎉 Eventify — Headless Event Management Platform

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![Contentstack](https://img.shields.io/badge/Contentstack-6C47FF?logo=contentstack&logoColor=white)
![Headless CMS](https://img.shields.io/badge/Architecture-Headless-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

Eventify is a **headless, CMS-driven event management platform** built using **Next.js** and **Contentstack**.  
It enables users to **create, manage, auto-publish, and discover events** using a modern, scalable architecture.

---

## 🔗 Live Demo

👉 **Live URL:**  
https://event-landing-ayush.eu-contentstackapps.com

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Content Models](#-content-models)
- [Auto-Publish Workflow](#-auto-publish-workflow)
- [Pages & Routes](#-pages--routes)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [What This Project Demonstrates](#-what-this-project-demonstrates)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

---

## 🧠 Project Overview

Eventify demonstrates a **real-world headless CMS implementation** where:

- Content is managed independently of UI
- Events are created dynamically with speakers and schedules
- Publishing is fully automated
- Search and discovery are fast and personalized

The project reflects **production-grade CMS workflows** and best practices.

---

## ✨ Key Features

### 🧩 Headless CMS Architecture
- Contentstack manages structured content
- Next.js handles all UI rendering
- Fully decoupled frontend & CMS

### ⚙️ Automated Event Creation
- Create events via a custom UI
- Automatically:
  - Upload assets
  - Create speaker entries
  - Create schedule entries
  - Publish all content

### 🖼️ Asset Management
- Banner images and speaker photos stored as Contentstack assets
- Assets referenced using UIDs

### 🔗 Content Relationships
- Events reference speakers and schedules
- Clean relational modeling

### 🔍 Search & Personalization
- Algolia-powered search
- Category-based filtering (`tech`, `music`, `sports`, `festivals`)
- Personalized recommendations

### ⏳ Event Status Handling
- Upcoming
- Live
- Past  
Calculated using event start & end times

### 📱 Responsive UI
- Mobile-first design
- Animated hero section
- Smooth transitions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-----|------------|
| Frontend | Next.js (App Router) |
| CMS | Contentstack (Headless CMS) |
| Search | Algolia |
| Styling | CSS Modules |
| Backend Logic | Next.js API Routes |
| Deployment | Contentstack Launch |

---

## 🏗️ Architecture Overview

```text
Create Event UI (Next.js)
        ↓
API Route (/api/create-event)
        ↓
Contentstack CMS
  - Assets
  - Speakers
  - Schedules
  - Events
        ↓
Auto-Publish
        ↓
Next.js fetches published content
        ↓
Frontend renders UI
```

## 📂 Content Models

### 📌 Event (`event_ayush`)
- **Title**
- **Slug**
- **Location**
- **Start Time**
- **End Time**
- **Category**
- **Description**
- **CTA Text**
- **CTA Link**
- **Banner Image**
- **References**
  - Speakers
  - Schedules

---

### 🎤 Speaker (`speaker_ayush`)
- **Name**
- **Designation**
- **Bio**
- **Photo**

---

### ⏰ Schedule (`schedule_ayush`)
- **Time**
- **Title**
- **Description**

---

## 🔄 Auto-Publish Workflow

When an event is created using the **Create Event** form:

1. Banner image is uploaded to **Contentstack Assets**
2. Speaker entries are created and **auto-published**
3. Schedule entries are created and **auto-published**
4. Event entry is created with references
5. Event is **automatically published** to the environment

✅ No manual CMS steps  
✅ No broken references  
✅ Production-ready content workflow  

---

## 🖥️ Pages & Routes

| Route | Description |
|------|------------|
| `/` | Landing page |
| `/events` | All events with search & filters |
| `/events/[slug]` | Event details page |
| `/create-event` | Create event form |
| `/api/create-event` | Backend orchestration API |

---

## 🎨 UI Highlights

- Responsive hero section with rotating preview images
- Featured events grid
- Category-based filtering (tech, music, sports, festivals)
- Countdown timers for upcoming events
- Clean, modern card-based layout

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token
CONTENTSTACK_ENVIRONMENT=development

ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_SEARCH_KEY=your_algolia_search_key
```
⚠️ Do not commit this file to GitHub

## ▶️ Running Locally

1. git clone https://github.com/Ayush2649/Event-Landing-Ayush.git
2. cd Event-Landing-Ayush
3. npm install
4. npm run dev

- Open in browser: http://localhost:3000

## 🎯 What This Project Demonstrates

- Headless CMS architecture

- Decoupled frontend & content management

- Backend orchestration using API routes

- Structured content modeling

- Automated publishing workflows

- CMS-driven frontend rendering

- Scalable and maintainable design

## 🚀 Future Enhancements

- Authentication & role-based access

- Draft preview support

- Multi-language content

- Event analytics dashboard

## 👨‍💻 Author

Ayush Sahu
Intern Project — Exploring modern headless CMS architecture using Contentstack and Next.js
