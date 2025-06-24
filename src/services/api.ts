import axios from 'axios'

// API endpoints
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'
const ALL_LEAGUES_URL = `${BASE_URL}/all_leagues.php`
const SEASONS_URL = `${BASE_URL}/search_all_seasons.php`

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export interface League {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate: string
  strLeagueBadge?: string
  intFormedYear?: string
  strCountry?: string
  strWebsite?: string
  strDescriptionEN?: string
}

export interface Season {
  strSeason: string
  strBadge: string
}

class ApiService {
  private async fetchWithCache<T>(url: string): Promise<T> {
    const cached = cache.get(url)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log('Returning cached data for:', url)
      return cached.data as T
    }

    try {
      const response = await axios.get<T>(url)
      cache.set(url, { data: response.data, timestamp: now })
      console.log('Fetched and cached data for:', url)
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      throw new Error('Failed to fetch data from API')
    }
  }

  async getAllLeagues(): Promise<League[]> {
    const response = await this.fetchWithCache<{ leagues: League[] }>(ALL_LEAGUES_URL)
    return response.leagues || []
  }

  async getSeasonBadge(leagueId: string): Promise<Season[]> {
    const url = `${SEASONS_URL}?badge=1&id=${leagueId}`
    const response = await this.fetchWithCache<{ seasons: Season[] }>(url)
    return response.seasons || []
  }

  clearCache(): void {
    cache.clear()
  }
}

export const apiService = new ApiService()
