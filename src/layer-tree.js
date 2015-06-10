const _ = require('lodash');
const $ = require('jquery');
const mixin = require('./util/mixin');
const events = require('./util/events');
const LayerEditor = require('./layer-editor.js');

// A sort of "view-model" but "view-collection" having a tree structure
class LayerTree extends mixin(class Base{}, events) {

  constructor(leaf, $el, config, toolbox, quickPicker) {
    super();
    this.$el = $el;
    this.toolbox = toolbox;
    this.quickPicker = quickPicker;
    this.config = config;
    // worth noting that this.data structure is self-referential,
    // so cannot be serialized 
    this.data = null;
    // a stack for keeping track of editors, layer and element, hovers
    this.hoverStack = [];
    // Self-explanatory
    this.editMode = true;
  }

  loadElementsIntoTree() {
    let elements = this.$el[0].querySelectorAll('* /deep/ .leaf-layer');
    _.each(elements, (el, i) => {
      var node = el.getAttribute('data-leaf-node');
      this.addLayer(node.split(':')[0], $(el));
    });
  }

  // nodeString looks like "3.0.1.3"
  addLayer(nodeString, $childEl) {
    $childEl.wrap('<div class="leafbuilder-container"></div>');
    let $el = $childEl.parent();
    let editor = new LayerEditor($el, this.config, this.toolbox, this.quickPicker);

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

    editor.on('hoverIn', (editor) => this.handleChildHoveredIn(editor));
    editor.on('hoverOut', (editor) => this.handleChildHoveredOut(editor));
  }

  toggleEditMode() {
    (this.editMode) ? this.disableEditMode() : this.enableEditMode();
  }

  disableEditMode() {
    this.editMode = false;
    this.clearHoverClasses();
    this.$el.removeClass('editing-layer');
    this.disableEditables();
    this.emit('enabled', false);
  }

  enableEditMode() {
    // the page may have changed, we need to rebuild editables
    this.loadElementsIntoTree();
    this.editMode = true;
    this.enableEditables();
    this.emit('enabled', true);
  }

  handleChildHoveredIn(editor) {
    if (!this.editMode) return;
    this.currentHover = editor;
    this.clearHoverClasses();
    editor.setHovered();
    this.hoverStack.push(editor);
  }

  handleChildHoveredOut(editor) {
    this.clearHoverClasses();
    this.hoverStack.pop();
    let last = _.last(this.hoverStack)
    if (last) last.setHovered();
  }

  clearHoverClasses(node) {
    this.invokeAllChildren('resetClasses');
  }

  disableEditables(node) {
    this.invokeAllChildren('disableEditables');
  }

  enableEditables(node) {
    this.invokeAllChildren('enableEditables');
  }

  // recursively calls a method on all children in the tree
  invokeAllChildren(method, node) {
    node = node || this.data;
    _.each(node.children, (child) => {
      child.editor[method]();
      this.invokeAllChildren(method, child);
    });
  }


}

module.exports = LayerTree;