const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
const manifests = require('./manifests');

// This model will be the source of manipulating the 
// leaf data model. In time it will grow to add support
// for batching changes into undoable history items.

class ConfigModel extends mixin(class Base{}, events)  {

  constructor(raw) {
    super();
    this.data = raw;
    this.debouncedSave = _.debounce(() => this.emit('change', this.data), 100);
  }

  getLayerNode(id) { return this.data.content[id] }

  transformDocumentLayout(nodeId, array) {
    let node = this.data.content[nodeId];
    node.layout.config.array = array;
    this.save();
  }

  addElement(nodeId, type) {
    let node = this.getLayerNode(nodeId);
    let newId = 0;
    while (node.children[newId]) newId++;
    node.children[newId] = {
      'elementId': newId,
      'type': type,
      'config': _.cloneDeep(manifests[type].defaultConfig) || {}
    };
    this.save();
    return '' + newId;
  }

  // compositeId here looks like "0.2:2" which is layer id:element id
  transformElementConfig(compositeId, newConfig) {
    let split = compositeId.split(':');
    let node = this.getLayerNode(split[0]);
    let elementNode = node.children[split[1]];
    elementNode.config = newConfig;
    this.save();
    return newConfig;
  }

  // convenience method for adding new element of type Text
  addTextNode(nodeId, content) {
    let newId = this.addElement(nodeId, "Text");
    let node = this.getLayerNode(nodeId);
    node.children[newId].config.text.content = content;
    return newId;
  }

  transformTextNode(compositeId, content) {
    let config = { "text": { "content": content }};
    return this.transformElementConfig(compositeId, config);
  }

  // I'm still thinking pretty hard about how to do this, with
  // edit histories planned, undo, redo, etc, definitions are needed.
  // I'm also thinking giving each element an id is overkill, but I
  // want to get to Canvas layout before I kill it.
  transformLayerNode(nodeId, content) {
    let node = this.getLayerNode(nodeId);

    // First we need to find the (non-text) elements in use.
    let idsToKeep = (content.match(/<<[0-9]+>>/g) || [])
                            .map((i) => i.replace(/<<|>>/g, ''))

    // reset the layer data for all text and no-longer-used elements
    let filtered = _.filter(node.children, (c) => {
      return _.includes(idsToKeep, ''+c.elementId);
    });
    node.children = _.indexBy(filtered, 'elementId');

    // Then we need to rebuild it, mapping to retain id ordering for layout
    let newLayout = _.map(content.split('\n') || [], (line) => {
      if (line.match(/^<<.+>>$/) && line.split('<<').length === 2) {
        // if the line is just a block level element
        return line.replace(/<<|>>/g, '');
      } else {
        // otherwise it's a text element and we create it now and return id
        return this.addTextNode(nodeId, line);
      }
    });

    // Finally, pass along the new layout, which will call save.
    this.transformDocumentLayout(nodeId, newLayout);
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
    this.debouncedSave();
  }

}

module.exports = ConfigModel;