// I'm really just trying to keep leafbuilder specific
// implementations out of formsmith, so I have a way
// to register plugins in formsmith and this type is
// delcared up here

const $ = require('jquery');
const _ = require('lodash');
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

    let layerId = data[schemaItem.key].nestedLayerId;

    // DISCLAIMER: A bit of complicated code here as this is the
    // place I've tried to keep it contained to.
    // 
    // Since I'm temporarily abandoning WYSIWYG text editor due to
    // the lovely nature of contenteditable, this code serves to 
    // parse config model to present editable content in a textarea
    // 
    // It needs to take all of the elements in a layer's layout and
    // represent them as new paragraphs in the textarea. It also
    // needs to take <<29>> and represent is more usefully as <<Image:29>>
    let layerNode = this.configModel.getLayerNode(layerId);
    // an annoying thing to hold onto, the ids of the text elements
    // since they are lost in translation into textarea.
    let textNodes = [];
    let children = _.map(layerNode.layout.config.array, (elementId) => {
      return layerNode.children[elementId];
    });
    let lines = _.map(children, (child) => {
      if (child.type === "Text") {
        textNodes.push(child.elementId);
        return child.config.text.content;
      } else {
        return '<<' + child.elementId + '>>';
      }
    });
    let content = lines.join('\n');
    let detailedContent = content.replace(/<<[0-9]+>>/g, (x) => {
      let id = x.replace('<<', '').replace('>>', '');
      return '<<' + layerNode.children[id].type + ':' + id + '>>';
    });

    // note that whitespace is respected within textarea tags here.
    let html = `
      <textarea class='fs-embedded-layer' 
        data-layer-id='${ data.nestedLayerId }'>${ detailedContent }</textarea>
    `
    let el = $(element).html(html);
    let $textarea = $(el).find('textarea');

    $textarea.on('keyup', (e) => {

      // Since I'm temporarily abandoning WYSIWYG text editor due to
      // the lovely nature of contenteditable, this code serves to 
      // parse the input of the textarea to represent the embedded layer
      // 
      // It needs to split the layer into either text elements, or
      // block level elements, and allow the author to input new elements
      // like so "<<Image>>", which will generate the new Image and 
      // insert an id rightaway like so "<<Image:29>>"
      
      let newVal = $textarea.val();


      let numTextNodes = 0;
      let newLayoutArray = _.map(newVal.split('\n'), (line) => {

        if (line.match(/^<<.+>>$/) && line.split('<<').length === 2) {
          // the line looks like "<<Element>>" and it is block level
          // let id = line.replace('<<', '').replace('>>', '');
          let newOrOldId = this.ensureElementExistence(line, $textarea, layerId);
          return newOrOldId;
        } else {
          // the line looks like "<<Element>> blah blah" and it is text

          // We need to remove the helper text '<<Image:29>>' -> '<<29>>'
          let nonDetailed = line.replace(/<<.+>>/g, (embed) => {
            // but first, lets make sure it's accouted for
            let id = this.ensureElementExistence(embed, $textarea, layerId);
            return '<<' + id + '>>';
          });

          // an attempt to retain same ids on text nodes, not necessary
          // but I want to avoid elementIds from ballooning for future
          // reasons, hence the shoddy implementation.
          let oldTextId = textNodes[numTextNodes++];
          if (oldTextId !== undefined) {
            this.configModel.transformTextNode(layerId + ':' + oldTextId, nonDetailed);
            return oldTextId;
          } else {
            let newId = this.configModel.addTextNode(layerId, nonDetailed);
            textNodes.push(newId);
            return newId;
          }

        }

      });

      this.configModel.transformDocumentLayout(layerId, newLayoutArray);

      smith.change();

    });

    return el;
  }

  // Takes a string that looks like <<Element>> and creates
  // an element of type Element, returning the id
  // or
  // Takes a string that looks like <<Element:29>> and returns 29
  ensureElementExistence(string, $textarea, layerId) {
    let id = string.replace('<<', '').replace('>>', '');
    let split = id.split(':');
    if (split.length > 1) {
      // it already has an id and we return that
      return split[1];
    } else {
      // we need to create it
      let type = split[0];
      let newId = this.configModel.addElement(layerId, type);

      // also, extremely ugly, but we also update the textarea in place here
      let newVal = $textarea.val().replace(string, '<<' + type + ':' + newId + '>>');
      $textarea.val(newVal);
      // TODO reset cursor position to where it was

      return newId;
    }
}

}

module.exports = EmbeddedLayerFSPlugin;