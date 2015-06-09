const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
const FormSmith = require('../submodules/formsmith/src/formsmith');
const EmbeddedLayerFSPlugin = require('./misc/fs-embedded-layer');
const fs = require('fs');
const styles = fs.readFileSync(__dirname + '/../styles/toolbox.css', 'utf8')

class Toolbox extends mixin(class Base{}, events) {

  constructor($el, leaf, manifests, configModel) {
    super();
    this.$el = $el;
    this.leaf = leaf;
    this.manifests = manifests;
    this.config = configModel;
    $el.html(`
      <style> ${ styles } </style>
      <ul class='toolbox-options'>
        <li class='config'>
          <i class='fa fa-cog'></i>
        </li>
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
      top: rect.top - this.$el.parent().offset().top - 3,
      left: rect.right - this.$el.parent().offset().left + 3
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
    let leafElement = this.leaf.getElementById(this.id);
    let schema = this.manifests[leafElement.elementData.type].configSchema;
    let plugin = new EmbeddedLayerFSPlugin(this.config, this.id.split(':')[0]);
    let options = {
      plugins: {
        EmbeddedLayer: plugin
      }
    }
    let formSmith = new FormSmith(schema, leafElement.elementData.config, this.$drawer[0], options);
    this.$drawer.show();
    formSmith.onChange((newConfig) => {
      this.config.transformElementConfig(this.id, newConfig);
      leafElement.rebuild(newConfig);
    });
  }

}

module.exports = Toolbox;