const $ = require('jquery');
const mixin = require('./util/mixin');
const events = require('./util/events');

class LayerEditor extends mixin(class Base{}, events) {

  constructor($el) {
    super();
    this.$el = $el;
    $el.wrap('<div class="leafbuilder-container"></div>');
    this.$el = $el.parent();
    this.$el.append(`
      <style>
        .leafbuilder-container {
          display: inline-block;
          position: relative;
        }
        .leafbuilder-container.hovered {
          border: 1px solid gray;
        }
        .layer-menu {
          position: absolute;
          left: calc(100% + 4px);
          top: 0;
          margin-left: 4px;
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        .layer-menu li {
          width: 20px;
          height: 20px;
          background-color: red;
        }

      </style>
      <ul class='layer-menu'>
        <li class='config'></li>
      </ul>
    `);
    this.$el.hover(this.onHoverIn.bind(this), this.onHoverOut.bind(this));
    this.$el.find('.config').on('click', (e) => {
      console.log('click');
    });
  }

  onHoverIn(e) {
    $(e.currentTarget).addClass('hovered');
    // communicate up to parent that this was chosen
    this.emit('hovered');
  }

  onHoverOut(e) {
    $(e.currentTarget).removeClass('hovered');
  }

  setDepth(i) {
    this.$el.addClass('deep');
    console.log(i);
  }

}

module.exports = LayerEditor;