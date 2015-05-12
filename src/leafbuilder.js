const $ = require('jquery');
const _ = require('lodash');
const Leaf = require('../submodules/leaf/src/leaf');

let configuration = require('../submodules/leaf/examples/basic.json');
let options = { el: $('#top-node')[0] };
let leaf = new Leaf(configuration, options);

