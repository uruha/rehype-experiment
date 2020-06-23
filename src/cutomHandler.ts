import { Transformer } from 'unified';
import { Node } from 'unist';

type CustomAttr = {
    attr: string
}
type AppendedAttr = {
    [key: string]: boolean
}
type ClassName = {
    className?: string[] | undefined
}
interface N extends Node {
    children?: any[]
    properties?: ClassName & AppendedAttr
}
interface AppendCustomAttr {
    (node: N , opt: CustomAttr): boolean
}
interface CoverNodes {
    (
        converter: AppendCustomAttr,
        node: N,
        parentNode: N | null,
        index: number,
        opt: CustomAttr
    ): void
}
const snakeToCamel = (str: string) => str.replace(
    /([-_]\w)/g,
    (group) => group[1].toUpperCase()
);

const appendCustomAttr: AppendCustomAttr = (node, opt) => {
    if(
        node.type === 'element' &&
        node.tagName === 'a' &&
        node.properties &&
        node.properties.className &&
        node.properties.className.includes(opt.attr)
    ) {
        const customAttr = snakeToCamel(opt.attr);
        node.properties[customAttr] = true;
        return true;
    }
    return false;
};

const cover: CoverNodes = (
    converter, node, parentNode, index, opt
): void => {
    if(converter(node, opt)) return;
    if(!node.children) return;

    for(let i = 0; i < node.children.length; i++) {
        cover(converter, node.children[i], node, i, opt);
    }
};

export const customAttrHandler = (opt: CustomAttr): Transformer => {
    if(!opt) {
        return (node, vfile, next) => {
            console.warn('This handler need "attr" property !');
            // @ts-ignore
            next();
        };
    }

    return (node, vfile, next) => {
        try {
            cover(appendCustomAttr, node, null, 0, opt);
            // @ts-ignore
            next();
        } catch (err) {
            // @ts-ignore
            next(err);
        }
    };
};
