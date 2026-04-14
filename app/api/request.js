import { getMatchesOnly, getMatchDetails, getMultipleMatchDetails } from './scraper.js';
import { clearCache } from './cache.js';

export const getMatches = async () => {
  return await getMatchesOnly();
};

export const getMatchDetailsById = async (id) => {
  return await getMatchDetails(id);
};

export const getMultipleMatchDetailsByIds = async (ids) => {
  return await getMultipleMatchDetails(ids);
};

export const refreshCache = async () => {
  clearCache();
  return await getMatchesOnly();
};