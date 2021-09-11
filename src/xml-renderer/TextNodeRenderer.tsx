import { evaluateUpdatingExpression } from 'fontoxpath';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MutationObserver, MutationRecord, Text } from 'slimdom';

import getNodeId from '../model/getNodeId';

type Props = {
	node: Text;
};

const TextNodeRenderer = ({ node }: Props) => {
	const nodeId = useMemo(() => getNodeId(node), [node]);

	const [textContent, setTextContent] = useState(node.textContent);

	console.log('TextNodeRenderer() render node', node, 'nodeId', nodeId);

	const handleMutation = useCallback(
		(records: MutationRecord[], observer: MutationObserver) => {
			//
			console.log(
				`TextNodeRenderer() node (${nodeId}) mutated, records`,
				records
			);
			setTextContent(node.textContent);
		},
		[nodeId, node.textContent]
	);

	useEffect(() => {
		const mutationObserver = new MutationObserver(handleMutation);
		mutationObserver.observe(node, {
			attributes: true,
			attributeOldValue: false,
			characterData: true,
			characterDataOldValue: false,
			childList: false
		});
		console.log(`TextNodeRenderer() observe node (${nodeId})`, node);

		return () => {
			mutationObserver.disconnect();
		};
	}, [node, handleMutation, nodeId]);

	const handleClick = useCallback(() => {
		console.log(`handleClick() node (${nodeId})`, node);

		evaluateUpdatingExpression('concat(., " test")', node).then(result => {
			console.log(
				`handleClick() > update expression result for (${nodeId})`,
				result
			);
			const updatedText = result.xdmValue[0] as string;
			node.textContent = updatedText;
			console.log(`handleClick() > done updating node (${nodeId})`, node);
		});
	}, [node, nodeId]);

	//
	return (
		<span
			data-test-id="text-node-renderer"
			data-node-id={nodeId}
			data-node-name={node.nodeName}
			onClick={handleClick}
		>
			{textContent}
		</span>
	);
};

export default TextNodeRenderer;
