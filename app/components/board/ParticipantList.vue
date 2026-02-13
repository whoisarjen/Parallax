<template>
  <div class="flex flex-col h-full">
    <div class="px-4 py-3 border-b border-surface-800">
      <h2 class="text-sm font-semibold text-surface-300 uppercase tracking-wider">
        Participants ({{ participants.length }})
      </h2>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-1">
      <div
        v-for="p in participants"
        :key="p.id"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
        :class="p.id === currentParticipantId ? 'bg-primary-500/10' : 'hover:bg-surface-800/50'"
      >
        <!-- Avatar circle -->
        <div class="relative shrink-0">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            :class="avatarClasses(p.role)"
          >
            {{ getInitial(p.display_name) }}
          </div>
          <!-- Online indicator -->
          <span
            class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-900"
            :class="isOnline(p.id) ? 'bg-emerald-400' : 'bg-surface-600'"
          />
        </div>

        <!-- Name + role -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5">
            <span class="text-sm font-medium text-surface-200 truncate">
              {{ p.display_name }}
            </span>
            <span v-if="p.id === currentParticipantId" class="text-xs text-surface-500">(you)</span>
          </div>
          <span :class="roleBadgeClass(p.role)" class="text-[10px] font-medium uppercase tracking-wider">
            {{ p.role }}
          </span>
        </div>

        <!-- Vote status indicator -->
        <div class="shrink-0">
          <div v-if="votingActive && p.role !== 'spectator'">
            <svg
              v-if="hasVoted(p.id)"
              class="w-5 h-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div
              v-else
              class="w-5 h-5 rounded-full border-2 border-surface-600 animate-pulse-soft"
            />
          </div>
        </div>

        <!-- Facilitator controls -->
        <div v-if="isFacilitator && p.id !== currentParticipantId" class="shrink-0 relative">
          <button
            @click.stop="toggleMenu(p.id)"
            class="p-1 rounded-lg text-surface-500 hover:text-surface-300 hover:bg-surface-700 transition-colors"
            aria-label="Participant options"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="openMenuId === p.id"
              class="absolute right-0 top-8 w-44 rounded-xl bg-surface-800 border border-surface-700 shadow-xl z-20 py-1"
            >
              <button
                v-if="p.role !== 'voter'"
                @click="changeRole(p.id, 'voter')"
                class="w-full px-3 py-2 text-sm text-left text-surface-300 hover:bg-surface-700 transition-colors"
              >
                Set as Voter
              </button>
              <button
                v-if="p.role !== 'spectator'"
                @click="changeRole(p.id, 'spectator')"
                class="w-full px-3 py-2 text-sm text-left text-surface-300 hover:bg-surface-700 transition-colors"
              >
                Set as Spectator
              </button>
              <button
                v-if="p.role !== 'facilitator'"
                @click="changeRole(p.id, 'facilitator')"
                class="w-full px-3 py-2 text-sm text-left text-surface-300 hover:bg-surface-700 transition-colors"
              >
                Set as Facilitator
              </button>
              <div class="border-t border-surface-700 my-1" />
              <button
                @click="kickParticipant(p.id)"
                class="w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Remove
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <div
        v-if="participants.length === 0"
        class="text-center py-8 text-surface-500 text-sm"
      >
        No participants yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Participant, ParticipantRole } from '~/types'

const props = defineProps<{
  participants: Participant[]
  currentParticipantId: string | null
  onlineParticipantIds: Set<string>
  votedParticipantIds: Set<string>
  votingActive: boolean
  isFacilitator: boolean
}>()

const emit = defineEmits<{
  changeRole: [participantId: string, role: ParticipantRole]
  kick: [participantId: string]
}>()

const openMenuId = ref<string | null>(null)

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase()
}

function isOnline(id: string): boolean {
  return props.onlineParticipantIds.has(id)
}

function hasVoted(id: string): boolean {
  return props.votedParticipantIds.has(id)
}

function avatarClasses(role: ParticipantRole): string {
  switch (role) {
    case 'facilitator':
      return 'bg-primary-500/20 text-primary-300'
    case 'spectator':
      return 'bg-surface-700 text-surface-400'
    default:
      return 'bg-surface-700 text-surface-300'
  }
}

function roleBadgeClass(role: ParticipantRole): string {
  switch (role) {
    case 'facilitator':
      return 'text-primary-400'
    case 'spectator':
      return 'text-surface-500'
    default:
      return 'text-emerald-400'
  }
}

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function changeRole(participantId: string, role: ParticipantRole) {
  openMenuId.value = null
  emit('changeRole', participantId, role)
}

function kickParticipant(participantId: string) {
  openMenuId.value = null
  emit('kick', participantId)
}

// Close menu on outside click
function handleClickOutside() {
  openMenuId.value = null
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
