<script>
  import { onMount } from "svelte";

  let canvas;
  let mouseX = -100;
  let mouseY = -100;
  let w = 0;
  let h = 0;
  let primaryColor = "160, 120, 255";

  onMount(() => {
    const hue = getComputedStyle(document.documentElement).getPropertyValue("--primary-hue") || "250";
    primaryColor = `hsl(${hue}, 80%, 65%)`;
    const match = primaryColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const [_, hue, sat, light] = match;
      const temp = document.createElement("div");
      temp.style.color = `hsl(${hue}, ${sat}%, ${light}%)`;
      document.body.appendChild(temp);
      const rgb = getComputedStyle(temp).color.match(/\d+/g);
      document.body.removeChild(temp);
      if (rgb) primaryColor = rgb.slice(0, 3).join(", ");
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  });

  function resize() {
    if (!canvas) return;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(devicePixelRatio, devicePixelRatio);
    draw(ctx);
  }

  const ARM = 10;
  const GAP = 3;
  const DOT = 2;

  function draw(ctx) {
    ctx.clearRect(0, 0, w, h);
    if (mouseX < 0 || mouseY < 0) return;

    ctx.strokeStyle = `rgba(${primaryColor}, 0.25)`;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(mouseX - ARM, mouseY);
    ctx.lineTo(mouseX - GAP, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX + GAP, mouseY);
    ctx.lineTo(mouseX + ARM, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY - ARM);
    ctx.lineTo(mouseX, mouseY - GAP);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY + GAP);
    ctx.lineTo(mouseX, mouseY + ARM);
    ctx.stroke();

    ctx.fillStyle = `rgba(${primaryColor}, 0.4)`;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, DOT, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(${primaryColor}, 0.08)`;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, DOT * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function move(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!canvas) return;
    draw(canvas.getContext("2d"));
  }

  function leave() {
    mouseX = -100;
    mouseY = -100;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
  }
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 pointer-events-none z-[9999]"
></canvas>

<style>
  :global(body) {
    cursor: none;
  }
  :global(a), :global(button), :global(input), :global(textarea),
  :global([role="button"]), :global(.btn-regular), :global(.btn-plain),
  :global(.btn-card), :global(.link), :global(label), :global(select),
  :global(summary) {
    cursor: none;
  }
</style>
