import React from 'react';
import ReactDOM from 'react-dom';

import createCache from '@emotion/cache';
import { CacheProvider, Global, css } from '@emotion/react';

import App from './App';
import { app } from './model/App';
import AppContext from './model/AppContext';
import reportWebVitals from './reportWebVitals';

const emotionCache = createCache({
	key: 'css',
	// get rid of the prefixer (otherwise you get -webkit-flex etc.)
	stylisPlugins: []
});

const styles = css`
	* {
		box-sizing: border-box;
	}

	html {
		font-size: 16px;
		line-height: 1;
	}

	body {
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		overflow-y: hidden;
		background-color: #202124;

		--text-color: #bcc0c3;

		color: var(--text-color);
		font-family: arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	#root {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		overflow-y: hidden;
	}
`;

ReactDOM.render(
	<React.StrictMode>
		<CacheProvider value={emotionCache}>
			<AppContext.Provider value={app}>
				<Global styles={styles} />

				<App />
			</AppContext.Provider>
		</CacheProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
