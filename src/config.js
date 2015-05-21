const _ = require('lodash');

// This model will be the source of manipulating the 
// leaf data model. In time it will grow to add support
// for batching changes into undoable history items.

class ConfigModel {

  constructor(raw) {
    // this.raw = JSON.parse(JSON.stringify(raw)); // clone raw obj
    this.data = raw;
  }

  transformLayerNode(nodeId, children) {
    let node = this.data.content[nodeId];
    // straight up manip the data in place for now. Just trying to
    // get something that works for the time being, it's ugly temp.
    _.each(children, (child) => {
      if (child.content) {
        node.children[child.id].config.text.content = child.content;
      }
    });
    this.save();
  }

  save() {
    let modified = this.data;
    localStorage.setItem('leaf-config', JSON.stringify(this.data));
  }

}

module.exports = ConfigModel;