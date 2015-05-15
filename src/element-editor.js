const $ = require('jquery');
const mixin = require('./util/mixin');
const events = require('./util/events');

class ElementEditor extends mixin(class Base{}, events) {

  constructor($original) {
    super();
    this.$original = $original;
    $original.wrap('<div class="leafbuilder-el-container" style="display: inline-block"></div>');
    this.$el = $original.parent();
    this.$el.append(`
      <style> ${ require('./styles/element-editor.css.js') } </style>
      <ul class='element-menu'>
        <li class='config'></li>
      </ul>
    `);

    this.$el.on('click', (e) => this.handleClick());
  }

  showEditOptions() {
    this.addClass('editing');
  }

  handleClick() {
    this.emit('click');
  }

  deconstruct() {
    this.$el.html(this.$original).children('.leaf-element').unwrap();
  }

}

module.exports = ElementEditor;