/** @jsxImportSource @emotion/react */

import styled from '@emotion/styled';

import { currentId } from './model/getNodeId';

const Bar = styled.div`
	flex: none;
	padding: calc(1rem / 4);
	background-color: #1a1a1d;
	border-bottom: 1px solid #111113;
	display: flex;
	flex-direction: row;

	> * + * {
		border-left: 1px solid var(--text-color);
		padding-left: calc(1rem / 2);
		margin-left: calc(1rem / 2);
	}
`;

const Metric = styled.div`
	flex: none;
	display: flex;
	flex-direction: row;
	font-family: monospace;
	font-size: 0.75rem;
	line-height: 1;

	> * + * {
		margin-left: calc(1rem / 4);
	}
`;

const Label = styled.span`
	font-weight: 500;
`;

const Value = styled.span`
	letter-spacing: 1.1;
`;

const Unit = styled.span`
	font-style: italic;
`;

type Props = {
	fetchTime?: number;
	fileSize?: number;
	initialRenderTime?: number;
	parseTime?: number;
};
const Profiler = ({
	fetchTime,
	fileSize,
	initialRenderTime,
	parseTime
}: Props) => {
	return (
		<Bar data-test-id="profiler">
			<Metric>
				<Label>fetch:</Label>

				{fetchTime && (
					<Value>
						{fetchTime}
						<Unit>ms</Unit>
					</Value>
				)}
				{!fetchTime && <Value>pending…</Value>}

				{fileSize && (
					<Value>
						({fileSize} <Unit>characters</Unit>)
					</Value>
				)}
			</Metric>

			<Metric>
				<Label>parse:</Label>

				{parseTime && (
					<Value>
						{parseTime}
						<Unit>ms</Unit>
					</Value>
				)}
				{!parseTime && <Value>pending…</Value>}

				<Value>({currentId} nodes)</Value>
			</Metric>

			<Metric>
				<Label>initial render:</Label>

				{initialRenderTime && (
					<Value>
						{initialRenderTime}
						<Unit>ms</Unit>
					</Value>
				)}
				{!initialRenderTime && <Value>pending…</Value>}
			</Metric>
		</Bar>
	);
};

export default Profiler;
