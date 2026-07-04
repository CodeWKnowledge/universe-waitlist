export function validateWaitlistForm(data) {
  const errors = {};

  // Validate Name
  if (!data.name || !data.name.trim()) {
    errors.name = "Full name is required.";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  } else {
    const email = data.email.trim().toLowerCase();
    // Optional check for .edu.ng to suggest institutional email
    if (!email.endsWith(".edu.ng")) {
      errors.emailHint = "Note: Using an institutional (.edu.ng) email will auto-verify your account at launch.";
    }
  }

  // Validate University
  if (!data.university || !data.university.trim()) {
    errors.university = "Please select your university.";
  }

  // Validate Role
  if (!data.role) {
    errors.role = "Please select your primary role.";
  }

  return {
    isValid: Object.keys(errors).filter(k => k !== "emailHint").length === 0,
    errors
  };
}
