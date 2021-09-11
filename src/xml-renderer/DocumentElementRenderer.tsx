import { useCallback, useEffect, useMemo } from 'react';
import { Element, MutationObserver, MutationRecord } from 'slimdom';

import getNodeId from '../model/getNodeId';
import ElementRenderer from './ElementRenderer';

type Props = {
	documentElement: Element;
};

const DocumentElementRenderer = ({ documentElement }: Props) => {
	const nodeId = useMemo(() => getNodeId(documentElement), [documentElement]);

	console.log(
		'DocumentElementRenderer() render documentElement',
		documentElement
	);

	const handleMutation = useCallback(
		(records: MutationRecord[], observer: MutationObserver) => {
			//
			console.log(
				'DocumentElementRenderer() documentElement mutated, records',
				records
			);
		},
		[]
	);

	useEffect(() => {
		const mutationObserver = new MutationObserver(handleMutation);
		mutationObserver.observe(documentElement, {
			attributes: true,
			attributeOldValue: false,
			characterData: false,
			characterDataOldValue: false,
			childList: true
		});
		console.log(
			'DocumentElementRenderer() observe documentElement',
			documentElement
		);

		return () => {
			mutationObserver.disconnect();
		};
	}, [documentElement, handleMutation]);

	//
	return (
		<div
			data-test-id="document-renderer"
			data-node-id={nodeId}
			data-element-name={documentElement.nodeName}
		>
			{documentElement.children.map(child => (
				<ElementRenderer key={getNodeId(child)} element={child} />
			))}
		</div>
	);
};

export default DocumentElementRenderer;
