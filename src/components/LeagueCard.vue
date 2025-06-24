<template>
  <div
    class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-4"
    @click="handleClick"
    :class="{ 'ring-2 ring-blue-500': isSelected }"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <!-- League Name -->
        <h3 class="text-lg font-semibold text-gray-900 truncate">
          {{ league.strLeague }}
        </h3>

        <!-- Sport Type -->
        <div class="mt-1">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ league.strSport }}
          </span>
        </div>

        <!-- Alternate Name -->
        <p v-if="league.strLeagueAlternate" class="mt-2 text-sm text-gray-600 truncate">
          <span class="font-medium">Also known as:</span> {{ league.strLeagueAlternate }}
        </p>

        <!-- Additional Info -->
        <div v-if="league.strCountry" class="mt-2 flex items-center text-sm text-gray-500">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          {{ league.strCountry }}
        </div>
      </div>

      <!-- League Badge -->
      <div v-if="league.strLeagueBadge" class="ml-4 flex-shrink-0">
        <img
          :src="league.strLeagueBadge"
          :alt="`${league.strLeague} badge`"
          class="w-12 h-12 object-contain rounded"
          @error="handleImageError"
        >
      </div>
    </div>

    <!-- Click indicator -->
    <div class="mt-3 flex items-center justify-between">
      <p class="text-xs text-gray-500">
        Click to view season badge
      </p>
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type { League } from '../services/api'

interface Props {
  league: League
  selectedLeague?: League | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  select: [league: League]
}>()

const isSelected = computed(() => {
  return props.selectedLeague?.idLeague === props.league.idLeague
})

const handleClick = () => {
  emit('select', props.league)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>
