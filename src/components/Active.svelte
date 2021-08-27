<script type='ts'>
  import { activeClue, mode, width } from '../stores';

  const style = `
    width: ${$width * 25}px;
  `;
</script>

<div style={style}>
  <strong>
    {$activeClue[$mode].index}.
  </strong>
  {$activeClue[$mode].clue}
</div>

<style>
  div {
    background-color: rgb(var(--blue));
    border-bottom: 2px solid rgb(var(--darkBlue));
    font-size: 16px;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 10px;
  }
</style>
