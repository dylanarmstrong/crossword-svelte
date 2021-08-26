<script lang='ts'>
  import Konva from 'konva';
  import { onMount } from 'svelte';

  import type { Mode } from '../types';
  import {
    grid,
    height,
    layer,
    mode,
    ready,
    selected,
    width,
  } from '../stores';
  import {
    filterCell,
    isGroup,
    isShape,
  } from '../utils';
  import colors from '../colors';

  let stageElement: HTMLDivElement;

  const highlight = (cells: number[], color: string) => {
    cells.forEach((cellIndex) => {
      const rows = $layer.children;
      for (let y = 0, yLen = rows.length; y < yLen; y++) {
        const row: Konva.Group | Konva.Shape= rows[y];
        if (isGroup(row)) {
          const children = row.children.filter(filterCell);
          for (let x = 0, xLen = children.length; x < xLen; x++) {
            const rect: Konva.Group | Konva.Shape = children[x];
            if (isShape(rect) && rect.attrs.$internal.cellIndex === cellIndex) {
              rect.fill(color);
            }
          }
        }
      }
    });
  };

  const onMouseDown = (
    e: Konva.KonvaEventObject<MouseEvent>
       | Konva.KonvaEventObject<TouchEvent>,
  ) => {
    e.cancelBubble = true;
    const { x, y } = e.target.attrs.$internal;
    const { x: oldX, y: oldY } = $selected;
    if (x === oldX && y === oldY) {
      mode.update(
        (oldMode) => oldMode === 'across' ? 'down' : 'across',
      );
    } else {
      selected.update(_ => ({ x, y }));
    }
  };

  let oldMode = $mode;
  const updateMode = (newMode: Mode) => {
    const { x, y } = $selected;
    const gridCell = $grid[y][x];
    highlight(gridCell[oldMode].cells, colors.white);

    highlight(gridCell[newMode].cells, colors.highlighted);
    highlight([gridCell.cell], colors.selected);
    oldMode = newMode;
  };

  let oldX = $selected.x;
  let oldY = $selected.y;
  const updateSelected = ({ x, y }) => {
    const oldGridCell = $grid[oldY][oldX];
    highlight(oldGridCell[$mode].cells, colors.white);

    const gridCell = $grid[y][x];
    highlight(gridCell[$mode].cells, colors.highlighted);
    highlight([gridCell.cell], colors.selected);

    oldX = x;
    oldY = y;
  };

  onMount(() => {
    const stage = new Konva.Stage({
      container: stageElement,
      width: $height * 25,
      height: $width * 25,
    });
    for (let y = 0; y < $height; y++) {
      const group = new Konva.Group();
      for (let x = 0; x < $width; x++) {
        const cell = $grid[y][x];
        if (cell) {
          const {
            cell: cellIndex,
            clueIndex,
            isBlack,
            isStart,
            value,
          } = cell;

          let fill = colors.white;
          if (isBlack) {
            fill = colors.black;
          } else {
            fill = colors.white;
          }

          const rect = new Konva.Rect({
            $internal: {
              cellIndex,
              isClueIndex: false,
              isCell: true,
              isValue: false,
              x,
              y,
            },
            fill,
            stroke: colors.black,
            strokeWidth: 1,
            height: 25,
            width: 25,
            x: x * 25,
            y: y * 25,
          });
          group.add(rect);

          if (isStart) {
            const text = new Konva.Text({
              $internal: {
                cellIndex,
                isClueIndex: true,
                isCell: false,
                isValue: false,
                x,
                y,
              },
              fontFamily: 'Raleway',
              fontSize: 8,
              offsetX: -1,
              text: String(clueIndex),
              x: x * 25,
              y: y * 25,
            });
            group.add(text);
          }

          if (!isBlack) {
            const text = new Konva.Text({
              $internal: {
                cellIndex,
                isClueIndex: false,
                isCell: false,
                isValue: true,
                x,
                y,
              },
              align: 'center',
              fill: colors.black,
              fontFamily: 'Raleway',
              fontSize: 20,
              fontVariant: 'small-caps',
              height: 25,
              text: value,
              verticalAlign: 'middle',
              width: 25,
              x: x * 25,
              y: y * 25 + 4,
            });
            text.on('mousedown', onMouseDown);
            text.on('touchend', onMouseDown);
            group.add(text);
          }
        }
      }
      $layer.add(group);
    }
    stage.add($layer);

    mode.subscribe(updateMode);
    selected.subscribe(updateSelected);
    ready.update(_ => true);
  });
</script>

<div bind:this={stageElement}/>
