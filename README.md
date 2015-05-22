# leafbuilder
An authoring tool for creating dynamic documents

The [leaf](https://github.com/gravitypersists/leaf) repo is a standalone rendering framework, this repo is for constructing those leaves. 


## Development

This repository relies on other repositories. To pull those in, you will need to run the famous:

`git submodule update --init --recursive`

Also run:

`npm install`

`gulp` (assuming gulp is installed `npm install -g gulp`)

There is no server required. Simply open `index.html`.


### Todos (these todos are a mix of both this repo and the bare Leaf repo)

 - layout engine formalization. Starting with 'Document' layout engine type (ongoing task)
 - customization menu for layout engines (for instance, line height, paragraph spacing, for Document)
 - data persistence (perhaps Firebase for start, data should be exposed though and leafbuilder should be consumed by a CMS like application)
 - alert parent layers upon child layer edits to resize the them
 - similarly, reposition toolbox on element edits to account for resizes
 - ability to set custom layout box widths/height (if appropriate, aka Document only requires width)
 - element picker prompt (to find and input elements)
 - generalize element instantiation (research web components, html imports, etc)
 - custom implementation of copy and paste to allow for elements to be copied and moved around
 - batch edits into historical items
 - a history which allows users to revert changes
 - a 'Canvas' layout engine, with absolute positioning
 - copy paste history toolbox
 - abandon Medium Editor for a more robust custom editing engine for 'Document' layouts
 - consider using iframes for shadow dom fallback
 - ability to "Pull request" changes into existing leaf pages (data model merges)
 - allow for creation of template elements