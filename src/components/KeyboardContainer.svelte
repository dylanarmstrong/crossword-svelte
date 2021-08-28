<script lang='ts'>
</script>

<div>
  <slot/>
</div>

<style>
  div {
    grid-template-columns: repeat(10, 33px);
    display: grid;
    grid-gap: 5px;
    width: 100%;
    margin-bottom: 5px;
  }
</style>
