const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');

class Toolbox extends mixin(class Base{}, events) {

  constructor($el) {
    super();
    this.$el = $el;
    $el.html(`
      <style> ${ require('./styles/toolbox.css.js') } </style>
      <ul class='toolbox'>
        <li class='config'></li>
      </ul>
    `);
    $el.find('.config').on('click', this.handleConfig.bind(this));
  }

  // caution here, as toolbox is becoming knowledgeable about parent
  show(rect) {
    this.$el.css({
      top: rect.top - this.$el.parent().offset().top,
      left: rect.right - this.$el.parent().offset().left + 5
    })
  }

  handleConfig() {
    console.log('config-clicked');
  }


}

// singleton, for now.
module.exports = Toolbox;