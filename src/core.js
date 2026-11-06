export class YieldedTrie {
  constructor() {
    this.root = { children: new Map(), terminal: false };
  }

  insert(word) {
    if (typeof word !== 'string') {
      throw new TypeError('word must be a string');
    }
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, { children: new Map(), terminal: false });
      }
      node = node.children.get(ch);
    }
    node.terminal = true;
  }

  has(word) {
    if (typeof word !== 'string') {
      throw new TypeError('word must be a string');
    }
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        return false;
      }
      node = node.children.get(ch);
    }
    return node.terminal;
  }

  delete(word) {
    if (typeof word !== 'string') {
      throw new TypeError('word must be a string');
    }
    const path = [];
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        return false;
      }
      path.push({ parent: node, char: ch, node: node.children.get(ch) });
      node = node.children.get(ch);
    }
    if (!node.terminal) {
      return false;
    }
    node.terminal = false;
    for (let i = path.length - 1; i >= 0; i--) {
      const { parent, char, node: child } = path[i];
      if (child.terminal || child.children.size > 0) {
        break;
      }
      parent.children.delete(char);
    }
    return true;
  }

  *prefix(prefix) {
    if (typeof prefix !== 'string') {
      throw new TypeError('prefix must be a string');
    }
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) {
        return;
      }
      node = node.children.get(ch);
    }
    yield* this._collect(node, prefix);
  }

  *_collect(node, prefix) {
    if (node.terminal) {
      yield prefix;
    }
    for (const [ch, child] of node.children) {
      yield* this._collect(child, prefix + ch);
    }
  }
}
