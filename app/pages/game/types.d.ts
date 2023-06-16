import { Vector2 } from "~/utils/Math"
export type NodeType = "basic"
export type NodeData = {
    id: string;
    type: NodeType;
    level: number;
    position: Vector2;
}