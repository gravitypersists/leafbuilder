module.exports = `
/*
  Wait, what? You're seriously loading css into js?

  Yes. Yes I am. For starters, I'm experimenting. With Shadow Dom, each
  node encapsulates itself from css rules cascading from above. We do this
  in the leaf framework to allow for many many elements without interaction.
  Leafbuilder kinda hacks onto this framework by injecting itself, and so
  must inject styles as well. The styles must be injected on each shadow
  node. This was just one way I want to test keeping css files distinct!

*/

.leafbuilder-container {
  position: relative;
}

.leafbuilder-container.deep:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  background-image: url('./assets/down-arrow.gif');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.leafbuilder-container.hovered:after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  padding: 2px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.5;
  border: 1px solid red;
  border-radius: 3px;
}

.leafbuilder-container.editing .layer-menu {
  display: block;
}

.ghost {
  display: inline-block;
}

.leafbuilder-container .leaf-layer:empty {
  min-width: 50px;
  min-height: 20px;
  background-color: rgb(203, 203, 203);
  display: table;
  text-align: center;
}

.leafbuilder-container .leaf-layer:empty:after {
  content: "empty";
  font-size: 12px;
  font-family: "Helvetica";
  font-style: italic;
  color: rgb(102, 102, 102);
  display: table-cell;
  vertical-align: middle;
}

.layer-menu {
  display: none;
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

.leafbuilder-el-container {
  position: relative;
}

.leaf-layer.editing .leafbuilder-el-container:hover:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(192, 231, 255, 0.22);
  border: 1px solid rgba(0, 148, 255, 0.25);
}

.medium-editor-placeholder {
  min-width: 50px;
  min-height: 20px;
}


`