<script lang='ts'>
  import type Konva from 'konva';
  import '@fontsource/raleway';

  import Active from './components/Active.svelte';
  import Byline from './components/Byline.svelte';
  import ClueContainer from './components/ClueContainer.svelte';
  import Clues from './components/Clues.svelte';
  import Container from './components/Container.svelte';
  import FileContainer from './components/FileContainer.svelte';
  import Header from './components/Header.svelte';
  import Key from './components/Key.svelte';
  import KeyboardContainer from './components/KeyboardContainer.svelte';
  import Mobile from './components/Mobile.svelte';
  import Puzzle from './components/Puzzle.svelte';
  import PuzzleContainer from './components/PuzzleContainer.svelte';
  import Title from './components/Title.svelte';
  import colors from './colors';
  import type { Solved } from './types';
  import {
    filterValue,
    getCell,
    getCellByClue,
    getCoord,
    hex,
    isGroup,
    isText,
  } from './utils';
  import {
    cellSize,
    grid,
    height,
    layer,
    key,
    ready,
    selected,
    solved,
    valid,
    width,
  } from './stores';

  const onValid = (isValid: boolean) => {
    if (isValid) {
      const { x, y } = getCoord(getCellByClue(1, $grid).cell, $width);
      selected.update(_ => ({ x, y }));
    }
  };

  const onKey = (k: string) => {
    if (k) {
      const save: Solved | null = JSON.parse(localStorage.getItem(`solved-${k}`));
      if (save) {
        solved.update(_ => save);
      } else {
        const initialSolved: Solved = new Array($height);
        for (let y = 0; y < $height; y++) {
          initialSolved[y] = new Array($width);
        }
        solved.update(_ => initialSolved);
      }
    }
  };

  const onSolved = (newSolved: Solved) => {
    if ($key) {
      localStorage.setItem(`solved-${$key}`, JSON.stringify(newSolved));
    }
  };

  const onReady = (isReady: boolean) => {
    if (isReady) {
      for (let y = 0, yLen = $layer.children.length; y < yLen; y++) {
        const row = $layer.children[y];
        if (isGroup(row)) {
          for (let x = 0, xLen = $solved[y].length; x < xLen; x++) {
            const text: Konva.Shape | undefined = getCell(
              row,
              x,
              y,
              filterValue,
            );
            if (isText(text)) {
              const s = $solved[y][x];
              if (text.attrs.text !== s) {
                text.setText(s);
              }
            }
          }
        }
      }
    }
  };

  // Set selected to first clue once the puzzle loads
  valid.subscribe(onValid);

  // Check if there's a save for this puzzle's key in localStorage
  key.subscribe(onKey);

  // On any solved change, save in localStorage
  solved.subscribe(onSolved);

  // Once the puzzle is ready, set grid to $solved
  ready.subscribe(onReady);

  // For mobile keyboard
  const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'CLEAR'
  ];

  // Add colors to :root
  const rootColors = Object
    .keys(colors)
    .map((key) => `--${key}:${hex(colors[key])};`)
    .join('');

  const el = document.createElement('style');
  el.textContent = `:root{${rootColors}}`;
  document.head.appendChild(el);
</script>

<svelte:head>
  <link rel='stylesheet' href='/crossword/normalize.css'/>
</svelte:head>

<Container>
  <Header/>
  <Byline/>
  {#if !$valid}
    <FileContainer/>
  {:else}
    <PuzzleContainer>
      <Puzzle/>
      <Mobile>
        <Active/>
        <KeyboardContainer>
          {#each keys as key}
            <Key key={key}/>
          {/each}
        </KeyboardContainer>
      </Mobile>
      <ClueContainer>
        <Clues slot='left' mode='across'>
          <Title first>
            Across
          </Title>
        </Clues>
        <Clues slot='right' mode='down'>
          <Title>
            Down
          </Title>
        </Clues>
      </ClueContainer>
    </PuzzleContainer>
  {/if}
</Container>
