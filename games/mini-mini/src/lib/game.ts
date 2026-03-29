// Game state and logic for mini-mini incremental game

import { writable } from 'svelte/store';

export interface Dimension {
	count: number;
	cost: number;
	baseCost: number;
	production: number; // per second
	multiplier: number;
}

export interface GameState {
	antimatter: number;
	dimensions: Dimension[];
	lastUpdate: number;
}

const initialState: GameState = {
	antimatter: 0,
	dimensions: [
		{ count: 0, cost: 10, baseCost: 10, production: 1, multiplier: 1.1 }, // produces AM
		{ count: 0, cost: 100, baseCost: 100, production: 1, multiplier: 1.15 } // produces 1st dims
	],
	lastUpdate: Date.now()
};

export const gameStore = writable<GameState>(initialState);

export function clickAntimatter() {
	gameStore.update((state) => {
		state.antimatter += 1;
		return state;
	});
}

export function buyDimension(index: number) {
	gameStore.update((state) => {
		const dim = state.dimensions[index];
		if (state.antimatter >= dim.cost) {
			state.antimatter -= dim.cost;
			dim.count += 1;
			dim.cost = Math.floor(dim.baseCost * Math.pow(dim.multiplier, dim.count));
		}
		return state;
	});
}

export function updateProduction(deltaTime: number) {
	gameStore.update((state) => {
		// 1st dimension produces antimatter
		const dim0 = state.dimensions[0];
		state.antimatter += dim0.count * dim0.production * deltaTime;

		// 2nd dimension produces 1st dimensions
		const dim1 = state.dimensions[1];
		dim0.count += dim1.count * dim1.production * deltaTime;

		state.lastUpdate = Date.now();
		return state;
	});
}
