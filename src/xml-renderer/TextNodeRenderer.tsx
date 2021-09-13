// import { evaluateUpdatingExpression } from 'fontoxpath';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { MutationObserver, MutationRecord, Text } from 'slimdom';

import ScrollContainerContext from '../ScrollContainerContext';
import getNodeId from '../model/getNodeId';

type Props = {
	node: Text;
};

const TextNodeRenderer = ({ node }: Props) => {
	const scrollContainer = useContext(ScrollContainerContext);

	const nodeId = useMemo(() => getNodeId(node), [node]);

	const [textContent, setTextContent] = useState(node.textContent);

	const handleMutation = useCallback(
		(records: MutationRecord[], observer: MutationObserver) => {
			// Note: slimdom DOM is modified in place, but this is a string, so no copy needed
			setTextContent(node.textContent);
		},
		[node.textContent]
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

		return () => {
			mutationObserver.disconnect();
		};
	}, [handleMutation, node, nodeId]);

	// const handleClick = useCallback(() => {
	// 	evaluateUpdatingExpression('concat(., " test")', node).then(result => {
	// 		const updatedText = result.xdmValue[0] as string;
	// 		node.textContent = updatedText;
	// 	});
	// }, [node]);

	const ref = useRef<HTMLSpanElement | null>(null);

	const handleIntersectionChange = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			if (!ref.current) {
				return;
			}

			ref.current.style.visibility =
				entries[0].intersectionRatio > 0 ? 'visible' : 'hidden';
		},
		[]
	);

	useEffect(() => {
		const intersectionObserver = new IntersectionObserver(
			handleIntersectionChange,
			{ root: scrollContainer, rootMargin: '10% 0% 10% 0%' }
		);
		if (ref.current) {
			intersectionObserver.observe(ref.current);
		}

		return () => {
			intersectionObserver.disconnect();
		};
	}, [handleIntersectionChange, scrollContainer]);

	return (
		<span
			data-test-id="text-node-renderer"
			data-node-id={nodeId}
			data-node-name={node.nodeName}
			ref={ref}
		>
			{textContent}
		</span>
	);
};

export default TextNodeRenderer;
