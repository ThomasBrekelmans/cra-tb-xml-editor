/** @jsxImportSource @emotion/react */

import { useContext, useEffect, useState } from 'react';
import { Element } from 'slimdom';

import { css } from '@emotion/react';

import AppHeader from './AppHeader';
import AppContext from './model/AppContext';
import DocumentElementRenderer from './xml-renderer/DocumentElementRenderer';

const styles = css`
	flex: 1;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

function App() {
	const app = useContext(AppContext);
	console.log('App app.id', app.id);
	console.log('App app.something', app.something);

	const [documentElement, setDocumentElement] = useState<Element | null>(
		null
	);

	useEffect(() => {
		app.parseXml().then(documentElement =>
			setDocumentElement(documentElement)
		);
	}, [app]);

	return (
		<div css={styles}>
			<AppHeader />

			{documentElement && (
				<DocumentElementRenderer documentElement={documentElement} />
			)}
		</div>
	);
}

export default App;
