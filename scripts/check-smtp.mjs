import { loadEnvFile } from "node:process";
import nodemailer from "nodemailer";

try { loadEnvFile(".env.local"); } catch { /* Environment variables can also be supplied by the host. */ }
const keys = ["SMTP_HOST","SMTP_USER","SMTP_PASSWORD","SMTP_FROM"];
const missing = keys.filter(key => !process.env[key]?.trim());
if (missing.length) {
  console.error(`SMTP is not ready. Fill these keys in .env.local: ${missing.join(", ")}`);
  process.exit(1);
}
const port = Number(process.env.SMTP_PORT || "587");
if (![465,587].includes(port)) { console.error("SMTP_PORT must be 465 or 587."); process.exit(1); }
const password = process.env.SMTP_HOST === "smtp.gmail.com" ? process.env.SMTP_PASSWORD.replace(/\s/g,"") : process.env.SMTP_PASSWORD;
const transport = nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port === 465,requireTLS:port === 587,auth:{user:process.env.SMTP_USER,pass:password},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:10000});
try {
  await transport.verify();
  console.log("SMTP connection and authentication succeeded. No email was sent.");
} catch (error) {
  console.error(`SMTP verification failed (${error.code || "UNKNOWN"}${error.responseCode ? ` / ${error.responseCode}` : ""}). Check provider settings and credentials.`);
  process.exitCode = 1;
} finally { transport.close(); }
