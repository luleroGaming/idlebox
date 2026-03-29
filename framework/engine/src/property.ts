// A minimal reactive property implementation inspired by JavaFX properties.
// This is not a full observable system, but provides get/set and change listeners.

export interface InvalidationListener {
  invalidate(): void;
}

export interface Property<T> {
  get(): T;
  addListener(listener: InvalidationListener): void;
  removeListener(listener: InvalidationListener): void;
}

abstract class BaseProperty<T> implements Property<T> {
  abstract get(): T;

  private listeners: InvalidationListener[] = [];
  addListener(listener: InvalidationListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: InvalidationListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  _notifyListeners(): void {
    this.listeners.forEach((listener) => listener.invalidate());
  }
}

export class SimpleProperty<T> extends BaseProperty<T> {
  private value: T;

  constructor(initialValue: T) {
    super();
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this._notifyListeners();
    }
  }
}

export class SimpleNumberProperty extends SimpleProperty<number> {
  mod(delta: number): void {
    this.set(this.get() + delta);
  }
}

export class BoundProperty<T>
  extends BaseProperty<T>
  implements InvalidationListener
{
  private dependencies: Property<any>[];
  private valid: boolean = false;
  private computeValue: () => T;
  private cachedValue: T;

  constructor(dependencies: Property<any>[], computeValue: () => T) {
    super();
    this.dependencies = dependencies;
    this.computeValue = computeValue;
    this.cachedValue = computeValue();
    dependencies.forEach((dep) => dep.addListener(this));
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
      this._notifyListeners();
    }
  }

  isValid(): boolean {
    return this.valid;
  }

  getCachedValue(): T {
    return this.cachedValue;
  }

  forgetDependencies(): void {
    this.dependencies.forEach((dep) => dep.removeListener(this));
    this.dependencies = [];
  }
}
