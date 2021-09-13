import { evaluateXPathToBoolean } from 'fontoxpath';
import { ComponentType, ReactNode } from 'react';
import * as slimdom from 'slimdom';
import { async } from 'slimdom-sax-parser';

import FallbackTemplate from '../templates/FallbackTemplate';
import { nodeByNodeId } from './getNodeId';

let id = 0;

export type ParseXmlResult = {
	documentElement: slimdom.Element | null;
	fileSize: number;
	fetchTime: number;
	parseTime: number;
};

export type TemplateProps = {
	children: ReactNode;
	element: slimdom.Element;
	nodeId: number;
	[otherProp: string]: any;
};

export class App {
	public readonly id: number = ++id;

	public fetchTime: number = 0;
	public parseTime: number = 0;
	public initialRenderTime: number = 0;

	public fileSize: number = 0;

	public xmlDocument: slimdom.Document | null = null;

	public selectionRange: slimdom.Range | null = null;

	public templates: {
		xPathTest: string;
		Component: ComponentType<TemplateProps>;
	}[] = [];

	public async parseXml(): Promise<ParseXmlResult> {
		this.fetchTime = 0;
		performance.mark('fetchXmlStart');

		const xmlFileResponse = await fetch('/assets/test.xml');

		const xmlFileContents = await xmlFileResponse.text();

		this.fileSize = xmlFileContents.length;

		performance.mark('fetchXmlEnd');
		this.fetchTime =
			Math.round(
				performance.measure(
					'fetchXmlTime',
					'fetchXmlStart',
					'fetchXmlEnd'
				).duration * 1000
			) / 1000;

		this.parseTime = 0;
		performance.mark('parseXmlStart');

		this.xmlDocument = await async(xmlFileContents, {
			position: false,
			xmlns: true
		});

		performance.mark('parseXmlEnd');
		this.parseTime =
			Math.round(
				performance.measure(
					'parseXmlTime',
					'parseXmlStart',
					'parseXmlEnd'
				).duration * 1000
			) / 1000;

		return {
			documentElement: this.xmlDocument.documentElement,
			fileSize: this.fileSize,
			fetchTime: this.fetchTime,
			parseTime: this.parseTime
		};
	}

	addTemplate(xPathTest: string, Component: ComponentType<TemplateProps>) {
		this.templates.push({ xPathTest, Component });
	}

	getTemplateForElement(
		element: slimdom.Element
	): ComponentType<TemplateProps> {
		let template = this.templates.find(({ xPathTest }) => {
			const result = evaluateXPathToBoolean(xPathTest, element);
			return result;
		});
		if (!template) {
			return FallbackTemplate;
		}
		return template.Component;
	}

	mapViewSelectionToModelRange(selection: Selection): slimdom.Range | null {
		if (
			// incomplete selection?
			!selection.anchorNode ||
			!selection.focusNode ||
			// detached selection?
			!selection.anchorNode.ownerDocument ||
			!selection.focusNode.ownerDocument
		) {
			// weird, ignore (also, type guards)
			this.selectionRange = null;
			return null;
		}

		const anchorElement =
			selection.anchorNode.nodeType === selection.anchorNode.ELEMENT_NODE
				? (selection.anchorNode as Element)
				: (selection.anchorNode.parentElement as Element);
		const anchorNodeIdAttribute = anchorElement
			.closest('[data-node-id]')
			?.getAttribute('data-node-id');

		const focusElement =
			selection.focusNode.nodeType === selection.focusNode.ELEMENT_NODE
				? (selection.focusNode as Element)
				: (selection.focusNode.parentElement as Element);
		const focusNodeIdAttribute = focusElement
			.closest('[data-node-id]')
			?.getAttribute('data-node-id');

		if (!anchorNodeIdAttribute || !focusNodeIdAttribute) {
			// non-mappable selection (eg. to UI elements that are not a template for an XML node), ignore.
			this.selectionRange = null;
			return null;
		}
		const anchorNodeId = parseInt(anchorNodeIdAttribute, 10);
		const focusNodeId = parseInt(focusNodeIdAttribute, 10);

		const anchorNode = nodeByNodeId.get(anchorNodeId);
		const focusNode = nodeByNodeId.get(focusNodeId);
		if (!anchorNode || !focusNode) {
			// non-mappable selection, weird, ignore.
			this.selectionRange = null;
			return null;
		}

		this.selectionRange = new slimdom.Range();
		this.selectionRange.setStart(anchorNode, selection.anchorOffset);
		this.selectionRange.setEnd(focusNode, selection.focusOffset);

		return this.selectionRange;
	}
}

export const app = new App();
