import { Property,
  NumberInputProperty, NumberOutputProperty, NumberProperty,
  StringInputProperty, StringOutputProperty, StringProperty,
  BooleanInputProperty, BooleanOutputProperty, BooleanProperty } from "./property";
import type { Clock } from "./clock";

// Generic game state abstractions for incremental/idle games

export interface DataNode<T> {
  nameProperty : StringInputProperty;
  qualifiedNameProperty : StringOutputProperty;
  valueProperty : Property<T>;

  getName: () => string;
  getQualifiedName: () => string;
  getValue: () => T;, 
  isRoot : () => boolean;

  getParent : () => undefined | DataNode<any>;
  addChildren : (child: DataNode<any>) => void;
  removeChildren : (child: DataNode<any>) => void;
}

interface SpecificPropertyNode<T, P extends Property<T>> extends DataNode<T> {
  valueProperty : P;
}

class BaseNode<T, P extends Property<T>> implements SpecificPropertyNode<T, P> {
  nameProperty : StringInputProperty;
  qualifiedNameProperty : StringOutputProperty;
  valueProperty : P;
  private parent: undefined | DataNode<any>;
  private children : DataNode<any>[];

  constructor(name: string, parent: undefined | DataNode<any>, valueProperty : P) {
    this.nameProperty = new StringInputProperty(name);
    this.parent = parent;
    this.children = [];
    this.valueProperty = valueProperty;
    this.qualifiedNameProperty = this.parent != undefined ?
      new StringOutputProperty(
        [this.parent?.qualifiedNameProperty, this.nameProperty],
        () => this.parent?.qualifiedNameProperty?.get() + ":" + this.nameProperty.get()
      ) :
      new StringOutputProperty(
        [this.nameProperty],
        () => this.nameProperty.get()
      );
  }

  getName = () => this.nameProperty.get();
  getQualifiedName =  () => this.qualifiedNameProperty.get();
  getValue = () => this.valueProperty.get();
  isRoot = () => typeof this.parent === undefined;

  getParent = () => this.parent;
  addChildren = (child: DataNode<any>) => this.children.push(child);
  removeChildren = (child: DataNode<any>) => this.children = this.children.filter((e) => e != child);
}

export interface NumberNode extends SpecificPropertyNode<number, NumberProperty> {}
export interface BooleanNode extends SpecificPropertyNode<boolean, BooleanProperty> {}
export interface StringNode extends SpecificPropertyNode<string, StringProperty> {}

export class NumberInputNode extends BaseNode<number, NumberInputProperty> implements NumberNode {}
export class NumberOutputNode extends BaseNode<number, NumberOutputProperty> implements NumberNode {}
export class BooleanInputNode extends BaseNode<boolean, BooleanInputProperty> implements BooleanNode {}
export class BooleanOutputNode extends BaseNode<boolean, BooleanOutputProperty> implements BooleanNode {}
export class StringInputNode extends BaseNode<string, StringInputProperty> implements StringNode {}
export class StringOutputNode extends BaseNode<string, StringOutputProperty> implements StringNode {}

export interface GameState {
  resources: Map<string, NumberInputProperty>;
  formulas: Map<string, NumberOutputProperty>;
  clock: Clock;
}
