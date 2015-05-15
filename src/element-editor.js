const $ = require('jquery');
const mixin = require('./util/mixin');
const events = require('./util/events');

class ElementEditor extends mixin(class Base{}, events) {

  constructor($el) {
    super();
    this.$el = $el;
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

}

module.exports = ElementEditor;