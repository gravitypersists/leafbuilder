const $ = require('jquery');
const _ = require('lodash');
const fs = require('fs');
const styles = fs.readFileSync(__dirname + '/../styles/layer-editor.css', 'utf8')
const mixin = require('./util/mixin');
const events = require('./util/events');
const ElementEditor = require('./element-editor');
const MediumEditor = require('../node_modules/medium-editor/dist/js/medium-editor.js');

class LayerEditor extends mixin(class Base{}, events) {

  constructor($el, config, toolbox) {
    super();
    this.$el = $el;
    this.config = config;
    this.$el.append(`
      <style> ${ styles } </style>
      <ul class='layer-menu'>
        <li class='config'></li>
      </ul>
    `);
    this.$el.hover(this.onHoverIn.bind(this), this.onHoverOut.bind(this));
    this.$el.on('click', this.onClick.bind(this));

    let $layer = this.$el.children('.leaf-layer');
    $layer.attr('contenteditable', true);
    $layer.on('focus', () => {
      if (!this.notHoverable) this.$el.addClass('editing');
    });
    $layer.on('blur', () => this.$el.removeClass('editing'));

    this.editors = [];
    let innerEls = this.$el.find('.leaf-element').not('.leaf-text-el');
    _.each(innerEls, (el, i) => {
      let elEditor = new ElementEditor($(el), toolbox);
      this.editors.push(elEditor);
      elEditor.on('click', (e) => this.handleElementEditorClick(elEditor));
      elEditor.on('hoverIn', (e) => this.handleChildHoveredIn(elEditor));
      elEditor.on('hoverOut', (e) => this.handleChildHoveredOut(elEditor));
    });
    let $editorEl = this.$el.find('.leaf-layer');
  }

  handleElementEditorClick(editor) {
    _.each(this.editors, (e) => e.clearEditOptions());
    editor.showEditOptions();
  }

  onClick(e) {
    if (this.hovered) this.emit('click', e);
  }

  onHoverIn(e) {
    this.emit('hoverIn');
  }

  onHoverOut(e) {
    this.emit('hoverOut');
  }

  resetClasses() {
    this.$el.removeClass('hovered');
    _.each(this.editors, (e) => e.resetClasses());
  }

  setHovered(bool = true) {
    this.hovered = true;
    (bool) ? this.$el.addClass('hovered') : this.$el.removeClass('hovered');
  }

  preventHoverables() {
    this.notHoverable = true;
  }

  // A pretty naive approach for the time being, will need to use
  // something more robust than hover events in the future
  handleChildHoveredIn(editor) {
    this.setHovered(false);
    editor.setHovered(true);
  }

  handleChildHoveredOut(editor) {
    if (!this.notHoverable) this.setHovered(true);
    editor.setHovered(false);
  }

  // // This code isn't really pretty, but it's my attempt at utilizing
  // // medium editor to its fullest extent and putting off building my
  // // own full-fledged implementation for a later date. We abuse the
  // // dom here and infer everything based on the output of Med Editor.
  // // 
  // // It is highly coupled with the Document layout engine, so much so
  // // that I think I need to find a way to incorporate it into that.
  // handleLayerEdits(event, editable) {
  //   let node = $(editable).attr('data-leaf-node');

  //   // Each child in the layer is an element. We map over to retain ordering
  //   // usedIds needed because Medium duplicates div data ids for some reason
  //   let usedIds = [];
  //   let childrenIds = _.map($(editable).children(), (child, i) => {
  //     let $child = $(child);
  //     let id = $child.attr('data-leaf-el');
  //     let idUsedAlready = _.contains(usedIds, id);

  //     if ($child.hasClass('leaf-text-el')) {

  //       // it's a text layer
  //       if (idUsedAlready) {
  //         // It's a newly created element, so we must create it
  //         // also, delete its attributes, because medium editor...
  //         let newId = this.config.addTextNode(node, this.convertTextLayerToContent($child));
  //         $child.attr('data-leaf-el', newId);
  //         usedIds.push(newId);
  //         return newId;
  //       } else {
  //         this.config.transformTextNode(node, id, this.convertTextLayerToContent($child))
  //         usedIds.push(id);
  //         return id;
  //       }

  //     } else if ($child.hasClass('leafbuilder-el-container')) {

  //       // it's a block level element
  //       id = $child.children('.leaf-element').attr('data-leaf-el');
  //       usedIds.push(id);
  //       return id;

  //     } else {

  //       // It's a newly created element, so we must create it
  //       let newId = this.config.addTextNode(node, this.convertTextLayerToContent($child))
  //       $child.attr('data-leaf-el', newId);
  //       usedIds.push(newId);
  //       return newId;

  //     }
  //   });
  //   this.config.transformDocumentLayout(node, childrenIds);
  // }

  // convertTextLayerToContent($layer) {
  //   // convert back to standard storage format by cloning original
  //   // and parsing out the id and making a string with embedded ids
  //   // like so: "blah <div leaf 3>...</div> blah" -> "blah <<3>> blah"
  //   let $clone = $layer.clone();
  //   let $clonedChildren = $clone.find('.leafbuilder-el-container');
  //   let $originalChildren = $layer.find('.leafbuilder-el-container');
  //   _.each($clonedChildren, function(clonedChild, i) {
  //     let childId = $originalChildren.eq(i)
  //                     .children('.leaf-element').attr('data-leaf-el');
  //     $(clonedChild).replaceWith('<<' + childId + '>>');
  //   });
  //   return _.unescape($clone.html());
  // }

  deconstruct() {
    _.each(this.editors, (e) => e.deconstruct());
  }

}

module.exports = LayerEditor;