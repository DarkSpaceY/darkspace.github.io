<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onDestroy, onMount } from "svelte";

  interface Track {
    title: string;
    artist: string;
    cover: string;
    src: string;
  }

  const playlist: Track[] = [
    {
      title: "Canvas",
      artist: "Dexter Britain",
      cover: "https://picsum.photos/seed/music1/200/200",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      title: "Dreams",
      artist: "Benjamin Tissot",
      cover: "https://picsum.photos/seed/music2/200/200",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      title: "Stellar",
      artist: "Alex Productions",
      cover: "https://picsum.photos/seed/music3/200/200",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
  ];

  let currentIndex = $state(0);
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let audioElement: HTMLAudioElement | null = null;
  let progressBar = $state<HTMLDivElement | null>(null);

  const currentTrack = $derived(playlist[currentIndex]);

  function togglePlay() {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    isPlaying = !isPlaying;
  }

  function nextTrack() {
    currentIndex = (currentIndex + 1) % playlist.length;
    isPlaying = false;
    setTimeout(() => {
      if (audioElement) {
        audioElement.src = playlist[currentIndex].src;
        audioElement.load();
        audioElement.play();
        isPlaying = true;
      }
    }, 50);
  }

  function prevTrack() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    isPlaying = false;
    setTimeout(() => {
      if (audioElement) {
        audioElement.src = playlist[currentIndex].src;
        audioElement.load();
        audioElement.play();
        isPlaying = true;
      }
    }, 50);
  }

  function handleProgressClick(e: MouseEvent) {
    if (!audioElement || !progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioElement.currentTime = ratio * duration;
  }

  function formatTime(seconds: number): string {
    if (!seconds || !Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  let mounted = $state(false);
  onMount(() => {
    mounted = true;
    audioElement = new Audio(playlist[currentIndex].src);
    audioElement.preload = "auto";

    audioElement.addEventListener("timeupdate", () => {
      if (audioElement) currentTime = audioElement.currentTime;
    });
    audioElement.addEventListener("loadedmetadata", () => {
      if (audioElement) duration = audioElement.duration;
    });
    audioElement.addEventListener("ended", () => { isPlaying = false; });
    audioElement.addEventListener("play", () => { isPlaying = true; });
    audioElement.addEventListener("pause", () => { isPlaying = false; });
  });

  onDestroy(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = "";
      audioElement = null;
    }
  });
</script>

{#if mounted}
  <div class="card-base p-3 onload-animation" style="animation-delay: 75ms">
    <div class="text-sm font-bold text-75 mb-2 flex items-center gap-1.5">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
      播放器
    </div>

    <div class="flex items-center gap-3 mb-3">
      <img
        src={currentTrack.cover}
        alt={currentTrack.title}
        class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        class:opacity-70={!isPlaying}
      />
      <div class="min-w-0 flex-1">
        <div class="text-xs font-medium text-90 truncate">{currentTrack.title}</div>
        <div class="text-[10px] text-50 truncate mt-0.5">{currentTrack.artist}</div>
      </div>
    </div>

    <div class="flex items-center gap-2 mb-2">
      <span class="text-[10px] text-50 w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
      <div
        bind:this={progressBar}
        class="flex-1 h-1 rounded-full bg-[var(--btn-plain-bg-hover)] cursor-pointer relative"
        onclick={handleProgressClick}
        onkeydown={(e) => {
          if (e.key === 'ArrowRight' && audioElement) audioElement.currentTime = Math.min(duration, currentTime + 5);
          if (e.key === 'ArrowLeft' && audioElement) audioElement.currentTime = Math.max(0, currentTime - 5);
        }}
        role="slider"
        aria-label="Track progress"
        tabindex="0"
      >
        <div
          class="h-full rounded-full transition-all duration-150 bg-[var(--primary)]"
          style="width: {duration > 0 ? (currentTime / duration * 100) : 0}%"
        ></div>
      </div>
      <span class="text-[10px] text-50 w-8 text-left tabular-nums">{formatTime(duration)}</span>
    </div>

    <div class="flex items-center justify-center gap-1">
      <button onclick={prevTrack} class="btn-plain scale-animation rounded-lg w-8 h-8 flex items-center justify-center" aria-label="Previous">
        <Icon icon="material-symbols:skip-previous-rounded" class="text-base" />
      </button>
      <button
        onclick={togglePlay}
        class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 bg-[var(--primary)] hover:brightness-110 active:scale-95"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {#if isPlaying}
          <Icon icon="material-symbols:pause-rounded" class="text-white text-lg" />
        {:else}
          <Icon icon="material-symbols:play-arrow-rounded" class="text-white text-lg ml-0.5" />
        {/if}
      </button>
      <button onclick={nextTrack} class="btn-plain scale-animation rounded-lg w-8 h-8 flex items-center justify-center" aria-label="Next">
        <Icon icon="material-symbols:skip-next-rounded" class="text-base" />
      </button>
    </div>
  </div>
{/if}
