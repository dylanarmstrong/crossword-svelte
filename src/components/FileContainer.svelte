<script lang='ts'>
  import parse from '@dylanarmstrong/puz';
  import { onMount } from 'svelte';

  import { puz } from '../stores';

  const onDragEnter = (
    e: DragEvent,
  ) => {
    const target = e.target as HTMLDivElement;
    target.style.borderColor = 'rgb(var(--darkBlue))';
  };

  const onDragLeave = (
    e: DragEvent,
  ) => {
    const target = e.target as HTMLDivElement;
    target.style.borderColor = 'rgb(var(--gray))';
  };

  const reader = new FileReader();
  const readFile = (blob: Blob | undefined) => {
    if (blob) {
      reader.readAsArrayBuffer(blob)
    }
  };

  const readPuz = (
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const target = e.target as HTMLInputElement;
    const [file] = target.files;
    readFile(file);
  };

  const onDrop = (
    e: DragEvent,
  ) => readFile(e.dataTransfer.files?.[0]);

  reader.onload = () => {
    const { result } = reader;
    if (result instanceof ArrayBuffer) {
      const parsedData = parse(new Uint8Array(result));
      puz.update(_ => parsedData);
    }
  };

  let el: HTMLElement | undefined;
  let innerHeight: number;
  $: style = '';
  const setHeight = () => {
    if (el) {
      style = `
        height: ${innerHeight - el.getBoundingClientRect().top * 2}px;
        visibility: visible;
      `;
    }
  };
  onMount(() => {
    setHeight();
  });
</script>

<svelte:window bind:innerHeight={innerHeight} on:resize={setHeight}/>

<input
  on:change={readPuz}
  type='file'
/>
<div
  bind:this={el}
  on:dragenter={onDragEnter}
  on:dragleave={onDragLeave}
  on:dragover|preventDefault
  on:drop|preventDefault={onDrop}
  style={style}
>
  <slot/>
</div>

<style>
  div {
    align-items: center;
    background-color: rgb(var(--white));
    border-radius: var(--borderRadius);
    border: 1px solid rgb(var(--gray));
    box-shadow: 1px 2px 2px rgba(var(--pink), 0.1);
    color: rgb(var(--black));
    display: flex;
    font-size: 2.5rem;
    justify-content: center;
    margin-top: 5px;
    text-align: center;
    visibility: hidden;
    width: 95%;
  }

  input {
    border-radius: var(--borderRadius);
    border: 1px solid rgb(var(--gray));
    box-shadow: 1px 2px 2px rgba(var(--pink), 0.1);
    padding: 0.5rem;
  }
</style>
