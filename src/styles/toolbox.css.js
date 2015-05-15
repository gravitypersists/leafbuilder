module.exports = `
/* 
  Wait, what? You're seriously loading css into js?
  Read the comment in layer-editor.css.js
*/

.toolbox {
  position: absolute;
  z-index: 100;
  width: 500px;
}

.toolbox-options {
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
  position: absolute;
  top: 0px;
  left: 30px;
  background-color: #ddd;
  padding: 10px;
  border-radius: 5px;
  border-top-left-radius: 0;
}

`