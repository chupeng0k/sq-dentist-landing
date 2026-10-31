import nodemailer from "nodemailer";
import { enquiryText, validateEnquiry } from "@/lib/consultation";

export const runtime = "nodejs";
const recipient = "cskh@sqdentist.vn";
const attempts = new Map<string, { count:number; until:number }>();

export async function POST(request:Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      // Next may normalize request.url to localhost while the browser uses 127.0.0.1.
      // Match the actual incoming Host, including its port; never trust forwarded-host.
      const source = new URL(origin);
      const host = (request.headers.get("host") || new URL(request.url).host).toLowerCase();
      if (!["http:","https:"].includes(source.protocol) || source.host !== host) return Response.json({error:"Invalid origin"},{status:403});
    } catch { return Response.json({error:"Invalid origin"},{status:403}); }
  }
  if (Number(request.headers.get("content-length")) > 16000) return Response.json({error:"Request too large"},{status:413});
  let raw:unknown;
  try { const text = await request.text(); if (text.length > 16000) return Response.json({error:"Request too large"},{status:413}); raw = JSON.parse(text); }
  catch { return Response.json({error:"Invalid request"},{status:400}); }
  const checked = validateEnquiry(raw);
  const flightOffer = !!raw && typeof raw === "object" && "campaign" in raw && raw.campaign === "flight-ticket";
  if (checked.data.website || !checked.valid) return Response.json({errors:checked.errors},{status:422});
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  const port = Number(SMTP_PORT || "587");
  const password = SMTP_HOST === "smtp.gmail.com" ? SMTP_PASSWORD?.replace(/\s/g,"") : SMTP_PASSWORD;
  if (!SMTP_HOST || !SMTP_USER || !password || !SMTP_FROM || ![465,587].includes(port)) return Response.json({error:"Email service unavailable"},{status:503});
  // Process-local throttle; use a shared rate limiter when scaling to multiple instances.
  const now = Date.now();
  for (const [key,value] of attempts) if (value.until < now) attempts.delete(key);
  const key = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const recent = attempts.get(key) || {count:0,until:now + 600000};
  if (recent.count >= 5) return Response.json({error:"Please try again later"},{status:429});
  recent.count++; attempts.set(key,recent);
  const transport = nodemailer.createTransport({ host:SMTP_HOST,port,secure:port === 465,requireTLS:port === 587,auth:{user:SMTP_USER,pass:password},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:10000,disableFileAccess:true,disableUrlAccess:true });
  try {
    const result = await transport.sendMail({from:{name:"SQ Dentist Website",address:SMTP_FROM},to:recipient,replyTo:checked.data.email || undefined,subject:flightOffer ? "SQ Dentist flight ticket offer enquiry" : "SQ Dentist consultation request",text:`${flightOffer ? "Offer: Complimentary flight ticket\n\n" : ""}${enquiryText(checked.data,checked.phone)}`});
    if (!result.accepted.map(String).includes(recipient)) throw new Error("Recipient was not accepted");
    return Response.json({ok:true});
  } catch { return Response.json({error:"Unable to send email"},{status:502}); }
  finally { transport.close(); }
}
