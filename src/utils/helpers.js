export function generateReferralLink(referralCode) {
  const base = window.location.origin;
  return `${base}?ref=${referralCode}`;
}
