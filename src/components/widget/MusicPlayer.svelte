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

  const kuGouId = "1716967559";
  let kuGouPlaylists = $state<{ name: string; songCount: number }[]>([]);
  let kuGouLoading = $state(true);

  onMount(() => {
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

    fetchKuGou();
  });

  onDestroy(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = "";
      audioElement = null;
    }
  });

  async function fetchKuGou() {
    try {
      const res = await fetch(
        `https://api-hot.ikutuga.com/kugou/user/playlist?userid=${kuGouId}&page=1&pagesize=5`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data?.data?.info) {
        kuGouPlaylists = data.data.info.map((p: any) => ({
          name: p.specialname || "未命名歌单",
          songCount: p.songcount || 0,
        }));
      }
    } catch {}
    kuGouLoading = false;
  }
</script>

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

  <div class="flex items-center justify-center gap-1 mb-3">
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

  <div class="border-t border-[var(--line-color)] pt-2">
    <div class="text-[10px] text-50 mb-1.5">酷狗歌单</div>
    {#if kuGouLoading}
      <div class="space-y-1">
        {#each Array(3) as _}
          <div class="h-3 bg-[var(--btn-regular-bg)] rounded animate-pulse"></div>
        {/each}
      </div>
    {:else if kuGouPlaylists.length > 0}
      <div class="space-y-0.5">
        {#each kuGouPlaylists as pl}
          <div class="flex items-center justify-between text-[10px] py-0.5">
            <span class="truncate text-75">{pl.name}</span>
            <span class="text-50 flex-shrink-0 ml-2">{pl.songCount}首</span>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-[10px] text-50">同步中...</div>
    {/if}
  </div>
</div>
