const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
const ElementEditor = require('./element-editor');

class LayerEditor extends mixin(class Base{}, events) {

  constructor($el) {
    super();
    this.$el = $el;
    this.$el.append(`
      <style> ${ require('./styles/layer-editor.css.js') } </style>
      <ul class='layer-menu'>
        <li class='config'></li>
      </ul>
    `);
    this.$el.hover(this.onHoverIn.bind(this), this.onHoverOut.bind(this));
    this.$el.on('click', (e) => this.emit('click', e));

    _.each(this.$el.find('.leaf-element'), (el, i) => {
      new ElementEditor($(el));
    });

  }

  onHoverIn(e) {
    this.emit('hoverIn');
  }

  onHoverOut(e) {
    this.emit('hoverOut');
  }

  setDepth(i) {
    this.$el.addClass('deep');
  }

  resetClasses() {
    this.$el.removeClass('deep hovered');
  }

  setHovered() {
    this.$el.addClass('hovered');
  }

}

module.exports = LayerEditor;