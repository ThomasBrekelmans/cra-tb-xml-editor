/** @jsxImportSource @emotion/react */

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';

import AppHeader from './AppHeader';
import Profiler from './Profiler';
import ScrollContainerContext from './ScrollContainerContext';
import { ParseXmlResult } from './model/App';
import AppContext from './model/AppContext';
import BlockTemplate from './templates/BlockTemplate';
import DocumentTemplate from './templates/DocumentTemplate';
import ParagraphTemplate from './templates/ParagraphTemplate';
import TitleTemplate from './templates/TitleTemplate';
import DocumentElementRenderer from './xml-renderer/DocumentElementRenderer';

const styles = css`
	flex: 1;
	overflow-y: hidden;
	display: flex;
	flex-direction: column;
	position: relative;
`;

function App() {
	const app = useContext(AppContext);

	const [parseResult, setParseResult] = useState<ParseXmlResult | null>(null);

	const [initialRenderTime, setInitialRenderTime] = useState(0);

	useEffect(() => {
		app.addTemplate('self::topic', DocumentTemplate);
		app.addTemplate('self::title', TitleTemplate);
		app.addTemplate('self::body', BlockTemplate);
		app.addTemplate('self::p', ParagraphTemplate);

		app.parseXml().then(parseXmlResult => {
			performance.mark('initialRenderStart');
			setParseResult(parseXmlResult);
		});
	}, [app]);

	const handleSelectionChange = useCallback(
		(selectionEvent: Event) => {
			const selection = window.getSelection();
			if (!selection) {
				return;
			}
			app.mapViewSelectionToModelRange(selection);
			// if (ref.current.contains(selection.anchorNode)) {
			// 	console.log(
			// 		'selection',
			// 		selection,
			// 		'starts in HTML domNode',
			// 		ref.current,
			// 		'starts in XML domNode',
			// 		node
			// 	);
			// }
			// if (ref.current.contains(selection.focusNode)) {
			// 	console.log(
			// 		'selection',
			// 		selection,
			// 		'ends in HTML domNode',
			// 		ref.current,
			// 		'ends in XML domNode',
			// 		node
			// 	);
			// }
		},
		[app]
	);

	useEffect(() => {
		window.document.addEventListener(
			'selectionchange',
			handleSelectionChange
		);

		return () => {
			window.document.removeEventListener(
				'selectionchange',
				handleSelectionChange
			);
		};
	}, [handleSelectionChange]);

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	return (
		<div css={styles} data-test-id="app">
			<AppHeader />

			<div
				css={css`
					flex: 1;
					padding: 0 1rem 1rem 0;
					margin-bottom: 1rem;
					overflow-y: auto;
				`}
				ref={scrollContainerRef}
			>
				<ScrollContainerContext.Provider
					value={scrollContainerRef.current}
				>
					{parseResult?.documentElement && (
						<DocumentElementRenderer
							documentElement={parseResult.documentElement}
							onAfterInitialRender={setInitialRenderTime}
						/>
					)}
				</ScrollContainerContext.Provider>
			</div>

			<Profiler
				fetchTime={parseResult?.fetchTime}
				fileSize={parseResult?.fileSize}
				initialRenderTime={initialRenderTime}
				parseTime={parseResult?.parseTime}
			/>
		</div>
	);
}

export default App;
