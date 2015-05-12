const $ = require('jquery');
const _ = require('lodash');
const Leaf = require('../submodules/leaf/src/leaf');
const LayerTree = require('./layer-tree');

let configuration = require('../submodules/leaf/examples/basic.json');
let options = { el: $('#top-node')[0] };
let leaf = new Leaf(configuration, options);
let tree = new LayerTree(leaf);


_.each($('html /deep/ .leaf-layer'), (el, i) => {
  var node = el.getAttribute('data-leaf-node');
  let $el = $(el);
  tree.addLayer(node.split(':')[1], $el);
});