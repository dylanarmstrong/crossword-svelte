<script type='ts'>
  import colors from '../colors';
  import { getCoord } from '../utils';

  export let mode: 'across' | 'down' = 'across';

  import {
    activeClue,
    clues,
    grid,
    height,
    mode as storeMode,
    selected,
    width,
  } from '../stores';

  $: activeIndex = $activeClue[mode].index;
  $: isActiveMode = $storeMode === mode;
  $: displayClues = $clues[mode];

  $: liStyle = isActiveMode
    ? `background-color: ${colors.blue};`
    : `background-color: ${colors.lightBlue}`;

  $: ulStyle = `
    height: ${$height * 25 - 22}px;
  `;

  const refs = [];
  const onClick = (index: number) => {
    let found = null;
    for (let y = 0, yLen = $height; y < yLen && !found; y++) {
      for (let x = 0, xLen = $width; x < xLen && !found; x++) {
        const cell = $grid[y][x];
        if (cell.clueIndex === index) {
          found = cell;
        }
      }
    }
    if (found) {
      const { x, y } = getCoord(found.cell, $width);
      selected.update(_ => ({ x, y }));
      if (mode !== $storeMode) {
        storeMode.update(_ => mode);
      }
    }
  };

  activeClue.subscribe((activeClues) => {
    const index = activeClues[mode].index;
    const ref = refs[index];
    if (ref) {
      ref.scrollIntoViewIfNeeded();
    }
  });
</script>

{#if displayClues.length > 0}
  <slot/>
  <ul style={ulStyle}>
    {#each displayClues as { clue, index } }
      {#if index === activeIndex}
        <li
          bind:this={refs[index]}
          on:click={() => onClick(index)}
          style={liStyle}
        >
          <span>{index}.</span>
          <p>{clue}</p>
        </li>
      {:else}
        <li
          bind:this={refs[index]}
          on:click={() => onClick(index)}
        >
          <span>{index}.</span>
          <p>{clue}</p>
        </li>
      {/if}
    {/each}
  </ul>
{/if}

<style>
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
  span {
    width: 25px;
    align-self: flex-start;
  }
  li {
    cursor: pointer;
    display: flex;
    padding-bottom: 3px;
    padding-top: 3px;
    width: 100%;
  }
  ul {
    overflow-y: scroll;
    list-style: none;
    margin: 0;
    padding-left: 0;
  }
</style>
