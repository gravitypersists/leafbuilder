const _ = require('lodash');
const $ = require('jquery');
const LayerEditor = require('./layer-editor.js');

// A sort of "view-model" but "view-collection" having a tree structure
class LayerTree {

  constructor(leaf, $el) {
    this.$el = $el;
    // worth noting that this.data structure is self-referential, so cannot be stringified 
    this.data = null;
    this.shiftOn = false;
    // This might not work as webcomponents evolves
    this.detachments = [];
  }

  // nodeString looks like "3.0.1.3"
  addLayer(nodeString, $childEl) {
    $childEl.wrap('<div class="leafbuilder-container"></div>');
    let $el = $childEl.parent();
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

    editor.on('hoverIn', (e) => this.handleChildHoveredIn(node));
    editor.on('hoverOut', (e) => this.handleChildHoveredOut(node));
    editor.on('click', (e) => this.handleEditorClick(node));
  }

  toggleShift(bool) {
    this.shiftOn = (bool !== undefined) ? bool : !this.shiftOn;
    $(document.body).css('border', '1px solid ' + ((this.shiftOn) ? '#ccc' : '#fff'));
    if (this.currentHover) this.handleChildHoveredIn(this.currentHover);
    if (!this.shiftOn) this.clearEditorClasses();
  }

  handleChildHoveredIn(node) {
    this.currentHover = node;
    if (this.shiftOn) {
      this.clearEditorClasses();
      this.traverseChildren(node.children, 0);
      if (node.editor) node.editor.setHovered();
    }
  }

  handleChildHoveredOut(node) {
    this.clearEditorClasses();
    this.handleChildHoveredIn(node.parentNode);
  }

  traverseChildren(children, depth) {
    _.each(children, (child) => {
      child.editor.setDepth(depth);
      this.traverseChildren(child.children, ++depth);
    });
  }

  clearEditorClasses(node) {
    node = node || this.data;
    _.each(node.children, (child) => {
      child.editor.resetClasses();
      this.clearEditorClasses(child);
    });
  }

  handleEditorClick(node) {
    if (this.currentHover !== node && this.shiftOn) return;
    this.setNodeToEdit(node);
  }

  setNodeToEdit(node) {
    this.returnDetachments();
    let $old = node.$el.children();
    let $ghost = $(`<div 
      style="width:${ $old.width() }px; height:${ $old.height() }px;">`);
    node.$el.html($ghost);
    $old.detach();
    let $detached = $('<div class="detached"></div>');
    $detached.append($old);
    this.$el.append($detached);
    // note that $.offset() does not work with shadow dom'd elements
    $detached.css({
      position: 'absolute',
      top: $ghost[0].getBoundingClientRect().top - this.$el.offset().top,
      left: $ghost[0].getBoundingClientRect().left - this.$el.offset().left
    });
    this.detachments.push({
      $origin: node.$el,
      $el: $detached
    });
  }

  returnDetachments() {
    _.each(this.detachments, (detachment, i) => {
      detachment.$origin.html(detachment.$el.children());
      this.detachments.splice(i, 1);
      detachment.$el.remove();
    });
  }

}

module.exports = LayerTree;