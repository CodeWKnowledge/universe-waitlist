export const segmentationService = {
  getWaitlistUsers: () => {
    // Return query params or perform fetch
    return { status: 'waitlist' };
  },
  getActiveUsers: () => {
    return { status: 'active' };
  },
  getBetaUsers: () => {
    return { status: 'beta' };
  }
};
