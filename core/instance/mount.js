import VNode from "../vdom/vnode.js";
import {
    prepareRender,
    getVnode2Template,
    getTemplate2Vnode,
    getVNodeByTemplate,
    clearMap,
} from "./render.js";
import {
    vmodel
} from "./grammer/vmodel.js";
import {
    vforInit
} from "./grammer/vfor.js";
import {
    mergeAttr
} from "../util/ObjectUtil.js";
import {
    checkVBind
} from "./grammer/vbind.js";
//主程序
//初始化挂载函数
//function initMount
//(Jue)
//Jue.prototype.$mount
//mount()
export function initMount(Jue) {
    Jue.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom);
    }
}
//定制挂载函数
export function mount(vm, elm) {
    //进行挂载
    vm._vnode = constructVNode(vm, elm, null)
    //预备渲染（建立渲染索引，通过模板找VNode，通过VNode找模板）
    prepareRender(vm, vm._vnode);
    console.log(getVnode2Template());
    console.log(getTemplate2Vnode());
}
//数组重新渲染函数
export function rebuild(vm,template){
    let virtualNode = getVNodeByTemplate(template);
    for(let i = 0 ; i < virtualNode.length ; i ++){
        virtualNode[i].parent.elm.innerHTML = "";
        virtualNode[i].parent.elm.appendChild(virtualNode[i].elm);
        let result = constructVNode(vm,virtualNode[i].elm,virtualNode[i].parent)
        virtualNode[i].parent.children = [result];
        clearMap();
        prepareRender(vm,vm._vnode);
    }
}
//工具程序
//虚拟节点构造函数
//function constructVNode
//(vm, elm, parent)
// return vnode
function constructVNode(vm, elm, parent) {
    let vnode = analysisAttr(vm, elm, parent);
    if (vnode == null) {
        //进行深度优先搜索
        //定制dom的各个属性
        let children = [];
        let text = getNodeText(elm);
        let data = null;
        let nodeType = elm.nodeType;
        let tag = elm.nodeName;
        //新建一个虚拟dom
        vnode = new VNode(tag, elm, children, text, data, parent, nodeType);
        if(elm.nodeType == 1 && elm.getAttribute("env")){
            vnode.env = mergeAttr(vnode.env,JSON.parse(elm.getAttribute("env")))
        }else{
            vnode.env = mergeAttr(vnode.env,parent?parent.env:{});
        }
    }
    checkVBind(vm,vnode);
    let childs = vnode.nodeType == 0 ? vnode.parent.elm.childNodes:vnode.elm.childNodes;
    let len = vnode.nodeType == 0 ?vnode.parent.elm.childNodes.length : vnode.elm.childNodes.length;
    for (let i = 0; i < len; i++) {
        let childNodes = constructVNode(vm, childs[i], vnode);
        //深度优先搜索  
        if (childNodes instanceof VNode) {
            //返回单一节点的时候
            vnode.children.push(childNodes);
        } else {
            //返回节点数组
            vnode.children = vnode.children.concat(childNodes)
        }
    }
    return vnode;
}
//文字节点获取函数
//function getNodeText
//(elm)
//return elm.nodeValue
//return ""
function getNodeText(elm) {
    if (elm.nodeType == 3) {
        return elm.nodeValue;
    } else {
        return "";
    }
}
//分析数组
function analysisAttr(vm, elm, parent) {
    if (elm.nodeType == 1) {
        let attrName = elm.getAttributeNames();
        if (attrName.indexOf("v-model") > -1) {
            vmodel(vm, elm, elm.getAttribute("v-model"))
        }
        if(attrName.indexOf("v-for")>-1){
            return vforInit(vm,elm,parent,elm.getAttribute("v-for"));
        }
    }
}