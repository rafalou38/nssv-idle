<script lang="ts">
  import { screen } from "@nativescript/core/platform";
  import { onMount } from "svelte";
  import { AbsoluteLayoutElement } from "svelte-native/dom";
  import { gridViewport } from "~/pages/game/stores";

  //   export let viewport: { width: number; height: number };
  export let margin = 10;
  let top = 0;
  let left = 0;
  gridViewport.subscribe((viewport) => {
    top = viewport.height - 56 - margin;
    left = viewport.width - 56 - margin;
    console.log(viewport, "updates");
  });
</script>

{#if top && left}
  <button class="fas" text="&#xf07a;" {top} {left} androidElevation={0} />
{/if}

<style>
  button {
    margin: 0;
    padding: 0;
    width: 56;
    height: 56;
    box-shadow: none;
    background-color: hsl(0, 0%, 15%);
    color: white;
    font-size: 18dp;
    /* border-radius: 28dp; */
    border-radius: 20dp;
  }
</style>
