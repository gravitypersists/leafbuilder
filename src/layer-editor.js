const $ = require('jquery');

class LayerEditor {

  constructor($el) {
    $el.wrap('<div class="leafbuilder-container"></div>');
    let $parent = $el.parent();
    $parent.append(`
      <style>
        .leafbuilder-container {
          display: inline-block;
        }
        .leafbuilder-container.hovered {
          border: 1px solid gray;
        }
      </style>
    `);
    $parent.hover(this.onHoverIn, this.onHoverOut);
  }

  onHoverIn(e) {
    e.stopPropagation();
    $(this).addClass('hovered');
    // communicate up to parent that this was chosen
  }

  onHoverOut(e) {
    $(this).removeClass('hovered');
  }  

}

module.exports = LayerEditor;