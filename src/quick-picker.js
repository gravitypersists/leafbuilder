const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
const fs = require('fs');
const styles = fs.readFileSync(__dirname + '/../styles/quick-picker.css', 'utf8')

function focusOnEnd(el) {
  let newRange = document.createRange();
  newRange.selectNodeContents(el);
  newRange.collapse(false);
  let sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(newRange);
}

function getRangeFromLastCharsAfter(delimiter) {
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);
  let clone1 = range.cloneRange();
  clone1.setStart(range.endContainer, 0);
  let string = clone1.toString();
  let split = string.split('<');
  split.pop();
  let startAt = split.join('<').length;
  let clone2 = range.cloneRange();
  clone2.setStart(range.endContainer, startAt);
  let rect = clone2.getBoundingClientRect();
  selection.removeAllRanges();
  selection.addRange(clone2);
  return clone2;
}

class QuickPicker extends mixin(class Base{}, events) {

  constructor($el, manifests) {
    super();
    this.manifests = manifests;
    this.$el = $el;
    this.$el.html(`
      <style> ${ styles } </style>
      <ul class='picker-matches'></ul>
    `);
    this.$el.hide();
  }

  show() {
    // we need to wrap this with a non contenteditable so that we
    // can place event handlers on 
    let $container = $('<span contenteditable="false" style="position: relative;">');

    let range = getRangeFromLastCharsAfter('<');
    let $anchor = $('<span class="picker-anchor" contenteditable="true">');
    // this is kinda ugly. But I want to wrap a range in place...
    range.surroundContents($anchor[0]);
    range.surroundContents($container[0]);

    $container.append(this.$el);
    $anchor.on('keyup', this.handleKeyup.bind(this));

    focusOnEnd($anchor[0]);

    this.$el.show();
  }

  handleKeyup(e) {
    e.stopPropagation();

    if (e.which === 13) { // enter
      e.preventDefault();
      let $first = $matches.children().first();
      if ($first.length) this.becomeElement($first.text());
      return;
    }

    let search = $(e.currentTarget).text().replace(/<|>/g, '');
    let options = _.filter(_.keys(this.manifests), (title) => {
      let regex = new RegExp('^' + search, 'i');
      return title.match(regex);
    });

    let $matches = this.$el.parent().find('.picker-matches');
    $matches.empty();
    _.each(options, (option) => {
      let fancyOption = option.replace(search, `<strong>${ search }</strong>`)
      let $li = $(`<li>${ fancyOption }</li>`);
      $matches.append($li);
      $li.on('click', (e) => this.becomeElement(option));
    });

  }

  becomeElement(elementName) {

  } 


}

module.exports = QuickPicker;