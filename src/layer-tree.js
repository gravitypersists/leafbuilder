const _ = require('lodash');
const $ = require('jquery');
const LayerHover = require('./layer-hover.js');
const LayerEditor = require('./layer-editor.js');

// A sort of "view-model" but "view-collection" having a tree structure
class LayerTree {

  constructor(leaf, $el, config, toolbox) {
    this.$el = $el;
    this.toolbox = toolbox;
    this.config = config;
    // worth noting that this.data structure is self-referential, so cannot be serialized 
    this.data = null;
    this.editMode = false;
    // This might not work as webcomponents evolves
    this.detachments = [];
    this.editingNode = false;
  }

  // nodeString looks like "3.0.1.3"
  addLayer(nodeString, $childEl) {
    $childEl.wrap('<div class="leafbuilder-container"></div>');
    let $el = $childEl.parent();
    let hover = new LayerHover($el);

    let node = null;
    let split = nodeString.split('.');
    if (split.length == 1) {
      // manually construct top level data structure
      this.data = { children: {} };
      node = { $el, hover, parentNode:this.data, children: {} };
      this.data.children[nodeString] = node;
    } else {
      // traverse the tree to get the parent node, then add it to the structure
      let parentNode = _.reduce(_.initial(split), (res, n) => res.children[n], this.data);
      node = { $el, hover, parentNode, children: {} };
      parentNode.children[_.last(split)] = node;
    }

    hover.on('hoverIn', (e) => this.handleChildHoveredIn(node));
    hover.on('hoverOut', (e) => this.handleChildHoveredOut(node));
    hover.on('click', (e) => this.handleHoverClick(node, e));
  }

  toggleEditMode(bool) {
    this.editMode = (bool !== undefined) ? bool : !this.editMode;
    if (this.editMode) {
      this.escape();
      this.editMode = true;
    }
    if (this.currentHover) this.handleChildHoveredIn(this.currentHover);
    if (!this.editMode) this.clearHoverClasses();
  }

  escape() {
    this.editMode = false;
    this.editingNode = false;
    this.returnDetachments();
    this.clearHoverClasses();
    this.$el.removeClass('editing-layer');
    $('#detached').hide();
  }

  handleChildHoveredIn(node) {
    this.currentHover = node;
    if (this.editMode) {
      this.clearHoverClasses();
      this.traverseChildren(node.children, 0);
      if (node.hover) node.hover.setHovered();
    }
  }

  handleChildHoveredOut(node) {
    this.clearHoverClasses();
    this.handleChildHoveredIn(node.parentNode);
  }

  traverseChildren(children, depth) {
    _.each(children, (child) => {
      child.hover.setDepth(depth);
      this.traverseChildren(child.children, ++depth);
    });
  }

  clearHoverClasses(node) {
    node = node || this.data;
    _.each(node.children, (child) => {
      child.hover.resetClasses();
      this.clearHoverClasses(child);
    });
  }

  handleHoverClick(node, e) {
    if (this.currentHover !== node || !this.editMode) return;
    e.stopPropagation();
    this.setNodeToEdit(node);
  }

  // There's a bit of (probably necessary) complicated logic here.
  // I want to focus on an element, which is a child of others, so
  // in order to blur those out, I need to detach the layer from
  // it's place in the dom and replace it on the top level.
  setNodeToEdit(node) {
    this.toggleEditMode(false);
    this.editingNode = true;
    this.$el.addClass('editing-layer');
    this.returnDetachments();

    let $goods = node.$el.children('.leaf-layer');

    // A ghost to retain flow in the dom with removed structure
    let $ghost = $(`<div class="ghost"
      style="
        width: ${ $goods.width() }px;
        height: ${ $goods.height() }px;
      ">`);
    node.$el.append($ghost);

    // now detach and append to top leafbuilder div
    $goods.detach(); // $.detach will prob not work in future shadow dom
    let $detached = $('<div class="detached"></div>');
    $detached.append($goods);
    $('#detached').show().append($detached);
    // note that $.offset() does not work with shadow dom'd elements
    $detached.css({
      top: $ghost[0].getBoundingClientRect().top - this.$el.offset().top,
      left: $ghost[0].getBoundingClientRect().left - this.$el.offset().left
    });

    // and then finally create the editor
    let le = new LayerEditor($detached, this.config, this.toolbox);

    // finally retain them for convenience later on when leaving edit mode
    this.detachments.push({ $origin: node.$el, $goods, $detached, $ghost, le });
  }

  returnDetachments() {
    _.each(this.detachments, (detachment, i) => {
      detachment.$origin.append(detachment.$goods);
      this.detachments.splice(i, 1);
      detachment.$detached.remove();
      detachment.$ghost.remove();
      detachment.le.deconstruct();
    });
  }

}

module.exports = LayerTree;