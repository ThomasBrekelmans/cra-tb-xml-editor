import styled from '@emotion/styled';

import { TemplateProps } from '../model/App';

const Title = styled.h1`
	padding: 0;
	margin: 0 1rem 0 0;
	font-size: 3rem;
	line-height: 1.25;
	font-weight: 700;
`;

const TitleTemplate = ({
	children,
	element,
	nodeId,
	...otherProps
}: TemplateProps) => {
	//
	return (
		<Title
			data-test-id="title-template"
			data-node-id={nodeId}
			data-element-name={element.nodeName}
			{...otherProps}
		>
			{children}
		</Title>
	);
};

export default TitleTemplate;
