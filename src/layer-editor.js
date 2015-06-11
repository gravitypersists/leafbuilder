const $ = require('jquery');
const _ = require('lodash');
const fs = require('fs');
const styles = fs.readFileSync(__dirname + '/../styles/layer-editor.css', 'utf8')
const mixin = require('./util/mixin');
const events = require('./util/events');
const ElementEditor = require('./element-editor');
const QuickPicker = require('./quick-picker');

class LayerEditor extends mixin(class Base{}, events) {

  constructor($el, config, toolbox, leaf) {
    super();
    this.$el = $el;
    this.config = config;
    this.toolbox = toolbox;
    this.leaf = leaf;
    this.$el.append(`
      <style> ${ styles } </style>
      <ul class='layer-menu'>
        <li class='config'></li>
      </ul>
    `);
    this.$el.hover(this.onHoverIn.bind(this), this.onHoverOut.bind(this));
    this.$el.on('click', this.onClick.bind(this));

    this.$layer = this.$el.children('.leaf-layer');
    this.layerId = this.$layer.attr('data-leaf-node');

    this.editors = [];
    let innerEls = this.$el.find('.leaf-element').not('.leaf-text-el');
    _.each(innerEls, (el) => this.addElementEditor(el));
    let $editorEl = this.$el.find('.leaf-layer');

    // Setup text editing functionality, must come after element editor setups
    this.$layer.attr('contenteditable', true);
    this.$layer.find('.leafbuilder-el-container').attr('contenteditable', false)
    this.$layer.on('focus', () => {
      if (!this.notHoverable) this.$el.addClass('editing');
    });
    this.$layer.on('blur', () => this.$el.removeClass('editing'));
    this.$layer.on('keyup', this.handleEdit.bind(this));

  }

  addElementEditor(el) {
    let elEditor = new ElementEditor($(el), this.toolbox);
    this.editors.push(elEditor);
    elEditor.on('click', (e) => this.handleElementEditorClick(elEditor));
    elEditor.on('hoverIn', (e) => this.handleChildHoveredIn(elEditor));
    elEditor.on('hoverOut', (e) => this.handleChildHoveredOut(elEditor));
  }

  handleEdit(e) {
    e.stopPropagation();

    // show quick picker on "<" input
    if (e.which === 188) { // '<' key
      this.setupQuickPicker();
      return; // avoid edits
    }

    // There are two types of top-level elements in here. 
    // element containers and text. We need to distinguish
    let lines = _.map(this.$layer.children(), (topEl) => {
      let $topEl = $(topEl);
      if ($topEl.hasClass('leafbuilder-el-container')) {
        let id = $topEl.children('.leaf-element').attr('data-leaf-el');
        return '<<' + id + '>>';
      } else {
        return this.convertTextLayerToContent($topEl);
      }
    });

    let layerId = this.$layer.attr('data-leaf-node');
    this.config.transformLayerNode(layerId, lines.join('\n'));

  }

  convertTextLayerToContent($original) {
    // convert back to standard storage format by cloning original
    // and parsing out the id and making a string with embedded ids
    // like so: "blah <div leaf 3>...</div> blah" -> "blah <<3>> blah"
    let $clone = $original.clone();
    let $clonedChildren = $clone.find('.leafbuilder-el-container');
    let $originalChildren = $original.find('.leafbuilder-el-container');
    _.each($clonedChildren, function(clonedChild, i) {
      let childId = $originalChildren.eq(i)
                      .children('.leaf-element').attr('data-leaf-el');
      $(clonedChild).replaceWith('<<' + childId + '>>');
    });
    return _.unescape($clone.html());
  }

  setupQuickPicker() {
    let picker = new QuickPicker();
    // the picker injects something like "<<Katex>>", we need to handle that
    picker.on('pick', (containerTextElId, type) => {
      // We need to place the element into config
      let newId = this.config.addElement(this.layerId, type);
      // update the text element's config
      let $text = this.$layer.find(`[data-leaf-el='${ containerTextElId }']`);
      let content = this.convertTextLayerToContent($text);
      let transformed = content.replace(`<<${type}>>`, `<<${newId}>>`);
      let compositeId = this.layerId + ':' + containerTextElId;
      let newElConfig = this.config.transformTextNode(compositeId, transformed);
      // and rerender the text element
      this.leaf.getElementById(compositeId).rebuild(newElConfig);
      // finally, reset element editors
      let newEls = $text.find('.leaf-element').not('.leaf-text-el');
      _.each(newEls, (el) => this.addElementEditor(el));
    });
  }

  handleElementEditorClick(editor) {
    _.each(this.editors, (e) => e.clearEditOptions());
    editor.showEditOptions();
  }

  onClick(e) {
    if (this.hovered) this.emit('click', e);
  }

  onHoverIn(e) {
    if (this.notHoverable) return;
    this.emit('hoverIn', this);
  }

  onHoverOut(e) {
    if (this.notHoverable) return;
    this.emit('hoverOut', this);
  }

  resetClasses() {
    this.$el.removeClass('hovered');
    _.each(this.editors, (e) => e.resetClasses());
  }

  disableEditables() {
    _.each(this.editors, (e) => e.clearEditOptions());
    _.each(this.editors, (e) => e.disableEditing());
    this.$el.find('.leaf-layer').attr('contenteditable', false);
  }

  enableEditables() {
    _.each(this.editors, (e) => e.enableEditing());
    this.$layer.attr('contenteditable', true);
  }

  setHovered(bool = true) {
    if (this.notHoverable) return;
    this.hovered = true;
    (bool) ? this.$el.addClass('hovered') : this.$el.removeClass('hovered');
  }

  preventHoverables() {
    this.notHoverable = true;
  }

  handleChildHoveredIn(editor) {
    this.emit('hoverIn', editor);
  }

  handleChildHoveredOut(editor) {
    this.emit('hoverOut', editor);
  }



}

module.exports = LayerEditor;