# WellnessHub | Digital Mental Health & Psychological Support System

<p align="center">
  A front-end, multi-page professional dashboard application entirely dedicated to mapping, assessing, and supporting the psychological equilibrium of students handling academic workloads.
</p>

## ✨ Core Features

* **Intelligent Intake Assessment:** Contextual onboarding flow gathering information on current social habits, immediate academic timelines, and persistent personal challenges to define a student’s baseline snapshot.
* **Premium Dashboard Architecture:** Designed mirroring enterprise-grade SaaS aesthetics using Tailwind CSS, including fully responsive sidemenus and interactive widget layout systems.
* **Timestamped Mood Tracking:** Users can log their daily emotional states out of 5 distinct tiers. Entries are instantly saved and cataloged into their historical progress feed.
* **Automated Client-Side Caching:** Utilizing localized JavaScript Object caching (`localStorage`) to guarantee uninterrupted session stability with zero database provisioning required.
* **Emergency Routing Protocols:** Immediate access barriers for emergency hotlines disguised directly inside the Community support suite for immediate help when necessary.

## 🚀 Getting Started

This application uses pure HTML5, standard JavaScript, and Tailwind CSS (via CDN). No complex bundlers or configurations required for basic local execution.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Neemasree/Design-Thinking-Digital-Mental-Health-Psychological-Support-System-for-Students.git
   ```
2. **Access the directory:**
   ```bash
   cd Design-Thinking-Digital-Mental-Health-Psychological-Support-System-for-Students
   ```
3. **Run a Local Server:**
   While you can open the HTML files directly, it is recommended to run a lightweight local server to prevent any potential local CORS restrictions.
   ```bash
   # If using Node:
   npx serve .
   
   # Or using Python:
   python -m http.server 8000
   ```
4. Navigate to `http://localhost:3000` (or `8000`) and the application will automatically route you into the initial login and assessment workflow.

## 🗂 Project Structure

| File | Description |
| ---- | ----------- |
| `app.js` | The central brain handling session checks, login routing, and memory cache interactions. |
| `index.html` | Base portal redirecting unauthenticated users cleanly to entry gates. |
| `dashboard.html` | High-level interactive summary displaying widgets and aggregated statuses. |
| `assessment.html` & `student-check.html` | The user onboarding and initial baseline metric gathering phase. |
| `mood.html` & `progress.html` | Interfaces exclusively meant for check-ins and historical charting. |
| `community.html` & `academics.html` | Dedicated knowledge bases for counseling connection and study frameworks. |

## 🎨 Technology Stack
* **Markup:** Native HTML5
* **Logic Framework:** Vanilla JavaScript (ES6) 
* **Design System:** Tailwind CSS (CDN-delivered for rapid prototyping) featuring the crisp `Inter` typeface stack.
* **Storage Provider:** Client-Bound `localStorage` DOM API