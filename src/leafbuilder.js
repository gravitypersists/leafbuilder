const $ = require('jquery');
const _ = require('lodash');
const Leaf = require('../submodules/leaf/src/leaf');
const LayerTree = require('./layer-tree');

// these things will be packaged up appropriately in the future
let configuration = require('../submodules/leaf/examples/basic.json');
configuration.manifests = {
  Text: require('../submodules/leaf/src/elements/text/manifest.json'),
  Katex: require('../submodules/leaf/src/elements/katex/manifest.json'),
  Picker: require('../submodules/leaf/src/elements/picker/manifest.json'),
  Image: require('../submodules/leaf/src/elements/image/manifest.json'),
  Switch: require('../submodules/leaf/src/elements/switch/manifest.json')
}

let options = { el: $('#top-node')[0] };
let leaf = new Leaf(configuration, options);
let tree = new LayerTree(leaf, $('#leafbuilder'));

$(document.body).on('keydown', (e) => {
  if (e.keyCode === 16) { 
    tree.toggleShift();
  }
});

_.each($('html /deep/ .leaf-layer'), (el, i) => {
  var node = el.getAttribute('data-leaf-node');
  let $el = $(el);
  tree.addLayer(node.split(':')[0], $el);
});

