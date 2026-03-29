import { Property, SimpleProperty } from "./property";
import type { Clock } from "./clock";

// Generic game state abstractions for incremental/idle games

export interface GameState {
  resources: Map<string, SimpleProperty<number>>;
  clock: Clock;
}
