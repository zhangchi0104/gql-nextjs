import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BORDER_POSTCODES = new Set([
  4827, 872, 2406, 2540, 2611, 2620, 3585, 3586, 3644, 3691, 3707, 4380, 4377,
  4383, 4385,
]);

export function postcodeToState(postcode: string) {
  // Convert postcode to a number for easier comparison
  const postcodeNum = parseInt(postcode, 10);

  // Throw error for invalid postcodes
  if (isNaN(postcodeNum) || postcodeNum < 200 || postcodeNum > 9999) {
    throw new Error(`Invalid Australian postcode: ${postcode}`);
  }

  // Map postcode ranges to Australian states and territories
  // New South Wales (NSW)
  if (
    (postcodeNum >= 1000 && postcodeNum <= 1999) || // LVRs and PO Boxes
    (postcodeNum >= 2000 && postcodeNum <= 2599) ||
    (postcodeNum >= 2619 && postcodeNum <= 2899) ||
    (postcodeNum >= 2921 && postcodeNum <= 2999)
  ) {
    return "NSW";
  }

  // Australian Capital Territory (ACT)
  if (
    (postcodeNum >= 200 && postcodeNum <= 299) || // LVRs and PO Boxes
    (postcodeNum >= 2600 && postcodeNum <= 2618) ||
    (postcodeNum >= 2900 && postcodeNum <= 2920)
  ) {
    return "ACT";
  }

  // Victoria (VIC)
  if (
    (postcodeNum >= 3000 && postcodeNum <= 3999) ||
    (postcodeNum >= 8000 && postcodeNum <= 8999)
  ) {
    // LVRs and PO Boxes
    return "VIC";
  }

  // Queensland (QLD)
  if (
    (postcodeNum >= 4000 && postcodeNum <= 4999) ||
    (postcodeNum >= 9000 && postcodeNum <= 9999)
  ) {
    // LVRs and PO Boxes
    return "QLD";
  }

  // South Australia (SA)
  if (
    (postcodeNum >= 5000 && postcodeNum <= 5799) ||
    (postcodeNum >= 5800 && postcodeNum <= 5999)
  ) {
    // LVRs and PO Boxes
    return "SA";
  }

  // Western Australia (WA)
  if (
    (postcodeNum >= 6000 && postcodeNum <= 6797) ||
    (postcodeNum >= 6800 && postcodeNum <= 6999)
  ) {
    // LVRs and PO Boxes
    return "WA";
  }

  // Tasmania (TAS)
  if (
    (postcodeNum >= 7000 && postcodeNum <= 7799) ||
    (postcodeNum >= 7800 && postcodeNum <= 7999)
  ) {
    // LVRs and PO Boxes
    return "TAS";
  }

  // Northern Territory (NT)
  if (
    (postcodeNum >= 800 && postcodeNum <= 899) ||
    (postcodeNum >= 900 && postcodeNum <= 999)
  ) {
    // LVRs and PO Boxes
    return "NT";
  }

  // Special cases for external territories
  if (postcodeNum === 2899) return "NSW"; // Norfolk Island
  if (postcodeNum === 6798) return "WA"; // Christmas Island
  if (postcodeNum === 6799) return "WA"; // Cocos (Keeling) Islands
  if (postcodeNum === 7151) return "TAS"; // Australian Antarctic Bases & Macquarie Island

  // Special postcode for Santa
  if (postcodeNum === 9999) return "VIC"; // North Pole (Santa mail)

  // Return null if postcode doesn't match any range

  return null;
}
