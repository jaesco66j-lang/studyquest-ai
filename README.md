# 🎮 StudyQuest AI — Fisica 1 UNIBG

App di studio **gamificata** con OCMA & PAV (Matteo Salvo), AI Tutor, Timer 60 min, Mystery Box e 8 metodi scientifici.

## ✨ Feature MVP

- 🔵 **OCMA** (Matteo Salvo) — Osserva → Comprendi → Memorizza → Applica
- 🟣 **PAV** (Matteo Salvo) — Paradosso → Azione → Vivido
- 🗺️ **5 Territori** Fisica 1 UNIBG con tracking progressi
- ⏱️ **Timer** 60/40/25 min con XP automatici al completamento
- 📦 **Mystery Box** con premi casuali (XP, timer bonus, moltiplicatori)
- 🤖 **AI Tutor** con Claude Sonnet — spiega con OCMA e PAV, fa quiz, esempi biomedici
- 📐 **8 Metodi** scientifici (Feynman, Spaced Rep., Active Recall, Mind Map, Interleaving…)
- 🔥 Streak, livelli, XP, notifiche

## 🚀 Deploy su Vercel (3 step)

### 1. Carica su GitHub
```bash
git init
git add .
git commit -m "StudyQuest AI MVP"
git remote add origin https://github.com/TUO_USERNAME/studyquest-ai.git
git push -u origin main
```

### 2. Importa su Vercel
1. Vai su [vercel.com](https://vercel.com) → **Add New Project**
2. Importa il tuo repository GitHub
3. Framework: **Vite** (rilevato automaticamente)
4. Lascia tutto il resto invariato → **Deploy**

### 3. Aggiungi la API Key
1. Nel tuo progetto Vercel → **Settings** → **Environment Variables**
2. Aggiungi:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (la tua chiave da [console.anthropic.com](https://console.anthropic.com))
3. **Redeploy** (Deployments → ⋯ → Redeploy)

✅ **Fatto!** La tua app è live.

## 💻 Sviluppo locale

```bash
npm install
cp .env.example .env.local
# Inserisci la tua ANTHROPIC_API_KEY in .env.local
npm run dev
```

## 📁 Struttura

```
studyquest-ai/
├── api/
│   └── chat.js          # Serverless function — proxy sicuro Anthropic API
├── src/
│   ├── main.jsx          # Entry point React
│   ├── App.jsx           # Componente principale (tutto l'MVP)
│   └── index.css         # Stili globali + animazioni
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── vercel.json           # Routing Vercel
└── package.json
```

## 🔐 Sicurezza

La `ANTHROPIC_API_KEY` **non è mai esposta al browser** — viene usata solo nella Vercel Serverless Function `api/chat.js`.

---

Built with ❤️ per Fisica 1 UNIBG · Metodi OCMA & PAV by Matteo Salvo
