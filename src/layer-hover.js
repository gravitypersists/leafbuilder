const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
class LayerHover extends mixin(class Base{}, events) {

  constructor($el) {
    super();
    this.$el = $el;
    this.$el.append(`
      <style> ${ require('./styles/layer-editor.css.js') } </style>
    `);
    this.$el.hover(this.onHoverIn.bind(this), this.onHoverOut.bind(this));
    this.$el.on('click', (e) => this.emit('click', e));
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

module.exports = LayerHover;