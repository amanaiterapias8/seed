import { useState } from "react";

const STEPS = [
  "welcome",
  "crop_type",
  "field_size",
  "location",
  "irrigation_type",
  "experience",
  "summary",
];

const CROPS = [
  { id: "citrus", label: "Cítricos", emoji: "🍊" },
  { id: "avocado", label: "Aguacate", emoji: "🥑" },
  { id: "mango", label: "Mango", emoji: "🥭" },
  { id: "olive", label: "Olivo", emoji: "🫒" },
  { id: "grape", label: "Vid / Uva", emoji: "🍇" },
  { id: "apple", label: "Manzana", emoji: "🍎" },
  { id: "tomato", label: "Tomate", emoji: "🍅" },
  { id: "other", label: "Otro cultivo", emoji: "🌿" },
];

const IRRIGATION_TYPES = [
  { id: "drip", label: "Riego por goteo", emoji: "💧" },
  { id: "sprinkler", label: "Aspersión", emoji: "🌧️" },
  { id: "flood", label: "Riego por gravedad", emoji: "🌊" },
  { id: "micro", label: "Micro-aspersión", emoji: "🔬" },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Menos de 2 años", desc: "Estoy comenzando" },
  { id: "intermediate", label: "2 – 10 años", desc: "Tengo experiencia básica" },
  { id: "expert", label: "Más de 10 años", desc: "Soy agricultor experimentado" },
];

const TIPS = [
  "🌱 Recibe alertas de heladas antes de que ocurran",
  "💧 Ahorra hasta 30% de agua con riego inteligente",
  "☀️ Pronóstico adaptado a tu cultivo específico",
  "📱 Recomendaciones diarias en tu WhatsApp",
];

export default function App() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [animating, setAnimating] = useState(false);
  const [form, setForm] = useState({
    crop: "",
    fieldSize: "",
    fieldUnit: "hectáreas",
    location: "",
    irrigationType: "",
    experience: "",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentStep = STEPS[step];

  const goNext = () => {
    if (animating) return;
    const validationError = validateStep(currentStep);
    if (validationError) {
      setErrors(validationError);
      return;
    }
    setErrors({});
    setDirection("forward");
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      setAnimating(false);
    }, 320);
  };

  const goBack = () => {
    if (animating || step === 0) return;
    setErrors({});
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => Math.max(s - 1, 0));
      setAnimating(false);
    }, 320);
  };

  const validateStep = (s) => {
    if (s === "crop_type" && !form.crop) return { crop: "Selecciona un tipo de cultivo" };
    if (s === "field_size" && (!form.fieldSize || isNaN(form.fieldSize) || Number(form.fieldSize) <= 0))
      return { fieldSize: "Ingresa un tamaño válido mayor a 0" };
    if (s === "location" && !form.location.trim()) return { location: "Ingresa tu municipio o ciudad" };
    if (s === "irrigation_type" && !form.irrigationType) return { irrigationType: "Selecciona un tipo de riego" };
    if (s === "experience" && !form.experience) return { experience: "Selecciona tu nivel de experiencia" };
    if (s === "summary") {
      const errs = {};
      if (!form.name.trim()) errs.name = "Ingresa tu nombre";
      if (!form.phone.trim() || !/^\+?[\d\s\-()]{8,}$/.test(form.phone))
        errs.phone = "Ingresa un teléfono válido (WhatsApp)";
      if (Object.keys(errs).length) return errs;
    }
    return null;
  };

  const handleSubmit = () => {
    const validationError = validateStep("summary");
    if (validationError) { setErrors(validationError); return; }
    // TODO: Enviar datos al backend de Seed / API de recomendaciones
    setSubmitted(true);
  };

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const ne = { ...e }; delete ne[field]; return ne; });
  };

  const progress = step / (STEPS.length - 1);

  // ─── Estilos base ───────────────────────────────────────────────────────────
  const colors = {
    green1: "#1a5c2a",
    green2: "#2d8a45",
    green3: "#4caf70",
    green4: "#a8d5b5",
    green5: "#e8f5ec",
    accent: "#f5a623",
    white: "#ffffff",
    gray1: "#f0f4f1",
    gray2: "#d1ddd5",
    gray3: "#8fa896",
    text: "#1a2e20",
    textSoft: "#4a6355",
    error: "#c0392b",
    errorBg: "#fdf0ef",
  };

  const S = {
    root: {
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${colors.green5} 0%, #f9fcf9 60%, #e0f0e5 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: "0 0 env(safe-area-inset-bottom, 20px)",
    },
    header: {
      width: "100%",
      maxWidth: 480,
      padding: "20px 24px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    logoIcon: {
      width: 36,
      height: 36,
      background: `linear-gradient(135deg, ${colors.green2}, ${colors.green1})`,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      boxShadow: "0 2px 8px rgba(45,138,69,0.3)",
    },
    logoText: {
      fontWeight: 800,
      fontSize: 22,
      color: colors.green1,
      letterSpacing: "-0.5px",
    },
    progressWrapper: {
      width: "100%",
      maxWidth: 480,
      padding: "16px 24px 0",
    },
    progressBar: {
      height: 4,
      background: colors.gray2,
      borderRadius: 99,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      width: `${progress * 100}%`,
      background: `linear-gradient(90deg, ${colors.green2}, ${colors.green3})`,
      borderRadius: 99,
      transition: "width 0.4s ease",
    },
    progressLabel: {
      fontSize: 12,
      color: colors.gray3,
      marginTop: 6,
      textAlign: "right",
    },
    card: {
      width: "100%",
      maxWidth: 480,
      flex: 1,
      padding: "28px 24px 24px",
      opacity: animating ? 0 : 1,
      transform: animating
        ? direction === "forward"
          ? "translateX(30px)"
          : "translateX(-30px)"
        : "translateX(0)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
    heading: {
      fontSize: 26,
      fontWeight: 800,
      color: colors.text,
      lineHeight: 1.2,
      marginBottom: 8,
    },
    subheading: {
      fontSize: 15,
      color: colors.textSoft,
      lineHeight: 1.5,
      marginBottom: 28,
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
    },
    optionCard: (selected) => ({
      border: `2px solid ${selected ? colors.green2 : colors.gray2}`,
      borderRadius: 14,
      padding: "14px 10px",
      cursor: "pointer",
      textAlign: "center",
      background: selected ? `${colors.green5}` : colors.white,
      transition: "all 0.18s ease",
      boxShadow: selected ? `0 0 0 3px ${colors.green3}33` : "none",
    }),
    optionEmoji: {
      fontSize: 28,
      marginBottom: 6,
      display: "block",
    },
    optionLabel: (selected) => ({
      fontSize: 13,
      fontWeight: selected ? 700 : 500,
      color: selected ? colors.green1 : colors.text,
    }),
    listOption: (selected) => ({
      border: `2px solid ${selected ? colors.green2 : colors.gray2}`,
      borderRadius: 14,
      padding: "14px 18px",
      cursor: "pointer",
      background: selected ? colors.green5 : colors.white,
      transition: "all 0.18s ease",
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: selected ? `0 0 0 3px ${colors.green3}33` : "none",
    }),
    listEmoji: {
      fontSize: 22,
      flexShrink: 0,
    },
    listLabel: (selected) => ({
      fontWeight: selected ? 700 : 500,
      fontSize: 15,
      color: selected ? colors.green1 : colors.text,
    }),
    listDesc: {
      fontSize: 12,
      color: colors.textSoft,
      marginTop: 2,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      display: "block",
      fontSize: 13,
      fontWeight: 600,
      color: colors.textSoft,
      marginBottom: 6,
    },
    input: (hasError) => ({
      width: "100%",
      padding: "13px 16px",
      borderRadius: 12,
      border: `2px solid ${hasError ? colors.error : colors.gray2}`,
      fontSize: 15,
      color: colors.text,
      background: hasError ? colors.errorBg : colors.white,
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
      fontFamily: "inherit",
    }),
    inputRow: {
      display: "flex",
      gap: 10,
    },
    select: {
      padding: "13px 12px",
      borderRadius: 12,
      border: `2px solid ${colors.gray2}`,
      fontSize: 15,
      color: colors.text,
      background: colors.white,
      outline: "none",
      fontFamily: "inherit",
      flexShrink: 0,
    },
    errorMsg: {
      fontSize: 12,
      color: colors.error,
      marginTop: 5,
    },
    btn: {
      width: "100%",
      padding: "16px",
      borderRadius: 14,
      border: "none",
      background: `linear-gradient(135deg, ${colors.green2}, ${colors.green1})`,
      color: colors.white,
      fontSize: 16,
      fontWeight: 700,
      cursor: "pointer",
      marginTop: 8,
      boxShadow: "0 4px 16px rgba(45,138,69,0.35)",
      transition: "transform 0.15s, box-shadow 0.15s",
      fontFamily: "inherit",
    },
    btnSecondary: {
      background: "transparent",
      border: `2px solid ${colors.gray2}`,
      color: colors.textSoft,
      boxShadow: "none",
    },
    backBtn: {
      background: "none",
      border: "none",
      color: colors.textSoft,
      cursor: "pointer",
      fontSize: 24,
      padding: 4,
      lineHeight: 1,
    },
    stepNum: {
      fontSize: 13,
      color: colors.gray3,
      fontWeight: 600,
    },
    tipCard: {
      background: `linear-gradient(135deg, ${colors.green1}, ${colors.green2})`,
      borderRadius: 16,
      padding: "18px 20px",
      marginBottom: 20,
      color: colors.white,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: 700,
      marginBottom: 12,
      opacity: 0.85,
    },
    tipItem: {
      fontSize: 13,
      marginBottom: 8,
      lineHeight: 1.4,
      display: "flex",
      alignItems: "flex-start",
      gap: 6,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: `1px solid ${colors.gray2}`,
      fontSize: 14,
    },
    summaryLabel: {
      color: colors.textSoft,
      fontWeight: 500,
    },
    summaryValue: {
      color: colors.text,
      fontWeight: 700,
      textAlign: "right",
      maxWidth: "60%",
    },
    successWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 24px",
      flex: 1,
    },
    successIcon: {
      width: 90,
      height: 90,
      background: `linear-gradient(135deg, ${colors.green2}, ${colors.green1})`,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 44,
      marginBottom: 24,
      boxShadow: "0 8px 30px rgba(45,138,69,0.4)",
    },
    successTitle: {
      fontSize: 26,
      fontWeight: 800,
      color: colors.text,
      marginBottom: 12,
    },
    successDesc: {
      fontSize: 15,
      color: colors.textSoft,
      lineHeight: 1.6,
      marginBottom: 32,
    },
    whatsappBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      width: "100%",
      padding: "16px",
      borderRadius: 14,
      border: "none",
      background: "#25D366",
      color: colors.white,
      fontSize: 16,
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
      fontFamily: "inherit",
      marginBottom: 12,
    },
  };

  // ─── Pantalla de éxito ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={S.root}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={S.header}>
            <div style={S.logo}>
              <div style={S.logoIcon}>🌱</div>
              <span style={S.logoText}>Seed</span>
            </div>
            <span style={{ fontSize: 12, color: colors.gray3 }}>Vita Studio</span>
          </div>
        </div>
        <div style={{ ...S.successWrapper, maxWidth: 480, width: "100%" }}>
          <div style={S.successIcon}>🌿</div>
          <div style={S.successTitle}>¡Listo, {form.name.split(" ")[0]}!</div>
          <p style={S.successDesc}>
            Tu perfil de cultivo está configurado. Recibirás tus primeras
            recomendaciones de riego personalizadas directamente en WhatsApp.
          </p>
          <div
            style={{
              background: colors.green5,
              borderRadius: 14,
              padding: "16px 18px",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            {TIPS.map((t, i) => (
              <div key={i} style={{ fontSize: 14, color: colors.text, marginBottom: i < TIPS.length - 1 ? 10 : 0, lineHeight: 1.5 }}>
                {t}
              </div>
            ))}
          </div>
          {/* TODO: Enlace real a WhatsApp con el número del bot de Seed */}
          <button
            style={S.whatsappBtn}
            onClick={() => window.open("https://wa.me/521XXXXXXXXXX?text=Hola%20Seed%2C%20quiero%20mis%20recomendaciones", "_blank")}
          >
            <span style={{ fontSize: 22 }}>💬</span>
            Abrir en WhatsApp
          </button>
          <button
            style={{ ...S.btn, background: "transparent", color: colors.green2, boxShadow: "none", border: `2px solid ${colors.green3}` }}
            onClick={() => { setSubmitted(false); setStep(0); setForm({ crop: "", fieldSize: "", fieldUnit: "hectáreas", location: "", irrigationType: "", experience: "", name: "", phone: "" }); }}
          >
            Registrar otro campo
          </button>
        </div>
      </div>
    );
  }

  // ─── Render de pasos ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      // ── BIENVENIDA ──────────────────────────────────────────────────────────
      case "welcome":
        return (
          <>
            <div
              style={{
                background: `linear-gradient(135deg, ${colors.green1} 0%, ${colors.green2} 100%)`,
                borderRadius: 24,
                padding: "32px 24px",
                textAlign: "center",
                marginBottom: 24,
                color: colors.white,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ fontSize: 70, marginBottom: 12, lineHeight: 1 }}>🌳</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10, lineHeight: 1.2 }}>
                Tus árboles<br />tienen sed
              </div>
              <div style={{ fontSize: 15, opacity: 0.88, lineHeight: 1.5 }}>
                Responde algunas preguntas y recibe recomendaciones
                de riego diarias y alertas del clima personalizadas.
              </div>
              {/* Decoración */}
              <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.07 }}>🌿</div>
              <div style={{ position: "absolute", bottom: -15, left: -15, fontSize: 60, opacity: 0.07 }}>🍃</div>
            </div>

            <div style={S.tipCard}>
              <div style={S.tipTitle}>¿QUÉ OBTIENES CON SEED?</div>
              {TIPS.map((t, i) => (
                <div key={i} style={S.tipItem}>{t}</div>
              ))}
            </div>

            <button
              style={S.btn}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(45,138,69,0.45)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,138,69,0.35)"; }}
              onClick={goNext}
            >
              Comenzar ahora →
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: colors.gray3, marginTop: 12 }}>
              Gratis · Sin tarjeta de crédito · Vita Studio
            </p>
          </>
        );

      // ── TIPO DE CULTIVO ──────────────────────────────────────────────────────
      case "crop_type":
        return (
          <>
            <div style={S.heading}>¿Qué cultivas? 🌱</div>
            <div style={S.subheading}>
              Selecciona el cultivo principal de tu campo para recibir
              recomendaciones específicas.
            </div>
            <div style={S.grid2}>
              {CROPS.map((c) => (
                <div
                  key={c.id}
                  style={S.optionCard(form.crop === c.id)}
                  onClick={() => update("crop", c.id)}
                  onMouseEnter={(e) => { if (form.crop !== c.id) e.currentTarget.style.borderColor = colors.green3; }}
                  onMouseLeave={(e) => { if (form.crop !== c.id) e.currentTarget.style.borderColor = colors.gray2; }}
                >
                  <span style={S.optionEmoji}>{c.emoji}</span>
                  <span style={S.optionLabel(form.crop === c.id)}>{c.label}</span>
                </div>
              ))}
            </div>
            {errors.crop && <div style={{ ...S.errorMsg, marginTop: 12 }}>{errors.crop}</div>}
            <button style={{ ...S.btn, marginTop: 24 }} onClick={goNext}>
              Continuar →
            </button>
          </>
        );

      // ── TAMAÑO DEL CAMPO ─────────────────────────────────────────────────────
      case "field_size":
        return (
          <>
            <div style={S.heading}>¿Cuánto campo tienes? 📐</div>
            <div style={S.subheading}>
              Nos ayuda a calcular volúmenes de agua y tiempos de riego óptimos.
            </div>
            <div style={S.inputGroup}>
              <label style={S.label}>Superficie del campo</label>
              <div style={S.inputRow}>
                <input
                  type="number"
                  placeholder="Ej: 5"
                  value={form.fieldSize}
                  onChange={(e) => update("fieldSize", e.target.value)}
                  style={{ ...S.input(!!errors.fieldSize), flex: 1 }}
                  min="0"
                />
                <select
                  value={form.fieldUnit}
                  onChange={(e) => update("fieldUnit", e.target.value)}
                  style={S.select}
                >
                  <option value="hectáreas">Hectáreas</option>
                  <option value="acres">Acres</option>
                  <option value="m²">m²</option>
                </select>
              </div>
              {errors.fieldSize && <div style={S.errorMsg}>{errors.fieldSize}</div>}
            </div>

            <div
              style={{
                background: colors.green5,
                borderRadius: 12,
                padding: "14px 16px",
                marginTop: 8,
                marginBottom: 16,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 13, color: colors.textSoft, margin: 0, lineHeight: 1.5 }}>
                Si tienes varios campos, ingresa el tamaño total. Podrás agregar
                campos adicionales después.
              </p>
            </div>
            <button style={S.btn} onClick={goNext}>
              Continuar →
            </button>
          </>
        );

      // ── UBICACIÓN ────────────────────────────────────────────────────────────
      case "location":
        return (
          <>
            <div style={S.heading}>¿Dónde está tu campo? 📍</div>
            <div style={S.subheading}>
              Usamos tu ubicación para consultar el clima local y enviarte alertas
              de lluvia, heladas y calor extremo.
            </div>
            <div style={S.inputGroup}>
              <label style={S.label}>Municipio o ciudad</label>
              <input
                type="text"
                placeholder="Ej: Tehuacán, Puebla"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                style={S.input(!!errors.location)}
              />
              {errors.location && <div style={S.errorMsg}>{errors.location}</div>}
            </div>

            {/* TODO: Integrar autocompletado de Google Places API para México */}
            <button
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: 12,
                border: `2px dashed ${colors.green3}`,
                background: "transparent",
                color: colors.green2,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 16,
                fontFamily: "inherit",
              }}
              onClick={() => {
                // TODO: Implementar geolocalización del navegador
                update("location", "Detectando ubicación...");
              }}
            >
              📡 Usar mi ubicación actual
            </button>

            <div
              style={{
                background: colors.green5,
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 16,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
              <p style={{ fontSize: 13, color: colors.textSoft, margin: 0, lineHeight: 1.5 }}>
                Tu ubicación solo se usa para el clima. No compartimos
                tus datos con terceros. Vita Studio.
              </p>
            </div>
            <button style={S.btn} onClick={goNext}>
              Continuar →
            </button>
          </>
        );

      // ── TIPO DE RIEGO ─────────────────────────────────────────────────────────
      case "irrigation_type":
        return (
          <>
            <div style={S.heading}>¿Cómo riegas? 💧</div>
            <div style={S.subheading}>
              Tu sistema de riego determina cómo calculamos los tiempos
              y volúmenes óptimos.
            </div>
            {IRRIGATION_TYPES.map((it) => (
              <div
                key={it.id}
                style={S.listOption(form.irrigationType === it.id)}
                onClick={() => update("irrigationType", it.id)}
                onMouseEnter={(e) => { if (form.irrigationType !== it.id) e.currentTarget.style.borderColor = colors.green3; }}
                onMouseLeave={(e) => { if (form.irrigationType !== it.id) e.currentTarget.style.borderColor = colors.gray2; }}
              >
                <span style={S.listEmoji}>{it.emoji}</span>
                <span style={S.listLabel(form.irrigationType === it.id)}>{it.label}</span>
              </div>
            ))}
            {errors.irrigationType && <div style={S.errorMsg}>{errors.irrigationType}</div>}
            <button style={{ ...S.btn, marginTop: 8 }} onClick={goNext}>
              Continuar →
            </button>
          </>
        );

      // ── EXPERIENCIA ───────────────────────────────────────────────────────────
      case "experience":
        return (
          <>
            <div style={S.heading}>¿Cuánta experiencia tienes? 🧑‍🌾</div>
            <div style={S.subheading}>
              Adaptamos el nivel de detalle de las recomendaciones a tu
              experiencia como agricultor.
            </div>
            {EXPERIENCE_LEVELS.map((lvl) => (
              <div
                key={lvl.id}
                style={S.listOption(form.experience === lvl.id)}
                onClick={() => update("experience", lvl.id)}
                onMouseEnter={(e) => { if (form.experience !== lvl.id) e.currentTarget.style.borderColor = colors.green3; }}
                onMouseLeave={(e) => { if (form.experience !== lvl.id) e.currentTarget.style.borderColor = colors.gray2; }}
              >
                <div style={{ flex: 1 }}>
                  <div style={S.listLabel(form.experience === lvl.id)}>{lvl.label}</div>
                  <div style={S.listDesc}>{lvl.desc}</div>
                </div>
                {form.experience === lvl.id && (
                  <span style={{ fontSize: 18, color: colors.green2 }}>✓</span>
                )}
              </div>
            ))}
            {errors.experience && <div style={S.errorMsg}>{errors.experience}</div>}
            <button style={{ ...S.btn, marginTop: 8 }} onClick={goNext}>
              Ver resumen →
            </button>
          </>
        );

      // ── RESUMEN Y REGISTRO ────────────────────────────────────────────────────
      case "summary":
        const selectedCrop = CROPS.find((c) => c.id === form.crop);
        const selectedIrrigation = IRRIGATION_TYPES.find((i) => i.id === form.irrigationType);
        const selectedExp = EXPERIENCE_LEVELS.find((e) => e.id === form.experience);

        return (
          <>
            <div style={S.heading}>Casi listo 🎉</div>
            <div style={S.subheading}>
              Revisa tu información y cuéntanos cómo enviarte las recomendaciones.
            </div>

            {/* Resumen */}
            <div
              style={{
                background: colors.white,
                borderRadius: 16,
                padding: "8px 16px",
                marginBottom: 20,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              {[
                { label: "Cultivo", value: selectedCrop ? `${selectedCrop.emoji} ${selectedCrop.label}` : "—" },
                { label: "Superficie", value: `${form.fieldSize} ${form.fieldUnit}` },
                { label: "Ubicación", value: form.location || "—" },
                { label: "Riego", value: selectedIrrigation ? `${selectedIrrigation.emoji} ${selectedIrrigation.label}` : "—" },
                { label: "Experiencia", value: selectedExp?.label || "—" },
              ].map((row, i) => (
                <div key={i} style={{ ...S.summaryRow, borderBottom: i < 4 ? `1px solid ${colors.gray2}` : "none" }}>
                  <span style={S.summaryLabel}>{row.label}</span>
                  <span style={S.summaryValue}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Datos de contacto */}
            <div style={S.inputGroup}>
              <label style={S.label}>Tu nombre</label>
              <input
                type="text"
                placeholder="Ej: María González"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                style={S.input(!!errors.name)}
              />
              {errors.name && <div style={S.errorMsg}>{errors.name}</div>}
            </div>

            <div style={S.inputGroup}>
              <label style={S.label}>WhatsApp (con código de país)</label>
              <input
                type="tel"
                placeholder="Ej: +52 55 1234 5678"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                style={S.input(!!errors.phone)}
              />
              {errors.phone && <div style={S.errorMsg}>{errors.phone}</div>}
              <div style={{ fontSize: 12, color: colors.gray3, marginTop: 5 }}>
                📱 Recibirás tus recomendaciones diarias aquí
              </div>
            </div>

            <button
              style={S.btn}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              onClick={handleSubmit}
            >
              🌱 Activar Seed gratis
            </button>

            <p style={{ textAlign: "center", fontSize: 12, color: colors.gray3, marginTop: 12, lineHeight: 1.5 }}>
              Al continuar aceptas los términos de servicio y política
              de privacidad de Vita Studio.
              {/* TODO: Agregar enlaces reales a términos y privacidad */}
            </p>
          </>
        );

      default:
        return null;
    }
  };

  // ─── Layout principal ────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={S.header}>
          <div style={S.logo}>
            <div style={S.logoIcon}>🌱</div>
            <span style={S.logoText}>Seed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {step > 0 && currentStep !== "welcome" && (
              <button style={S.backBtn} onClick={goBack} title="Regresar">
                ←
              </button>
            )}
            <span style={S.stepNum}>
              {currentStep !== "welcome" ? `${step} / ${STEPS.length - 1}` : ""}
            </span>
          </div>
        </div>

        {/* Barra de progreso */}
        {step > 0 && (
          <div style={S.progressWrapper}>
            <div style={S.progressBar}>
              <div style={S.progressFill} />
            </div>
            <div style={S.progressLabel}>{Math.round(progress * 100)}% completado</div>
          </div>
        )}
      </div>

      {/* Contenido del paso */}
      <div style={S.card}>{renderStep()}</div>

      {/* Footer */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          textAlign: "center",
          padding: "8px 24px 20px",
          fontSize: 12,
          color: colors.gray3,
        }}
      >
        © 2024 Vita Studio · Seed — Riego Inteligente
      </div>
    </div>
  );
}