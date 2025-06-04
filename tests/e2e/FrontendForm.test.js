const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');

let dom;

beforeAll(() => {
  const html = fs.readFileSync(path.join(__dirname, 'form.html'), 'utf8');
  dom = new JSDOM(html, { url: 'http://localhost' });

  global.window = dom.window;
  global.document = dom.window.document;
  global.FormData = dom.window.FormData;
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ success: true }) }));
  global.igpr_params = { ajax_url: '/ajax', nonce: '123', i18n: { submit_error: 'error' } };
  global.window.scrollTo = jest.fn();
});

afterAll(() => {
  dom.window.close();
});

test('frontend script loads without errors', () => {
  expect(() => {
    require('../../build/frontend.js');
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
  }).not.toThrow();
});
