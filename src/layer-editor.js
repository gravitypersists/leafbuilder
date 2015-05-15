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

    _.each(this.$el.find('.leaf-element'), (el, i) => {
      let elEditor = new ElementEditor($(el));
      elEditor.on('click', (e) => this.handleElementEditorClick(elEditor));
    });

  }

  enable() {
    this.enabled = true;
  }

  handleElementEditorClick(editor) {
    if (!this.enabled) return;
    editor.showEditOptions();
  }

}

module.exports = LayerEditor;