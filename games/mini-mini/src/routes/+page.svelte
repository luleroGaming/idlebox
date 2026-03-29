<script lang="ts">
	import { onMount } from 'svelte';
	import { gameStore, clickAntimatter, buyDimension, updateProduction } from '$lib/game';

	let gameState: import('$lib/game').GameState;
	let unsubscribe = gameStore.subscribe(state => gameState = state);

	let interval: number;

	onMount(() => {
		interval = setInterval(() => {
			const now = Date.now();
			const deltaTime = (now - gameState.lastUpdate) / 1000; // seconds
			updateProduction(deltaTime);
		}, 100) as unknown as number;

		return () => {
			clearInterval(interval);
			unsubscribe();
		};
	});
</script>

<main>
	<h1>Mini-Mini Incremental Game</h1>
	<p>Antimatter: {gameState.antimatter.toFixed(1)}</p>
	<button on:click={clickAntimatter}>Click for Antimatter</button>

	<h2>Dimensions</h2>
	{#each gameState.dimensions as dim, i (i)}
		<div>
			<p>{i + 1}st Dimension: {dim.count.toFixed(1)} {i === 0 ? '(produces antimatter)' : '(produces 1st dimensions)'}</p>
			<p>Cost: {dim.cost} antimatter</p>
			<button on:click={() => buyDimension(i)} disabled={gameState.antimatter < dim.cost}>Buy</button>
		</div>
	{/each}
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
