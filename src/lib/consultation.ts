import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";

export const phoneCountries = getCountries();
export { getCountryCallingCode };
export const treatmentOptions = ["Single Implant", "Full-mouth Implant", "Vietnam Dental Tourism"];
export const emptyEnquiry = { firstName:"", lastName:"", email:"", country:"VN", phone:"", location:"", treatment:"", message:"", website:"" };
export type Enquiry = typeof emptyEnquiry;
export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export function validateEnquiry(input: unknown) {
  const raw = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const data = Object.fromEntries(Object.keys(emptyEnquiry).map(key => [key, typeof raw[key] === "string" ? raw[key].trim() : ""])) as Enquiry;
  const errors: EnquiryErrors = {};
  for (const key of ["firstName", "lastName"] as const) {
    if (!/\p{L}/u.test(data[key])) errors[key] = "Please enter your name.";
    else if (data[key].length > 100 || /[\r\n\x00-\x1f]/.test(data[key])) errors[key] = "Please enter a name of 100 characters or fewer.";
  }
  if (!/[\p{L}\p{N}]/u.test(data.location) || data.location.length > 150) errors.location = "Please enter your country or city (up to 150 characters).";
  if (data.email && (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) || data.email.length > 254)) errors.email = "Please enter a valid email address.";
  if (!phoneCountries.includes(data.country as CountryCode)) errors.country = "Please select your phone country.";
  const phone = !errors.country && /^[+\d\s().-]+$/.test(data.phone) && data.phone.length <= 40
    ? parsePhoneNumberFromString(data.phone, { defaultCountry:data.country as CountryCode, extract:false }) : undefined;
  if (!phone?.isValid()) errors.phone = "Please enter a valid phone number for the selected country, or include + and your country code.";
  if (!treatmentOptions.includes(data.treatment)) errors.treatment = "Please select a treatment.";
  if (data.message.length > 3000) errors.message = "Please keep your message within 3,000 characters.";
  return { data, errors, phone:phone?.number ?? "", valid:Object.keys(errors).length === 0 };
}

export function enquiryText(data: Enquiry, phone: string) {
  return [`Name: ${data.firstName} ${data.lastName}`, `Email: ${data.email || "Not provided"}`, `Phone: ${phone}`, `Phone country: ${data.country}`, `Location: ${data.location}`, `Treatment: ${data.treatment}`, `Message: ${data.message || "Not provided"}`].join("\n");
}
