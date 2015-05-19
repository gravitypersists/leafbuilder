const $ = require('jquery');
const _ = require('lodash');
const Leaf = require('../submodules/leaf/src/leaf');
const LayerTree = require('./layer-tree');
const Toolbox = require('./toolbox');
const ConfigModel = require('./config');

// these things will be packaged up appropriately in the future
let configuration = require('../submodules/leaf/examples/basic.json');
configuration.manifests = {
  Text: require('../submodules/leaf/src/elements/text/manifest.json'),
  Katex: require('../submodules/leaf/src/elements/katex/manifest.json'),
  Picker: require('../submodules/leaf/src/elements/picker/manifest.json'),
  Image: require('../submodules/leaf/src/elements/image/manifest.json'),
  Switch: require('../submodules/leaf/src/elements/switch/manifest.json'),
  Switch: require('../submodules/leaf/src/elements/event-button/manifest.json')
}
let config = new ConfigModel(configuration);

let $lb = $('#leafbuilder').html(`
  <div id="leaf">
    <div id="top-node"></div>
  </div>
  <div class="toolbox"></div>
`);

let options = { el: $('#top-node')[0] };
let leaf = new Leaf(configuration, options);
let toolbox = new Toolbox($lb.children('.toolbox'), leaf, configuration.manifests);
let tree = new LayerTree(leaf, $lb, config, toolbox);


$(document.body).on('keydown', (e) => {
  if (e.keyCode === 192) { // ` character
    tree.toggleEditMode();
  }
  if (e.keyCode === 27) { // esc
    tree.escape();
  }
});

_.each($('html /deep/ .leaf-layer'), (el, i) => {
  var node = el.getAttribute('data-leaf-node');
  tree.addLayer(node.split(':')[0], $(el));
});

