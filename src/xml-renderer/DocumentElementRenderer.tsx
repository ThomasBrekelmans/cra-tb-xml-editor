import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Element, MutationObserver, MutationRecord } from 'slimdom';

import AppContext from '../model/AppContext';
import getNodeId from '../model/getNodeId';
import ElementRenderer from './ElementRenderer';

type Props = {
	documentElement: Element;
	onAfterInitialRender: (initialRenderTime: number) => void;
};

const DocumentElementRenderer = ({
	documentElement,
	onAfterInitialRender
}: Props) => {
	const app = useContext(AppContext);

	const nodeId = useMemo(() => getNodeId(documentElement), [documentElement]);

	const [children, setChildren] = useState(documentElement.children);

	const handleMutation = useCallback(
		(records: MutationRecord[], observer: MutationObserver) => {
			// TODO: change attributes only if attributes mutation

			// TODO: only if childList mutation
			// Note: slimdom DOM is modified in place, make a new copy so React detects a change
			setChildren(documentElement.children.slice());
		},
		[documentElement]
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

		return () => {
			mutationObserver.disconnect();
		};
	}, [documentElement, handleMutation]);

	useEffect(() => {
		performance.mark('initialRenderEnd');
		app.initialRenderTime =
			Math.round(
				performance.measure(
					'initialRenderTime',
					'initialRenderStart',
					'initialRenderEnd'
				).duration * 1000
			) / 1000;
		onAfterInitialRender(app.initialRenderTime);
	}, [app, onAfterInitialRender]);

	const handleKeyUp = useCallback(
		(keyboardEvent: KeyboardEvent) => {
			console.log('keyboardEvent', keyboardEvent);
			//
			if (
				(keyboardEvent.key === 'Backspace' ||
					keyboardEvent.key === 'Delete') &&
				app.selectionRange
			) {
				console.log(
					'TODO: DELETE selected text, app.selectionRange',
					app.selectionRange
				);
			}
		},
		[app.selectionRange]
	);

	useEffect(() => {
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyUp]);

	const Template = app.getTemplateForElement(documentElement);

	return (
		<Template element={documentElement} nodeId={nodeId}>
			{children.map(child => (
				<ElementRenderer key={getNodeId(child)} element={child} />
			))}
		</Template>
	);
};

export default DocumentElementRenderer;
