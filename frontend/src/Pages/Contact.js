import React, { useState } from "react";
import Footer from "../Components/Footer";

const Contact = () => {
  const EMAIL = "contact@fagworld.com";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // Fallback (older browsers)
      const textarea = document.createElement("textarea");
      textarea.value = EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Optional quick links
  const mailto = `mailto:${EMAIL}`;
  const gmailCompose = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(
    "Hello from FAG World"
  )}`;

  return (
    <>
      {/* SEO / Rich data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact — FAG World",
          description: "Get in touch with FAG World via email.",
          url: typeof window !== "undefined" ? window.location.href : "https://fagworld.com/contact",
          contactPoint: [{
            "@type": "ContactPoint",
            contactType: "customer support",
            email: EMAIL
          }]
        })
      }} />

      <section className="contact-wrap">
        <div className="card">
          <div className="icon">
            {/* Envelope icon (SVG) */}
            <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true">
              <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v.217l9 5.4 9-5.4V7H3zm18 10V9.383l-8.355 5.012a2 2 0 0 1-2.29 0L2 9.383V17a1 1 0 0 0 1 1h16a2 2 0 0 0 2-2z" />
            </svg>
          </div>

          <h1 className="title">Get in touch</h1>
          <p className="subtitle">We’d love to hear from you — email us anytime.</p>

          <div className="email-row" role="group" aria-label="Contact email actions">
            <code className="email">{EMAIL}</code>
            <button className="Contactbtn ghost" onClick={handleCopy} aria-live="polite">
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <div className="actions">
            <a className="Contactbtn primary" href={mailto}>Open email app</a>
            <a className="Contactbtn outline" href={gmailCompose} target="_blank" rel="noreferrer">
              Compose in Gmail
            </a>
          </div>

          <p className="hint">Prefer forms? We use email for faster replies.</p>
        </div>
      </section>

      <Footer/>

      {/* Scoped styles (no external CSS required) */}
      <style>{`
        :root {
          --bg: #0b0f14;
          --card: #0f141b;
          --muted: #9fb0c3;
          --text: #e9f0f7;
          --accent: #4da3ff;
          --accent-2: #2a87f3;
          --border: rgba(255,255,255,0.08);
          --shadow: 0 10px 30px rgba(0,0,0,0.35);
          --radius: 18px;
        }
        .contact-wrap {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: 32px;
          background: radial-gradient(1200px 600px at 20% -10%, #18324a 0%, transparent 60%),
                      radial-gradient(900px 500px at 100% 100%, #102235 0%, transparent 55%),
                      var(--bg);
        }
        .card {
          width: 100%;
          max-width: 680px;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: clamp(20px, 4vw, 40px);
          backdrop-filter: blur(8px);
          color: var(--text);
          text-align: center;
        }
        .icon {
          width: 84px;
          height: 84px;
          border-radius: 22px;
          display: grid;
          place-items: center;
          margin: 0 auto 16px auto;
          background: linear-gradient(135deg, rgba(77,163,255,0.18), rgba(77,163,255,0.06));
          border: 1px solid var(--border);
        }
        .icon svg { fill: var(--accent); }
        .title {
          font-size: clamp(22px, 3.2vw, 34px);
          letter-spacing: 0.2px;
          margin: 6px 0 6px;
        }
        .subtitle {
          margin: 0 0 22px;
          color: var(--muted);
          font-size: clamp(14px, 2.2vw, 16px);
        }
        .email-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          align-items: center;
          background: #0c1219;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 12px 12px 12px 16px;
        }
        .email {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 15px;
          color: #cfe6ff;
          overflow-wrap: anywhere;
        }
        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }
        .Contactbtn {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid transparent;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.08s ease, background 0.2s ease, border-color 0.2s ease;
          font-weight: 600;
          letter-spacing: 0.2px;
        }
        .Contactbtn:active { transform: translateY(1px); }
        .Contactbtn.primary {
          color: white;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          border-color: rgba(255,255,255,0.12);
        }
        .Contactbtn.outline {
          color: var(--text);
          background: transparent;
          border-color: var(--border);
        }
        .Contactbtn.ghost {
          color: #cfe6ff;
          background: rgba(77,163,255,0.10);
          border-color: rgba(77,163,255,0.25);
          padding: 8px 12px;
        }
        .hint {
          margin-top: 14px;
          color: var(--muted);
          font-size: 13px;
        }

        /* Mobile */
        @media (max-width: 560px) {
          .actions { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default Contact;