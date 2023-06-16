import { Vector2 } from "~/utils/Math"

export type NodeData = {
    id: string;
    type: "basic";
    level: number;
    position: Vector2;
}