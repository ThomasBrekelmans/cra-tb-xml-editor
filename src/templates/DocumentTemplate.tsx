import styled from '@emotion/styled';

import { TemplateProps } from '../model/App';

const Document = styled.div`
	display: block;
`;

const DocumentTemplate = ({
	children,
	element,
	nodeId,
	...otherProps
}: TemplateProps) => {
	//
	return (
		<Document
			data-test-id="document-template"
			data-node-id={nodeId}
			data-element-name={element.nodeName}
			{...otherProps}
		>
			{children}
		</Document>
	);
};

export default DocumentTemplate;
