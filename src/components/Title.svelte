<script type='ts'>
  import colors from '../colors';

  export let first: boolean = false;

  $: style = `
    ${first ? 'grid-column: 1/1;' : 'grid-column: 2/2;'}
    background-color: ${colors.white};
    border-bottom: 2px solid ${colors.black};
  `;
</script>

<strong style={style}>
  <slot/>
</strong>

<style>
  strong {
    height: 20px;
    grid-row: 1/1;
  }
</style>
