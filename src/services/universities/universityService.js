import { UNIVERSITIES_DATA } from "../../data/universities";

export const universityService = {
  getAll: () => {
    return UNIVERSITIES_DATA.sort((a, b) => a.name.localeCompare(b.name));
  },
  
  search: (query) => {
    if (!query) return universityService.getAll();
    const lowerQuery = query.toLowerCase();
    return UNIVERSITIES_DATA.filter(uni => 
      uni.name.toLowerCase().includes(lowerQuery) || 
      uni.shortName.toLowerCase().includes(lowerQuery)
    );
  },

  getById: (id) => {
    return UNIVERSITIES_DATA.find(uni => uni.id === id);
  }
};
