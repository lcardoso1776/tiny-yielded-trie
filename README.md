# tiny-yielded-trie

A dynamic set of strings that supports character-by-character insertion, membership tests, prefix queries, and deletion.

```js
import { YieldedTrie } from './src/index.js';

const trie = new YieldedTrie();
trie.insert('apple');
trie.insert('app');
trie.insert('apricot');

console.log(trie.has('app')); // true
console.log(trie.has('apples')); // false

for (const word of trie.prefix('ap')) {
  console.log(word); // app, apple, apricot (order may vary)
}

trie.delete('app');
console.log(trie.has('app')); // false
console.log(trie.has('apple')); // true
```

## Why this exists

A trie stores strings by sharing prefixes, so a prefix query costs time proportional to the prefix length plus the number of matches, not the size of the whole set. The trade-off is memory: every distinct prefix path becomes a node. This implementation keeps nodes small (a `Map` of children plus a terminal flag) and does not store counts or subtree sizes, which keeps insertion and deletion simple at the cost of not being able to answer rank or select queries.

The prefix iterator is a generator, so it is lazy: you can stop early without walking the whole subtree.

## API

- `new YieldedTrie()`
- `insert(word)` — adds `word` to the set. Duplicate inserts are harmless.
- `has(word)` — returns `true` if `word` is in the set.
- `delete(word)` — removes `word` and returns `true` if it was present, `false` otherwise. It also prunes now-empty branches.
- `prefix(prefix)` — returns a generator yielding every word in the set that starts with `prefix`. Passing `''` yields every word.

All methods throw a `TypeError` if given a non-string argument.

## Edge case worth knowing

Deleting a word that is itself a prefix of another word (for example `app` when `apple` is also present) removes only the terminal marker; the branch stays because `apple` still needs it. Deleting `apple` afterwards then removes the remaining branch. This is the intended behaviour and is covered by the tests.
