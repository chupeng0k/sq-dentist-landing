import Image from "next/image";

const doctors = [
  {
    slug:"hien", name:"Dr. Le Thi Hien", image:"dr-le-thi-hien.png",
    specialty:"Specialist in Cosmetic Dentistry", field:"Aesthetic Dentistry",
    description:"Ceramic restorations, veneers, and aesthetic smile design.",
    treatments:["Porcelain veneers and smile design", "Ceramic crowns and aesthetic restorations", "Implant crowns shaped for natural-looking results"],
    approach:"A restrained, detail-led approach to lasting cosmetic outcomes.",
  },
  {
    slug:"nghi", name:"Dr. Hoang Phan Bich Nghi", image:"dr-hoang-phan-bich-nghi.webp",
    specialty:"Implant Dentistry & Implant Restorations", field:"Implant Restoration",
    description:"Implant planning, implant placement, and ceramic restorations.",
    treatments:["Implant treatment planning and case coordination", "Implant placement with restorative goals in mind", "Ceramic crowns and implant-supported restorations"],
    approach:"Restorative planning that connects implant function with final teeth.",
  },
  {
    slug:"hung", name:"Dr. Nguyen Viet Hung", image:"dr-nguyen-viet-hung.png",
    specialty:"Implant Dentistry", field:"Implant Surgery",
    description:"Implant surgery, treatment planning, and restorative care.",
    treatments:["Diagnosis-led implant treatment planning", "Dental implant placement and surgical workflows", "Ceramic restorations after implant placement"],
    approach:"Structured surgical planning for stable function and long-term follow-up.",
  },
];

export function DoctorsSection() {
  return <section id="dentists" className="doctors-section section-inner section-line" aria-labelledby="doctors-heading">
    <div className="doctors-heading"><span>DOCTORS</span><h2 id="doctors-heading"><em>Dental specialists</em> for <strong>coordinated care</strong> in Vietnam.</h2><p>These profiles introduce the clinical focus areas supporting SQ Dentist International patients. Doctor availability is confirmed during consultation and treatment planning.</p></div>
    <div className="doctors-grid">{doctors.map(doctor => <article className={`doctor-card doctor-${doctor.slug}`} key={doctor.slug} aria-labelledby={`doctor-${doctor.slug}-name`}>
      <div className="doctor-portrait">
        <div className="doctor-portrait-glow" aria-hidden="true" />
        <div className="doctor-portrait-accent" aria-hidden="true" />
        <div className="doctor-portrait-shell">
          <div className="doctor-portrait-sheen" aria-hidden="true" />
          <div className="doctor-photo"><Image src={`/sites/sqdentist/doctors/${doctor.image}`} alt={doctor.name} fill sizes="(max-width:640px) 400px, 520px" quality={90}/></div>
          <div className="doctor-portrait-shade" aria-hidden="true" />
          <div className="doctor-identity"><h3 id={`doctor-${doctor.slug}-name`}>{doctor.name}</h3><p className="doctor-specialty">{doctor.specialty}</p></div>
        </div>
      </div>
      <div className="doctor-information">
        <div className="doctor-expertise"><h4><Image src="/sites/sqdentist/doctors/implant.svg" alt="" width={17} height={17}/><span>{doctor.field}</span></h4><p>{doctor.description}</p><ul>{doctor.treatments.map(treatment => <li key={treatment}>{treatment}</li>)}</ul></div>
        <div className="doctor-approach"><div className="doctor-flower-divider" aria-hidden="true"><Image src="/sites/sqdentist/doctors/flower.png" alt="" width={20} height={20}/></div><p><em>{doctor.approach}</em></p></div>
      </div>
    </article>)}</div>
  </section>;
}
