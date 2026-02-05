<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	
	<!-- ===== Open Graph ===== -->
	<meta property="og:site_name" content="Pol Santos" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Pol Santos" />
	<meta property="og:image" content="https://polsantos.dev/og/default.jpg" />

	<!-- ===== Twitter ===== -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Pol Santos" />
	<meta name="twitter:image" content="https://polsantos.dev/og/default.jpg" />
</svelte:head>


{@render children()}
<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
