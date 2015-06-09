const $ = require('jquery');
const mixin = require('./util/mixin');
const events = require('./util/events');
const fs = require('fs');
const styles = fs.readFileSync(__dirname + '/../styles/element-editor.css', 'utf8')

class ElementEditor extends mixin(class Base{}, events) {

  constructor($original, toolbox) {
    super();
    this.toolbox = toolbox;

    this.$original = $original;
    $original.wrap('<div class="leafbuilder-el-container"></div>');
    this.$el = $original.parent();
    // parent inherits child's display style
    this.$el.css('display', $original.css('display'));
    this.$el.append(`
      <style> ${ styles } </style>
    `);

    // need to capture this click to be able to prevent clicks in
    // the elements from doing things.
    this.$el[0].addEventListener('click', this.handleClick.bind(this), true);
    this.$el.hover(this.onHoverIn.bind(this), this.onHoverOut.bind(this));
    this.boundHandler = this.handleBodyClick.bind(this);
  }

  showEditOptions() {
    this.$el.addClass('editing');
    let elId = this.$el.children('.leaf-element').attr('data-leaf-el');
    let layerId = this.$el.parents('.leaf-layer').attr('data-leaf-node');
    this.toolbox.show(this.$el, layerId+':'+elId);
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

  // this handler is captured, not bubbled
  handleClick(e) {
    // enable normal clicks when editor is not in edit mode
    if (!this.disabled) e.stopPropagation();
    if (this.hovered) this.emit('click');
  }

  deconstruct() {
    this.clearEditOptions();
    this.$el.html(this.$original).children('.leaf-element').unwrap();
  }

  onHoverIn(e) {
    this.emit('hoverIn');
  }

  onHoverOut(e) {
    this.emit('hoverOut');
  }

  resetClasses() {
    this.hovered = false;
    this.$el.removeClass('hovered');
  }

  setHovered(bool = true) {
    this.hovered = bool;
    (bool) ? this.$el.addClass('hovered') : this.$el.removeClass('hovered');
  }

  disableEditing() {
    console.log('disableEditing')
    this.disabled = true;
  }

  enableEditing() {
    this.disabled = false;
  }
}

module.exports = ElementEditor;