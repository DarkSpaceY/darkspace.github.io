<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Icon from '@iconify/svelte';

  interface Track {
    title: string;
    artist: string;
    cover: string;
    src: string;
  }

  const playlist: Track[] = [
    {
      title: 'Canvas',
      artist: 'Dexter Britain',
      cover: 'https://picsum.photos/seed/music1/400/400',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      title: 'Dreams',
      artist: 'Benjamin Tissot',
      cover: 'https://picsum.photos/seed/music2/400/400',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      title: 'Stellar',
      artist: 'Alex Productions',
      cover: 'https://picsum.photos/seed/music3/400/400',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
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
    if (!seconds || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  let mounted = $state(false);
  onMount(() => {
    mounted = true;
    audioElement = new Audio(playlist[currentIndex].src);
    audioElement.preload = 'auto';

    audioElement.addEventListener('timeupdate', () => {
      if (audioElement) currentTime = audioElement.currentTime;
    });

    audioElement.addEventListener('loadedmetadata', () => {
      if (audioElement) duration = audioElement.duration;
    });

    audioElement.addEventListener('ended', () => {
      isPlaying = false;
    });

    audioElement.addEventListener('play', () => {
      isPlaying = true;
    });

    audioElement.addEventListener('pause', () => {
      isPlaying = false;
    });
  });

  onDestroy(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      audioElement = null;
    }
  });
</script>

{#if mounted}
  <div class="player-card card-base p-4 relative overflow-hidden group">
    <!-- 氛围光晕背景 -->
    <div
      class="absolute inset-0 transition-all duration-1000"
      class:opacity-100={isPlaying}
      class:opacity-40={!isPlaying}
    >
      <div
        class="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] transition-all duration-1000"
        class:animate-spin-slow={isPlaying}
        style="background: radial-gradient(circle at center, var(--primary) 0%, transparent 60%);"
      >
      </div>
    </div>

    <!-- 唱片区域 -->
    <div class="relative z-10">
      <div class="relative mx-auto mb-4" style="width: 140px; height: 140px;">
        <!-- 旋转唱片 -->
        <div
          class="absolute inset-0 rounded-full transition-all duration-700"
          class:animate-spin-slow={isPlaying}
          class:paused={!isPlaying}
        >
          <svg viewBox="0 0 140 140" class="w-full h-full drop-shadow-lg">
            <defs>
              <clipPath id="discClip">
                <circle cx="70" cy="70" r="70" />
              </clipPath>
            </defs>
            <!-- 唱片底色 -->
            <circle cx="70" cy="70" r="70" fill="none" stroke="var(--line-color)" stroke-width="0.5" />
            <!-- 唱片纹路 -->
            {#each Array(8) as _, i}
              <circle
                cx="70" cy="70"
                r={22 + i * 5.5}
                fill="none"
                stroke="var(--line-color)"
                stroke-width="0.3"
                opacity={0.3 + i * 0.05}
              />
            {/each}
            <!-- 中心圆 -->
            <circle cx="70" cy="70" r="52" fill="none" stroke="var(--line-color)" stroke-width="0.5" />
          </svg>
        </div>

        <!-- 专辑封面 -->
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden transition-all duration-500 border-2 border-[var(--line-color)]"
          style="width: 88px; height: 88px;"
          class:shadow-lg={isPlaying}
          class:shadow-[var(--primary)]={isPlaying}
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            class="w-full h-full object-cover"
            class:animate-spin-slow={isPlaying}
            style={isPlaying ? '' : 'animation-play-state: paused;'}
          />
        </div>

        <!-- 播放/暂停覆盖层 -->
        <button
          onclick={togglePlay}
          class="absolute inset-0 flex items-center justify-center group/play"
        >
          <div
            class="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 bg-[var(--card-bg)] shadow-md hover:shadow-lg hover:scale-110 active:scale-95 border border-[var(--line-color)]"
            class:bg-[var(--primary)]={isPlaying}
          >
            {#if isPlaying}
              <Icon icon="material-symbols:pause-rounded" class="text-white text-2xl" />
            {:else}
              <Icon icon="material-symbols:play-arrow-rounded" class="text-[var(--primary)] text-2xl ml-0.5" />
            {/if}
          </div>
        </button>
      </div>

      <!-- 歌曲信息 -->
      <div class="text-center mb-3 relative z-10">
        <div class="font-bold text-sm text-90 truncate px-2 transition-colors">
          {currentTrack.title}
        </div>
        <div class="text-xs text-50 mt-0.5 truncate px-2 transition-colors">
          {currentTrack.artist}
        </div>
      </div>

      <!-- 进度条 -->
      <div class="relative z-10 flex items-center gap-2 mb-3 px-1">
        <span class="text-[10px] text-50 w-8 text-right tabular-nums select-none transition-colors">
          {formatTime(currentTime)}
        </span>
        <div
          bind:this={progressBar}
          class="flex-1 h-1.5 rounded-full bg-[var(--btn-plain-bg-hover)] cursor-pointer group/progress relative overflow-hidden"
          onclick={handleProgressClick}
          onkeydown={(e) => {
            if (e.key === 'ArrowRight' && audioElement) audioElement.currentTime = Math.min(duration, currentTime + 5);
            if (e.key === 'ArrowLeft' && audioElement) audioElement.currentTime = Math.max(0, currentTime - 5);
          }}
          role="slider"
          aria-label="Track progress"
          aria-valuenow={duration > 0 ? Math.round((currentTime / duration) * 100) : 0}
          aria-valuemin="0"
          aria-valuemax="100"
          tabindex="0"
        >
          <div
            class="h-full rounded-full transition-all duration-150 bg-[var(--primary)]"
            style="width: {duration > 0 ? (currentTime / duration * 100) : 0}%"
          >
          </div>
          <!-- hover 拖动点 -->
          <div
            class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--primary)] opacity-0 group-hover/progress:opacity-100 transition-opacity shadow"
            style="left: calc({duration > 0 ? (currentTime / duration * 100) : 0}% - 6px)"
          >
          </div>
        </div>
        <span class="text-[10px] text-50 w-8 text-left tabular-nums select-none transition-colors">
          {formatTime(duration)}
        </span>
      </div>

      <!-- 控制按钮 -->
      <div class="relative z-10 flex items-center justify-center gap-1">
        <button
          onclick={prevTrack}
          class="btn-plain scale-animation rounded-lg w-9 h-9 flex items-center justify-center"
          aria-label="Previous track"
        >
          <Icon icon="material-symbols:skip-previous-rounded" class="text-lg" />
        </button>

        <button
          onclick={togglePlay}
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-[var(--primary)] hover:brightness-110 active:scale-95 shadow-md hover:shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {#if isPlaying}
            <Icon icon="material-symbols:pause-rounded" class="text-white text-xl" />
          {:else}
            <Icon icon="material-symbols:play-arrow-rounded" class="text-white text-xl ml-0.5" />
          {/if}
        </button>

        <button
          onclick={nextTrack}
          class="btn-plain scale-animation rounded-lg w-9 h-9 flex items-center justify-center"
          aria-label="Next track"
        >
          <Icon icon="material-symbols:skip-next-rounded" class="text-lg" />
        </button>
      </div>
    </div>

    <!-- 歌曲计数指示器 -->
    <div class="relative z-10 flex justify-center gap-1.5 mt-3">
      {#each playlist as _, i}
        <button
          onclick={() => {
            currentIndex = i;
            if (isPlaying && audioElement) {
              audioElement.pause();
            }
            setTimeout(() => {
              if (audioElement) {
                audioElement.src = playlist[i].src;
                audioElement.load();
                audioElement.play();
              }
            }, 50);
          }}
          class="w-1.5 h-1.5 rounded-full transition-all duration-300"
          class:bg-[var(--primary)]={i === currentIndex}
          class:bg-[var(--line-color)]={i !== currentIndex}
          class:w-4={i === currentIndex}
          aria-label="Track {i + 1}"
        >
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .player-card {
    position: relative;
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }

  .paused {
    animation-play-state: paused;
  }
</style>
