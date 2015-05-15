const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');

class Toolbox extends mixin(class Base{}, events) {

  constructor($el, leaf) {
    super();
    this.$el = $el;
    this.leaf = leaf;
    $el.html(`
      <style> ${ require('./styles/toolbox.css.js') } </style>
      <ul class='toolbox-options'>
        <li class='config'></li>
      </ul>
      <div class='toolbox-drawer'></div>
    `);
    $el.find('.config').on('click', this.handleConfig.bind(this));
    this.$drawer = $el.find('.toolbox-drawer');
  }

  // caution here, as toolbox is becoming knowledgeable about parent
  show(rect, id) {
    this.$el.css({
      top: rect.top - this.$el.parent().offset().top,
      left: rect.right - this.$el.parent().offset().left + 5
    });

    if (id) {
      this.$el.find('.config').show().on('click', (e) => {
        this.$drawer.html('hello!').show();
      });
    } else {
      this.$el.find('.config').hide();
    }

  }

  handleConfig() {
    console.log('config-clicked');
  }


}

// singleton, for now.
module.exports = Toolbox;