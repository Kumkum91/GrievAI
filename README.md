<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 🎤 GrievAI - Voice-First Public Grievance Intelligence System

> AI-powered voice complaint platform for India | AI for Bharat Hackathon 2026

---

## 🌟 Overview

**GrievAI** enables citizens to register public grievances via **voice in Hindi/English**, automatically categorizes and routes them using **AI**, and identifies **systemic governance issues** through pattern detection.

### The Problem
- 25%+ citizens struggle with text-based forms (literacy barrier)
- 2-3 days manual processing delay
- 30-40% complaints misrouted
- No transparency or pattern analysis

### Our Solution
Voice → AI Categorization → Auto-Routing → Real-time Tracking → Pattern Detection

---

## ✨ Key Features

**Citizens**: Voice registration, real-time tracking, progress updates  
**Officers**: Smart dashboard, AI insights, pattern detection alerts  
**Public**: Aggregated statistics, department performance metrics

---

## 🤖 AI Components (5)

| Component | Technology | Accuracy |
|-----------|-----------|----------|
| Speech-to-Text | Google Cloud STT | 85%+ |
| Categorization | BERT + TF-IDF | 80%+ |
| Urgency Detection | scikit-learn | High/Med/Low |
| Smart Routing | Rule-based AI | 90%+ |
| Pattern Detection | DBSCAN | Real-time |

---

## 🏗️ Architecture

```
React.js (AWS Amplify)
         ↓ HTTPS
Node.js + Express (Render.com) + AI Engine
         ↓
MongoDB Atlas + AWS S3
```

**Style**: 3-Tier with AI Intelligence Engine  
**Communication**: REST API + Apache Kafka

---

## 🛠️ Tech Stack (36 Technologies)

**Frontend**: React.js 18+, Tailwind CSS, Web Audio API, Chart.js, AWS Amplify  
**Backend**: Node.js 18+, Express.js, JWT, Multer, Helmet.js, Render.com  
**AI/ML**: Google Cloud STT, BERT, scikit-learn, DBSCAN, Pandas, NumPy  
**Data**: MongoDB Atlas, AWS S3  
**Infrastructure**: Cloudflare CDN, Let's Encrypt, Apache Kafka

---

**Environment Variables**: MongoDB URI, JWT Secret, Google Cloud credentials, AWS keys

---

## 📊 Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Registration Time | 5-10 min | <2 min | 80% faster |
| Processing | 2-3 days | Instant | 99% faster |
| Routing Accuracy | 60-70% | 90%+ | 30% better |
| Cost per Complaint | ₹50-100 | ₹2-5 | 95% cheaper |


---

## 🗺️ Roadmap

**Phase 1 (MVP)**: Voice (Hindi/English), 5 categories, tracking, pattern detection  
**(Future ) Phase 2**: Mobile apps, 15+ languages, SMS/Email notifications  


---

## 🏆 Why GrievAI?

✅ **First voice-first** grievance platform for India  
✅ **5 AI components** for intelligent automation  
✅ **95% cost reduction** vs manual processing  
✅ **100% transparency** with real-time tracking  
✅ **Scalable** from prototype to national deployment

---

## � Documentation

- [Requirements](requirements.md)
- [System Design](design.md)

---










>>>>>>> 6dacd307dafadddc83a431fa74332dc3e865362a
