<script>
  import { width } from '../stores.ts';

  const getWidth = () => Number.parseInt(
    window
    .getComputedStyle(document.body)
    .width
    .replace(/[^0-9]/g, ''),
  );
  let windowWidth = getWidth();
  const setWidth = () => (windowWidth = getWidth());

  // Svelte doesn't allow dynamic styles
  $: style = windowWidth > 1200
    ? `grid-template-columns: calc(${$width} * 25px) auto auto`
    : undefined;
</script>

<svelte:window on:resize={setWidth}/>

<div style={style}>
  <slot/>
</div>

<style>
  div {
    display: grid;
    grid-template-columns: auto;
    grid-column-gap: 10px;
  }

  @media print {
    div {
      grid-template-columns: auto;
    }
  }
</style>
