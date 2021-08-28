<script lang='ts'>
  import { puz, valid } from '../stores';
  const resetPuz = () => puz.update(_ => null);
</script>

<header>
  <h2>
    Crossword
  </h2>
  {#if $valid}
    <button
      on:click|preventDefault={resetPuz}
    >
      Load New Crossword
    </button>
  {/if}
</header>

<style>
  header {
    width: 95%;
    flex-direction: row;
    margin: 0 auto;
    display: flex;
  }
  h2 {
    align-self: center;
    margin: 0 auto 0 0;
    padding: 0.5rem 0;
  }
  button {
    align-self: center;
    background-color: rgb(var(--white));
    border-radius: var(--borderRadius);
    border: 1px solid rgb(var(--gray));
    box-shadow: 1px 2px 2px rgba(var(--pink), 0.1);
    padding: 0.5rem;
    width: 13rem;
  }
</style>
