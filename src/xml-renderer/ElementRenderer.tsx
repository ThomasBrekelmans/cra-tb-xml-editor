import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Element, MutationObserver, MutationRecord, Node, Text } from 'slimdom';

import AppContext from '../model/AppContext';
import getNodeId from '../model/getNodeId';
import TextNodeRenderer from './TextNodeRenderer';

type Props = {
	element: Element;
};

const ElementRenderer = ({ element }: Props) => {
	const app = useContext(AppContext);

	const nodeId = useMemo(() => getNodeId(element), [element]);

	const [childNodes, setChildNodes] = useState(element.childNodes);

	const handleMutation = useCallback(
		(records: MutationRecord[], observer: MutationObserver) => {
			// TODO: change attributes only if attributes mutation

			// TODO: only if childList mutation
			// Note: slimdom DOM is modified in place, make a new copy so React detects a change
			setChildNodes(element.childNodes.slice());
		},
		[element]
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

	const Template = app.getTemplateForElement(element);

	// TODO: render attributes + test attributes change
	return (
		<Template element={element} nodeId={nodeId}>
			{childNodes.map(renderChild)}
		</Template>
	);
};

export default ElementRenderer;
