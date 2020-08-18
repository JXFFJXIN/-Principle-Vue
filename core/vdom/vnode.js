//定义额外节点即虚拟dom，VNode
export default class VNode {
    constructor(
        tag,//标签类型DIV，SPAN，INPUT，#TEXT
        elm,//对应的真实节点
        children,//当前虚拟节点的子节点
        text,//当前虚拟节点中的文本
        data,//VNodeData类型，保留类型
        parent,//父级VNode节点
        nodeType,//节点类型
        key,
    ){
        this.tag = tag;
        this.elm = elm;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.key = key;
        this.env = {};//当前节点的环境变量，用来存放自己声明的变量，让子节点继承
        this.instructions = null;//存放指令
        this.template = [];//当前节点涉及到的模板

    }
}