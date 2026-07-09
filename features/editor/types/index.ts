export type ElementType = 'pen' | 'line' | 'arrow' | 'rect' | 'circle' | 'text' | 'dimension';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  stroke: string;
  strokeWidth: number;
  fill?: string;
  opacity?: number;
}

export interface PathElement extends BaseElement {
  type: 'pen';
  points: number[]; // [x1, y1, x2, y2, ...]
}

export interface LineElement extends BaseElement {
  type: 'line' | 'arrow';
  points: number[];
}

export interface ShapeElement extends BaseElement {
  type: 'rect' | 'circle';
  radius?: number;
}

export interface DimensionElement extends BaseElement {
  type: 'dimension';
  points: number[];
  unit: string;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize?: number;
}

export type EditorElement = PathElement | LineElement | ShapeElement | DimensionElement | TextElement;
