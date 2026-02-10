<script lang="ts">
	import { setLocale, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import { getContent } from '$lib/utils/cms';

	let currentLocale = getLocale();
	let selectedSlug = 'general/general_info';
	let contentResult: any = null;
	let error: string | null = null;

	function testGetContent() {
		try {
			error = null;
			contentResult = getContent(selectedSlug);
		} catch (e) {
			error = String(e);
			contentResult = null;
		}
	}

	function changeLocale(locale: string) {
		setLocale(locale);
		currentLocale = locale;
	}

	// Test on mount
	testGetContent();
</script>

<div class="demo-container">
	<h1>🧪 CMS Demo Page</h1>

	<section class="locale-section">
		<h2>Current Locale: <code>{currentLocale}</code></h2>
		<div class="locale-buttons">
			<button on:click={() => changeLocale('en')}>en</button>
			<button on:click={() => changeLocale('es')}>es</button>
			<button on:click={() => changeLocale('ca')}>ca</button>
		</div>
	</section>

	<section class="test-section">
		<h2>Test CMS Function</h2>
		<div class="form-group">
			<label for="slug">Content Slug:</label>
			<input
				id="slug"
				type="text"
				bind:value={selectedSlug}
				placeholder="e.g., general/general_info"
			/>
		</div>
		<button on:click={testGetContent}>Get Content</button>
	</section>

	{#if error}
		<section class="error-section">
			<h3>❌ Error</h3>
			<pre>{error}</pre>
		</section>
	{/if}

	{#if contentResult}
		<section class="result-section">
			<h3>✅ Content Result</h3>
			<details open>
				<summary>JSON Output</summary>
				<pre>{JSON.stringify(contentResult, null, 2)}</pre>
			</details>
		</section>
	{:else if !error && contentResult !== null}
		<section class="result-section">
			<p>No content found for this slug</p>
		</section>
	{/if}
</div>

<style>
	.demo-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
	}

	section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background: #f9f9f9;
	}

	h2, h3 {
		margin-top: 0;
		color: #555;
	}

	.locale-display {
		padding: 1rem;
		background: white;
		border-radius: 4px;
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	.locale-switcher {
		padding: 1rem;
		background: white;
		border-radius: 4px;
	}

	.locale-buttons {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.locale-buttons button {
		padding: 0.5rem 1rem;
		background: #e0e0e0;
		color: #333;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.3s;
	}

	.locale-buttons button:hover {
		background: #d0d0d0;
	}

	.locale-buttons button:active {
		background: #007bff;
		color: white;
	}

	code {
		background: #f0f0f0;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		box-sizing: border-box;
	}

	button {
		padding: 0.75rem 1.5rem;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.3s;
	}

	button:hover {
		background: #0056b3;
	}

	.error-section {
		background: #fee;
		border-color: #fcc;
	}

	.error-section h3 {
		color: #c00;
	}

	.result-section {
		background: #efe;
		border-color: #cfc;
	}

	.result-section h3 {
		color: #060;
	}

	pre {
		background: white;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	details {
		margin-top: 1rem;
	}

	summary {
		cursor: pointer;
		font-weight: 500;
		padding: 0.5rem;
		user-select: none;
	}

	summary:hover {
		text-decoration: underline;
	}
</style>
