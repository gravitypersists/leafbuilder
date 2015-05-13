const _ = require('lodash');
const $ = require('jquery');
const LayerEditor = require('./layer-editor.js');

// A sort of "view-model" but "view-collection" having a tree structure
class LayerTree {

  constructor() {
    // worth noting that this.data structure is self-referential, so cannot be stringified 
    this.data = null;
    this.shiftOn = false;
  }

  // nodeString looks like "3.0.1.3"
  addLayer(nodeString, $el) {
    let editor = new LayerEditor($el);

    let node = null;
    let split = nodeString.split('.');
    if (split.length == 1) {
      // manually construct top level data structure
      this.data = { children: [] };
      node = { $el, editor, parentNode:this.data, children: [] };
      this.data.children[nodeString] = node;
    } else {
      // traverse the tree to get the parent node, then add it to the structure
      let parentNode = _.reduce(_.initial(split), (res, n) => res.children[n], this.data);
      node = { $el, editor, parentNode, children: [] };
      parentNode.children[_.last(split)] = node;
    }

    editor.on('hovered', (e) => this.handleChildHoveredOver(node));
  }

  toggleShift(bool) {
    this.shiftOn = (bool !== undefined) ? bool : !this.shiftOn;
    $(document.body).css('background-color', (this.shiftOn) ? '#ccc' : '#fff');
    if (this.currentHover) this.handleChildHoveredOver(this.currentHover);
  }

  handleChildHoveredOver(node) {
    this.currentHover = node;
    if (this.shiftOn) {
      this.traverseChildren(node.children, 0);
    }
  }

  traverseChildren(children, depth) {
    _.each(children, (child) => {
      child.editor.setDepth(depth);
      this.traverseChildren(child.children, ++depth);
    });
  }

}

module.exports = LayerTree;