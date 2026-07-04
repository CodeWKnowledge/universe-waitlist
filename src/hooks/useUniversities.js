import { useState, useMemo } from 'react';
import { universityService } from '../services/universities/universityService';

export function useUniversities() {
  const [searchQuery, setSearchQuery] = useState('');

  const universities = useMemo(() => {
    return universityService.search(searchQuery);
  }, [searchQuery]);

  return {
    universities,
    searchQuery,
    setSearchQuery,
    getAll: universityService.getAll
  };
}
