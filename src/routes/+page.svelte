<svelte:head>
  <title>Pol Santos</title>
  <meta
    name="description"
    content="Portfolio of Pol Santos, swe (software engineer), data scientist and full-stack developer."
  />
</svelte:head>


<script>
  import CMSImage from '$lib/components/CMSImage.svelte';
</script>

<CMSImage
  class="my-image"
  src="/uploads/raw/test/1_test.jpg" 
  alt="Hero banner image" 
/>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<style>
  :global(.my-image) {
    max-width: 200px;
    margin: 20px auto;
    border-radius: 20px;
  }
</style>