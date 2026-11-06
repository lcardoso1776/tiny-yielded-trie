import { test } from 'node:test';
import assert from 'node:assert/strict';
import { YieldedTrie } from '../src/index.js';

test('empty trie has no words', () => {
  const t = new YieldedTrie();
  assert.equal(t.has(''), false);
  assert.equal(t.has('a'), false);
  assert.deepEqual([...t.prefix('')], []);
});

test('insert and has', () => {
  const t = new YieldedTrie();
  t.insert('apple');
  assert.equal(t.has('apple'), true);
  assert.equal(t.has('app'), false);
  assert.equal(t.has('apples'), false);
  assert.equal(t.has(''), false);
});

test('insert empty string', () => {
  const t = new YieldedTrie();
  t.insert('');
  assert.equal(t.has(''), true);
  assert.deepEqual([...t.prefix('')], ['']);
});

test('prefix query returns all words with prefix', () => {
  const t = new YieldedTrie();
  t.insert('apple');
  t.insert('app');
  t.insert('apricot');
  t.insert('banana');
  assert.deepEqual([...t.prefix('ap')].sort(), ['app', 'apple', 'apricot']);
  assert.deepEqual([...t.prefix('app')].sort(), ['app', 'apple']);
  assert.deepEqual([...t.prefix('b')].sort(), ['banana']);
  assert.deepEqual([...t.prefix('z')], []);
});

test('prefix on empty string returns all words', () => {
  const t = new YieldedTrie();
  t.insert('a');
  t.insert('b');
  assert.deepEqual([...t.prefix('')].sort(), ['a', 'b']);
});

test('delete existing word', () => {
  const t = new YieldedTrie();
  t.insert('apple');
  assert.equal(t.delete('apple'), true);
  assert.equal(t.has('apple'), false);
  assert.deepEqual([...t.prefix('')], []);
});

test('delete non-existent word', () => {
  const t = new YieldedTrie();
  t.insert('apple');
  assert.equal(t.delete('app'), false);
  assert.equal(t.has('apple'), true);
});

test('delete word that is prefix of another', () => {
  const t = new YieldedTrie();
  t.insert('app');
  t.insert('apple');
  assert.equal(t.delete('app'), true);
  assert.equal(t.has('app'), false);
  assert.equal(t.has('apple'), true);
  assert.deepEqual([...t.prefix('app')], ['apple']);
});

test('delete word that has prefix already deleted', () => {
  const t = new YieldedTrie();
  t.insert('app');
  t.insert('apple');
  assert.equal(t.delete('app'), true);
  assert.equal(t.delete('apple'), true);
  assert.equal(t.has('apple'), false);
  assert.deepEqual([...t.prefix('')], []);
});

test('delete word with shared prefix does not remove sibling', () => {
  const t = new YieldedTrie();
  t.insert('apple');
  t.insert('apricot');
  assert.equal(t.delete('apple'), true);
  assert.equal(t.has('apple'), false);
  assert.equal(t.has('apricot'), true);
  assert.deepEqual([...t.prefix('ap')], ['apricot']);
});

test('insert duplicate does not change state', () => {
  const t = new YieldedTrie();
  t.insert('a');
  t.insert('a');
  assert.equal(t.has('a'), true);
  assert.deepEqual([...t.prefix('a')], ['a']);
  assert.equal(t.delete('a'), true);
  assert.equal(t.delete('a'), false);
});

test('non-string arguments throw TypeError', () => {
  const t = new YieldedTrie();
  assert.throws(() => t.insert(123), TypeError);
  assert.throws(() => t.has(null), TypeError);
  assert.throws(() => t.delete(undefined), TypeError);
  assert.throws(() => [...t.prefix(42)], TypeError);
});

test('prefix returns a generator', () => {
  const t = new YieldedTrie();
  t.insert('a');
  const gen = t.prefix('');
  assert.equal(typeof gen.next, 'function');
  assert.deepEqual(gen.next(), { value: 'a', done: false });
  assert.deepEqual(gen.next(), { value: undefined, done: true });
});
