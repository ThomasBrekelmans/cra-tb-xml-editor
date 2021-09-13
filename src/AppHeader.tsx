/** @jsxImportSource @emotion/react */

import {
	evaluateUpdatingExpression,
	executePendingUpdateList
} from 'fontoxpath';
import { useCallback, useContext } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import logo from './logo.svg';
import AppContext from './model/AppContext';

const styles = css`
	flex: none;
	align-self: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const AppLogo = styled.img`
	height: 40vmin;
	pointer-events: none;

	@keyframes App-logo-spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		animation: App-logo-spin infinite 20s linear;
	}
`;

const AppHeader = () => {
	const app = useContext(AppContext);

	const handleClick = useCallback(() => {
		console.log(`handleClick() logo`);

		evaluateUpdatingExpression(
			'replace node //p[1] with <p>test</p>',
			app.xmlDocument?.documentElement
		).then(result => {
			console.log(
				`handleClick() > update expression result for logo`,
				result
			);
			executePendingUpdateList(result.pendingUpdateList);
			console.log(
				`handleClick() > done updating for logo, documentElement`,
				app.xmlDocument?.documentElement
			);
		});
	}, [app.xmlDocument?.documentElement]);

	return (
		<header css={styles} onClick={handleClick}>
			<AppLogo src={logo} alt="logo" />
		</header>
	);
};

export default AppHeader;
