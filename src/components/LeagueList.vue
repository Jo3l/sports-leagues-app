<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Filter Leagues</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
            Search by name
          </label>
          <SearchBar
            id="search"
            v-model="searchQuery"
            placeholder="Search leagues..."
          />
        </div>
        <div>
          <label for="sport-filter" class="block text-sm font-medium text-gray-700 mb-2">
            Filter by sport
          </label>
          <SportFilter
            id="sport-filter"
            v-model="selectedSport"
            :sports="availableSports"
          />
        </div>
      </div>

      <!-- Results info -->
      <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {{ filteredLeaguesCount }} of {{ totalLeaguesCount }} leagues
          <span v-if="hasFilters" class="text-blue-600">(filtered)</span>
        </div>
        <button
          v-if="hasFilters"
          @click="clearFilters"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <span class="ml-3 text-gray-600">Loading leagues...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-lg font-medium text-red-800">Error loading leagues</h3>
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>
      <button
        @click="retryFetch"
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredLeaguesCount === 0 && !loading" class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No leagues found</h3>
      <p class="mt-2 text-gray-500">
        {{ hasFilters ? 'Try adjusting your search criteria.' : 'No leagues available.' }}
      </p>
    </div>

    <!-- Leagues Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <LeagueCard
        v-for="league in filteredLeagues"
        :key="league.idLeague"
        :league="league"
        :selected-league="selectedLeague"
        @select="handleLeagueSelect"
      />
    </div>

    <!-- Season Badge Modal/Panel -->
    <div
      v-if="selectedLeague"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="handleOverlayClick"
    >
      <div class="max-w-2xl w-full max-h-screen overflow-y-auto" @click.stop>
        <SeasonBadge
          :selected-league="selectedLeague"
          :season-badge="seasonBadge"
          :loading="loadingBadge"
          @close="clearSelection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { State } from '../store'
import LeagueCard from './LeagueCard.vue'
import SearchBar from './SearchBar.vue'
import SportFilter from './SportFilter.vue'
import SeasonBadge from './SeasonBadge.vue'
import type { League } from '../services/api'

const store = useStore<State>()

// Computed properties
const loading = computed(() => store.state.loading)
const error = computed(() => store.state.error)
const filteredLeagues = computed(() => store.state.filteredLeagues)
const availableSports = computed(() => store.state.availableSports)
const selectedLeague = computed(() => store.state.selectedLeague)
const seasonBadge = computed(() => store.state.seasonBadge)
const loadingBadge = computed(() => store.state.loadingBadge)

// Getters
const filteredLeaguesCount = computed(() => store.getters.filteredLeaguesCount)
const totalLeaguesCount = computed(() => store.getters.totalLeaguesCount)
const hasFilters = computed(() => store.getters.hasFilters)

// Two-way binding for filters
const searchQuery = computed({
  get: () => store.state.searchQuery,
  set: (value: string) => store.dispatch('setSearchQuery', value)
})

const selectedSport = computed({
  get: () => store.state.selectedSport,
  set: (value: string) => store.dispatch('setSelectedSport', value)
})

// Methods
const handleLeagueSelect = (league: League) => {
  store.dispatch('selectLeague', league)
}

const clearSelection = () => {
  store.dispatch('clearSelection')
}

const clearFilters = () => {
  store.dispatch('setSearchQuery', '')
  store.dispatch('setSelectedSport', '')
}

const retryFetch = () => {
  store.dispatch('fetchLeagues')
}

const handleOverlayClick = () => {
  clearSelection()
}

// Initialize
onMounted(() => {
  store.dispatch('fetchLeagues')
})
</script>
