<script lang="ts">
  import { onMount } from "svelte";
  import { AbsoluteLayoutElement } from "svelte-native/dom";
  import {} from "svelte-native";
  import Fab from "~/components/Fab.svelte";
  import { draggingNode, gridViewport } from "./stores";
  import Node from "./Node.svelte";
  import {
    PanGestureEventData,
    TouchGestureEventData,
  } from "@nativescript/core";
  import { Vector2 } from "~/utils/Math";

  let container: AbsoluteLayoutElement;
  let interval: NodeJS.Timeout;

  let cam_pos = new Vector2();
  let delta_pos = new Vector2();

  function pan(e: PanGestureEventData) {
    if ($draggingNode) return;
    delta_pos.x = e.deltaX;
    delta_pos.y = e.deltaY;
  }

  function touch(e: TouchGestureEventData) {
    switch (e.action) {
      case "up":
        cam_pos.x += delta_pos.x;
        cam_pos.y += delta_pos.y;
      case "cancel":
        delta_pos.x = 0;
        delta_pos.y = 0;
        break;

      default:
        break;
    }
  }

  onMount(() => {
    if (!container) return; // @ts-ignore
    container.addEventListener("pan", pan); // @ts-ignore
    container.addEventListener("touch", touch);

    interval = setInterval(() => {
      try {
        let { width, height } = container?.nativeView?.getActualSize();
        if (width && height) {
          clearInterval(interval);
          console.log($gridViewport);
          $gridViewport = {
            width,
            height,
          };
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 100);
  });
</script>

<absoluteLayout
  top={cam_pos.y + delta_pos.y + "dp"}
  left={cam_pos.x + delta_pos.x + "dp"}
  bind:this={container}
  row={1}
  col={0}
  class="grid"
>
  <Node delta={cam_pos.copy().add(delta_pos)} />
  <Node delta={cam_pos.copy().add(delta_pos)} y={100} />
  <Fab />
</absoluteLayout>

<style>
</style>
