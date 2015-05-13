const $ = require('jquery');
const mixin = require('./util/mixin');
const events = require('./util/events');

class LayerEditor extends mixin(class Base{}, events) {

  constructor($el) {
    super();
    this.$el = $el;
    $el.wrap('<div class="leafbuilder-container"></div>');
    this.$el = $el.parent();
    this.$el.append(`
      <style> ${ require('./styles/layer-editor.css.js') } </style>
      <ul class='layer-menu'>
        <li class='config'></li>
      </ul>
    `);
    this.$el.hover(this.onHoverIn.bind(this), this.onHoverOut.bind(this));
    this.$el.find('.config').on('click', (e) => {
      console.log('click');
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