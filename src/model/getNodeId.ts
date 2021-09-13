import { Node } from 'slimdom';

export const nodeByNodeId = new Map<number, Node>();

const nodeIdByNode = new WeakMap<Node, number>();
export let currentId = 0;

export default function getNodeId(node: Node): number {
	let id = nodeIdByNode.get(node);
	if (id === undefined) {
		id = ++currentId;
		nodeIdByNode.set(node, id);
		nodeByNodeId.set(id, node);
	}
	return id;
}
