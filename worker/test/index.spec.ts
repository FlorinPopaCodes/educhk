import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('educhk worker', () => {
	describe('routing', () => {
		it('returns 400 for root path', async () => {
			const response = await SELF.fetch('https://example.com/');
			expect(response.status).toBe(400);
			const body = await response.json();
			expect(body).toHaveProperty('error');
		});

		it('returns 400 for empty path', async () => {
			const response = await SELF.fetch('https://example.com');
			expect(response.status).toBe(400);
		});

		it('returns 200 with JSON content-type and cache headers', async () => {
			const response = await SELF.fetch('https://example.com/stanford.edu');
			expect(response.status).toBe(200);
			expect(response.headers.get('content-type')).toBe('application/json');
			expect(response.headers.get('cache-control')).toBe('public, max-age=86400');
		});
	});

	describe('academic domains', () => {
		it('identifies stanford.edu as academic', async () => {
			const response = await SELF.fetch('https://example.com/stanford.edu');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('stanford.edu');
			expect(body.academic).toBe(true);
			expect(body.abused).toBe(false);
		});

		it('identifies gla.ac.uk as academic', async () => {
			const response = await SELF.fetch('https://example.com/gla.ac.uk');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('gla.ac.uk');
			expect(body.academic).toBe(true);
		});

		it('identifies usask.ca as academic', async () => {
			const response = await SELF.fetch('https://example.com/usask.ca');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('usask.ca');
			expect(body.academic).toBe(true);
		});

		it('identifies fu-berlin.de as academic', async () => {
			const response = await SELF.fetch('https://example.com/fu-berlin.de');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('fu-berlin.de');
			expect(body.academic).toBe(true);
		});

		it('identifies hdm-stuttgart.de as academic', async () => {
			const response = await SELF.fetch('https://example.com/hdm-stuttgart.de');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('hdm-stuttgart.de');
			expect(body.academic).toBe(true);
		});

		it('identifies hil.no as academic', async () => {
			const response = await SELF.fetch('https://example.com/hil.no');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('hil.no');
			expect(body.academic).toBe(true);
		});
	});

	describe('non-academic domains', () => {
		it('identifies gmail.com as non-academic and abused', async () => {
			const response = await SELF.fetch('https://example.com/gmail.com');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('gmail.com');
			expect(body.academic).toBe(false);
			expect(body.abused).toBe(true);
		});

		it('identifies google.com as non-academic', async () => {
			const response = await SELF.fetch('https://example.com/google.com');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('google.com');
			expect(body.academic).toBe(false);
		});

		it('identifies bvb.de as non-academic', async () => {
			const response = await SELF.fetch('https://example.com/bvb.de');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('bvb.de');
			expect(body.academic).toBe(false);
		});
	});

	describe('edge cases', () => {
		it('handles subdomain of academic domain', async () => {
			const response = await SELF.fetch('https://example.com/cs.stanford.edu');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.domain).toBe('cs.stanford.edu');
			expect(body.academic).toBe(true);
		});

		it('is case-insensitive', async () => {
			const response = await SELF.fetch('https://example.com/Stanford.EDU');
			const body = await response.json<{ domain: string; academic: boolean; abused: boolean }>();
			expect(body.academic).toBe(true);
		});
	});
});
