<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onDestroy, onMount } from "svelte";

  interface Song {
    title: string;
    artist: string;
    cover: string;
    src: string;
  }

  const searchKeyword = "古风";

  let songs = $state<Song[]>([]);
  let loading = $state(true);
  let error = $state(false);

  let currentIndex = $state(0);
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let audioElement: HTMLAudioElement | null = null;
  let progressBar = $state<HTMLDivElement | null>(null);

  const currentTrack = $derived(songs[currentIndex] || null);

  function togglePlay() {
    if (!audioElement || songs.length === 0) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(() => {});
    }
    isPlaying = !isPlaying;
  }

  function playIndex(i: number) {
    currentIndex = i;
    if (audioElement) {
      audioElement.src = songs[i].src;
      audioElement.load();
      audioElement.play().catch(() => {});
      isPlaying = true;
    }
  }

  function nextTrack() {
    if (songs.length === 0) return;
    playIndex((currentIndex + 1) % songs.length);
  }

  function prevTrack() {
    if (songs.length === 0) return;
    playIndex((currentIndex - 1 + songs.length) % songs.length);
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

  onMount(() => {
    audioElement = new Audio();
    audioElement.preload = "auto";

    audioElement.addEventListener("timeupdate", () => {
      if (audioElement) currentTime = audioElement.currentTime;
    });
    audioElement.addEventListener("loadedmetadata", () => {
      if (audioElement) duration = audioElement.duration;
    });
    audioElement.addEventListener("ended", () => {
      if (songs.length > 1) nextTrack();
      else isPlaying = false;
    });
    audioElement.addEventListener("play", () => { isPlaying = true; });
    audioElement.addEventListener("pause", () => { isPlaying = false; });

    fetchSongs();
  });

  onDestroy(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = "";
      audioElement = null;
    }
  });

  async function fetchSongs() {
    try {
      const res = await fetch(
        `https://api.i-meto.com/meting/api?server=kugou&type=search&id=${encodeURIComponent(searchKeyword)}`,
        { signal: AbortSignal.timeout(8000) },
      );
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No results");
      }

      songs = data
        .filter((s: any) => s.url)
        .map((s: any) => ({
          title: s.title || "未知歌曲",
          artist: s.author || "未知歌手",
          cover: s.pic || "",
          src: s.url,
        }));
    } catch {
      error = true;
    }
    loading = false;
  }
</script>

<div class="card-base p-3 onload-animation" style="animation-delay: 75ms">
  <div class="text-sm font-bold text-75 mb-2 flex items-center gap-1.5">
    <Icon icon="material-symbols:music-note-rounded" class="w-4 h-4" />
    播放器
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-4">
      <div class="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if error || songs.length === 0}
    <div class="text-xs text-50 py-2 text-center">
      暂无歌曲数据
    </div>
  {:else}
    <div class="text-[10px] text-50 mb-2 truncate">酷狗音乐 · 搜索「{searchKeyword}」</div>

    <div class="flex items-center gap-3 mb-3">
      <img
        src={currentTrack.cover
          ? currentTrack.cover
          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23222' width='48' height='48'/%3E%3Ctext x='24' y='28' text-anchor='middle' fill='%23555' font-size='18'%3E♪%3C/text%3E%3C/svg%3E"}
        alt={currentTrack.title}
        class="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-[var(--btn-regular-bg)]"
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

    <div class="flex items-center justify-center gap-1 mb-2">
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
      <div class="text-[10px] text-50 mb-1">歌单 ({songs.length}首)</div>
      <div class="max-h-32 overflow-y-auto">
        {#each songs as song, i}
          <button
            onclick={() => playIndex(i)}
            class="w-full flex items-center gap-2 text-left py-1 px-1 rounded hover:bg-[var(--btn-regular-bg)] transition-colors"
            class:bg-[var(--btn-regular-bg)]={i === currentIndex}
          >
            <span class="text-[10px] text-50 w-4 text-right flex-shrink-0">{i + 1}</span>
            <span class="text-[10px] truncate flex-1" class:text-[var(--primary)]={i === currentIndex} class:text-75={i !== currentIndex}>
              {song.title}
            </span>
            <span class="text-[10px] text-50 truncate max-w-[60px] flex-shrink-0">{song.artist}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
