const fs = require('fs');
const rehype = require('rehype');
const merge = require('deepmerge')
const gh = require('hast-util-sanitize/lib/github');
const sanitize = require('rehype-sanitize');

const schema = merge(
    gh,
    {
        attributes: {
            'a': [
                ['scroll', true],
                ['pagescroll', true],
                ['download', true],
                ['tosaka', true]
            ]
        },
        tagNames: ['math', 'mi']
    }
);

rehype()
  .data('settings', {fragment: true})
  .use(sanitize, schema)
  .process(fs.readFileSync('raw.html'), function(err, file) {
    if (err) throw err
    console.log(String(file))
  });