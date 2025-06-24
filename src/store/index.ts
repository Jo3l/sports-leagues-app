import { createStore } from 'vuex'
import { apiService } from '../services/api'
import type { League } from '../services/api'

export interface State {
  leagues: League[]
  filteredLeagues: League[]
  loading: boolean
  error: string | null
  searchQuery: string
  selectedSport: string
  availableSports: string[]
  selectedLeague: League | null
  seasonBadge: string | null
  loadingBadge: boolean
}

export default createStore<State>({
  state: {
    leagues: [],
    filteredLeagues: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedSport: '',
    availableSports: [],
    selectedLeague: null,
    seasonBadge: null,
    loadingBadge: false
  },

  mutations: {
    SET_LOADING(state: State, loading: boolean) {
      state.loading = loading
    },
    SET_LOADING_BADGE(state: State, loading: boolean) {
      state.loadingBadge = loading
    },
    SET_ERROR(state: State, error: string | null) {
      state.error = error
    },
    SET_LEAGUES(state: State, leagues: League[]) {
      state.leagues = leagues
      state.filteredLeagues = leagues
      // Extract unique sports
      const sports = [...new Set(leagues.map(league => league.strSport))].sort()
      state.availableSports = sports
    },
    SET_SEARCH_QUERY(state: State, query: string) {
      state.searchQuery = query
    },
    SET_SELECTED_SPORT(state: State, sport: string) {
      state.selectedSport = sport
    },
    SET_FILTERED_LEAGUES(state: State, leagues: League[]) {
      state.filteredLeagues = leagues
    },
    SET_SELECTED_LEAGUE(state: State, league: League | null) {
      state.selectedLeague = league
    },
    SET_SEASON_BADGE(state: State, badge: string | null) {
      state.seasonBadge = badge
    }
  },

  actions: {
    async fetchLeagues({ commit }: any) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const leagues = await apiService.getAllLeagues()
        commit('SET_LEAGUES', leagues)
      } catch (error) {
        commit('SET_ERROR', error instanceof Error ? error.message : 'Failed to fetch leagues')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchSeasonBadge({ commit }: any, leagueId: string) {
      commit('SET_LOADING_BADGE', true)
      commit('SET_SEASON_BADGE', null)

      try {
        const seasons = await apiService.getSeasonBadge(leagueId)
        if (seasons.length > 0) {
          // Use the last season badge found
          commit('SET_SEASON_BADGE', seasons[seasons.length - 1].strBadge)
        } else {
          commit('SET_SEASON_BADGE', null)
        }
      } catch (error) {
        console.error('Failed to fetch season badge:', error)
        commit('SET_SEASON_BADGE', null)
      } finally {
        commit('SET_LOADING_BADGE', false)
      }
    },

    setSearchQuery({ commit, dispatch }: any, query: string) {
      commit('SET_SEARCH_QUERY', query)
      dispatch('applyFilters')
    },

    setSelectedSport({ commit, dispatch }: any, sport: string) {
      commit('SET_SELECTED_SPORT', sport)
      dispatch('applyFilters')
    },

    applyFilters({ commit, state }: any) {
      let filtered = [...state.leagues]

      // Apply search filter
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(league =>
          league.strLeague.toLowerCase().includes(query) ||
          league.strLeagueAlternate?.toLowerCase().includes(query)
        )
      }

      // Apply sport filter
      if (state.selectedSport) {
        filtered = filtered.filter(league => league.strSport === state.selectedSport)
      }

      commit('SET_FILTERED_LEAGUES', filtered)
    },

    selectLeague({ commit, dispatch }: any, league: League) {
      commit('SET_SELECTED_LEAGUE', league)
      dispatch('fetchSeasonBadge', league.idLeague)
    },

    clearSelection({ commit }: any) {
      commit('SET_SELECTED_LEAGUE', null)
      commit('SET_SEASON_BADGE', null)
    }
  },

  getters: {
    filteredLeaguesCount: (state: State) => state.filteredLeagues.length,
    totalLeaguesCount: (state: State) => state.leagues.length,
    hasFilters: (state: State) => state.searchQuery.trim() !== '' || state.selectedSport !== ''
  }
})
