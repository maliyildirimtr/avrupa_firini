import { test } from 'node:test';
import assert from 'node:assert/strict';
import { instagramModu, instagramHTML, YEDEK_SURE_MS } from '../js/instagram.js';

const url = 'https://www.instagram.com/avrupafirini/';

test('kapalıyken gizli ve boş', () => {
  assert.equal(instagramModu({ acik: false, feedId: 'abc' }), 'gizli');
  assert.equal(instagramHTML('gizli', {}, url), '');
});

test('açık ama feedId boş ya da boşluksa gizli', () => {
  assert.equal(instagramModu({ acik: true, feedId: '' }), 'gizli');
  assert.equal(instagramModu({ acik: true, feedId: '   ' }), 'gizli');
  assert.equal(instagramModu({ acik: true }), 'gizli');
});

test('açık ve feedId doluysa akış', () => {
  const ayar = { acik: true, feedId: 'abc' };
  assert.equal(instagramModu(ayar), 'akis');
  const h = instagramHTML('akis', ayar, url);
  assert.ok(h.includes('feed-id="abc"'));
  assert.ok(h.includes(url));
});

test('feedId kaçırılır', () => {
  const h = instagramHTML('akis', { acik: true, feedId: 'a"><script>' }, url);
  assert.ok(!h.includes('<script>'));
});

test('yedek bekleme süresi 8 saniye', () => {
  assert.equal(YEDEK_SURE_MS, 8000);
});
