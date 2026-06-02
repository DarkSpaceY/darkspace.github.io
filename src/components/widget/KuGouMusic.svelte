<script>
  import { onMount } from "svelte";

  const userId = "1716967559";

  let playlists = $state([]);
  let loading = $state(true);
  let error = $state(false);

  onMount(async () => {
    try {
      const res = await fetch(
        `https://api-hot.ikutuga.com/kugou/user/playlist?userid=${userId}&page=1&pagesize=5`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      if (data?.data?.info) {
        playlists = data.data.info.map((p) => ({
          name: p.specialname || "未命名歌单",
          songCount: p.songcount || 0,
        }));
      }
    } catch {
      error = true;
    }
    loading = false;
  });
</script>

<div class="card-base p-3 onload-animation" style="animation-delay: 50ms">
  <div class="text-sm font-bold text-75 mb-2 flex items-center gap-1.5">
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
    最近在听
  </div>

  {#if loading}
    <div class="space-y-1.5">
      {#each Array(3) as _}
        <div class="h-4 bg-[var(--btn-regular-bg)] rounded animate-pulse"></div>
      {/each}
    </div>
  {:else if error || playlists.length === 0}
    <div class="text-xs text-50 py-1">
      酷狗音乐 · 歌单同步中
    </div>
  {:else}
    <div class="space-y-0.5">
      {#each playlists.slice(0, 5) as pl}
        <div class="flex items-center justify-between text-xs py-0.5">
          <span class="truncate text-75">{pl.name}</span>
          <span class="text-50 flex-shrink-0 ml-2">{pl.songCount}首</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
