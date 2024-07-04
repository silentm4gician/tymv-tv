import { getData } from "@silent_m4gician/ftv-scraper"

export const getMatches = async () => {
  const matches = await getData()
  return matches
}