module.exports = `
/* 
  Wait, what? You're seriously loading css into js?
  Read the comment in layer-editor.css.js
*/

.toolbox {
  position: absolute;
  z-index: 100;
}

.toolbox-options {
  background-color: red;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.toolbox-options li {
  width: 30px;
  height: 30px;
  background-color: gray;
}

.toolbox-drawer {
  display: none;
}

`