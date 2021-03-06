const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
const Leaf = require('../submodules/leaf/src/leaf');
const LayerTree = require('./layer-tree');
const Toolbox = require('./toolbox');
const ConfigModel = require('./config');
const fs = require('fs');
const manifests = require('./manifests');
// TODO: look into using webpack, or finding a proper way to package
// css in with applications
const baseStyles = fs.readFileSync(__dirname + '/../styles/leafbuilder.css', 'utf8')
const fsStyles = fs.readFileSync(__dirname + '/../submodules/formsmith/styles/formsmith.css', 'utf8')
const fsExtras = fs.readFileSync(__dirname + '/../styles/formsmith-custom.css', 'utf8')

let styles = baseStyles + fsStyles + fsExtras;



function loadElementsIntoTree(elements, tree) {
  _.each(elements, (el, i) => {
    var node = el.getAttribute('data-leaf-node');
    tree.addLayer(node.split(':')[0], $(el));
  });
}

class LeafBuilder extends mixin(class Base{}, events) {

  constructor(el, configuration) {
    super();
    this.$el = $(el);
    this.$el.html(`
      <style>${ styles }</style>
      <div class="leafbuilder-main-container">
        <div class="leaf"></div>
        <div class="toolbox"></div>
        <div class="quick-picker"></div>
      </div>
    `);
    let $main = this.$el.find('.leafbuilder-main-container');
    configuration.manifests = manifests;
    // TODO: think about a better way to pass around "globals",
    // as a bunch of arguments to a constructor isn't pleasing
    let options = { el: $main.children('.leaf')[0] };
    let leaf = new Leaf(configuration, options);
    let config = new ConfigModel(configuration);
    config.on('change', (config) => {
      this.emit('change', _.omit(config, 'manifests'));
    });
    let toolbox = new Toolbox($main.children('.toolbox'), leaf, manifests, config);
    let tree = new LayerTree(leaf, $main, config, toolbox);
    tree.on('enabled', (enabledBool) => {
      $main.toggleClass('preview-mode', !enabledBool); 
    });
    tree.loadElementsIntoTree();

    $(document.body).on('keydown', (e) => {
      if (e.which === 9) { // tab key
        e.preventDefault();
        tree.toggleEditMode();
      }
    });

  }

}

module.exports = LeafBuilder

