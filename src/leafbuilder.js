const $ = require('jquery');
const _ = require('lodash');
const Leaf = require('../submodules/leaf/src/leaf');
const LayerTree = require('./layer-tree');
const Toolbox = require('./toolbox');
const ConfigModel = require('./config');
const fs = require('fs');
// TODO: look into using webpack, or finding a proper way to package
// css in with applications
const baseStyles = fs.readFileSync(__dirname + '/../styles/leafbuilder.css', 'utf8')
const fsStyles = fs.readFileSync(__dirname + '/../submodules/formsmith/styles/formsmith.css', 'utf8')
const fsExtras = fs.readFileSync(__dirname + '/../styles/formsmith-custom.css', 'utf8')

let styles = baseStyles + fsStyles + fsExtras;

let manifests = {
  Text: require('../submodules/leaf/src/elements/text/manifest.json'),
  Katex: require('../submodules/leaf/src/elements/katex/manifest.json'),
  Picker: require('../submodules/leaf/src/elements/picker/manifest.json'),
  Image: require('../submodules/leaf/src/elements/image/manifest.json'),
  Switch: require('../submodules/leaf/src/elements/switch/manifest.json'),
  EventButton: require('../submodules/leaf/src/elements/event-button/manifest.json'),
  LogicalStatement: require('../submodules/leaf/src/elements/logical-statement/manifest.json'),
  Question: require('../submodules/leaf/src/elements/question/manifest.json'),
}

function loadElementsIntoTree(elements, tree) {
  _.each(elements, (el, i) => {
    var node = el.getAttribute('data-leaf-node');
    tree.addLayer(node.split(':')[0], $(el));
  });
}

class LeafBuilder {

  constructor(el, configuration) {
    this.$el = $(el);
    this.$el.html(`
      <style>${ styles }</style>
      <div class="leafbuilder-main-container">
        <div class="leaf"></div>
        <div class="toolbox"></div>
        <div class="detached-container"></div>
      </div>
    `);
    let $main = this.$el.find('.leafbuilder-main-container');
    configuration.manifests = manifests;
    // TODO: think about a better way to pass around "globals",
    // as a bunch of arguments to a constructor isn't pleasing
    let options = { el: $main.children('.leaf')[0] };
    let leaf = new Leaf(configuration, options);
    let config = new ConfigModel(configuration);
    let toolbox = new Toolbox($main.children('.toolbox'), leaf, manifests, config);
    let tree = new LayerTree(leaf, $main, config, toolbox, $main.children('.detached-container'));

    // TODO need to scope this selector
    loadElementsIntoTree($('html /deep/ .leaf-layer'), tree);

    // toolbox knows when a portion of the tree has been rerendered.
    // That's probably more than toolbox should know.
    toolbox.on('elementRedraw', () => {
      loadElementsIntoTree($('#detached /deep/ .leaf-layer'));
    });

    $(document.body).on('keydown', (e) => {
      if (e.keyCode === 27) { // esc
        tree.escape();
      }
    });

  }

}

module.exports = LeafBuilder

