import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const TERRITORIES = [
  { id: 1, name: "Meccanica del Punto",       icon: "🎯", color: "#FF6B6B", topics: ["Vettori e Analisi Dimensionale", "Cinematica 1D", "Cinematica 2D", "Dinamica – Leggi di Newton", "Lavoro ed Energia", "Energia Potenziale"] },
  { id: 2, name: "Sistemi e Urti",             icon: "💥", color: "#FF9F43", topics: ["Centro di Massa", "Momento Lineare", "Urti Elastici", "Urti Anelastici", "Momento Angolare"] },
  { id: 3, name: "Corpo Rigido & Fluidi",      icon: "🌊", color: "#54A0FF", topics: ["Cinematica Rotazionale", "Dinamica Rotazionale", "Legge di Stevino", "Principio di Archimede", "Equazione di Bernoulli"] },
  { id: 4, name: "Termodinamica",              icon: "🔥", color: "#FF6348", topics: ["Gas Ideali e Reali", "Primo Principio", "Calorimetria", "Ciclo di Carnot", "Secondo Principio ed Entropia"] },
  { id: 5, name: "Elettromagnetismo",          icon: "⚡", color: "#A29BFE", topics: ["Legge di Coulomb e Campo E", "Legge di Gauss", "Potenziale Elettrico", "Circuiti DC", "Campo Magnetico e Forza di Lorentz", "Equazioni di Maxwell"] },
];

const STUDY_METHODS = [
  {
    id: "ocma", name: "OCMA", author: "Matteo Salvo", icon: "🔵", color: "#6C5CE7",
    desc: "Osserva → Comprendi → Memorizza → Applica",
    steps: ["👁️ Osserva il concetto senza giudicare — leggi o ascolta passivamente", "🧠 Comprendi il meccanismo profondo — fai domande, cerca connessioni", "💾 Memorizza con schemi visivi e mnemonici personalizzati", "⚡ Applica con esercizi pratici — almeno 3 problemi diversi"],
    tip: "Il metodo OCMA funziona perché separa la ricezione dalla comprensione, evitando la falsa sensazione di sapere.",
  },
  {
    id: "pav", name: "PAV", author: "Matteo Salvo", icon: "🟣", color: "#FD79A8",
    desc: "Paradosso → Azione → Vivido",
    steps: ["🎭 Paradosso: collega il concetto ad una situazione assurda o sorprendente", "🎬 Azione: immagina il concetto fisico in movimento, come un film mentale", "🌈 Vivido: rendi il ricordo sensoriale — colori, suoni, sensazioni fisiche"],
    tip: "Il PAV sfrutta la memoria episodica: il cervello ricorda meglio storie bizzarre che fatti aridi.",
  },
  {
    id: "pomodoro", name: "Pomodoro", author: "F. Cirillo", icon: "🍅", color: "#FF6B6B",
    desc: "25 min focus + 5 min break",
    steps: ["⏱️ 25 minuti di focus totale — nessuna distrazione", "🔔 Pausa rigida di 5 minuti — alzati, muoviti", "🔄 Dopo 4 cicli: pausa lunga di 20-30 minuti", "📝 Segna ogni pomodoro completato — la soddisfazione motiva"],
    tip: "La scadenza temporale riduce la procrastinazione attivando il 'race against time' nel cervello.",
  },
  {
    id: "feynman", name: "Feynman", author: "R. Feynman", icon: "🏆", color: "#FDCB6E",
    desc: "Spiega come ad un bambino",
    steps: ["📖 Studia il concetto fino a sentirti sicuro", "✍️ Spiegalo ad alta voce come se parlassi ad un bambino di 10 anni", "🔍 Identifica ogni punto dove ti inceppi — quelli sono i tuoi gap", "🔁 Torna al materiale solo per quei gap, poi ripeti"],
    tip: "Se non sai spiegarlo in modo semplice, non lo hai capito davvero. Feynman usava questo metodo ogni giorno.",
  },
  {
    id: "spaced", name: "Spaced Rep.", author: "H. Ebbinghaus", icon: "📅", color: "#00CEC9",
    desc: "Ripetizioni spaziate nel tempo",
    steps: ["1️⃣ Prima ripetizione: 1 giorno dopo lo studio iniziale", "3️⃣ Seconda ripetizione: 3 giorni dopo", "7️⃣ Terza ripetizione: 1 settimana dopo", "🔁 Poi: 2 settimane → 1 mese → 3 mesi"],
    tip: "Combatte la curva dell'oblio di Ebbinghaus: ogni ripetizione 'resetta' il decadimento della memoria.",
  },
  {
    id: "recall", name: "Active Recall", author: "J. Dunlosky", icon: "🎯", color: "#74B9FF",
    desc: "Recupera attivamente dalla memoria",
    steps: ["📚 Studia il materiale una volta con attenzione", "📕 Chiudi il libro — nessun appunto davanti", "✍️ Scrivi o dì ad alta voce tutto ciò che ricordi", "✅ Apri il libro, controlla e correggi i gap"],
    tip: "Recuperare informazioni (invece di rileggerle) è 2-3x più efficace per la ritenzione a lungo termine.",
  },
  {
    id: "mindmap", name: "Mind Map", author: "T. Buzan", icon: "🗺️", color: "#A29BFE",
    desc: "Mappe concettuali visive",
    steps: ["⭕ Centro: scrivi il concetto principale al centro del foglio", "🌿 Rami primari: aggiungi le categorie principali come rami", "🎨 Usa colori diversi per ogni area tematica", "✏️ Aggiungi simboli, frecce e parole-chiave — non frasi"],
    tip: "Il cervello elabora le informazioni visivo-spaziali 60.000 volte più veloce del testo puro.",
  },
  {
    id: "interleave", name: "Interleaving", author: "R. Bjork", icon: "🔀", color: "#55EFC4",
    desc: "Alterna argomenti diversi",
    steps: ["📚 Studia argomento A per 20-30 minuti", "🔄 Passa ad argomento B per 20-30 minuti", "🔀 Torna ad A oppure inizia C", "💡 Evita blocchi lunghi sullo stesso argomento"],
    tip: "Paradossalmente sembra meno efficace nell'immediato ma produce ritenzione 40% superiore a lungo termine.",
  },
];

const MYSTERY_PRIZES = [
  { icon: "⚡", name: "+50 XP Bonus",        value: 50,       type: "xp" },
  { icon: "🛡️", name: "Shield Study",        value: "shield", type: "item" },
  { icon: "🍅", name: "Timer +10 min",        value: 10,       type: "timer" },
  { icon: "💎", name: "JACKPOT +150 XP!",     value: 150,      type: "xp" },
  { icon: "🌟", name: "XP Multiplier 2×",     value: 2,        type: "mult" },
  { icon: "📖", name: "Hint Gratuito",         value: "hint",   type: "item" },
  { icon: "🎯", name: "+75 XP",               value: 75,       type: "xp" },
  { icon: "🔥", name: "Streak Bonus +25 XP",  value: 25,       type: "xp" },
];

const LEVELS = [
  { name: "Esploratore", min: 0,    icon: "🌱", color: "#55EFC4" },
  { name: "Studente",    min: 500,  icon: "📚", color: "#74B9FF" },
  { name: "Analista",    min: 1000, icon: "🔬", color: "#A29BFE" },
  { name: "Ingegnere",   min: 2000, icon: "⚙️", color: "#FDCB6E" },
  { name: "Ricercatore", min: 5000, icon: "🏆", color: "#FF6B6B" },
];

const SYSTEM_PROMPT = `Sei StudyQuest AI, tutor gamificato per Fisica 1 UNIBG (Università degli studi di Bergamo).

METODI OBBLIGATORI da usare (di Matteo Salvo):
- OCMA: Osserva → Comprendi → Memorizza → Applica
- PAV: Paradosso → Azione → Vivido (memoria episodica sensoriale)

PROGRAMMA UNIBG:
- T1 Meccanica del Punto: Vettori, Cinematica 1D/2D, Dinamica, Lavoro, Energia
- T2 Sistemi e Urti: Centro di massa, Impulso, Urti elastici/anelastici, Mom. Angolare
- T3 Corpo Rigido e Fluidi: Rotazioni, Stevino, Archimede, Bernoulli
- T4 Termodinamica: Gas ideali, 1° Principio, Calorimetria, Carnot, Entropia
- T5 Elettromagnetismo: Coulomb, Gauss, Potenziale, Circuiti, Maxwell

REGOLE:
- Rispondi SEMPRE in italiano
- Usa emoji e formattazione chiara
- Massimo 350 parole per risposta
- Quando usi OCMA, segui le 4 fasi con titoli espliciti
- Quando usi PAV, crea una storia assurda/vivida/sensoriale memorabile
- Aggiungi sempre un collegamento biomedico/ingegneristico pratico
- Stile energico, motivante, stile game master universitario
- Alla fine di ogni spiegazione aggiungi: "🎯 SFIDA: [domanda di auto-verifica]"`;

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function StudyQuestAI() {
  const [xp, setXp] = useState(120);
  const [tab, setTab] = useState("dashboard");
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [activeMethod, setActiveMethod] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(3600);
  const [timerMode] = useState("study");
  const [mysteryOpen, setMysteryOpen] = useState(false);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryPrize, setMysteryPrize] = useState(null);
  const [mysteryBoxes, setMysteryBoxes] = useState(3);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [streak] = useState(7);
  const [completedTopics, setCompletedTopics] = useState(new Set(["Vettori e Analisi Dimensionale", "Cinematica 1D"]));
  const timerRef = useRef(null);
  const chatEndRef = useRef(null);

  const currentLevel = [...LEVELS].reverse().find(l => xp >= l.min) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.min > xp);
  const levelProgress = nextLevel
    ? ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  const showNotif = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3200);
  }, []);

  const addXP = useCallback((amount, msg) => {
    setXp(prev => prev + amount);
    showNotif(`+${amount} XP! ${msg || ""}`, "xp");
  }, [showNotif]);

  // Timer
  useEffect(() => {
    if (timerActive && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            addXP(100, "Sessione completata! 🎉");
            setMysteryBoxes(prev => prev + 1);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, addXP]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, chatLoading]);

  const formatTime = s =>
    `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const openMysteryBox = () => {
    if (mysteryBoxes <= 0) { showNotif("Nessuna Mystery Box disponibile!", "error"); return; }
    const prize = MYSTERY_PRIZES[Math.floor(Math.random() * MYSTERY_PRIZES.length)];
    setMysteryPrize(prize);
    setMysteryRevealed(false);
    setMysteryOpen(true);
    setMysteryBoxes(prev => prev - 1);
  };

  const revealPrize = () => {
    setMysteryRevealed(true);
    if (mysteryPrize?.type === "xp") addXP(mysteryPrize.value, "Mystery Box! 📦");
    if (mysteryPrize?.type === "timer") setTimerSeconds(s => s + mysteryPrize.value * 60);
  };

  const sendChat = useCallback(async (msgOverride) => {
    const msg = (msgOverride || chatInput).trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    const userMsg = { role: "user", content: msg };
    const newChat = [...chat, userMsg];
    setChat(newChat);
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newChat.slice(-12),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "⚠️ Nessuna risposta ricevuta.";
      setChat(prev => [...prev, { role: "assistant", content: reply }]);
      addXP(10, "Domanda al tutor!");
    } catch {
      setChat(prev => [...prev, { role: "assistant", content: "⚠️ Errore di connessione. Controlla la tua API key su Vercel." }]);
    }
    setChatLoading(false);
  }, [chat, chatInput, chatLoading, addXP]);

  const completeTopic = topic => {
    if (!completedTopics.has(topic)) {
      setCompletedTopics(prev => new Set([...prev, topic]));
      addXP(50, `"${topic}" completato!`);
      setMysteryBoxes(prev => prev + 1);
    }
  };

  const totalTopics = TERRITORIES.reduce((a, t) => a + t.topics.length, 0);
  const timerPct = (3600 - timerSeconds) / 3600 * 100;
  const R = 54, CIRC = 2 * Math.PI * R;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0C29 0%, #1a1a2e 50%, #16213E 100%)",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background blobs */}
      {["#6C5CE7","#FD79A8","#74B9FF","#FDCB6E","#55EFC4","#FF6B6B"].map((c, i) => (
        <div key={i} style={{
          position: "fixed", borderRadius: "50%", opacity: 0.04,
          background: c,
          width:  [300,200,250,180,220,160][i],
          height: [300,200,250,180,220,160][i],
          top:  [`-5%`,`60%`,`20%`,`70%`,`40%`,`10%`][i],
          left: [`-5%`,`70%`,`60%`,`-5%`,`30%`,`80%`][i],
          filter: "blur(60px)", zIndex: 0, pointerEvents: "none",
        }} />
      ))}

      {/* Notifications */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8 }}>
        {notifications.map(n => (
          <div key={n.id} style={{
            background: n.type === "xp" ? "linear-gradient(135deg,#6C5CE7,#A29BFE)"
                      : n.type === "success" ? "linear-gradient(135deg,#00B894,#55EFC4)"
                      : n.type === "error"   ? "linear-gradient(135deg,#FF6B6B,#FF9F43)"
                      : "linear-gradient(135deg,#2d3436,#636e72)",
            padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700,
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)", animation: "slideIn 0.3s ease",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>{n.msg}</div>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px", position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "12px 16px" }}>
          <div style={{ fontSize: 28 }}>🎮</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, background: "linear-gradient(90deg,#A29BFE,#FD79A8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              StudyQuest AI
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Fisica 1 UNIBG · OCMA & PAV by Matteo Salvo</div>
          </div>
          {/* Level + XP */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{currentLevel.icon} {currentLevel.name}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#FDCB6E", fontFamily: "'JetBrains Mono', monospace" }}>{xp} XP</div>
            <div style={{ width: 80, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, marginTop: 3 }}>
              <div style={{ width: `${levelProgress}%`, height: "100%", background: "linear-gradient(90deg,#6C5CE7,#A29BFE)", borderRadius: 4, transition: "width 0.5s" }} />
            </div>
            {nextLevel && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{nextLevel.min - xp} XP al prossimo</div>}
          </div>
          {/* Streak */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <div style={{ fontSize: 18 }}>🔥</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6B6B" }}>{streak}d</div>
          </div>
          {/* Mystery box */}
          <div onClick={openMysteryBox} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
            cursor: "pointer", padding: "6px 10px", borderRadius: 10,
            border: "1px solid rgba(253,203,110,0.3)", background: "rgba(253,203,110,0.05)",
            animation: mysteryBoxes > 0 ? "glow 2s infinite" : "none",
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 18 }}>📦</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#FDCB6E" }}>×{mysteryBoxes}</div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, padding: "6px", background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            { id: "dashboard",   icon: "🏠", label: "Base" },
            { id: "territories", icon: "🗺️", label: "Territori" },
            { id: "methods",     icon: "📐", label: "Metodi" },
            { id: "timer",       icon: "⏱️", label: "Timer" },
            { id: "tutor",       icon: "🤖", label: "AI Tutor" },
          ].map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 12, fontWeight: 700,
              color: tab === t.id ? "#fff" : "rgba(255,255,255,0.4)",
              background: tab === t.id ? "linear-gradient(135deg,#6C5CE7,#A29BFE)" : "transparent",
            }}>
              {t.icon}<br />{t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════ DASHBOARD ═══════════════ */}
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeIn 0.3s ease" }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { icon: "📚", label: "Topic OK", value: completedTopics.size, sub: `/ ${totalTopics}`, color: "#55EFC4" },
                { icon: "⭐", label: "XP Totali", value: xp, sub: currentLevel.name, color: "#FDCB6E" },
                { icon: "🔥", label: "Streak", value: `${streak}d`, sub: "giorni consecutivi", color: "#FF6B6B" },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Missions */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>⚡ Missioni Attive</div>
              {[
                { icon: "🔵", title: "OCMA Sprint",     desc: "Studia Cinematica 2D con metodo OCMA",         xp: 80,  done: false },
                { icon: "🟣", title: "PAV Story",        desc: "Crea storia PAV per le Leggi di Newton",       xp: 60,  done: completedTopics.has("Cinematica 1D") },
                { icon: "⏱️", title: "Session 60 min",  desc: "Completa una sessione timer completa",          xp: 100, done: false },
                { icon: "📦", title: "Mystery Hunter",   desc: "Apri la tua prima Mystery Box",                xp: 50,  done: false },
              ].map((m, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px",
                  borderRadius: 10, marginBottom: 6,
                  background: m.done ? "rgba(0,184,148,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${m.done ? "rgba(0,184,148,0.2)" : "rgba(255,255,255,0.06)"}`,
                }}>
                  <div style={{ fontSize: 20 }}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: m.done ? "#55EFC4" : "#fff" }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{m.desc}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#FDCB6E" }}>+{m.xp}</div>
                  {m.done ? <div>✅</div> : <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>○</div>}
                </div>
              ))}
            </div>

            {/* OCMA + PAV cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["ocma", "pav"].map(mid => {
                const m = STUDY_METHODS.find(x => x.id === mid);
                return (
                  <div key={mid} className="card" style={{ padding: 14, cursor: "pointer", borderColor: `${m.color}30` }}
                    onClick={() => { setActiveMethod(m); setTab("methods"); }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 22 }}>{m.icon}</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: m.color }}>{m.name}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>by {m.author}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 8 }}>{m.desc}</div>
                    <div style={{ fontSize: 10, color: m.color, fontStyle: "italic" }}>"{m.tip?.slice(0, 70)}…"</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════ TERRITORIES ═══════════════ */}
        {tab === "territories" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {!selectedTerritory ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>🗺️ Programma Fisica 1 UNIBG — scegli un territorio</div>
                {TERRITORIES.map(t => {
                  const done = t.topics.filter(tp => completedTopics.has(tp)).length;
                  const pct = (done / t.topics.length) * 100;
                  return (
                    <div key={t.id} className="card" style={{ padding: 16, cursor: "pointer", borderColor: `${t.color}30` }}
                      onClick={() => setSelectedTerritory(t)}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 46, height: 46, borderRadius: 12, background: `${t.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `2px solid ${t.color}40`, flexShrink: 0 }}>
                          {t.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 800 }}>T{t.id}: {t.name}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{done}/{t.topics.length} topic · {Math.round(pct)}% completato</div>
                          <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, marginTop: 6 }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: t.color, borderRadius: 4, transition: "width 0.5s" }} />
                          </div>
                        </div>
                        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.2)" }}>›</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <button onClick={() => setSelectedTerritory(null)}
                  style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
                  ← Torna ai Territori
                </button>
                <div className="card" style={{ padding: 16, borderColor: `${selectedTerritory.color}30`, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 36 }}>{selectedTerritory.icon}</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: selectedTerritory.color }}>T{selectedTerritory.id}: {selectedTerritory.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Clicca per completare un topic → +50 XP + Mystery Box 📦</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {selectedTerritory.topics.map(tp => (
                      <button key={tp} className={`topic-btn ${completedTopics.has(tp) ? "done" : ""}`}
                        onClick={() => completeTopic(tp)}>
                        {completedTopics.has(tp) ? "✅ " : "⬜ "}{tp}
                        {!completedTopics.has(tp) && <span style={{ float: "right", color: "#FDCB6E", fontSize: 10 }}>+50 XP</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="card" style={{ padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🤖 Studia con l'AI Tutor</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Spiega con OCMA", "Storia PAV vivida", "Formula chiave", "Quiz 3 domande", "Esempio biomedico"].map(q => (
                      <button key={q} className="chip" onClick={() => { setTab("tutor"); sendChat(`${q}: ${selectedTerritory.name}`); }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ METHODS ═══════════════ */}
        {tab === "methods" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {!activeMethod ? (
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>📐 8 Metodi di Studio Scientifici — clicca per esplorare</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {STUDY_METHODS.map(m => (
                    <div key={m.id} className="method-card" onClick={() => setActiveMethod(m)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>{m.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.name}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>by {m.author}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <button onClick={() => setActiveMethod(null)}
                  style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, marginBottom: 12 }}>
                  ← Tutti i Metodi
                </button>
                <div className="card" style={{ padding: 20, borderColor: `${activeMethod.color}40` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 44 }}>{activeMethod.icon}</div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: activeMethod.color }}>{activeMethod.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Metodo di {activeMethod.author}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 8, fontStyle: "italic" }}>"{activeMethod.desc}"</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16, padding: "10px 14px", background: `${activeMethod.color}12`, borderRadius: 10, borderLeft: `3px solid ${activeMethod.color}` }}>
                    💡 {activeMethod.tip}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {activeMethod.steps.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, background: `${activeMethod.color}12`, border: `1px solid ${activeMethod.color}25` }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: activeMethod.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                        <div style={{ fontSize: 13 }}>{s}</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: 13 }}
                    onClick={() => { setTab("tutor"); sendChat(`Usa il metodo ${activeMethod.name} di ${activeMethod.author} per insegnarmi il prossimo argomento difficile di Fisica 1 UNIBG`); }}>
                    🤖 Usa {activeMethod.name} con l'AI Tutor →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ TIMER ═══════════════ */}
        {tab === "timer" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, animation: "fadeIn 0.3s ease" }}>
            <div className="card" style={{ padding: 30, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              {/* SVG Ring */}
              <div style={{ position: "relative", width: 150, height: 150, marginBottom: 20 }}>
                <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="75" cy="75" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                  <circle cx="75" cy="75" r={R} fill="none"
                    stroke={timerMode === "study" ? "#6C5CE7" : "#55EFC4"}
                    strokeWidth="9"
                    strokeDasharray={CIRC}
                    strokeDashoffset={CIRC - (CIRC * timerPct / 100)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>{formatTime(timerSeconds)}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                    {timerActive ? "⚡ IN CORSO" : timerSeconds === 0 ? "✅ COMPLETATO" : "⏸ IN PAUSA"}
                  </div>
                </div>
              </div>

              {/* Preset buttons */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[{ label: "60 min", sec: 3600 }, { label: "40 min", sec: 2400 }, { label: "25 min", sec: 1500 }].map(p => (
                  <button key={p.label} className="chip"
                    onClick={() => { setTimerSeconds(p.sec); setTimerActive(false); }}>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary" style={{ padding: "12px 28px", fontSize: 14 }}
                  onClick={() => setTimerActive(a => !a)}>
                  {timerActive ? "⏸️ Pausa" : "▶️ Avvia"}
                </button>
                <button style={{ padding: "12px 16px", fontSize: 14, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "white", cursor: "pointer" }}
                  onClick={() => { setTimerSeconds(3600); setTimerActive(false); }}>
                  🔄
                </button>
              </div>
            </div>

            {/* Daily sessions */}
            <div className="card" style={{ padding: 14, width: "100%" }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>📊 Sessioni di Oggi</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                {[1, 1, 0, 0].map((done, i) => (
                  <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: done ? "#6C5CE7" : "rgba(255,255,255,0.08)" }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>2 / 4 sessioni completate · +100 XP a sessione · +1 Mystery Box 📦</div>
            </div>

            {/* Focus topic */}
            <div className="card" style={{ padding: 14, width: "100%" }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🎯 Territorio su cui vuoi concentrarti?</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {TERRITORIES.map(t => (
                  <button key={t.id} className="chip" onClick={() => sendChat && setTab("tutor")}>{t.icon} T{t.id}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ AI TUTOR ═══════════════ */}
        {tab === "tutor" && (
          <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(100vh - 240px)", minHeight: 420, animation: "fadeIn 0.3s ease" }}>
            {/* Header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#6C5CE7,#FD79A8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>AI Tutor — Fisica 1 UNIBG</div>
                <div style={{ fontSize: 10, color: "#55EFC4" }}>● OCMA · PAV · 8 Metodi · +10 XP per domanda</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {chat.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 16px" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>🤖</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Ciao! Sono il tuo AI Tutor</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Uso OCMA e PAV di Matteo Salvo per spiegarti la Fisica 1 UNIBG</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                    {[
                      "🔵 OCMA: Cinematica",
                      "🟣 PAV: Leggi di Newton",
                      "🎯 Quiz T1: Meccanica",
                      "📐 Formula: Energia",
                      "💡 Esempio biomedico",
                    ].map(q => (
                      <button key={q} className="chip" onClick={() => sendChat(q)}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {chat.map((m, i) => (
                <div key={i} className={m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}
                  style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, animation: "fadeIn 0.3s ease" }}>
                  {m.content}
                </div>
              ))}
              {chatLoading && (
                <div className="chat-bubble-ai" style={{ display: "flex", gap: 5, alignItems: "center", padding: "12px 16px" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#6C5CE7", animation: `bounce 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick chips */}
            <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                {["🔵 OCMA", "🟣 PAV", "🎯 Quiz", "📐 Formula", "💡 Esempio biomedico", "🔀 Interleaving"].map(c => (
                  <button key={c} className="chip" style={{ fontSize: 11, padding: "4px 10px" }}
                    onClick={() => sendChat(c)}>{c}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
                  placeholder="Chiedi al tutor AI... (Enter per inviare)"
                  style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 13, outline: "none" }}
                />
                <button className="btn-primary" style={{ padding: "10px 18px", fontSize: 14 }}
                  onClick={() => sendChat()} disabled={chatLoading}>
                  {chatLoading ? "⏳" : "▶"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ═══════════════ MYSTERY BOX MODAL ═══════════════ */}
      {mysteryOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(8px)" }}>
          <div className="card" style={{ padding: 32, textAlign: "center", maxWidth: 320, width: "90%", border: "1px solid rgba(253,203,110,0.4)", animation: "pulse 0.4s ease" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#FDCB6E", marginBottom: 18, letterSpacing: 2 }}>📦 MYSTERY BOX</div>
            {!mysteryRevealed ? (
              <>
                <div style={{ fontSize: 80, marginBottom: 16, animation: "bounce 1s infinite" }}>📦</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>Cosa si nasconde dentro?</div>
                <button className="btn-primary" style={{ padding: "14px 32px", fontSize: 15 }} onClick={revealPrize}>
                  🎁 Apri!
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 80, marginBottom: 10, animation: "pulse 0.5s ease" }}>{mysteryPrize?.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#FDCB6E", marginBottom: 6 }}>{mysteryPrize?.name}</div>
                {mysteryPrize?.type === "xp"    && <div style={{ fontSize: 13, color: "#55EFC4", marginBottom: 16 }}>+{mysteryPrize.value} XP aggiunti al tuo account!</div>}
                {mysteryPrize?.type === "timer" && <div style={{ fontSize: 13, color: "#74B9FF", marginBottom: 16 }}>+{mysteryPrize.value} minuti aggiunti al timer!</div>}
                {mysteryPrize?.type === "item"  && <div style={{ fontSize: 13, color: "#A29BFE", marginBottom: 16 }}>Oggetto sbloccato nel tuo inventario!</div>}
                {mysteryPrize?.type === "mult"  && <div style={{ fontSize: 13, color: "#FDCB6E", marginBottom: 16 }}>Moltiplicatore XP attivato!</div>}
                <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 13 }}
                  onClick={() => { setMysteryOpen(false); setMysteryPrize(null); }}>
                  ✨ Forte! Chiudi
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
