const _ = require('lodash');
const $ = require('jquery');
const LayerEditor = require('./layer-editor.js');

// A sort of "view-model" but "view-collection" having a tree structure
class LayerTree {

  constructor(leaf, $el, config, toolbox, $detachments) {
    this.$el = $el;
    this.toolbox = toolbox;
    this.config = config;
    // worth noting that this.data structure is self-referential,
    // so cannot be serialized 
    this.data = null;
  }

  // nodeString looks like "3.0.1.3"
  addLayer(nodeString, $childEl) {
    $childEl.wrap('<div class="leafbuilder-container"></div>');
    let $el = $childEl.parent();
    let editor = new LayerEditor($el, this.config, this.toolbox);

    let node = null;
    let split = nodeString.split('.');
    if (split.length == 1) {
      // manually construct top level data structure
      this.data = { children: {} };
      node = { $el, editor, parentNode:this.data, children: {}, top: true };
      this.data.children[nodeString] = node;
      editor.preventHoverables();
    } else {
      // traverse the tree to get the parent node, then add it to the structure
      let parentNode = _.reduce(_.initial(split), (res, n) => res.children[n], this.data);
      node = { $el, editor, parentNode, children: {} };
      parentNode.children[_.last(split)] = node;
    }

    editor.on('hoverIn', (e) => this.handleChildHoveredIn(node));
    editor.on('hoverOut', (e) => this.handleChildHoveredOut(node));
  }


  escape() {
    this.clearHoverClasses();
    this.$el.removeClass('editing-layer');
  }

  handleChildHoveredIn(node) {
    this.currentHover = node;
    this.clearHoverClasses();
    if (node.editor && !node.top) node.editor.setHovered();
  }

  handleChildHoveredOut(node) {
    this.clearHoverClasses();
    this.handleChildHoveredIn(node.parentNode);
  }

  clearHoverClasses(node) {
    node = node || this.data;
    _.each(node.children, (child) => {
      child.editor.resetClasses();
      this.clearHoverClasses(child);
    });
  }


}

module.exports = LayerTree;