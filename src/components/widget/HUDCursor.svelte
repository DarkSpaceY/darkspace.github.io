<script lang="ts">
  import { Invert } from "mouse-animations";
  import { onDestroy, onMount } from "svelte";

  const BASE_SIZE = 40;
  const HOVER_SIZE = 100;

  let invert: Invert | null = null;
  let el: HTMLElement | null = null;

  onMount(() => {
    const hue = getComputedStyle(document.documentElement).getPropertyValue("--primary-hue") || "250";

    invert = new Invert({
      size: BASE_SIZE,
      color: `hsl(${hue}, 70%, 65%)`,
      smoothness: 0.12,
      hideDefault: true,
    });

    el = document.querySelector(".__ma-invert") as HTMLElement;
    if (el) el.style.transition = "width 0.3s ease, height 0.3s ease, background 0.3s ease";

    const onEnter = () => {
      if (!el) return;
      el.style.width = `${HOVER_SIZE}px`;
      el.style.height = `${HOVER_SIZE}px`;
    };
    const onLeave = () => {
      if (!el) return;
      el.style.width = `${BASE_SIZE}px`;
      el.style.height = `${BASE_SIZE}px`;
    };

    const selectors = 'a, button, input, textarea, [role="button"], .btn-regular, .btn-plain, .btn-card, [contenteditable], label, select, summary';
    document.querySelectorAll(selectors).forEach((target) => {
      target.addEventListener("mouseenter", onEnter);
      target.addEventListener("mouseleave", onLeave);
    });
  });

  onDestroy(() => {
    invert?.destroy();
  });
</script>
