import assert from "node:assert/strict";
import { hasReachedOfferThreshold } from "../src/lib/scroll-offer.ts";
import { emptyEnquiry, enquiryText, phoneCountries, validateEnquiry } from "../src/lib/consultation.ts";

const valid = {...emptyEnquiry,firstName:"Nguyễn",lastName:"An",phone:"0902455745",location:"Hồ Chí Minh",treatment:"Single Implant"};
assert.ok(phoneCountries.length > 200);
assert.equal(validateEnquiry(valid).phone,"+84902455745");
for (const [country,phone] of [["AU","0412345678"],["GB","02079460958"],["US","2025550123"],["CA","4165550123"],["SG","81234567"],["DE","030901820"],["JP","09012345678"],["IN","9876543210"]]) {
  assert.equal(validateEnquiry({...valid,country,phone}).valid,true,`${country} national number`);
}
for (const key of ["firstName","lastName","location","phone"]) {
  assert.ok(validateEnquiry({...valid,[key]:"   "}).errors[key]);
}
for (const phone of ["1     ","abc1234567","+84+84902455745","0902455745 hello","123"]) {
  assert.ok(validateEnquiry({...valid,phone}).errors.phone,phone);
}
assert.ok(validateEnquiry({...valid,email:"invalid-email"}).errors.email);
assert.ok(validateEnquiry({...valid,email:"a@example.com\nBcc:other@example.com"}).errors.email);
assert.ok(validateEnquiry({...valid,country:"XX"}).errors.country);
assert.ok(validateEnquiry({...valid,treatment:"injected"}).errors.treatment);
assert.ok(validateEnquiry({...valid,message:"x".repeat(3001)}).errors.message);
const international = validateEnquiry({...valid,country:"AU",phone:"+84 90 2455 745"});
assert.equal(international.phone,"+84902455745");
const trimmed = validateEnquiry({...valid,firstName:"  An  ",location:"  Việt Nam  "});
assert.equal(trimmed.data.firstName,"An");
assert.equal(trimmed.data.location,"Việt Nam");
assert.ok(enquiryText(trimmed.data,trimmed.phone).includes("Phone: +84902455745"));
console.log(`Consultation checks passed; ${phoneCountries.length} phone countries/territories.`);

assert.equal(hasReachedOfferThreshold(489, 2000, 1000), false);
assert.equal(hasReachedOfferThreshold(499, 2000, 1000), false);
assert.equal(hasReachedOfferThreshold(500, 2000, 1000), true);
assert.equal(hasReachedOfferThreshold(501, 2000, 1000), true);
assert.equal(hasReachedOfferThreshold(0, 1000, 1000), false);
assert.equal(hasReachedOfferThreshold(0, 800, 1000), false);
assert.equal(hasReachedOfferThreshold(100, 5000, 1000), false);
console.log("Flight offer scroll threshold checks passed.");
