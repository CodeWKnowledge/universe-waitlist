import { STORAGE_KEYS } from "../../utils/waitlist.constants";
import { validateWaitlistForm } from "../../utils/waitlist.validation";

// Helper to get all users registered on this browser
function getStoredUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WAITLIST_USERS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

// Helper to save all users
function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.WAITLIST_USERS, JSON.stringify(users));
  } catch (e) {
    // Ignore storage errors in this mockup
  }
}

/**
 * Registers a student onto the UniVerse Waitlist.
 * Simulates a Supabase async database insert.
 * 
 * @param {Object} data - Signup info.
 * @returns {Promise<Object>} The registered user session details.
 */
export async function joinWaitlist(data) {
  // Simulate 1.2s network round-trip delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Perform validation check
  const { isValid, errors } = validateWaitlistForm(data);
  if (!isValid) {
    const firstError = Object.values(errors)[0];
    throw new Error(firstError || "Validation failed.");
  }

  const email = data.email.trim().toLowerCase();
  const users = getStoredUsers();

  // Check for duplicate emails
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    // If user already registered, return their existing record
    return existingUser;
  }

  // Create new user entry
  const queuePos = users.length + 1483; // Base count + registered users
  const referralCode = `UNI-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  const newUser = {
    name: data.name.trim(),
    email: email,
    university: data.university.trim(),
    role: data.role,
    category: data.category || "electronics",
    referralCode,
    queuePosition: queuePos,
    referralsCount: 0,
    joinedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  // If a referral code was passed in the signup, credit that user
  if (data.referralCode) {
    const referrer = users.find(u => u.referralCode === data.referralCode);
    if (referrer) {
      referrer.referralsCount += 1;
      saveUsers(users);
    }
  }

  // Set current user session in local storage
  localStorage.setItem(STORAGE_KEYS.WAITLIST_USER, JSON.stringify(newUser));

  return newUser;
}



/**
 * Generates a shareable referral URL.
 * 
 * @param {string} referralCode 
 * @returns {string}
 */
export function generateReferralLink(referralCode) {
  const base = window.location.origin;
  return `${base}?ref=${referralCode}`;
}


