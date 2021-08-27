import type Konva from 'konva';
import type { Cell, Grid, Row } from '@dylanarmstrong/puz';

import type { Coord, InternalAttrs } from './types';

export const isGroup = (
  v: Konva.Group | Konva.Shape,
): v is Konva.Group => !!v && typeof (v as Konva.Group).children !== 'undefined';

export const isText = (
  v: Konva.Shape | undefined,
): v is Konva.Text => !!v && (v as Konva.Text).className === 'Text';

export const isShape = (
  v: Konva.Group | Konva.Shape,
): v is Konva.Shape => !!v && !isGroup(v);

export const filterCell = (
  c: Konva.Group & InternalAttrs,
) => !!c.attrs.$internal.isCell;

export const filterValue = (
  c: Konva.Text & InternalAttrs,
) => !!c.attrs.$internal.isValue;

export const filterClueIndex = (
  c: Konva.Group & InternalAttrs,
) => !!c.attrs.$internal.isClueIndex;

export const notFilterClueIndex = (
  c: Konva.Group & InternalAttrs,
) => !filterClueIndex(c);

export const getCell = (
  row: Konva.Group,
  x: number,
  y: number,
  test: (cell: Konva.Shape) => boolean,
): Konva.Shape | undefined => {
  const cells: (Konva.Group | Konva.Shape)[] = row.children.filter(
    ({ attrs }) => attrs.$internal.x === x && attrs.$internal.y === y,
  );

  if (cells.length === 0) {
    return;
  }

  return cells.filter(isShape).find(test);
};

export const getCoord = (cellIndex: number, width: number): Coord => ({
  x: cellIndex % width,
  y: Math.floor(cellIndex / width),
});

const validKey = /^([A-Z]|ARROWLEFT|ARROWUP|ARROWRIGHT|ARROWDOWN|BACKSPACE|\ )$/;
export const isValidKey = (
  key: string,
): boolean => !!key.match(validKey);

export const getCellByClue = (
  clueIndex: number,
  grid: Grid,
): Cell => {
  for (let y = 0, yLen = grid.length; y < yLen; y++) {
    const row: Row = grid[y];
    for (let x = 0, xLen = row.length; x < xLen; x++) {
      const col: Cell = row[x];
      if (col.clueIndex === clueIndex) {
        return col;
      }
    }
  }
  return null;
};

// Convert hex to rgb
export const hex = (hex: string) => {
  const r = Number.parseInt(`0x${hex[1]}${hex[2]}`, 16);
  const g = Number.parseInt(`0x${hex[3]}${hex[4]}`, 16);
  const b = Number.parseInt(`0x${hex[5]}${hex[6]}`, 16);
  return `${r},${g},${b}`;
};
