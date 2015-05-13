const _ = require('lodash');
const LayerEditor = require('./layer-editor.js');

// A sort of "view-model" but "view-collection" having a tree structure
class LayerTree {

  constructor() {
    this.data = null;
    this.shiftOn = false;
  }

  // nodeString looks like "3.0.1.3"
  addLayer(nodeString, $el) {
    let editor = new LayerEditor($el);

    let split = nodeString.split('.');
    if (split.length == 1) {
      // manually construct top level data structure
      this.data = { children: [] };
      this.data.children[nodeString] = { $el, editor, parentNode:this.data, children: [] };
    } else {
      // traverse the tree to get the parent node, then add it to the structure
      let parentNode = _.reduce(_.initial(split), (res, n) => res.children[n], this.data);
      // worth noting that this data structure is self-referential, so cannot be stringified 
      parentNode.children[_.last(split)] = { $el, editor, parentNode, children: [] };
    }

    editor.on('hovered', () => {
      console.log('x');
    });
  }

}

module.exports = LayerTree;