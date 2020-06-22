const snakeToCamel = (str) => str.replace(
    /([-_]\w)/g,
    (group) => group[1].toUpperCase()
);

const appendCustomAttr = (node, opt) => {
    if(
        node.type === 'element' &&
        node.tagName === 'a' &&
        node.properties.className &&
        node.properties.className.includes(opt.attr)
    ) {
        const customAttr = snakeToCamel(opt.attr);
        node.properties[customAttr] = true;
        return true;
    }
    return false;
};

const cover = (converter, node, parentNode, index, opt) => {
    if(converter(node, opt)) return;
    if(!node.children) return;

    for(let i = 0; i < node.children.length; i++) {
        cover(converter, node.children[i], node, i, opt);
    }
};

const handler = (opt) => {
    if(!opt) {
        console.warn('This handler need "attr" property !');
        return (node, vfile, done) => done();
    }

    return (node, vfile, done) => {
        try {
            cover(appendCustomAttr, node, null, 0, opt);
            done();
        } catch (err) {
            done(err);
        }
    };
};