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

  deconstruct() {
    _.each(this.editors, (e) => e.deconstruct());
  }

}

module.exports = LayerEditor;