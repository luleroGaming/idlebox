// A minimal reactive property implementation inspired by JavaFX properties.
// This is not a full observable system, but provides get/set and change listeners.

export interface InvalidationListener {
  invalidate(): void;
}

export interface Property<T> {
  get(): T;
  isValid(): boolean;
  addListener(listener: InvalidationListener): void;
  removeListener(listener: InvalidationListener): void;
  notifyListeners(): void;
}

export interface NumberProperty extends Property<number> {}

export interface BooleanProperty extends Property<boolean> {}

export interface StringProperty extends Property<string> {}

abstract class BaseProperty<T> implements Property<T> {
  abstract get(): T;
  abstract isValid(): boolean;

  private listeners: InvalidationListener[] = [];

  addListener(listener: InvalidationListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: InvalidationListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  notifyListeners(): void {
    this.listeners.forEach((listener) => listener.invalidate());
  }
}

export class ObjectInputProperty<T> extends BaseProperty<T> {
  private value: T;

  constructor(initialValue: T) {
    super();
    this.value = initialValue;
  }

  get = () => this.value;

  isValid = () => true;

  set(newValue: T): void {
    this.value = newValue;
    this.notifyListeners();
  }
}

export class NumberInputProperty extends ObjectInputProperty<number> implements NumberProperty {
  modify(delta : number) : number {
    const result: number = this.get() + delta;
    this.set(result);
    return result;
  }
}

export class BooleanInputProperty extends ObjectInputProperty<boolean> implements BooleanProperty {
  switch() : boolean {
    const result: boolean = !this.get();
    this.set(result);
    return result;
  }
}

export class StringInputProperty extends ObjectInputProperty<string> implements StringProperty {
  append(s : string) : string {
    const result: string = this.get() + s;
    this.set(result);
    return result;
  }
}

export class ObjectOutputProperty<T> extends BaseProperty<T> implements InvalidationListener {
  private dependencies: Property<any>[] = [];
  private valid: boolean = false;
  private computeValue: () => T;
  private cachedValue: T;

  constructor(dependencies: (undefined | Property<any>)[], computeValue: () => T) {
    super();
    dependencies.forEach((e) => {if (typeof e != undefined) {this.dependencies.push(e as Property<any>)}})
    this.computeValue = computeValue;
    this.cachedValue = computeValue();
    this.dependencies.forEach((dep) => dep.addListener(this));
  }

  get(): T {
    if (!this.valid) {
      this.cachedValue = this.computeValue();
      this.valid = true;
    }
    return this.cachedValue;
  }

  invalidate(): void {
    if (this.valid) {
      this.valid = false;
      this.notifyListeners();
    }
  }

  isValid = () => this.valid;

  getCachedValue = () => this.cachedValue;

  delete(): void {
    this.dependencies.forEach((dep) => dep.removeListener(this));
    this.dependencies = [];
  }

}

export class NumberOutputProperty extends ObjectOutputProperty<number> implements NumberProperty {}

export class BooleanOutputProperty extends ObjectOutputProperty<boolean> implements BooleanProperty {}

export class StringOutputProperty extends ObjectOutputProperty<string> implements StringProperty {}