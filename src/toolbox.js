const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
const FormSmith = require('../submodules/formsmith/src/formsmith');
const EmbeddedLayerFSPlugin = require('./misc/fs-embedded-layer');

class Toolbox extends mixin(class Base{}, events) {

  constructor($el, leaf, manifests, configModel) {
    super();
    this.$el = $el;
    this.leaf = leaf;
    this.manifests = manifests;
    this.config = configModel;
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
    this.$el.find('.config').on('click', this.handleConfig.bind(this));
  }

  // caution here, as toolbox is becoming knowledgeable about parent
  show($elementEl, id) {
    let rect = $elementEl[0].getBoundingClientRect();
    this.$el.css({
      top: rect.top - this.$el.parent().offset().top,
      left: rect.right - this.$el.parent().offset().left + 5
    });
    this.$el.show();
    this.$drawer.empty().hide();

    (id) ? this.id = id : this.$el.find('.config').hide();

    // for now, for convenience 
    this.$el.find('.config').click();
  }

  close() {
    this.$el.hide();
  }

  handleConfig(e) {
    let leafEl = this.leaf.getElementById(this.id);
    let schema = this.manifests[leafEl.elementData.type].configSchema;
    let plugin = new EmbeddedLayerFSPlugin(this.config, this.id.split(':')[0]);
    let options = {
      plugins: {
        EmbeddedLayer: plugin
      }
    }
    let fs = new FormSmith(schema, leafEl.elementData.config, this.$drawer[0], options);
    this.$drawer.show();
    fs.onChange((newConfig) => {
      this.config.transformElementConfig(this.id, newConfig);
      leafEl.rebuild(newConfig);
    });
  }

}

module.exports = Toolbox;