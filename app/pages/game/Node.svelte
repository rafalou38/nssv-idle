<script lang="ts">
  import {
    PanGestureEventData,
    TouchGestureEventData,
  } from "@nativescript/core";
  import { onMount } from "svelte";
  import { FlexboxLayoutElement } from "svelte-native/dom";
  import { Vector2 } from "~/utils/Math";
  import { draggingNode } from "./stores";
  import type { NodeData } from "./types";

  export let data: NodeData;
  export let delta = new Vector2();
  export let unit = 25;

  let e: FlexboxLayoutElement;
  let dx = 0;
  let dy = 0;
  let timeout: NodeJS.Timeout | null = null;

  function startDrag() {
    console.log("Drag start");
    $draggingNode = data.id;
  }

  function endDrag() {
    data.position.x += dx;
    data.position.y += dy;
  }

  function pan(e: PanGestureEventData) {
    if ($draggingNode) {
      dx = Math.round(e.deltaX / unit) * unit;
      dy = Math.round(e.deltaY / unit) * unit;
    }
  }

  function onTouch(e: TouchGestureEventData) {
    switch (e.action) {
      case "down":
        console.log("Start timeout");
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(startDrag, 200);
        break;

      case "move":
        if ($draggingNode) return;
      case "up":
        endDrag();
      case "cancel":
        dx = 0;
        dy = 0;
        setTimeout(() => {
          $draggingNode = null;
        }, 100);
        if (timeout) clearTimeout(timeout);
        break;

      default:
        break;
    }
  }

  onMount(() => {
    e.addEventListener("pan", pan);
    e.addEventListener("touch", onTouch);

    return () => {
      clearTimeout(timeout);
    };
  });
</script>

<flexboxLayout
  class="node"
  class:node--drag={$draggingNode == data.id}
  top={`${delta.y + data.position.y + dy}dp`}
  left={`${delta.x + data.position.x + dx}dp`}
  bind:this={e}
>
  <flexboxLayout class="main">
    <label text={$draggingNode + ""} />
  </flexboxLayout>
  <flexboxLayout class="upgrade">
    <label class="fas" text="&#xf07a;" />
    <label text="700" />
  </flexboxLayout>
</flexboxLayout>

<style>
  .node {
    padding: 10dp;
    background: #4a6551;
    color: white;
    border-radius: 8px;
    width: 200dp;
  }

  .node--drag {
    transform: scale(1.2);
  }

  .main {
    flex-grow: 1;
    flex-direction: row;
  }

  .upgrade {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #3d5443;
    border-radius: 8px;
    height: 50dp;
    width: 50dp;
  }
</style>
