<template>
  <div v-if="selectedLeague" class="bg-white rounded-lg border border-gray-200 shadow-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-gray-900">
        {{ selectedLeague.strLeague }}
      </h3>
      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-4">
      <!-- League Info -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span class="font-medium text-gray-700">Sport:</span>
            <span class="ml-2 text-gray-600">{{ selectedLeague.strSport }}</span>
          </div>
          <div v-if="selectedLeague.strCountry">
            <span class="font-medium text-gray-700">Country:</span>
            <span class="ml-2 text-gray-600">{{ selectedLeague.strCountry }}</span>
          </div>
          <div v-if="selectedLeague.strLeagueAlternate" class="sm:col-span-2">
            <span class="font-medium text-gray-700">Alternative Name:</span>
            <span class="ml-2 text-gray-600">{{ selectedLeague.strLeagueAlternate }}</span>
          </div>
        </div>
      </div>

      <!-- Season Badge -->
      <div class="text-center">
        <h4 class="text-lg font-medium text-gray-900 mb-4">Season Badge</h4>
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span class="ml-2 text-gray-600">Loading season badge...</span>
        </div>

        <div v-else-if="seasonBadge" class="flex justify-center">
          <img
            :src="seasonBadge"
            :alt="`${selectedLeague.strLeague} season badge`"
            class="max-w-full h-auto max-h-64 object-contain rounded-lg shadow-md"
            @error="handleImageError"
          >
        </div>

        <div v-else class="py-8 text-center">
          <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-gray-500">No season badge available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { League } from '../services/api'

interface Props {
  selectedLeague: League | null
  seasonBadge: string | null
  loading: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = ''
  target.style.display = 'none'
}
</script>
