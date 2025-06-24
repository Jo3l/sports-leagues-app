<script setup lang="ts">
import LeagueList from "./components/LeagueList.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Sports Leagues</h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <LeagueList />
    </main>

    <!-- Footer -->
    <footer class="mt-16 border-t border-gray-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-gray-500">
          <p>
            Sports Leagues Explorer &copy; 2025 | Data provided by
            <a
              href="https://www.thesportsdb.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:text-blue-800"
            >
              TheSportsDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
