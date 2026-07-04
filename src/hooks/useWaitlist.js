import { useState } from 'react';
import { waitlistService } from '../services/waitlist/waitlistService';

export function useWaitlist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const join = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const user = await waitlistService.joinWaitlist(data);
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to join waitlist. Please try again.');
      throw err;
    }
  };

  return { join, loading, error };
}
