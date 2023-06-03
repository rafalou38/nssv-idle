import { writable } from "svelte/store";

export const gridViewport = writable({ width: 0, height: 0 })
export const draggingNode = writable(0)