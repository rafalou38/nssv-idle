<script lang="ts">
  import { onMount } from "svelte";
  import { AbsoluteLayoutElement } from "svelte-native/dom";
  import {} from "svelte-native";
  import Fab from "~/components/Fab.svelte";
  import { gridViewport } from "./stores";

  let container: AbsoluteLayoutElement;
  let interval: NodeJS.Timeout;
  onMount(() => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (!container) return;
      let { width, height } = container?.nativeView?.getActualSize();
      if (width && height) {
        clearInterval(interval);
        console.log($gridViewport);
        $gridViewport = {
          width,
          height,
        };
      }
    }, 100);
  });
</script>

<absoluteLayout row={1} col={0} bind:this={container}>
  <label left="120" />
  <Fab />
</absoluteLayout>

<style>
  label {
    background: #4a6551;
    border-radius: 8px;
    width: 512px;
    height: 200px;
    position: absolute;
    bottom: 0;
  }
</style>
