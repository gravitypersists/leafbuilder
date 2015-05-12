const _ = require('lodash');
const LayerEditor = require('./layer-editor.js');

// A sort of "view-model" but "view-collection" having a tree structure
class LayerTree {

  constructor() {
    this.data = {};
  }

  // nodeString looks like "3.0.1.3"
  addLayer(nodeString, $el) {
    let layerNode = _.reduce(nodeString.split('.'), (res, n) => {
      res[n] = res[n] || {};
      return res[n];
    }, this.data);
    let le = new LayerEditor($el);
    layerNode.$el = $el;
    layerNode.editor = le;
  }

}

module.exports = LayerTree;