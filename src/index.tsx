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
	html {
		font-size: 16px;
	}

	body {
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		background-color: #282c34;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
			'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
			'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	#root {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
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
