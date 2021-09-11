import { Document, Element } from 'slimdom';
import { async } from 'slimdom-sax-parser';

let id = 0;

export class App {
	public readonly id: number;

	public xmlDocument: Document | null = null;

	public something = 'empty';

	constructor() {
		this.id = ++id;
	}

	public async parseXml(
		xml = '<?xml version="1.0" encoding="UTF-8" ?><topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:fontoxml:names:tc:dita:xsd:topic.xsd:1.3"><title>Example</title><body><p>Example text</p></body></topic>'
	): Promise<Element | null> {
		this.xmlDocument = await async(xml, {
			position: false,
			xmlns: true
		});

		return this.xmlDocument.documentElement;
	}
}

export const app = new App();
