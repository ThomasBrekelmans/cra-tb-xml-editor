import styled from '@emotion/styled';

import { TemplateProps } from '../model/App';

const Paragraph = styled.p`
	padding: 0;
	margin: 0 1rem 0 0;
	font-size: 1rem;
	line-height: 1.5;
`;

const ParagraphTemplate = ({
	children,
	element,
	nodeId,
	...otherProps
}: TemplateProps) => {
	//
	return (
		<Paragraph
			data-test-id="paragraph-template"
			data-node-id={nodeId}
			data-element-name={element.nodeName}
			{...otherProps}
		>
			{children}
		</Paragraph>
	);
};

export default ParagraphTemplate;
