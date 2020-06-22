import { Node } from 'unist';
import { VFile } from 'vfile';

export type CustomAttr = {
    attr: string
}

interface DoneCallbackType {
    (argv?: Error): Promise<void | Error>;
}
interface AppendCustomAttr {
    (node: Node | ExNode, opt: CustomAttr): Boolean
}
interface CoverNodes {
    (
        converter: AppendCustomAttr,
        node: Node,
        parentNode: Node | null,
        index: number,
        opt: CustomAttr
    ): void
}
interface ExNode extends Node {
    properties?: string[]
}

const snakeToCamel = (str: string) => str.replace(
    /([-_]\w)/g,
    (group) => group[1].toUpperCase()
);

const appendCustomAttr: AppendCustomAttr = (node, opt) => {
    if(
        node.type === 'element' &&
        node.tagName === 'a' &&
        // @ts-ignore
        node.properties.className &&
        // @ts-ignore
        node.properties.className.includes(opt.attr)
    ) {
        const customAttr = snakeToCamel(opt.attr);
        // @ts-ignore
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

    // @ts-ignore
    for(let i = 0; i < node.children.length; i++) {
        // @ts-ignore
        cover(converter, node.children[i], node, i, opt);
    }
};

export const customAttrHandler = (opt: CustomAttr) => {
    if(!opt) {
        console.warn('This handler need "attr" property !');
        return (node: Node, vfile: VFile, done: DoneCallbackType) => done();
    }

    return (node: Node, vfile: VFile, done: DoneCallbackType) => {
        try {
            cover(appendCustomAttr, node, null, 0, opt);
            done();
        } catch (err) {
            done(err);
        }
    };
};
