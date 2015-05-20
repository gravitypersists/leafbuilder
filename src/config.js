// This model will be the source of manipulating the 
// leaf data model. In time it will grow to add support
// for batching changes into undoable history items.

class ConfigModel {

  constructor(raw) {
    // this.raw = JSON.parse(JSON.stringify(raw)); // clone raw obj
    this.data = raw;
  }

  transformLayerNode(node, children) {

  }

  save() {
    let modified = this.data;
    localStorage.setItem('leaf-config', this.data)
  }

}

module.exports = ConfigModel;