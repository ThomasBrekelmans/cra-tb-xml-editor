import { useCallback, useEffect, useMemo, useState } from 'react';
import { Element, MutationObserver, MutationRecord, Node, Text } from 'slimdom';

import getNodeId from '../model/getNodeId';
import TextNodeRenderer from './TextNodeRenderer';

type Props = {
	element: Element;
};

const ElementRenderer = ({ element }: Props) => {
	const nodeId = useMemo(() => getNodeId(element), [element]);

	const [childNodes, setChildNodes] = useState(element.childNodes);

	console.log('ElementRenderer() render element', element, 'nodeId', nodeId);

	const handleMutation = useCallback(
		(records: MutationRecord[], observer: MutationObserver) => {
			//
			console.log(
				`ElementRenderer() element (${nodeId}) mutated, records`,
				records
			);
			console.log('element', element);
			// TODO: change attributes only if attributes mutation

			// TODO: only if childList mutation
			setChildNodes(element.childNodes.slice());
		},
		[element, nodeId]
	);

	useEffect(() => {
		const mutationObserver = new MutationObserver(handleMutation);
		mutationObserver.observe(element, {
			attributes: true,
			attributeOldValue: false,
			characterData: false,
			characterDataOldValue: false,
			childList: true
		});
		console.log(`ElementRenderer() observe element (${nodeId})`, element);

		return () => {
			mutationObserver.disconnect();
		};
	}, [element, handleMutation, nodeId]);

	const renderChild = useCallback((child: Node) => {
		switch (child.nodeType) {
			case Node.ELEMENT_NODE:
				return (
					<ElementRenderer
						key={getNodeId(child)}
						element={child as Element}
					/>
				);
			case Node.TEXT_NODE:
				return (
					<TextNodeRenderer
						key={getNodeId(child)}
						node={child as Text}
					/>
				);
			default:
				return <span>Unsupported node found</span>;
		}
	}, []);

	// TODO: render attributes + test attributes change
	return (
		<span
			data-test-id="element-renderer"
			data-node-id={nodeId}
			data-element-name={element.nodeName}
		>
			{childNodes.map(renderChild)}
		</span>
	);
};

export default ElementRenderer;
