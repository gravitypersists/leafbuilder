const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
const FormSmith = require('../submodules/formsmith/src/formsmith');

class Toolbox extends mixin(class Base{}, events) {

  constructor($el, leaf, manifests) {
    super();
    this.$el = $el;
    this.leaf = leaf;
    this.manifests = manifests;
    $el.html(`
      <style> ${ require('./styles/toolbox.css.js') } </style>
      <ul class='toolbox-options'>
        <li class='config'></li>
      </ul>
      <div class='toolbox-drawer'></div>
    `);
    // $el.find('.config').on('click', this.handleConfig.bind(this));
    this.$drawer = $el.find('.toolbox-drawer');
    this.$el.hide();
  }

  // caution here, as toolbox is becoming knowledgeable about parent
  show(rect, id) {
    this.$el.css({
      top: rect.top - this.$el.parent().offset().top,
      left: rect.right - this.$el.parent().offset().left + 5
    });
    this.$el.show();

    if (id) {
      this.$el.find('.config').show().on('click', (e) => {
        let leafEl = this.leaf.getElementById(id);
        let schema = this.manifests[leafEl.elementData.type].configSchema;
        let fs = new FormSmith(schema, leafEl.elementData.config, this.$drawer[0]);
        this.$drawer.show();
        fs.onChange((config) => leafEl.rebuild(config));
      });
    } else {
      this.$el.find('.config').hide();
    }

  }

  close() {
    this.$el.hide();
  }

  handleConfig() {
    console.log('config-clicked');
  }


}

// singleton, for now.
module.exports = Toolbox;