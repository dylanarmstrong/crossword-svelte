<div>
  <slot name='left'/>
  <slot name='right'/>
</div>

<style>
  div {
    display: none;
  }

  @media (min-width: 992px) {
    div {
      display: grid;
      grid-template-columns: auto auto;
      grid-column-gap: 10px;
    }
  }
</style>
