<script lang="ts">
  import {
    PanGestureEventData,
    TouchGestureEventData,
  } from "@nativescript/core";
  import { onMount } from "svelte";
  import { FlexboxLayoutElement } from "svelte-native/dom";
  import { Vector2 } from "~/utils/Math";
  import { draggingNode } from "./stores";

  export let delta = new Vector2();
  export let x = 0;
  export let y = 0;
  export let unit = 25;

  let e: FlexboxLayoutElement;
  let id = Math.random();

  let dx = 0;
  let dy = 0;

  function startDrag() {
    console.log("Dragg start");
    $draggingNode = id;
  }
  function endDrag() {
    x += dx;
    y += dy;
  }

  function pan(e: PanGestureEventData) {
    if ($draggingNode) {
      dx = Math.round(e.deltaX / unit) * unit;
      dy = Math.round(e.deltaY / unit) * unit;
    }
  }

  let timeout: NodeJS.Timeout | null = null;
  function onTouch(e: TouchGestureEventData) {
    switch (e.action) {
      case "down":
        console.log("start timeout");
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
          $draggingNode = 0;
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
  });
</script>

<flexboxLayout
  class="node"
  class:node--drag={$draggingNode == id}
  top={delta.y + y + dy + "dp"}
  left={delta.x + x + dx + "dp"}
  onpan={console.log}
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
