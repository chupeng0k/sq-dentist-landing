"use client";

import { useRef, useState, type FormEvent } from "react";
import { emptyEnquiry, enquiryText, treatmentOptions, validateEnquiry, type Enquiry, type EnquiryErrors } from "@/lib/consultation";
import { PhoneCountryPicker } from "./PhoneCountryPicker";
import { contact } from "./content";


export function ConsultationForm({ title = false, id, campaign }: { title?: boolean; id:string; campaign?:"flight-ticket" }) {
  const [values, setValues] = useState<Enquiry>({ ...emptyEnquiry });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const submitting = useRef(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const checked = validateEnquiry(values);
  const enquiry = `${campaign === "flight-ticket" ? "Offer: Complimentary flight ticket\n\n" : ""}${enquiryText(checked.data, checked.phone)}`;
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(campaign === "flight-ticket" ? "SQ Dentist flight ticket offer enquiry" : "SQ Dentist consultation request")}&body=${encodeURIComponent(enquiry)}`;
  function update(key:keyof Enquiry, value:string) {
    setValues(current => ({ ...current, [key]:value }));
    setErrors(current => ({ ...current, [key]:undefined, ...(key === "country" ? {phone:undefined} : {}) }));
    setStatus("idle");
    setCopied(false);
  }
  function field(key:keyof Enquiry) {
    return { name:key, id:`${id}-${key}`, value:values[key], "aria-invalid":!!errors[key], "aria-describedby":errors[key] ? `${id}-${key}-error` : undefined,
      onChange:(event:React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => update(key,event.target.value),
      onBlur:() => setErrors(current => ({ ...current, [key]:validateEnquiry(values).errors[key] })) };
  }
  const error = (key:keyof Enquiry) => errors[key] && <span className="field-error" id={`${id}-${key}-error`}>{errors[key]}</span>;
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || status === "sent") return;
    setErrors(checked.errors);
    if (!checked.valid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(checked.errors)[0]}"]`)?.focus();
      return;
    }
    submitting.current = true;
    setStatus("sending");
    setCopied(false);
    try {
      const response = await fetch("/api/contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...checked.data,campaign}), signal:AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        if (result.errors) setErrors(result.errors);
        setStatus("failed");
        return;
      }
      setStatus("sent");
      window.dispatchEvent(new Event("sq:consultation-sent"));
    } catch { setStatus("failed"); }
    finally { submitting.current = false; }
  }
  async function copyEnquiry() {
    try {
      await navigator.clipboard.writeText(enquiry);
      setCopied(true);
    } catch {
      formRef.current?.querySelector<HTMLTextAreaElement>(".enquiry-copy")?.select();
    }
  }
  return <div className="consultation-form">
    {title && <h2>Get In Touch</h2>}
    <form ref={formRef} id={id} noValidate onSubmit={submit} aria-busy={status === "sending"}>
      <fieldset disabled={status === "sending" || status === "sent"}>
        <div className="form-row"><label htmlFor={`${id}-firstName`}>First Name <em>*</em><input {...field("firstName")} autoComplete="given-name" required maxLength={100}/>{error("firstName")}</label><label htmlFor={`${id}-lastName`}>Last Name <em>*</em><input {...field("lastName")} autoComplete="family-name" required maxLength={100}/>{error("lastName")}</label></div>
        <div className="form-row email-phone"><label htmlFor={`${id}-email`}>Email<input {...field("email")} type="email" autoComplete="email" maxLength={254}/>{error("email")}</label><div className="phone-fields"><div><label htmlFor={`${id}-country`}>Phone country <em>*</em></label><PhoneCountryPicker id={`${id}-country`} value={values.country} onChange={code => update("country",code)} invalid={!!errors.country} describedBy={errors.country ? `${id}-country-error` : undefined}/>{error("country")}</div><label htmlFor={`${id}-phone`}>Phone number <em>*</em><input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel-national" required maxLength={40} placeholder={values.country === "VN" ? "090 2455 745" : "Your phone number"}/>{error("phone")}<span className="field-hint">Local number or full international number with +.</span></label></div></div>
        <label htmlFor={`${id}-location`}>Your country or city <em>*</em><input {...field("location")} autoComplete="address-level2" required maxLength={150}/>{error("location")}</label>
        <label htmlFor={`${id}-treatment`}>What Treatment Are You Interested In? <em>*</em><select {...field("treatment")} required><option value="" disabled>Please Select</option>{treatmentOptions.map(option => <option key={option}>{option}</option>)}</select>{error("treatment")}</label>
        <label htmlFor={`${id}-message`}>Anything Else We Can Help With?<textarea {...field("message")} rows={4} maxLength={3000}/>{error("message")}</label>
        <div className="form-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={event => update("website",event.target.value)}/></label></div>
        <p className="field-hint">By sending, you agree that SQ Dentist may contact you about your enquiry. <a href="https://www.sqdentist.com/privacy" target="_blank" rel="noreferrer">Privacy policy</a>.</p>
        <p className="field-hint">Send your enquiry directly to our patient support team at {contact.email}.</p>
        <button type="submit" className="submit-consultation">{status === "sending" ? "Sending…" : status === "sent" ? "Request sent" : campaign === "flight-ticket" ? "Request My Flight Offer" : "Send Consultation Request"}<span aria-hidden="true"> ⟶</span></button>
      </fieldset>
      {status === "sent" && <div className="form-result" role="status"><strong>Your request has been sent.</strong><p>Thank you. Our patient support team will contact you about your enquiry.</p><button type="button" onClick={() => {setValues({...emptyEnquiry});setErrors({});setStatus("idle");setCopied(false);}}>New enquiry</button></div>}
      {status === "failed" && <div className="form-result" role="alert"><strong>We couldn’t confirm that your request was sent.</strong><p>Your information is still here. Please try again or contact our team directly. If you already submitted this enquiry, please check with us before retrying.</p>{checked.valid && <><a className="action" href={mailHref}>Send via your email app ⟶</a><label htmlFor={`${id}-copy`}>Your enquiry<textarea id={`${id}-copy`} className="enquiry-copy" readOnly value={enquiry} rows={6}/></label><button type="button" className="action" onClick={copyEnquiry}>{copied ? "Copied" : "Copy enquiry"}</button></>}<p><a href={contact.whatsapp} target="_blank" rel="noreferrer">Contact SQ on WhatsApp</a></p></div>}
    </form>
  </div>;
}
