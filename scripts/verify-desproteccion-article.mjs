import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const article = JSON.parse(readFileSync(new URL('lib/articles.json', root), 'utf8')).academic
  .find(item => item.id === 'desproteccion-institucionalizacion-y-gobierno-infancia');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const publicFile = path => readFileSync(new URL(`public${path}`, root));

test('the restored paper includes every section, reference, and footnote', () => {
  assert.ok(article.title.endsWith('Michel Foucault'));
  const sections = article.content.filter(line => /^\d+(?:\.\d+)*\.\s/.test(line));
  assert.deepEqual(sections.map(line => line.split(' ')[0]), [
    '1.', '1.1.', '1.2.', '1.3.', '1.4.', '1.5.', '1.6.', '1.7.', '1.8.', '1.9.',
    '2.', '2.1.', '2.2.', '2.3.', '2.4.', '3.',
  ]);
  const references = article.content.slice(article.content.indexOf('3. Referencias bibliográficas') + 1);
  assert.equal(references.length, 40);
  assert.match(references.at(-1), /^Vial, M\. C\./);
  assert.deepEqual(article.footnotes.map(note => note.id), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.ok(article.content.some(line => line.startsWith('Analizar la desprotección')));
  assert.ok(article.content.some(line => line.startsWith('Nuestro trabajo ha subrayado')));
  assert.equal(article.content.filter(line => line.startsWith('> ')).length, 4);
});

test('the image and unchanged original PDF are available locally', () => {
  assert.equal(publicFile(article.image).subarray(1, 4).toString(), 'PNG');
  assert.equal(publicFile(article.publication.pdf).subarray(0, 5).toString(), '%PDF-');
  assert.equal(hash(publicFile(article.publication.pdf)), 'ee01ca1491993e37db321e13ea830123b5a0b8cc67896ac240234d22c34bf171');
  assert.equal(article.publication.doi, '10.5209/soci.68287');
  assert.equal(article.date, '2020');
});

if (process.env.ARTICLE_TEST_ORIGIN) {
  const origin = process.env.ARTICLE_TEST_ORIGIN;
  test('the served article renders every content block and all notes', async () => {
    const response = await fetch(`${origin}/trabajos-intelectuales/${article.id}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    // Ignore scripts so serialized React props cannot masquerade as visible content.
    const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const compact = text => text.replace(/\s+/g, '');
    for (const line of article.content) {
      if (line.startsWith('PALABRAS CLAVE:')) continue;
      const expected = line.replace(/^##\s+|^>\s+/, '').replace(/\[(\d+)\]/g, '$1');
      assert.ok(compact(visible).includes(compact(expected)), `Missing rendered block: ${line.slice(0, 100)}`);
    }
    for (const note of article.footnotes) assert.ok(compact(visible).includes(compact(note.text)));
    assert.ok(visible.includes(article.title));
    assert.ok(!visible.includes('michel foucault'));
    assert.ok(html.includes('id="referencias"'));
    assert.ok(html.includes('id="nota-8"'));
  });
  test('the deployed image and source PDF match the verified files', async () => {
    for (const path of [article.image, article.publication.pdf]) {
      const response = await fetch(`${origin}${path}`);
      assert.equal(response.status, 200);
      assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(publicFile(path)));
    }
  });
}
