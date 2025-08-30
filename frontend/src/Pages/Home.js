/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Home_Image from '../assets/Illustration.png';
import Footer from "../Components/Footer";
import Home_img from '../assets/home_img.jpeg'

/**
 * Replace "illustration.png" with your actual image path.
 * If you want to use the provided image, copy it to /public or import it.
 */
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="home_overlay">
            <img src={Home_img} alt="Home Page" />
            <div className="content">
              <h1 className="hero-title">
                Shaping the Future Together with
                <br />
                <span className="accent">FAG</span>
              </h1>
              <p className="hero-sub">
                Empowering innovation through smart investments. Join FAG in building sustainable, tech-driven solutions for tomorrow's world.
              </p>

              <div className="hero-cta">
                <button onClick={() => window.location.href = '/login'} className="btn btn-primary">REGISTER</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why FAG Section */}
      <section className="services_hero">
        <div className="services-inner">

          {/* Left Side - Text */}
          <div className="hero-left">
            <h1 className="service-title">Why FAG</h1>
            <p className="hero-sub">
              <br />
              Our Core Values — what drives us forward:
              <br /><br />
              🔹 <strong>Integrity</strong>
              <br />
              We act with transparency and accountability in every decision.
              <br /><br />
              🔹 <strong>Innovation</strong>
              <br />
              We invest in bold ideas that shape the industries of tomorrow.
              <br /><br />
              🔹 <strong>Sustainability</strong>
              <br />
              Our strategies prioritize long-term impact over short-term gain.
              <br /><br />
              🔹 <strong>Collaboration</strong>
              <br />
              We build strong partnerships to drive shared success and growth.
              <br /><br />
              🔹 <strong>Excellence</strong>
              <br />
              We pursue the highest standards in every investment we make.
            </p>
          </div>

          <div className="hero-right">
            <img src={Home_Image} alt="Why FAG" />
          </div>

        </div>
      </section>

      {/* Trusted Section */}
      <div class="card_Main">
        <div class="trust_container" role="main" aria-label="User trust and service highlight section">
          <p class="user-around">User Around The World</p>
          <h1 class="trusted-heading" aria-level="1">
            Trusted Over <b>1.7 Million+</b><br />
            User In the World!
          </h1>

          <section class="trusted_card" aria-label="Service benefits cards">
            <article class="trust_sub_card" tabindex="0" aria-describedby="service1desc">
              <svg class="card-icon" viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <h2 class="card-title">24 Hours Service</h2>
              <p id="service1desc" class="card-desc">The benefit from our service</p>
            </article>

            <article class="trust_sub_card" tabindex="0" aria-describedby="service2desc">
              <svg class="card-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
                <path stroke-width="1" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" />
              </svg>
              <h2 class="card-title">Safety Trust</h2>
              <p id="service2desc" class="card-desc">The benefit from our service</p>
            </article>

            <article class="trust_sub_card" tabindex="0" aria-describedby="service3desc">
              <svg class="card-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24">
                <path stroke-linejoin="round" stroke-width="1" d="M9.5 11.5 11 13l4-3.5M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z" />
              </svg>
              <h2 class="card-title">Secure Payment</h2>
              <p id="service3desc" class="card-desc">The benefit from our service</p>
            </article>
          </section>
        </div>
      </div>
      <main className="choose_main">
        <h1>Why Choose FAG?</h1>
        <section class="features-grid" aria-label="Features of Pocket Broker">
          <article class="feature-card">
            <svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 64 64" >
              <path d="M32 12L12 20L12 36C12 43 21 48 32 48C43 48 52 43 52 36L52 20L32 12Z" />
              <line x1="32" y1="12" x2="32" y2="48" />
              <line x1="45" y1="12" x2="45" y2="20" />
            </svg>
            <p class="feature-text">Comprehensive Education</p>
          </article>

          <article class="feature-card">
            <svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 64 64">
              <rect x="16" y="32" width="32" height="16" stroke-width="2" rx="2" ry="2" />
              <circle cx="32" cy="24" r="8" stroke-width="2" />
              <line x1="29" y1="22" x2="29" y2="26" stroke-width="1.5" />
              <line x1="35" y1="22" x2="35" y2="26" stroke-width="1.5" />
              <line x1="32" y1="18" x2="32" y2="30" stroke-width="1.5" />
            </svg>
            <p class="feature-text">Investments starting at $1</p>
          </article>

          <article class="feature-card">
            <svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 64 64">
              <rect x="16" y="24" width="32" height="10" rx="1" ry="1" stroke-width="2" />
              <rect x="22" y="36" width="20" height="6" rx="3" ry="3" fill="#002654" stroke="#0981e0" stroke-width="1.5" />
              <line x1="22" y1="42" x2="42" y2="42" stroke="#0981e0" stroke-width="2" />
              <line x1="25" y1="30" x2="39" y2="30" stroke-width="2" />
              <line x1="32" y1="36" x2="32" y2="42" stroke-width="2" />
            </svg>
            <p class="feature-text">Simple Free Registration</p>
          </article>

          <article class="feature-card">
            <svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 64 64">
              <circle cx="22" cy="32" r="12" stroke-width="2" />
              <path d="M15 32H29" stroke-width="1.5" />
              <path d="M22 20V44" stroke-width="1.5" />
              <path d="M34 44L44 36L44 28L34 20" stroke-width="2" />
              <path d="M38 24L44 28" stroke-width="1.5" />
            </svg>
            <p class="feature-text">Fractional Shares Feature</p>
          </article>

          <article class="feature-card">
            <svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 64 64">
              <circle cx="32" cy="38" r="12" stroke-width="2" />
              <line x1="20" y1="28" x2="20" y2="40" stroke-width="2" />
              <line x1="44" y1="28" x2="44" y2="40" stroke-width="2" />
              <path d="M22 41L26 34H38L42 41" stroke-width="2" />
              <path d="M32 30C30 30 30 32 32 32C34 32 34 30 32 30Z" fill="none" stroke-width="1.5" />
              <path d="M32 26V22" stroke-width="1.5" />
              <path d="M24 20L40 20" stroke-width="1.5" />
            </svg>
            <p class="feature-text">24/7 Multilanguage Support</p>
          </article>

          <article class="feature-card">
            <svg class="icon" aria-hidden="true" focusable="false" viewBox="0 0 64 64">
              <rect x="20" y="24" width="24" height="20" stroke-width="2" rx="4" ry="4" />
              <line x1="32" y1="24" x2="32" y2="44" stroke-width="2" />
              <line x1="20" y1="36" x2="44" y2="36" stroke-width="2" />
              <line x1="26" y1="48" x2="38" y2="48" stroke-width="2" />
              <line x1="44" y1="24" x2="50" y2="18" stroke="#0981e0" stroke-width="2" />
            </svg>
            <p class="feature-text">No Platform Fees</p>
          </article>

        </section>
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
}
