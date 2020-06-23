import h from 'hastscript';
import toHtml from 'hast-util-to-html';

const tree = h('.alpha', [
  'bravo ',
  h('b', 'charlie'),
  ' delta ',
  h('a.echo', {pageScroll: true}, 'foxtrot')
]);

export default toHtml(tree);
