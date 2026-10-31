export const flightOfferSessionKey = "sq-flight-offer-shown-v1";

export function hasReachedOfferThreshold(scrollTop:number, documentHeight:number, viewportHeight:number) {
  const distance = documentHeight - viewportHeight;
  return distance > 0 && scrollTop / distance >= 0.5;
}
