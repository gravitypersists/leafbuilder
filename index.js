// NOT es6
var $ = require('jquery');
var LeafBuilder = require('./src/leafbuilder');

var basicConfig = require('./submodules/leaf/examples/basic.json');
var stored = localStorage.getItem('leaf-config');
var parsed = (stored) ? JSON.parse(stored) : null;
var configuration = parsed || basicConfig;

new LeafBuilder($('#leafbuilder'), configuration);