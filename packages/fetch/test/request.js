import http from 'http';
import {TextEncoder} from 'util';

import AbortController from 'abort-controller';
import chai from 'chai';
import FormData from 'form-data';
import { Blob, ReadableStream, Request, FormData as WebFormData} from '@web-std/fetch';
import { File } from '@web-std/file';

import TestServer from './utils/server.js';

const {expect} = chai;

describe('Request', () => {
	const local = new TestServer();
	let base;

	before(async () => {
		await local.start();
		base = `http://${local.hostname}:${local.port}/`;
		global.File = File;
	});

	after(async () => {
		return local.stop();
	});

	it('should have attributes conforming to Web IDL', () => {
		const request = new Request('https://github.com/');
		const enumerableProperties = [];
		for (const property in request) {
			enumerableProperties.push(property);
		}

		for (const toCheck of [
			'body',
			'bodyUsed',
			'arrayBuffer',
			'blob',
			'json',
			'text',
			'method',
			'url',
			'headers',
			'redirect',
			'clone',
			'signal'
		]) {
			expect(enumerableProperties).to.contain(toCheck);
		}

		for (const toCheck of [
			'body', 'bodyUsed', 'method', 'url', 'headers', 'redirect', 'signal'
		]) {
			expect(() => {
				request[toCheck] = 'abc';
			}).to.throw();
		}
	});

	it('should support wrapping Request instance', () => {
		const url = `${base}hello`;

		const form = new FormData();
		form.append('a', '1');
		const {signal} = new AbortController();

		const r1 = new Request(url, {
			method: 'POST',
			follow: 1,
			body: form,
			signal
		});
		const r2 = new Request(r1, {
			follow: 2
		});

		expect(r2.url).to.equal(url);
		expect(r2.method).to.equal('POST');
		expect(r2.signal).to.equal(signal);
		// Note that we didn't clone the body
		expect(r2.body).to.instanceOf(ReadableStream);
		expect(r1.follow).to.equal(1);
		expect(r2.follow).to.equal(2);
		expect(r1.counter).to.equal(0);
		expect(r2.counter).to.equal(0);
	});

	it('should throw a TypeError for forbidden methods', () => {
		// https://fetch.spec.whatwg.org/#methods
		const forbiddenMethods = [
			"CONNECT",
			"TRACE",
			"TRACK",
		];

		forbiddenMethods.forEach(method => {
			try {
				new Request(base, { method: method.toLowerCase() });
				expect(true).to.equal(false);
			} catch (e) {
				expect(e instanceof TypeError).to.equal(true);
				expect(e.message).to.equal(`Failed to construct 'Request': '${method.toLowerCase()}' HTTP method is unsupported.`)
			}
			try {
				new Request(base, { method: method.toUpperCase() });
				expect(true).to.equal(false);
			} catch (e) {
				expect(e instanceof TypeError).to.equal(true);
				expect(e.message).to.equal(`Failed to construct 'Request': '${method.toUpperCase()}' HTTP method is unsupported.`)
			}
		});
	});

	it('should normalize method', () => {
		// https://fetch.spec.whatwg.org/#methods
		const shouldUpperCaseMethods = [
			"DELETE",
			"GET",
			"HEAD",
			"OPTIONS",
			"POST",
			"PUT",
		];
		const otherMethods = ["PATCH", "CHICKEN"];

		shouldUpperCaseMethods.forEach(method => {
			const r1 = new Request(base, { method: method.toLowerCase() });
			expect(r1.method).to.equal(method.toUpperCase());
			const r2 = new Request(base, { method: method.toUpperCase() });
			expect(r2.method).to.equal(method.toUpperCase());
		});

		otherMethods.forEach(method => {
			const r1 = new Request(base, { method: method.toLowerCase() });
			expect(r1.method).to.equal(method.toLowerCase());
			const r2 = new Request(base, { method: method.toUpperCase() });
			expect(r2.method).to.equal(method.toUpperCase());
		});
	});

	it('should override signal on derived Request instances', () => {
		const parentAbortController = new AbortController();
		const derivedAbortController = new AbortController();
		const parentRequest = new Request(`${base}hello`, {
			signal: parentAbortController.signal
		});
		const derivedRequest = new Request(parentRequest, {
			signal: derivedAbortController.signal
		});
		expect(parentRequest.signal).to.equal(parentAbortController.signal);
		expect(derivedRequest.signal).to.equal(derivedAbortController.signal);
	});

	it('should allow overriding signal on derived Request instances', () => {
		const parentAbortController = new AbortController();
		const parentRequest = new Request(`${base}hello`, {
			signal: parentAbortController.signal
		});
		const derivedRequest = new Request(parentRequest, {
			signal: null
		});
		expect(parentRequest.signal).to.equal(parentAbortController.signal);
		expect(derivedRequest.signal).to.not.equal(null);
		expect(derivedRequest.signal).to.not.equal(parentAbortController.signal);
	});


	it('should abort signal', () => {
		const controller = new AbortController();
		const request = new Request(base, {
			signal: controller.signal,
		});
		controller.abort();
		expect(request.signal.aborted).to.equal(true);
	});

	it('should abort signal after clone', () => {
		const controller = new AbortController();
		const request = new Request(base, {
			signal: controller.signal,
		});
		controller.abort();
		const clonedRequest = request.clone();
		expect(clonedRequest.signal.aborted).to.equal(true);
	});

	it('should default to "same-origin" as credentials', () => {
		const request = new Request(base)
		expect(request.credentials).to.equal('same-origin');
	})

	it('should respect custom credentials value', () => {
		expect(new Request(base, { credentials: 'omit'})).to.have.property('credentials', 'omit');
		expect(new Request(base, { credentials: 'include'})).to.have.property('credentials', 'include');
	})

	it('should throw error with GET/HEAD requests with body', () => {
		expect(() => new Request(base, {body: ''}))
			.to.throw(TypeError);
		expect(() => new Request(base, {body: 'a'}))
			.to.throw(TypeError);
		expect(() => new Request(base, {body: '', method: 'HEAD'}))
			.to.throw(TypeError);
		expect(() => new Request(base, {body: 'a', method: 'HEAD'}))
			.to.throw(TypeError);
		expect(() => new Request(base, {body: 'a', method: 'get'}))
			.to.throw(TypeError);
		expect(() => new Request(base, {body: 'a', method: 'head'}))
			.to.throw(TypeError);
	});

	it('should default to null as body', () => {
		const request = new Request(base);
		expect(request.body).to.equal(null);
		return request.text().then(result => expect(result).to.equal(''));
	});

	it('should support parsing headers', () => {
		const url = base;
		const request = new Request(url, {
			headers: {
				a: '1'
			}
		});
		expect(request.url).to.equal(url);
		expect(request.headers.get('a')).to.equal('1');
	});

	it('should support arrayBuffer() method', () => {
		const url = base;
		const request = new Request(url, {
			method: 'POST',
			body: 'a=1'
		});
		expect(request.url).to.equal(url);
		return request.arrayBuffer().then(result => {
			expect(result).to.be.an.instanceOf(ArrayBuffer);
			const string = String.fromCharCode.apply(null, new Uint8Array(result));
			expect(string).to.equal('a=1');
		});
	});

	it('should support text() method', () => {
		const url = base;
		const request = new Request(url, {
			method: 'POST',
			body: 'a=1'
		});
		expect(request.url).to.equal(url);
		return request.text().then(result => {
			expect(result).to.equal('a=1');
		});
	});

	it('should support json() method', () => {
		const url = base;
		const request = new Request(url, {
			method: 'POST',
			body: '{"a":1}'
		});
		expect(request.url).to.equal(url);
		return request.json().then(result => {
			expect(result.a).to.equal(1);
		});
	});

	it('should support blob() method', () => {
		const url = base;
		const request = new Request(url, {
			method: 'POST',
			body: Buffer.from('a=1')
		});
		expect(request.url).to.equal(url);
		return request.blob().then(result => {
			expect(result).to.be.an.instanceOf(Blob);
			expect(result.size).to.equal(3);
			expect(result.type).to.equal('');
		});
	});

	it('should support clone() method', () => {
		const url = base;
		const body = new ReadableStream({
			start(c) {
				c.enqueue('a=1');
				c.close();
			}
		});

		const agent = new http.Agent();
		const {signal} = new AbortController();
		const request = new Request(url, {
			body,
			method: 'POST',
			redirect: 'manual',
			headers: {
				b: '2'
			},
			follow: 3,
			compress: false,
			agent,
			signal
		});
		const cl = request.clone();
		expect(cl.url).to.equal(url);
		expect(cl.method).to.equal('POST');
		expect(cl.redirect).to.equal('manual');
		expect(cl.headers.get('b')).to.equal('2');
		expect(cl.follow).to.equal(3);
		expect(cl.compress).to.equal(false);
		expect(cl.method).to.equal('POST');
		expect(cl.counter).to.equal(0);
		expect(cl.agent).to.equal(agent);
		expect(cl.signal).to.equal(signal);
		// Clone body shouldn't be the same body
		expect(cl.body).to.not.equal(body);
		return Promise.all([cl.text(), request.text()]).then(results => {
			expect(results[0]).to.equal('a=1');
			expect(results[1]).to.equal('a=1');
		});
	});

	it('should support clone() method with null body', () => {
		const url = base;

		const agent = new http.Agent();
		const {signal} = new AbortController();
		const request = new Request(url, {
			method: 'POST',
			redirect: 'manual',
			headers: {
				b: '2'
			},
			follow: 3,
			compress: false,
			agent,
			signal
		});
		const cl = request.clone();
		expect(cl.url).to.equal(url);
		expect(cl.method).to.equal('POST');
		expect(cl.redirect).to.equal('manual');
		expect(cl.headers.get('b')).to.equal('2');
		expect(cl.follow).to.equal(3);
		expect(cl.compress).to.equal(false);
		expect(cl.method).to.equal('POST');
		expect(cl.counter).to.equal(0);
		expect(cl.agent).to.equal(agent);
		expect(cl.signal).to.equal(signal);
		// Clone body should be null
		expect(cl.body).to.equal(null);
	});

	it('should support ArrayBuffer as body', () => {
		const encoder = new TextEncoder();
		const request = new Request(base, {
			method: 'POST',
			body: encoder.encode('a=1').buffer
		});
		return request.text().then(result => {
			expect(result).to.equal('a=1');
		});
	});

	it('should support Uint8Array as body', () => {
		const encoder = new TextEncoder();
		const request = new Request(base, {
			method: 'POST',
			body: encoder.encode('a=1')
		});
		return request.text().then(result => {
			expect(result).to.equal('a=1');
		});
	});

	it('should support DataView as body', () => {
		const encoder = new TextEncoder();
		const request = new Request(base, {
			method: 'POST',
			body: new DataView(encoder.encode('a=1').buffer)
		});
		return request.text().then(result => {
			expect(result).to.equal('a=1');
		});
	});
  
it('should decode empty file inputs into File instances (web FormData)', async () => {
		const ogFormData = new WebFormData();
		ogFormData.append('a', 1);
		// This is what happens when you construct the form data set with an empty file input:
		// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constructing-the-form-data-set
		ogFormData.append('file', new File([], '', { type: 'application/octet-stream' }));
		const request = new Request(base, {
			method: 'POST',
			body: ogFormData,
		});
		const clonedRequest = request.clone();
		return clonedRequest.formData().then(async clonedFormData => {
			expect(clonedFormData.get('a')).to.equal("1");
			const file = clonedFormData.get('file');
			expect(file.name).to.equal("");
			expect(file.type).to.equal("application/octet-stream");
			expect(file.size).to.equal(0);
		});
	});

	it.skip('should decode empty file inputs into File instances (node FormData)', async () => {
		const ogFormData = new FormData();
		ogFormData.append('a', 1);
		// This is what happens when you construct the form data set with an empty file input:
		// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constructing-the-form-data-set
		ogFormData.append('file', Buffer.from(''), {
			// Note: This doesn't work at the moment due to https://github.com/form-data/form-data/issues/412.
			// There is a v4 released which has a fix that might handle this but I
			// wasn't positive if it had breaking changes that would impact us so we
			// can handle an upgrade separately.
			filename: '',
			contentType: 'application/octet-stream',
		});
		const request = new Request(base, {
			method: 'POST',
			body: ogFormData,
		});
		const clonedRequest = request.clone();
		return clonedRequest.formData().then(async clonedFormData => {
			expect(clonedFormData.get('a')).to.equal("1");
			const file = clonedFormData.get('file');
			expect(file.name).to.equal("");
			expect(file.type).to.equal("application/octet-stream");
			expect(file.size).to.equal(0);
		});

	});

	it('should read formData after clone with web FormData body',async () => {
		const ogFormData = new WebFormData();
		ogFormData.append('a', 1);
		ogFormData.append('b', 2);
		ogFormData.append('file', new File(['content'], 'file.txt'));

		const request = new Request(base, {
			method: 'POST',
			body: ogFormData,
		});
		const clonedRequest = request.clone();

		return clonedRequest.formData().then(async clonedFormData => {
			expect(clonedFormData.get('a')).to.equal("1");
			expect(clonedFormData.get('b')).to.equal("2");
			const file = clonedFormData.get('file')
			if (typeof file !== "object") {
				throw new Error("File is not an object");
			}
			expect(file.name).to.equal("file.txt");
			expect(file.type).to.equal("application/octet-stream");
			expect(file.size).to.equal(7);
			expect(await file.text()).to.equal("content");
			expect(file.lastModified).to.be.a('number');
		});
	});

	it('should read formData after clone with node FormData body',async () => {
		const ogFormData = new FormData();
		ogFormData.append('a', '1');
		ogFormData.append('b', '2');
		ogFormData.append('file', Buffer.from('content'), { filename: "file.txt" });

		const request = new Request(base, {
			method: 'POST',
			body: ogFormData,
		});
		const clonedRequest = request.clone();

		return clonedRequest.formData().then(async clonedFormData => {
			expect(clonedFormData.get('a')).to.equal("1");
			expect(clonedFormData.get('b')).to.equal("2");
			const file = clonedFormData.get('file')
			if (typeof file !== "object") {
				throw new Error("File is not an object");
			}
			expect(file.name).to.equal("file.txt");
			expect(file.type).to.equal("text/plain");
			expect(file.size).to.equal(7);
			expect(await file.text()).to.equal("content");
			expect(file.lastModified).to.be.a('number');
		});
	});
});