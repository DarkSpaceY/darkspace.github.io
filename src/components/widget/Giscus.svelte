<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: string;
    strict: boolean;
    reactionsEnabled: boolean;
    emitMetadata: boolean;
    inputPosition: string;
    lang: string;
  }

  let { repo, repoId, category, categoryId, mapping, strict, reactionsEnabled, emitMetadata, inputPosition, lang }: Props = $props();

  let giscusContainer = $state<HTMLDivElement | null>(null);

  onMount(() => {
    if (!giscusContainer) return;

    const existingScript = giscusContainer.querySelector('script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    script.setAttribute('data-strict', strict ? '1' : '0');
    script.setAttribute('data-reactions-enabled', reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', emitMetadata ? '1' : '0');
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', lang);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    giscusContainer.appendChild(script);
  });
</script>

<div class="giscus-wrapper card-base p-6 mt-4" bind:this={giscusContainer}>
  <div class="giscus"></div>
</div>