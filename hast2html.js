const h = require('hastscript');
const toHtml = require('hast-util-to-html');

const tree = h('.alpha', [
  'bravo ',
  h('b', 'charlie'),
  ' delta ',
  h('a.echo', {pageScroll: true}, 'foxtrot')
]);

console.log(toHtml(tree));