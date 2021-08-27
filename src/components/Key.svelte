<script type='ts'>
import { keyEvent } from '../stores';

export let key: string = '';

const onClick = (e: MouseEvent) => {
  const { textContent } = e.target as HTMLDivElement;
  keyEvent.update(_ => textContent);
};
</script>

<div on:click|preventDefault={onClick}>
  {key}
</div>

<style>
  div {
    align-items: center;
    background-color: rgb(var(--lightBlue));
    border: 1px solid rgb(var(--darkBlue));
    box-shadow: 1px 2px 1px 0px rgba(var(--black), 0.25);
    cursor: pointer;
    display: flex;
    font-size: 18px;
    height: 35px;
    justify-content: center;
    touch-action: manipulation;
    user-select: none;
  }
  div:last-child {
    width: 75px;
  }
</style>
