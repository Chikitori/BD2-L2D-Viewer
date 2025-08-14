<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <nav class="flex items-center justify-between bg-black text-white p-4">
      <div class="text-xl md:text-3xl font-bold">Brown Dust 2 L2D Viewer</div>
      <div class="hidden md:flex items-center gap-4">
        <button class="cursor-pointer" @click="showUploadModal = true">
          <PlusIcon class="w-5 h-5 md:w-7 md:h-7" />
        </button>
        <a
          href="https://ko-fi.com/jelosus1"
          target="_blank"
          rel="noopener"
          class="relative"
        >
          <KoFiIcon class="w-5 h-5 md:w-7 md:h-7" />
          <div
            v-if="showKofiTooltip"
            :class="[
              'absolute top-full z-10 mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-black text-xs rounded px-2 py-1 shadow transition-opacity duration-500',
              kofiTooltipHidden ? 'opacity-0' : 'opacity-100'
            ]"
          >
            If you like the work consider supporting!
            <span class="absolute left-1/2 -top-2 -translate-x-1/2 border-4 border-transparent border-b-white"></span>
          </div>
        </a>
        <button class="cursor-pointer" @click="showChangelog = true">
          <ChangelogIcon class="w-5 h-5 md:w-7 md:h-7" />
        </button>
        <a href="https://github.com/Jelosus2/BD2-L2D-Viewer" target="_blank">
          <GithubIcon class="w-5 h-5 md:w-7 md:h-7" />
        </a>
      </div>
      <button
        class="md:hidden cursor-pointer"
        @click="openMobileMenu()"
        aria-label="Menu"
      >
        <MenuIcon class="w-5 h-5" />
      </button>
    </nav>

    <div
      v-if="mobileMenuOpen"
      ref="mobileMenu"
      tabindex="-1"
      class="fixed inset-0 z-50 md:hidden bg-black bg-opacity-50"
    >
      <button
        class="absolute top-2 right-4 text-xl"
        @click="closeMobileMenu"
        aria-label="Close menu"
      >
        ✕
      </button>
      <div
        class="bg-black text-white w-60 p-4 flex flex-col gap-4 h-full"
      >
        <button
          class="flex items-center gap-2"
          @click="() => { showUploadModal = true; closeMobileMenu(); }"
        >
          <PlusIcon class="w-5 h-5" />
          <span>Upload</span>
        </button>
        <button
          class="flex items-center gap-2"
          @click="() => { showChangelog = true; closeMobileMenu(); }"
        >
          <ChangelogIcon class="w-5 h-5" />
          <span>Changelog</span>
        </button>
        <a
          href="https://github.com/Jelosus2/BD2-L2D-Viewer"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2"
          @click="closeMobileMenu"
        >
          <GithubIcon class="w-5 h-5" />
          <span>GitHub</span>
        </a>
        <a
          href="https://ko-fi.com/jelosus1"
          target="_blank"
          rel="noopener"
          class="relative flex items-center gap-2"
          @click="closeMobileMenu"
        >
          <KoFiIcon class="w-5 h-5" />
          <span>Ko-fi</span>
          <span
            v-if="showMobileKofiTip"
            :class="[
              'ml-2 text-xs bg-red-600 text-white rounded px-2 py-0.5 transition-opacity duration-500',
              mobileKofiTipHidden ? 'opacity-0' : 'opacity-100'
            ]"
            >Support!</span
          >
        </a>
      </div>
    </div>

    <UploadSpineModal v-if="showUploadModal" @close="showUploadModal = false" />
    <ChangelogModal v-if="showChangelog" @close="showChangelog = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ChangelogModal from '@/components/ChangelogModal.vue';
import UploadSpineModal from '@/components/UploadSpineModal.vue';

import GithubIcon from '@/components/icons/GithubIcon.vue';
import ChangelogIcon from '@/components/icons/ChangelogIcon.vue';
import PlusIcon from '@/components/icons/PlusIcon.vue';
import MenuIcon from '@/components/icons/MenuIcon.vue';
import KoFiIcon from '@/components/icons/KoFiIcon.vue';

const showChangelog = ref(false);
const showUploadModal = ref(false);
const showKofiTooltip = ref(false);
const kofiTooltipHidden = ref(false);
const mobileMenuOpen = ref(false);
const mobileMenu = ref<HTMLElement | null>(null);
const showMobileKofiTip = ref(false);
const mobileKofiTipHidden = ref(false);

let mobileTipTimer: ReturnType<typeof setTimeout> | undefined;
let mobileTipHideTimer: ReturnType<typeof setTimeout> | undefined;

const openMobileMenu = () => {
  mobileMenuOpen.value = true;
  if (!localStorage.getItem('kofiPromptSeen') && !mobileTipTimer) {
    showMobileKofiTip.value = true;
    mobileTipTimer = window.setTimeout(() => {
      mobileKofiTipHidden.value = true;
      mobileTipHideTimer = window.setTimeout(() => {
        showMobileKofiTip.value = false;
        localStorage.setItem('kofiPromptSeen', '1');
      }, 500);
    }, 5000);
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  if (mobileTipTimer) {
    clearTimeout(mobileTipTimer);
    mobileTipTimer = undefined;
  }
  if (mobileTipHideTimer) {
    clearTimeout(mobileTipHideTimer);
    mobileTipHideTimer = undefined;
  }
  mobileKofiTipHidden.value = false;
  showMobileKofiTip.value = false;
};

onMounted(() => {
  if (!localStorage.getItem('kofiPromptSeen') && !window.matchMedia('(max-width: 767px)').matches) {
    showKofiTooltip.value = true;
    setTimeout(() => {
      kofiTooltipHidden.value = true;
      setTimeout(() => {
        showKofiTooltip.value = false;
        localStorage.setItem('kofiPromptSeen', '1');
      }, 500);
    }, 5000);
  }
});
</script>
