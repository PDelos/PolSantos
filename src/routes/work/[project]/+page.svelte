<svelte:head>
  <title>Pol · {data}</title>
  <meta
    name="description"
    content={data}
  />
</svelte:head>

<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>
