const _ = require('lodash');

// This model will be the source of manipulating the 
// leaf data model. In time it will grow to add support
// for batching changes into undoable history items.

class ConfigModel {

  constructor(raw) {
    // this.raw = JSON.parse(JSON.stringify(raw)); // clone raw obj
    this.data = raw;
  }

  transformTextNode(nodeId, textElementId, content) {
    let node = this.data.content[nodeId];
    // manipulate it in place
    node.children[textElementId].config.text.content = content;
    this.save();
  }

  addTextNode(nodeId, content) {
    let node = this.data.content[nodeId];
    // concat to [-1] in case node.children is empty {}
    let ids = [-1].concat(_.keys(node.children));
    let newIndex = Math.max.apply(null, ids) + 1;
    node.children[newIndex] = {
      "elementId": newIndex,
      "type": "Text",
      "config": {
        "text": {
          "content": content,
          "children": {}
        }
      }
    };
    this.save();
    return newIndex;
  }

  transformDocumentLayout(nodeId, array) {
    let node = this.data.content[nodeId];
    node.layout.config.array = array;
    this.save();
  }

  transformElementConfig(elementId, newConfig) {
    let split = elementId.split(':');
    let node = this.data.content[split[0]];
    let elementNode = node.children[split[1]];
    elementNode.config = newConfig;
    this.save();
  }

  addLayerNode(baseNode) {
    let currentNodes = _.keys(this.data.content);
    let nodesOnSameLayer = _.filter(currentNodes, (n) => {
      // matches 2.3.5 if baseNode is 2.3, but not 2.3.5.1
      return n.match(new RegExp(baseNode + '.[0-9]+$')); 
    });
    let ids = _.map(nodesOnSameLayer, (n) => _.last(n.split('.')));
    let newIdOnLayer = Math.max.apply(null, [-1].concat(ids)) + 1;
    let newId = baseNode + '.' + newIdOnLayer;
    // TODO: move these defaults somewhere more sensible, perhaps
    // adjustable according to author preferences or patterns.
    this.data.content[newId] = {
      layerId: newId,
      children: {},
      layout: {
        type: "Document",
        config: {
          array: []
        }
      }
    };
    this.save()
    return newId;
  }

  save() {
    let modified = this.data;
    localStorage.setItem('leaf-config', JSON.stringify(this.data));
  }

}

module.exports = ConfigModel;