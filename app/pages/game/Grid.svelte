<script lang="ts">
  import { onMount } from "svelte";
  import { AbsoluteLayoutElement } from "svelte-native/dom";
  import Fab from "~/components/Fab.svelte";
  import { draggingNode, gridViewport } from "./stores";
  import Node from "./Node.svelte";
  import {
    PanGestureEventData,
    TouchGestureEventData,
  } from "@nativescript/core";
  import { Vector2 } from "~/utils/Math";
  import { addNode, ownedNodes } from "~/databases/Nodes";
  import { Screen } from "@nativescript/core/platform";
  const dpi = Screen.mainScreen.scale;

  let container: AbsoluteLayoutElement;
  let interval: NodeJS.Timeout;
  let cam_pos = new Vector2();
  let delta_pos = new Vector2();
  let unit = 20;
  let gridUnit = 20;

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
    }
  }

  onMount(() => {
    if (!container) return;
    container.addEventListener("pan", pan);
    container.addEventListener("touch", touch);

    interval = setInterval(() => {
      try {
        let { width, height } = container?.nativeView?.getActualSize();
        if (width && height) {
          clearInterval(interval);
          $gridViewport = { width, height };
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  });

  const approachIntervals = new Map<string, NodeJS.Timeout>();

  $: {
    for (const nodeA of $ownedNodes) {
      let nearest = Infinity;
      let nearestPos = new Vector2();
      for (const nodeB of $ownedNodes) {
        if (nodeA == nodeB) continue;
        const dist = nodeA.position.to(nodeB.position).norm();
        if (dist < nearest) {
          nearest = dist;
          nearestPos = nodeB.position;
        }
      }

      if (!approachIntervals.has(nodeA.id)) {
        const index = $ownedNodes.indexOf(nodeA);

        const approach = (target: Vector2) => {
          if (nodeA.position.to(target).norm() < 300) {
            clearInterval(approachIntervals.get(nodeA.id));
            approachIntervals.delete(nodeA.id);

            return;
          }

          $ownedNodes[index].position = nodeA.position.lerp(target, 0.01);
        };

        approachIntervals.set(
          nodeA.id,
          setInterval(approach.bind(null, nearestPos), 25)
        );
      }
    }
  }
</script>

<absoluteLayout
  top={`${cam_pos.y + delta_pos.y}dp`}
  left={`${cam_pos.x + delta_pos.x}dp`}
  bind:this={container}
  row={1}
  col={0}
  class=""
>
  <absoluteLayout
    class="grid"
    style="background-size: {gridUnit * dpi}px {gridUnit * dpi}px"
    top={`${cam_pos.y + delta_pos.y}dp`}
    left={`${cam_pos.x + delta_pos.x}dp`}
    class:grid--visible={$draggingNode}
  />
  {#each $ownedNodes as node (node.id)}
    <Node delta={cam_pos.copy().add(delta_pos)} data={node} {unit} />
  {/each}
  <Fab on:tap={() => addNode("basic")} />
</absoluteLayout>

<style>
  @keyframes fadeOut {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.5;
    }
  }

  .grid {
    z-index: -1;
    opacity: 0;
    transform: translate(-1500dp, -1500dp);
    width: 3000dp;
    height: 3000dp;
    background: url("~/assets/images/square.png");
    animation: fadeOut 200ms linear forwards;
  }

  .grid--visible {
    animation: fadeIn 200ms linear forwards;
  }
</style>
