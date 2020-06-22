import fs from 'fs';
import rehype from 'rehype';

// hast AST tree
import hastTree from './hast2html';
console.log(hastTree);

// rehype sanitize
import { schema } from './sanitize';
import sanitize from 'rehype-sanitize';

// custom handler
import { customAttrHandler } from './cutomHandler';


rehype()
  .data('settings', {fragment: true})
  .use(sanitize, schema)
  // @ts-ignore
  .use(customAttrHandler, { attr: 'page-scroll' })
  .process(fs.readFileSync(`${__dirname}/raw.html`), function(err, file) {
    if (err) throw err
    console.log(String(file))
  });