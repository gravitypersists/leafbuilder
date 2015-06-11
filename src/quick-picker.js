const $ = require('jquery');
const _ = require('lodash');
const mixin = require('./util/mixin');
const events = require('./util/events');
const manifests = require('./manifests');
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

  constructor() {
    super();
    this.$el = $(`
      <style> ${ styles } </style>
      <div class='quick-picker'>
        <ul class='picker-matches'></ul>
      </div>
    `);

    // we need to wrap this with a non contenteditable so that we
    // can place event handlers on 
    this.$container = $('<span contenteditable="false" style="position: relative;">');

    let range = getRangeFromLastCharsAfter('<');
    let $anchor = $('<span class="picker-anchor" contenteditable="true">');
    // this is kinda ugly. But I want to wrap a range in place...
    range.surroundContents($anchor[0]);
    range.surroundContents(this.$container[0]);

    this.$container.append(this.$el);
    $anchor.on('keyup', this.onKeyup.bind(this));
    $anchor.on('blur', this.close.bind(this));

    focusOnEnd($anchor[0]);
  }

  onKeyup(e) {
    e.stopPropagation();

    if (e.which === 13) { // enter
      e.preventDefault();
      let $first = $matches.children().first();
      if ($first.length) this.becomeElement($first.text());
      return;
    }

    let search = $(e.currentTarget).text().replace(/<|>/g, '');
    let options = _.filter(_.keys(manifests), (title) => {
      let regex = new RegExp('^' + search, 'i');
      return title.match(regex);
    });

    let $matches = this.$el.parent().find('.picker-matches');
    $matches.empty();
    _.each(options, (option) => {
      let fancyOption = option.replace(search, `<strong>${ search }</strong>`)
      let $li = $(`<li>${ fancyOption }</li>`);
      $matches.append($li);
      $li.on('mousedown', (e) => {
        e.preventDefault();
        this.becomeElement(option);
      });
    });

  }

  becomeElement(elementType) {
    let id = this.$container.parents('.leaf-text-el').attr('data-leaf-el');
    this.$container.replaceWith(_.escape('<<' + elementType + '>>'));
    this.emit('pick', id, elementType);
    this.close();
  }

  close() {
    this.$container.remove();
  }

}

module.exports = QuickPicker;