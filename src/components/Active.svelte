<script type='ts'>
  import colors from '../colors';
  import { activeClue, mode, width } from '../stores';

  const style = `
    background-color: ${colors.blue};
    border-bottom: 2px solid ${colors.darkBlue};
    width: ${$width * 25 - 20}px;
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
    padding: 10px;
    background-color: blue;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 5px;
    border-bottom: 2px solid blue;
    display: block;
  }

  @media (min-width: 992px) {
    div {
      display: none;
    }
  }
</style>
