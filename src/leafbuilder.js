const $ = require('jquery');
const _ = require('lodash');
const Leaf = require('../submodules/leaf/src/leaf');
const LayerTree = require('./layer-tree');
const Toolbox = require('./toolbox');
const ConfigModel = require('./config');

let manifests = {
  Text: require('../submodules/leaf/src/elements/text/manifest.json'),
  Katex: require('../submodules/leaf/src/elements/katex/manifest.json'),
  Picker: require('../submodules/leaf/src/elements/picker/manifest.json'),
  Image: require('../submodules/leaf/src/elements/image/manifest.json'),
  Switch: require('../submodules/leaf/src/elements/switch/manifest.json'),
  EventButton: require('../submodules/leaf/src/elements/event-button/manifest.json'),
  LogicalStatement: require('../submodules/leaf/src/elements/logical-statement/manifest.json'),
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
      <div class="leaf"></div>
      <div class="toolbox"></div>
      <div id="detached"></div>
    `);
    configuration.manifests = manifests;
    let options = { el: this.$el.children('.leaf')[0] };
    let leaf = new Leaf(configuration, options);
    let toolbox = new Toolbox(this.$el.children('.toolbox'), leaf, manifests, config);
    let config = new ConfigModel(configuration);
    let tree = new LayerTree(leaf, this.$el, config, toolbox);

    loadElementsIntoTree($('html /deep/ .leaf-layer'), tree);

    // toolbox knows when a portion of the tree has been rerendered.
    // That's probably more than toolbox should know.
    toolbox.on('elementRedraw', () => {
      loadElementsIntoTree($('#detached /deep/ .leaf-layer'));
    });

    $(document.body).on('keydown', (e) => {
      if (e.keyCode === 192) { // ` character
        tree.toggleEditMode();
      }
      if (e.keyCode === 27) { // esc
        tree.escape();
      }
    });

  }

}

module.exports = LeafBuilder

