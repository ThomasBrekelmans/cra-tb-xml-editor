import styled from '@emotion/styled';

import { TemplateProps } from '../model/App';

const Fallback = styled.span`
	color: red;
	font-size: 1rem;
	line-height: 1.5;
`;

const FallbackTemplate = ({ children, element }: TemplateProps) => {
	//
	return (
		<Fallback
			data-test-id="fallback-template"
			data-element-name={element.nodeName}
		>
			{children}
		</Fallback>
	);
};

export default FallbackTemplate;
