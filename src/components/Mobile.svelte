<div>
  <slot/>
</div>

<style>
  div {
    display: block;
  }

  @media (min-width: 992px) {
    div {
      display: none;
    }
  }
</style>
