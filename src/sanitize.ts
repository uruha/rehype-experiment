import merge from 'deepmerge';
import gh from 'hast-util-sanitize/lib/github';

export const schema = merge(
    gh,
    {
        attributes: {
            'a': [
                ['className']
            ]
        }
    }
);
