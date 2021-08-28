<script lang='ts'>
  import type Konva from 'konva';
  import type { Cell, Row } from '@dylanarmstrong/puz';

  import {
    layer,
    grid,
    height,
    keyEvent,
    mode,
    selected,
    solved,
    width,
  } from '../stores';
  import {
    filterValue,
    getCell,
    getCellByClue,
    getCoord,
    isValidKey,
    isGroup,
    isText,
  } from '../utils';

  type MobileKeyEvent = {
    key: string,
  }

  const getNextClue = (clueIndex: number): Cell => {
    for (let y = 0, yLen = $grid.length; y < yLen; y++) {
      const row: Row = $grid[y];
      for (let x = 0, xLen = row.length; x < xLen; x++) {
        const col = row[x];
        if (col.isStart && col[$mode].clueIndex > clueIndex) {
          return col;
        }
      }
    }
    return getCellByClue(1, $grid);
  };

  const getNextCoord = (
    x: number,
    y: number,
  ): { x: number, y: number } => {
    const cell = $grid[y][x];
    const index = cell.cell;
    const { cells, clueIndex } = cell[$mode];
    const cellIndex = cells.findIndex((n) => n === index);
    if (cellIndex > cells.length - 2) {
      return getCoord(getNextClue(clueIndex).cell, $width);
    } else {
      return getCoord(cells[cellIndex + 1], $width);
    }
  };

  const move = (key: string, x?: number, y?: number) => {
    let newX = x || $selected.x;
    let newY = y || $selected.y;
    switch (key) {
      case 'ARROWLEFT': {
        newX -= 1;
        break;
      }
      case 'ARROWUP': {
        newY -= 1;
        break;
      }
      case 'ARROWRIGHT': {
        newX += 1;
        break;
      }
      case 'ARROWDOWN': {
        newY += 1;
        break;
      }
      default: break;
    }
    if (newX < $width && newY < $height && newX > -1 && newY > -1) {
      const cell = $grid[newY][newX];
      if (cell.isBlack) {
        return move(key, newX, newY);
      }
      selected.update(_ => ({ x: newX, y: newY }));
      return;
    }
  };

  const updateSolved = (x: number, y: number, key: string) => {
    solved.update((oldSolved) => {
      const newSolved = oldSolved.slice(0);
      newSolved[y][x] = key;
      return newSolved;
    });
  };

  const onKeyDown = (e: KeyboardEvent | MobileKeyEvent) => {
    const key = e.key.toUpperCase();

    if (!isValidKey(key)) {
      return;
    }

    const { x, y } = $selected;
    const row = $layer.children[y];
    if (isGroup(row)) {
      const text: Konva.Shape | undefined = getCell(
        row,
        x,
        y,
        filterValue,
      );
      if (isText(text)) {
        switch(key) {
          case 'ARROWLEFT':
          case 'ARROWUP':
          case 'ARROWRIGHT':
          case 'ARROWDOWN': {
            move(key);
            break;
          }
          case ' ': {
            mode.update(
              (currentMode) => currentMode === 'across' ? 'down' : 'across',
            );
            break;
          }
          case 'BACKSPACE': {
            text.setText('');
            updateSolved(x, y, '');
            break;
          }
          default: {
            text.setText(key);
            updateSolved(x, y, key);
            selected.update(_ => getNextCoord(x, y));
            break;
          }
        }
      }
    }
  };

  const onMobileKeyEvent = (char: string) => {
    if (char) {
      onKeyDown({ key: char === 'CLEAR' ? 'BACKSPACE' : char});
    }
  };

  keyEvent.subscribe(onMobileKeyEvent);
</script>

<div on:keydown={onKeyDown} tabIndex=0>
  <slot/>
</div>

<style>
  div {
    height: 100%;
    margin: 0.5rem auto;
    outline: none;
    width: 100%;
  }

  @media (min-width: 576px) {
    div {
      max-width: 540px;
    }
  }

  @media (min-width: 768px) {
    div {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    div {
      margin: 1.5rem auto;
      max-width: 960px;
      width: 95%;
    }
  }

  @media (min-width: 1200px) {
    div {
      margin: 3rem auto;
      max-width: 1140px;
    }
  }
</style>
