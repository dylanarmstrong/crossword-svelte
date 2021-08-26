export type Mode = 'across' | 'down';

export type InternalAttrs = {
  cellIndex: number,
  isCell: boolean,
  isClueIndex: boolean,
  isValue: boolean,
  x: number,
  y: number,
};

export type Clue = {
  clue: string,
  index: number,
};

export type ActiveClue = {
  across: Clue,
  down: Clue,
};

export type Clues = {
  across: Clue[],
  down: Clue[],
};

export type Coord = {
  x: number,
  y: number,
};

type SolvedRow = string[];
export type Solved = SolvedRow[];
