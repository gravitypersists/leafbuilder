const _ = require('lodash');
const LayerEditor = require('./layer-editor.js');

// A sort of "view-model" but "view-collection" having a tree structure
class LayerTree {

  constructor() {
    this.data = {};
  }

  // nodeString looks like "3.0.1.3"
  addLayer(nodeString, $el) {
    let editor = new LayerEditor($el);

    let parentNode = null;
    let split = nodeString.split('.');
    if (split.length == 1) {
      parentNode = this.data[split[0]] = {};
    } else {
      parentNode = _.reduce(_.initial(split), (res, n) => res[n], this.data);
      parentNode[_.last(split)] = { $el, editor }
    }

    editor.on('hovered', () => {
      console.log('x');
    });
  }

}

module.exports = LayerTree;