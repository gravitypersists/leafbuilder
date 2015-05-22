// I'm really just trying to keep leafbuilder specific
// implementations out of formsmith, so I have a way
// to register plugins in formsmith and this type is
// delcared up here

const $ = require('jquery');
const mixin = require('../util/mixin');
const events = require('../util/events');

class EmbeddedLayerFSPlugin extends mixin(class Base{}, events) {
  
  constructor(configModel, parentLayer) {
    super();
    this.configModel = configModel;
    this.parentLayer = parentLayer;
  }

  render(element, schemaItem, data, smith) {
    if (!data[schemaItem.key].nestedLayerId) {
      // this config item was just created, we need to communicate
      // to the config model that we want a new nested layer created
      let newLayerId = this.configModel.addLayerNode(this.parentLayer);
      data[schemaItem.key] = { nestedLayerId: newLayerId };
    }
    let html = `
      <div class='fs-embedded-layer' data-layer-id='${ data.nestedLayerId }'></div>
    `
    let el = $(element).html(html);
    return el;
  } 

}

module.exports = EmbeddedLayerFSPlugin;