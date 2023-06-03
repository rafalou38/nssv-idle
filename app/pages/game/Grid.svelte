<script lang="ts">
  import { onMount } from "svelte";
  import { AbsoluteLayoutElement } from "svelte-native/dom";
  import {} from "svelte-native";
  import Fab from "~/components/Fab.svelte";
  import { gridViewport } from "./stores";
  import Node from "./Node.svelte";

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
  <Node />
  <Fab />
</absoluteLayout>

<style>
</style>
