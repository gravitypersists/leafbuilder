module.exports = `
/* 
  Wait, what? You're seriously loading css into js?
  Read the comment in layer-editor.css.js
*/

.leafbuilder-el-container.editing:after {
  content: "";
  position: absolute;
  top: -2px !important;
  left: -2px !important;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0) !important;
  border: 1px solid rgba(0, 148, 255, 0.75);
  padding: 2px;
}

`