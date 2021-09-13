import styled from '@emotion/styled';

import { TemplateProps } from '../model/App';

const Block = styled.div`
	display: block;
`;

const BlockTemplate = ({
	children,
	element,
	nodeId,
	...otherProps
}: TemplateProps) => {
	//
	return (
		<Block
			data-test-id="block-template"
			data-node-id={nodeId}
			data-element-name={element.nodeName}
			{...otherProps}
		>
			{children}
		</Block>
	);
};

export default BlockTemplate;
