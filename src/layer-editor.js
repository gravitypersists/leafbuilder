const $ = require('jquery');
const _ = require('lodash');
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
      <style> ${ require('./styles/layer-editor.css.js') } </style>
      <ul class='layer-menu'>
        <li class='config'></li>
      </ul>
    `);

    this.editors = [];
    let innerEls = this.$el.find('.leaf-element').not('.leaf-text-el');
    _.each(innerEls, (el, i) => {
      let elEditor = new ElementEditor($(el), toolbox);
      this.editors.push(elEditor);
      elEditor.on('click', (e) => this.handleElementEditorClick(elEditor));
    });
    let me = new MediumEditor(this.$el.find('.leaf-layer')[0], {
      buttons: ['bold', 'italic', 'quote'],
      paste: {
          forcePlainText: false
      }
    });
    me.subscribe('editableInput', this.handleLayerEdits.bind(this));
  }

  handleElementEditorClick(editor) {
    _.each(this.editors, (e) => e.clearEditOptions());
    editor.showEditOptions();
  }

  // This code isn't really pretty, but it's my attempt at utilizing
  // medium editor to its fullest extent and putting off building my
  // own full-fledged implementation for a later date. We abuse the
  // dom here and infer everything based on the output of Med Editor.
  handleLayerEdits(event, editable) {
    let node = $(editable).attr('data-leaf-node');

    // Each child in the layer is an element. We map over to retain ordering
    let children = _.map($(editable).children(), (child, i) => {
      
      let $child = $(child);
      let id = null;
      if ($child.hasClass('leaf-text-el')) {
        // it's a text layer
        id = $child.attr('data-leaf-el');
        return { id, content: this.convertTextLayerToContent($child) };
      } else if ($child.hasClass('leafbuilder-el-container')) {
        // it's a block level element
        id = $child.children('.leaf-element').attr('data-leaf-el');
        return { id, content: null };
      } else {
        // It's a newly created element
        return { id: null, content: this.convertTextLayerToContent($child) };
      }
    });
    console.log(children);
  }

  convertTextLayerToContent($layer) {
    // convert back to standard storage format by cloning original
    // and parsing out the id and making a string with embedded ids
    // like <<3>> so.
    let $clone = $layer.clone();
    let $clonedChildren = $clone.children('.leafbuilder-el-container');
    let $originalChildren = $layer.children('.leafbuilder-el-container');
    _.each($clonedChildren, function(clonedChild, i) {
      let childId = $originalChildren.eq(i)
                      .children('.leaf-element').attr('data-leaf-el');
      $(clonedChild).replaceWith('<<' + childId + '>>');
    });
    return $clone.text();
  }

  deconstruct() {
    _.each(this.editors, (e) => e.deconstruct());
  }

}

module.exports = LayerEditor;