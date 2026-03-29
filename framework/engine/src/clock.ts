// A generic, possibly nested, clock abstraction for incremental/idle games.
// A clock can represent time, ticks, or any progression unit, and can be composed.

import { Property, SimpleProperty } from "./property";

export interface Tickable {
  tick(deltaTime: number): void;
}

export interface Clock {
  addTickable(tickable: Tickable): void;
  removeTickable(tickable: Tickable): void;
}

export class RealTimeClock implements Clock {
  private tickables: Set<Tickable> = new Set();
  private lastTime: number = Date.now();
  private running: boolean = false;

  addTickable(tickable: Tickable): void {
    this.tickables.add(tickable);
  }

  removeTickable(tickable: Tickable): void {
    this.tickables.delete(tickable);
  }

  start(): void {
    if (!this.running) {
      this.running = true;
      this.lastTime = Date.now();
    }
  }

  stop(): void {
    this.running = false;
  }

  tick(): void {
    if (!this.running) return;
    const now = Date.now();
    const deltaTime = (now - this.lastTime) / 1000; // convert to seconds
    this.lastTime = now;
    this.tickables.forEach((tickable) => tickable.tick(deltaTime));
  }
}
