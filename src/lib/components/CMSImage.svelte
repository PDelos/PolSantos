<script lang="ts">
  import type { ClassValue } from 'svelte/elements';

  import { IMAGE_SIZES } from '../config';

  let { 
    src, 
    alt = "", 
    class: className = undefined as ClassValue
  }: {
    src: string;
    alt?: string;
    class?: ClassValue;
  } = $props();

  // Widths matching optimize-images.ts: mobile(480), tablet(768), pc(1200), desktop(1920)
  const widths = Object.values(IMAGE_SIZES);

  // Convert raw path to optimized base (remove extension)
  const optimizedBase = $derived(
    src
      .replace('/uploads/raw/', '/uploads/optimized/')
      .replace(/\.[^/.]+$/, "")
  );

  // Generate srcsets for modern formats
  const avifSrcset = $derived(
    widths.map(w => `${optimizedBase}-w${w}.avif ${w}w`).join(', ')
  );
  
  const webpSrcset = $derived(
    widths.map(w => `${optimizedBase}-w${w}.webp ${w}w`).join(', ')
  );

  // Responsive sizes: tells browser how wide the image will be displayed
  // Browser then automatically picks the correct optimized image:
  // - Mobile viewport → uses *-w480.avif
  // - Tablet viewport → uses *-w768.avif  
  // - PC viewport → uses *-w1200.avif
  // - Desktop/HiDPI → uses *-w1920.avif
  const sizesAttr = `(min-width: ${IMAGE_SIZES.pc}px) ${IMAGE_SIZES.pc}px, 100vw`;
</script>

<picture>
  <!-- Browser automatically selects correct size from optimized folder -->
  <source type="image/avif" srcset={avifSrcset} sizes={sizesAttr} />
  <source type="image/webp" srcset={webpSrcset} sizes={sizesAttr} />
  
  <img 
    {src} 
    {alt} 
    loading="lazy" 
    decoding="async" 
    class={["responsive-img", className]}
  />
</picture>

<style>
  .responsive-img {
    width: 100%;
    height: auto;
    display: block;
  }
</style>