<script lang='ts'>
  export let first: boolean = false;

  $: style = `
    ${first ? 'grid-column: 1/1;' : 'grid-column: 2/2;'}
  `;
</script>

<strong style={style}>
  <slot/>
</strong>

<style>
  strong {
    background-color: rgb(var(--white));
    border-bottom: 2px solid rgb(var(--black));
    grid-row: 1/1;
    height: 20px;
  }
</style>
