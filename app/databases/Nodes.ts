import { CouchBase, ConcurrencyMode } from '@triniwiz/nativescript-couchbase';
import { writable } from 'svelte/store';
import { NodeData, NodeType } from '~/pages/game/types';
import { Vector2 } from '~/utils/Math';
const database = new CouchBase('my-database');


export const ownedNodes = writable<NodeData[]>([]);
// ownedNodes.subscribe(save)

async function load() {
    const result = database.query()
    console.log("result:", result);

    if (result instanceof Array)
        ownedNodes.set(result.map(node => ({ ...node, position: Vector2.from(node.position) })))
    else
        throw new Error("WTF data failed to load ?!");
}

export async function saveNodePosition(id: string, position: Vector2) {
    database.updateDocument(id, {
        position
    })
    ownedNodes.update(old => {
        const node = old.find(node => node.id == id)
        if (!node) throw new Error("That's not supposed to happen");

        node.position = position;

        return old;
    })
}
export async function addNode(type: NodeType) {
    const id = Math.random().toString(16);
    const document: NodeData = {
        id,
        level: 1,
        position: new Vector2(0, 0),
        type: "basic",
    }
    database.createDocument(document, id)
    ownedNodes.update(old => [...old, document])
}

// async function save(data: NodeData[]) {
//     console.log("saving dah data", data);
//     database.inBatch(() => {
//         for (const node of data) {
//             database.updateDocument(node.id, node)
//         }
//     })
// }

load()