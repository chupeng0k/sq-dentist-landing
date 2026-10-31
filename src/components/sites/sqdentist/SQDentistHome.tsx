"use client";

/* Preserve the original photography and source image crops. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ConsultationForm } from "./ConsultationForm";
import { VideoGallery } from "./VideoGallery";
import { FlightOfferPopup } from "./FlightOfferPopup";
import { DoctorsSection } from "./DoctorsSection";
import { contact, faqs, iconMedia, implantPath, introduction, media, origin, patientCases, reasons, slides } from "./content";

function Arrow({ circle = false }: { circle?: boolean }) {
  return <span className={circle ? "arrow circle" : "arrow"} aria-hidden="true">⟶</span>;
}

function Action({ children, href = "#footer", light = false }: { children: React.ReactNode; href?: string; light?: boolean }) {
  return <a href={href} className={`action${light ? " action-light" : ""}`}>{children}<Arrow /></a>;
}

const headerLinks = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "Warranty", href: `${origin}/warranty` },
  { label: "Services", href: "#services" },
  { label: "Results", href: "#results" },
  { label: "Contact Us", href: "#footer" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      });
    }, { rootMargin: "-90px 0px -55% 0px", threshold: 0 });
    headerLinks.filter(link => link.href.startsWith("#")).forEach(link => {
      const element = document.getElementById(link.href.slice(1));
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return <header className="landing-header">
    <div className="landing-header-inner">
      <a className="landing-header-logo" href="#top" aria-label="SQ Dentist International home" onClick={() => setMenuOpen(false)}><img src={`${media}logo-gold.png`} width="1847" height="371" alt="SQ Dentist International" /></a>
      <nav id="sq-landing-navigation" className={`landing-header-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        {headerLinks.map(link => <a key={link.label} href={link.href} aria-current={active === link.href ? "location" : undefined} onClick={() => { setMenuOpen(false); if (link.href.startsWith("#")) setActive(link.href); }}>{link.label}</a>)}
      </nav>
      <a className="landing-header-location" href={contact.map} aria-label="Find SQ Dentist in Ho Chi Minh City, Vietnam">
        <svg width="12" height="12" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><path d="m32 0a24.0319 24.0319 0 0 0 -24 24c0 17.23 22.36 38.81 23.31 39.72a.99.99 0 0 0 1.38 0c.95-.91 23.31-22.49 23.31-39.72a24.0319 24.0319 0 0 0 -24-24zm0 35a11 11 0 1 1 11-11 11.0066 11.0066 0 0 1 -11 11z" /></svg>
        <span>HO CHI MINH CITY, VIETNAM</span>
      </a>
      <button ref={toggle} className="landing-header-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="sq-landing-navigation" onClick={() => setMenuOpen(open => !open)}><span aria-hidden="true">{menuOpen ? "×" : "☰"}</span></button>
    </div>
  </header>;
}

function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const interacted = useRef(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, [paused]);
  const move = (direction: number) => { interacted.current = true; setPaused(true); setActive((active + direction + slides.length) % slides.length); };
  return <section id="top" className="hero" aria-label="SQ Dentist highlights" aria-roledescription="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => { if (!interacted.current) setPaused(false); }} onFocusCapture={() => setPaused(true)} onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => { if (touchStart.current !== null && Math.abs(event.changedTouches[0].clientX - touchStart.current) > 50) move(event.changedTouches[0].clientX < touchStart.current ? 1 : -1); }}>
    {slides.map((slide, index) => <div key={slide.image} aria-hidden={active !== index} className={`hero-slide${active === index ? " active" : ""}${slide.first ? " first-slide" : ""}`} style={{ backgroundImage: `url('${media}${slide.image}')`, backgroundPosition: slide.position, backgroundSize: slide.fit }}>
      <div className="hero-shade" />
      <div className="hero-copy">
        {slide.first && <div className="rating">SQ DENTIST INTERNATIONAL <span>HO CHI MINH CITY, VIETNAM</span></div>}
        {slide.first ? <h1>{slide.title.slice(0, slide.title.indexOf(". ") + 2)}<span className="hero-gold">{slide.title.slice(slide.title.indexOf(". ") + 2)}</span></h1> : <h2>{slide.title}</h2>}
        <p>{slide.description}</p>
        {slide.href && <a className="hero-read" tabIndex={active === index ? 0 : -1} href={slide.href.startsWith("#") ? slide.href : `${origin}${slide.href}`}>Read more <Arrow /></a>}
      </div>
    </div>)}
    <button className="hero-prev" aria-label="Previous highlight" onClick={() => move(-1)}>‹</button><button className="hero-next" aria-label="Next highlight" onClick={() => move(1)}>›</button>
    <div className="hero-progress"><span>0{active + 1}</span><div className="progress-rule"><i style={{ width: `${((active + 1) / slides.length) * 100}%` }} /></div></div>
  </section>;
}

function Reasons() {
  return <section className="reasons section-inner section-line" aria-labelledby="why-heading">
    <div className="reasons-intro"><h2 id="why-heading">Why Choose SQ Dentist International?</h2><p>Over the years, our team has earned the trust of patients looking for dental implants and tooth restoration in Vietnam.</p><p>We bring together experienced specialists, modern technology and an individual approach to your dental concerns.</p><p>Your comfort matters throughout the journey. We take time to explain your options and help you understand the proposed treatment plan.</p><p>Our commitment goes beyond the appointment — we aim to be your partner in dental health and well-being.</p><Action>Book a consultation</Action></div>
    <div className="reason-cards">{reasons.map((reason, index) => <article className="reason-card" key={reason.title}><span className="reason-number">{index + 1}</span><h3>{reason.title}</h3><ul>{reason.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div>
  </section>;
}

function Cases() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(3);
  const [selected, setSelected] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const interacted = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const onResize = () => setVisible(window.innerWidth <= 767 ? 1 : window.innerWidth <= 1024 ? 2 : 3);
    onResize(); window.addEventListener("resize", onResize); return () => window.removeEventListener("resize", onResize);
  }, []);
  useEffect(() => {
    if (paused || selected !== null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % patientCases.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused, selected]);
  const move = (direction: number) => { interacted.current = true; setPaused(true); setIndex((index + direction + patientCases.length) % patientCases.length); };
  const showCase = (item: number) => { interacted.current = true; setPaused(true); setSelected(item); dialogRef.current?.showModal(); };
  return <section className="cases section-inner" id="results">
    <div className="cases-intro"><h2>Discover the Power of Change</h2><p>Meet Kevin, Joan and Saaed — patients featured by SQ Dentist International. Every smile has its own story.</p><Action href="#patient-cases">View Patient Stories</Action></div>
    <div id="patient-cases" className="case-carousel" aria-label="Patient results" aria-roledescription="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => { if (!interacted.current) setPaused(false); }} onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => { if (touchStart.current !== null && Math.abs(event.changedTouches[0].clientX - touchStart.current) > 50) move(event.changedTouches[0].clientX < touchStart.current ? 1 : -1); }}>
      <div className="case-grid">{Array.from({ length: Math.min(visible, patientCases.length) }, (_, offset) => (index + offset) % patientCases.length).map(item => <article key={patientCases[item].name} className="case-card"><button onClick={() => showCase(item)} aria-label={`View ${patientCases[item].name}'s patient story`}><img src={`${media}${patientCases[item].image}`} alt={`${patientCases[item].name}, a patient featured by SQ Dentist International`} width="1122" height="1402" loading="lazy" /></button><div><span>Patient story:</span><strong>{patientCases[item].name}</strong></div></article>)}</div>
      <div className="case-controls"><button aria-label="Previous patient result" onClick={() => move(-1)}>←</button><button aria-label="Next patient result" onClick={() => move(1)}>→</button><div className="case-track"><i style={{ width: `${((index + 1) / patientCases.length) * 100}%` }} /></div></div>
    </div>
    <dialog ref={dialogRef} className="case-dialog" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}><button className="dialog-close" aria-label="Close patient result" onClick={() => dialogRef.current?.close()}>×</button>{selected !== null && <img src={`${media}${patientCases[selected].image}`} alt={`${patientCases[selected].name}, a patient featured by SQ Dentist International`} />}</dialog>
  </section>;
}

function FAQ() {
  const [expanded, setExpanded] = useState<number | null>(0);
  return <section className="faq section-inner" aria-labelledby="faq-heading">
    <div><h2 id="faq-heading">Your Questions, Answered</h2>
      <div className="faq-list">{faqs.map((faq, index) => <article className={`faq-item${expanded === index ? " expanded" : ""}`} key={faq.question}>
        <h3><button aria-expanded={expanded === index} aria-controls={`faq-answer-${index}`} id={`faq-question-${index}`} onClick={() => setExpanded(expanded === index ? null : index)} onKeyDown={event => {
          if (event.key === "Escape") setExpanded(null);
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const next = (index + (event.key === "ArrowDown" ? 1 : -1) + faqs.length) % faqs.length;
            document.querySelector<HTMLButtonElement>(`#faq-question-${next}`)?.focus();
          }
        }}>{faq.question}</button></h3>
        <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={expanded !== index}>
          <p>{faq.answer}</p>{faq.link && <a className="faq-source-link" href={`${origin}${faq.link.href}`}>{faq.link.label} <Arrow /></a>}
        </div>
      </article>)}</div>
    </div>
    <img className="faq-image" src={`${media}sterilization.webp`} alt="Sterilization equipment shown by SQ Dentist International" width="640" height="853" loading="lazy" />
  </section>;
}

function Footer() {
  return <footer className="footer">
    <section id="footer" className="footer-consultation">
      <div><h2>Your Dental Journey Starts Here.</h2><p>Talk with SQ Dentist International about your dental concerns, treatment options and travel plans.</p><p>Our team can help you arrange a consultation in Ho Chi Minh City and discuss your next steps.</p></div>
      <ConsultationForm id="footer-enquiry" />
    </section>
    <div className="footer-columns">
      <div className="clinic-details">
        <a href="#top" aria-label="Back to top — SQ Dentist International"><img src={`${media}logo-gold.png`} width="1847" height="371" alt="SQ Dentist International" loading="lazy" /></a>
        <p>SQ Dentist International provides officially licensed dental care in Ho Chi Minh City for patients who expect clinical precision and a calmer journey.</p>
        <address><p>⌖ &nbsp; {contact.address}</p><p><a href={contact.phoneHref}>☎ &nbsp; {contact.phone}</a></p><p><a href={`mailto:${contact.email}`}>✉ &nbsp; {contact.email}</a></p></address>
        <h3>CONSULTATION &amp; PATIENT SUPPORT</h3>
        <p>Contact our team before your visit to discuss your dental concerns and appointment plans.</p>
        <a href={contact.whatsapp}>Chat with SQ Dentist on WhatsApp <Arrow /></a>
      </div>
      <div><h3>Services</h3><Link href="/">Home</Link><a href={`${origin}${implantPath}`}>Dental Implants</a><a href={`${origin}/dental-tourism-vietnam`}>Dental Tourism</a><a href="#services">Tooth Restoration</a></div>
      <div><h3>About</h3><a href="#about">SQ Dentist International</a><a href="#dentists">Meet Our Dentists</a><h3>Patient Information</h3><a href={`${origin}/privacy`}>Privacy Policy</a><a href={`${origin}/warranty`}>Warranty Policy</a><a href="#footer">Contact Us</a></div>
      <div><h3>Follow</h3><div className="social-links">
        <a href={contact.facebook} aria-label="Facebook"><img src={`${iconMedia}facebook.svg`} alt="" /></a>
        <a href={contact.youtube} aria-label="YouTube"><img src={`${iconMedia}youtube.svg`} alt="" /></a>
        <a href={contact.whatsapp} aria-label="WhatsApp"><img src={`${iconMedia}whatsapp.svg`} alt="" /></a>
        <a href={contact.map} aria-label="Map"><img src={`${iconMedia}map.svg`} alt="" /></a>
      </div>
      <p><strong>Company</strong><br />SQ GROUP INTERNATIONAL DENTAL COMPANY LIMITED</p>
      <p><strong>Operating Licence</strong><br />11053/HCM-GPHD<br />Issued by the Ho Chi Minh City Department of Health</p>
      <h3>Plan Your Visit</h3><p>Contact our team to confirm your consultation appointment.</p></div>
    </div>
    <p className="copyright">© {new Date().getFullYear()} SQ GROUP INTERNATIONAL DENTAL COMPANY LIMITED. All rights reserved.</p>
  </footer>;
}

export function SQDentistHome({ showHeader = true }: { showHeader?: boolean } = {}) {
  return <><a className="skip-link" href="#content">Skip to content</a>{showHeader && <Header />}
    <main id="content"><Hero /><div className="white-panel primary-panel">
      <section className="introduction section-inner" id="about">
        <div className="intro-photo"><img src={`${media}team.webp`} alt="A SQ Dentist clinician consulting with an international patient" width="1728" height="2160" /></div>
        <div><h2>SQ DENTIST INTERNATIONAL</h2><p className="intro-subtitle">More than a clinic. Your smile partner.</p>{introduction.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<Action>Book Consultation</Action></div>
      </section>
      <section className="services section-inner section-line" id="services">
        <div><h2>Expert Care for Every Smile</h2><p>Explore dental implants, crowns, bridges and veneers with a team that takes time to understand your needs. Your consultation helps us plan the care that suits your smile.</p><Action href={`${origin}/#services`} light>Explore Our Services</Action></div>
        <a href={`${origin}${implantPath}`} className="implant-card"><img src={`${media}hero.webp`} alt="Dental implant illustration from SQ Dentist International" width="2400" height="1350" loading="lazy" /><h3>DENTAL IMPLANTS</h3></a>
      </section>
      <section className="smile-section section-inner section-line">
        <img src={`${media}technology.webp`} alt="Digital dental technology shown by SQ Dentist International" width="640" height="853" loading="lazy" />
        <div><h2>Modern Technology. Personalised Treatment.</h2><Action>Book Consultation</Action></div>
      </section>
      <DoctorsSection />
      <VideoGallery />
      <section className="contact-section section-inner section-line">
        <ConsultationForm title id="main-enquiry" /><img src={`${media}clinic.webp`} alt="A SQ Dentist clinician reviewing a digital dental scan with a patient" width="1448" height="1086" loading="lazy" />
      </section>
      <Reasons />
    </div>
    <section className="tourism" id="dental-tourism">
      <div className="tourism-heading"><span>DENTAL TOURISM</span><h2>Your Smile Journey in Vietnam</h2></div>
      <div className="tourism-art" style={{ backgroundImage: `url('${media}city.webp')` }}>
        <img className="tourism-plane" src={`${media}airplane.webp`} alt="SQ Dentist dental tourism airplane illustration" width="2172" height="724" loading="lazy" />
        <div className="tourism-card"><h3>Dental Tourism in Vietnam</h3><em>Dental care and a journey to Ho Chi Minh City</em>
          <p>Plan your visit to SQ Dentist International with support from our team. We can discuss your dental concerns, consultation and travel plans before you arrive.</p>
          <p>Find out about dental tourism services and the support available for your individual visit.</p>
          <a href={`${origin}/dental-tourism-vietnam`}>Explore Dental Tourism <Arrow circle /></a>
        </div>
      </div>
    </section>
    <div className="white-panel results-panel"><Cases /><FAQ /></div></main>
    <Footer /><FlightOfferPopup />
    <aside className="floating-contact" aria-label="Quick contact">
      <a className="whatsapp-contact" href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with our team on WhatsApp"><span className="contact-icon"><img src={`${iconMedia}whatsapp.svg`} alt="" /></span><span><strong>Chat with Our Team</strong><small>SPEAK WITH SQ DENTIST</small></span></a>
      <a className="phone-contact" href={contact.phoneHref} aria-label="Call SQ Dentist International"><span className="contact-icon"><img src={`${iconMedia}phone.svg`} alt="" /></span><span><strong>Call SQ Dentist</strong><small>{contact.phone}</small></span></a>
    </aside>
  </>;
}
