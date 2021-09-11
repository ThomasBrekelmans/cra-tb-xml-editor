import { Node } from 'slimdom';

const nodeIdByNode = new WeakMap<Node, number>();
let currentId = 0;

export default function getNodeId(node: Node): number {
	let id = nodeIdByNode.get(node);
	if (id === undefined) {
		id = ++currentId;
		nodeIdByNode.set(node, id);
	}
	return id;
}
