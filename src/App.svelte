<script lang='ts'>
  import type Konva from 'konva';
  import '@fontsource/raleway';

  import type { Solved } from './types';
  import Active from './components/Active.svelte';
  import Byline from './components/Byline.svelte';
  import ClueContainer from './components/ClueContainer.svelte';
  import Clues from './components/Clues.svelte';
  import Container from './components/Container.svelte';
  import FileContainer from './components/FileContainer.svelte';
  import Header from './components/Header.svelte';
  import Puzzle from './components/Puzzle.svelte';
  import PuzzleContainer from './components/PuzzleContainer.svelte';
  import Title from './components/Title.svelte';
  import {
    filterValue,
    getCell,
    getCellByClue,
    getCoord,
    isGroup,
    isText,
  } from './utils';
  import {
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

  // Set selected to first clue once the puzzle loads
  valid.subscribe((v) => {
    if (v) {
      const { x, y } = getCoord(getCellByClue(1, $grid).cell, $width);
      selected.update(_ => ({ x, y }));
    }
  });

  // Check if there's a save for this puzzle's key
  key.subscribe((k) => {
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
  });

  // On any solved change, save in localStorage
  solved.subscribe((newSolved: Solved) => {
    if ($key) {
      localStorage.setItem(`solved-${$key}`, JSON.stringify(newSolved));
    }
  });

  // Once the puzzle is ready, set grid to $solved
  ready.subscribe((isReady) => {
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
  });
</script>

<Container>
  <Header>
    Crossword
  </Header>
  <Byline/>
  {#if !$valid}
    <FileContainer>
      Drag & Drop .puz File Here
    </FileContainer>
  {:else}
    <PuzzleContainer>
      <Puzzle/>
      <Active/>
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

<style>
  :global(body) {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: subpixel-antialiased;
    background: white;
    font-family: 'Raleway', 'Helvetica Neue', sans-serif;
    letter-spacing: -.25px;
    margin: 10px 0 0;
  }
</style>
