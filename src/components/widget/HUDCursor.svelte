<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { CustomCursor, Ripple } from "mouse-animations";

  let cursor: CustomCursor | null = null;
  let ripple: Ripple | null = null;

  onMount(() => {
    const hue = getComputedStyle(document.documentElement).getPropertyValue("--primary-hue") || "250";

    cursor = new CustomCursor({
      innerSize: 6,
      outerSize: 28,
      innerColor: `hsl(${hue}, 70%, 65%)`,
      outerColor: `hsla(${hue}, 60%, 60%, 0.35)`,
      smoothness: 0.1,
      hideDefault: true,
    });

    ripple = new Ripple({
      color: `hsla(${hue}, 70%, 65%, 0.25)`,
      duration: 700,
      maxSize: 60,
    });
  });

  onDestroy(() => {
    cursor?.destroy();
    ripple?.destroy();
  });
</script>
