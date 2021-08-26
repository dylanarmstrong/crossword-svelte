import Konva from 'konva';
import md5 from 'md5';
import type { Grid, Puz } from '@dylanarmstrong/puz';
import type { Readable, Writable } from 'svelte/store';
import { derived, readable, writable } from 'svelte/store';

import type { ActiveClue, Clues, Coord, Mode, Solved } from './types';

export const puz: Writable<Puz> = writable(null);
export const selected: Writable<Coord> = writable(null);
export const mode: Writable<Mode> = writable('across');
export const solved: Writable<Solved> = writable(null);
export const ready: Writable<boolean> = writable(false);

export const layer: Readable<Konva.Layer> = readable(new Konva.Layer());

export const author: Readable<string> = derived(
  puz,
  ($puz) => $puz?.author || '',
);

export const copyright: Readable<string> = derived(
  puz,
  ($puz) => $puz?.copyright || '',
);

export const grid: Readable<Grid> = derived(
  puz,
  ($puz) => $puz?.grid || [],
);

export const height: Readable<number> = derived(
  puz,
  ($puz) => $puz?.header?.height?.[0] || 1,
);

export const title: Readable<string> = derived(
  puz,
  ($puz) => $puz?.title || '',
);

export const valid: Readable<boolean> = derived(
  puz,
  ($puz) => $puz?.valid || false,
);

export const width: Readable<number> = derived(
  puz,
  ($puz) => $puz?.header?.width?.[0] || 1,
);

export const solution: Readable<number[]> = derived(
  puz,
  ($puz) => $puz?.solution || null
);

export const key: Readable<string | null> = derived(
  solution,
  ($solution) => $solution ? md5($solution) : null,
);

export const byline = derived(
  [title, author, copyright],
  ([$title, $author, $copyright]) => [$title, $author, $copyright].filter(Boolean).join(' '),
);

export const clues: Readable<Clues> = derived(
  [grid, valid],
  ([$grid, $valid]) => {
    if (!$valid) {
      return null;
    }
    const across = [];
    const down = [];
    $grid.forEach(
      (row) => row.forEach(
        ({
          across: { clue: acrossClue, clueIndex: acrossClueIndex },
          down: { clue: downClue, clueIndex: downClueIndex },
          isAcross,
          isDown,
        }) => {
          if (isAcross) {
            across.push({ clue: acrossClue, index: acrossClueIndex });
          }
          if (isDown) {
            down.push({ clue: downClue, index: downClueIndex });
          }
        },
      ),
    );
    return {
      across,
      down,
    };
  },
);

export const activeClue: Readable<ActiveClue | null> = derived(
  [selected, grid],
  ([$selected, $grid]) => {
    const { x, y } = $selected;
    const row = $grid[y];
    if (row) {
      const cell = row[x];
      if (cell) {
        return {
          across: {
            index: cell.across.clueIndex,
            clue: cell.across.clue,
          },
          down: {
            index: cell.down.clueIndex,
            clue: cell.down.clue,
          }
        };
      }
    }
    return null;
  },
);
