import { writable } from "svelte/store";
import { NodeData } from "./types";
// import { getOwnedNodes } from "~/databases/Nodes";

export const gridViewport = writable({ width: 0, height: 0 })
export const draggingNode = writable<string | null>(null)
export const ownedNodes = writable<NodeData[]>([]);