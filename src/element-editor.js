const $ = require('jquery');
const mixin = require('./util/mixin');
const events = require('./util/events');

class ElementEditor extends mixin(class Base{}, events) {

  constructor($original, toolbox) {
    super();
    this.toolbox = toolbox;

    this.$original = $original;
    $original.wrap('<div class="leafbuilder-el-container" style="display: inline-block"></div>');
    this.$el = $original.parent();
    this.$el.append(`
      <style> ${ require('./styles/element-editor.css.js') } </style>
    `);

    this.$el.on('click', (e) => this.handleClick());
    this.boundHandler = this.handleBodyClick.bind(this);
  }

  showEditOptions() {
    this.$el.addClass('editing');
    let elId = this.$el.children('.leaf-element').attr('data-leaf-el');
    let layerId = this.$el.parent().attr('data-leaf-node');
    this.toolbox.show(this.$el[0].getBoundingClientRect(), layerId+':'+elId);
    // use mousedown here instead of click to avoid click invoking 
    // showEditOptions from automatically invoking the handler
    $(document.body).on('mousedown', this.boundHandler);
  }

  clearEditOptions() {
    this.$el.removeClass('editing');
    this.toolbox.close();
    $(document.body).off('mousedown', this.boundHandler);
  }

  handleBodyClick(e) {
    // click happened not within .toolbox
    if ($(e.target).closest('.toolbox').length === 0) {
      this.clearEditOptions();
    }
  }

  handleClick() {
    this.emit('click');
  }

  deconstruct() {
    this.clearEditOptions();
    this.$el.html(this.$original).children('.leaf-element').unwrap();
  }

}

module.exports = ElementEditor;