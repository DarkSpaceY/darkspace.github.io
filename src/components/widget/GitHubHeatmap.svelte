<script lang="ts">
  import { onMount } from "svelte";

  const username = "DarkSpaceY";

  interface ContributionDay {
    color: string;
    contributionCount: number;
    contributionLevel: string;
    date: string;
  }

  let weeks = $state<ContributionDay[][]>([]);
  let totalContributions = $state(0);
  let loading = $state(true);
  let error = $state(false);
  let tooltip = $state<{ x: number; y: number; text: string } | null>(null);

  onMount(() => {
    fetchContributions();
  });

  async function fetchContributions() {
    try {
      const res = await fetch(
        `https://github-contributions-api.deno.dev/${username}.json`,
        { signal: AbortSignal.timeout(8000) },
      );
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      weeks = data.contributions || [];
      totalContributions = weeks.reduce(
        (sum, week) => sum + week.reduce((s, day) => s + day.contributionCount, 0),
        0,
      );
    } catch {
      error = true;
    }
    loading = false;
  }

  function levelClass(level: string): string {
    if (level === "NONE") return "l0";
    if (level === "FIRST_QUARTILE") return "l1";
    if (level === "SECOND_QUARTILE") return "l2";
    if (level === "THIRD_QUARTILE") return "l3";
    if (level === "FOURTH_QUARTILE") return "l4";
    return "l0";
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let monthLabels = $derived.by(() => {
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks.length; w++) {
      for (const day of weeks[w]) {
        if (day) {
          const m = new Date(day.date).getMonth();
          if (m !== lastMonth) {
            labels.push({ label: monthNames[m], index: w });
            lastMonth = m;
          }
          break;
        }
      }
    }
    return labels;
  });

  const dayLabels = [
    { label: "Mon", row: 1 },
    { label: "Wed", row: 3 },
    { label: "Fri", row: 5 },
  ];

  let colCount = $derived(weeks.length);

  function showTooltip(e: MouseEvent, count: number, date: string) {
    const d = new Date(date);
    const formatted = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const text =
      count === 0
        ? `No contributions on ${formatted}`
        : `${count} contribution${count !== 1 ? "s" : ""} on ${formatted}`;

    const cell = e.currentTarget as HTMLElement;
    const rect = cell.getBoundingClientRect();
    tooltip = {
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      text,
    };
  }

  function hideTooltip() {
    tooltip = null;
  }
</script>

<div class="heatmap-wrapper">
  <div class="heatmap-header">
    <div class="heatmap-title text-75">
      <svg class="gh-icon" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
      GitHub Contributions
    </div>
    {#if !loading && !error}
      <span class="heatmap-total text-50">{totalContributions.toLocaleString()} contributions in the last year</span>
    {/if}
  </div>

  {#if loading}
    <div class="heatmap-loading">
      <div class="spinner"></div>
    </div>
  {:else if error}
    <div class="heatmap-error">
      <a class="text-50" href="https://github.com/{username}" target="_blank" rel="noopener noreferrer">
        View contributions on GitHub →
      </a>
    </div>
  {:else}
    <div class="heatmap-scroll">
      <div
        class="heatmap-grid"
        style="grid-template-columns: 28px repeat({colCount}, 12px); grid-template-rows: 16px repeat(7, 12px);"
      >
        {#each monthLabels as ml}
          <span class="month-label text-50" style="grid-column: {ml.index + 2}; grid-row: 1;">
            {ml.label}
          </span>
        {/each}

        {#each dayLabels as dl}
          <span class="day-label text-50" style="grid-column: 1; grid-row: {dl.row + 2};">
            {dl.label}
          </span>
        {/each}

        {#each weeks as week, wIdx}
          {#each week as day, dIdx}
            <div
              class="cell {levelClass(day.contributionLevel)}"
              style="grid-column: {wIdx + 2}; grid-row: {dIdx + 2};"
              onmouseenter={(e) => showTooltip(e, day.contributionCount, day.date)}
              onmouseleave={hideTooltip}
            ></div>
          {/each}
        {/each}
      </div>
    </div>

    <div class="heatmap-footer">
      <div class="legend text-50">
        <span>Less</span>
        <span class="cell l0"></span>
        <span class="cell l1"></span>
        <span class="cell l2"></span>
        <span class="cell l3"></span>
        <span class="cell l4"></span>
        <span>More</span>
      </div>
      <a href="https://github.com/{username}" target="_blank" rel="noopener noreferrer" class="gh-link text-50">
        @{username}
      </a>
    </div>
  {/if}
</div>

{#if tooltip}
  <div class="tooltip" style="left: {tooltip.x}px; top: {tooltip.y}px;">
    {tooltip.text}
  </div>
{/if}

<style>
  .heatmap-wrapper {
    margin-top: 0.75rem;
    padding: 1.25rem;
    border-radius: var(--radius-large);
    background: var(--card-bg);
    animation: hfadeIn 0.5s ease-out both;
    animation-delay: 200ms;
  }

  @keyframes hfadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .heatmap-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .heatmap-title {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-weight: 700;
  }

  .gh-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .heatmap-total {
    font-size: 0.75rem;
  }

  .heatmap-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
  }

  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--btn-regular-bg);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: hsp 0.6s linear infinite;
  }

  @keyframes hsp {
    to { transform: rotate(360deg); }
  }

  .heatmap-error {
    text-align: center;
    padding: 1rem 0;
  }

  .heatmap-error a:hover {
    color: var(--primary);
  }

  .heatmap-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.25rem;
  }

  .heatmap-scroll::-webkit-scrollbar {
    height: 6px;
  }

  .heatmap-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .heatmap-scroll::-webkit-scrollbar-thumb {
    background: var(--btn-regular-bg);
    border-radius: 3px;
  }

  .heatmap-grid {
    display: grid;
    gap: 2px;
    min-width: fit-content;
  }

  .month-label {
    font-size: 0.625rem;
    white-space: nowrap;
    align-self: end;
    line-height: 1;
  }

  .day-label {
    font-size: 0.625rem;
    text-align: right;
    padding-right: 4px;
    align-self: center;
    line-height: 1;
  }

  .cell {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    cursor: pointer;
  }

  .cell:hover {
    outline: 1px solid var(--btn-content);
    outline-offset: -1px;
  }

  .l0 { background-color: #ebedf0; }
  .l1 { background-color: #9be9a8; }
  .l2 { background-color: #40c463; }
  .l3 { background-color: #30a14e; }
  .l4 { background-color: #216e39; }

  :global(.dark) .l0 { background-color: #161b22; }
  :global(.dark) .l1 { background-color: #0e4429; }
  :global(.dark) .l2 { background-color: #006d32; }
  :global(.dark) .l3 { background-color: #26a641; }
  :global(.dark) .l4 { background-color: #39d353; }

  .heatmap-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .legend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
  }

  .legend .cell {
    width: 10px;
    height: 10px;
    cursor: default;
  }

  .legend .cell:hover {
    outline: none;
  }

  .gh-link {
    font-size: 0.75rem;
    transition: color 0.2s;
  }

  .gh-link:hover {
    color: var(--primary);
  }

  .tooltip {
    position: fixed;
    transform: translate(-50%, -100%);
    background: #24292f;
    color: #fff;
    font-size: 0.75rem;
    padding: 0.375rem 0.625rem;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  :global(.dark) .tooltip {
    background: #f0f6fc;
    color: #1f2328;
  }
</style>
