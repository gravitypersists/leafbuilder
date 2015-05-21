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
    let newIndex = Math.max.apply(null, _.keys(node.children)) + 1;
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

  save() {
    let modified = this.data;
    localStorage.setItem('leaf-config', JSON.stringify(this.data));
  }

}

module.exports = ConfigModel;