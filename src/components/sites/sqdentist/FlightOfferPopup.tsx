"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { flightOfferSessionKey, hasReachedOfferThreshold } from "@/lib/scroll-offer";
import { ConsultationForm } from "./ConsultationForm";

export function FlightOfferPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const shown = useRef(false);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try { shown.current = sessionStorage.getItem(flightOfferSessionKey) === "1"; } catch { /* In-memory once-per-page fallback. */ }
    const markShown = () => {
      shown.current = true;
      try { sessionStorage.setItem(flightOfferSessionKey,"1"); } catch { /* Session storage may be unavailable. */ }
    };
    const checkScroll = () => {
      if (shown.current || !dialog.current || document.querySelector("dialog[open]")) return;
      // Let visitors finish entering an enquiry instead of interrupting their form.
      if (document.activeElement?.closest("form")) return;
      if (!hasReachedOfferThreshold(window.scrollY,document.documentElement.scrollHeight,window.innerHeight)) return;
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      document.querySelectorAll("video").forEach(video => video.pause());
      dialog.current.showModal();
      markShown();
      closeButton.current?.focus({preventScroll:true});
    };
    window.addEventListener("scroll",checkScroll,{passive:true});
    window.addEventListener("sq:consultation-sent",markShown);
    return () => {
      window.removeEventListener("scroll",checkScroll);
      window.removeEventListener("sq:consultation-sent",markShown);
    };
  },[]);

  return <dialog ref={dialog} className="flight-offer" aria-labelledby="flight-offer-title" aria-describedby="flight-offer-description flight-offer-terms" onClose={() => previousFocus.current?.focus({preventScroll:true})} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
  }}>
    <button ref={closeButton} type="button" className="flight-offer-close" aria-label="Close flight ticket offer" onClick={() => dialog.current?.close()}>×</button>
    <div className="flight-offer-layout">
      <div className="flight-offer-details">
        <Image className="flight-offer-logo" src="/sites/sqdentist/logo-gold.png" alt="SQ Dentist International" width={1847} height={371}/>
        <p className="flight-offer-eyebrow">YOUR DENTAL TRIP TO VIETNAM</p>
        <h2 id="flight-offer-title">Enjoy a <span>Complimentary Flight Ticket</span></h2>
        <p id="flight-offer-description">Coming home to Vietnam for dental treatment? Leave your details and ask SQ Dentist about your flight ticket offer.</p>
        <p className="flight-offer-terms" id="flight-offer-terms">Our team will confirm eligibility, ticket coverage and offer terms before you book.</p>
        <div className="flight-offer-visual" aria-hidden="true"><Image className="flight-offer-city" src="/sites/sqdentist/city.webp" alt="" width={1672} height={941}/><Image className="flight-offer-plane" src="/sites/sqdentist/airplane.webp" alt="" width={2172} height={724}/></div>
      </div>
      <div className="flight-offer-form"><h3>Plan your visit with us</h3><p>Tell us how to reach you. We’ll help you explore your treatment and travel options.</p><ConsultationForm id="flight-offer-enquiry" campaign="flight-ticket"/></div>
    </div>
  </dialog>;
}
