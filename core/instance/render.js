//导入工具函数getValue，获得对象属性值
import {
    getValue
} from "../util/ObjectUtil.js";
//通过模板，找到哪些节点用到了这个模板
let template2Vnode = new Map();
//通过节点，找到这个节点下有哪些模板
let vnode2Template = new Map();
//主程序
//导出renderMixin函数为Jue原型添加_render方法
// function renderMixin
// (Jue)
// Jue.prototype._render=function(){renderNode(this,this._vnode);}
export function renderMixin(Jue) {
    Jue.prototype._render = function () {
        renderNode(this, this._vnode);
    }
}
//渲染入口函数
// function renderNode
// (vm,vnode)
// result = result.replace("{{"+templates[i]+"}}",templateValue);
export function renderNode(vm, vnode) {
    if (vnode.nodeType == 3) {
        //通过虚拟Dom寻找到模板变量
        let templates = vnode2Template.get(vnode);
        //必须确保变量名存在
        if (templates) {
            let result = vnode.text;
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i])
                console.log(templateValue)
                if (templateValue) {
                    //渲染，进行vnode.text以及vnode.elm.nodeValue的内容替换
                    result = result.replace("{{" + templates[i] + "}}", templateValue);
                }
            }
            vnode.elm.nodeValue = result;
        }
    }else if( vnode.nodeType == 1 && vnode.tag == "INPUT" ){
        let templates = vnode2Template.get(vnode);
        if(templates){
            for(let i = 0 ; i < templates.length ; i ++ ){
                let templateValue = getTemplateValue([vm._data,vnode.env],templates[i])
                if(templateValue){
                    vnode.elm.value = templateValue;
                }
            }
        }
    } else {
        for (let i = 0; i < vnode.children.length; i++) {
            //递归
            renderNode(vm, vnode.children[i])
        }
    }
}
//预渲染，将文本节点进行分析，得到模板字符
//function prepareRender
// (vm,vnode)
export function prepareRender(vm, vnode) {
    if (vnode == null) {
        return;
    }
    if (vnode.nodeType == 3) {
        //文字节点处理
        analysisTemplateString(vnode);
    }
    analysisAttr(vm,vnode);
    if (vnode.nodeType == 1) {
        for (let i = 0; i < vnode.children.length; i++) {
            //递归
            prepareRender(vm, vnode.children[i]);
        }
    }
}
//获取更新数据并重新渲染
// function renderData
// (vm,data)
// renderNode(vm,vnodes[i]);
export function renderData(vm, data) {
    //通过数据的改变获取虚拟dom
    let vnodes = template2Vnode.get(data);
    if (vnodes != null) {
        for (var i = 0; i < NodeList.length; i++) {
            renderNode(vm, vnodes[i]);
        }
    }
}
//工具程序
function analysisAttr(vm,vnode){
    if(vnode.nodeType != 1 ){
        return;
    }
    let attrNames = vnode.elm.getAttributeNames();
    if(attrNames.indexOf("v-model")>-1){
        setTemplate2Vnode(vnode.elm.getAttribute("v-model"),vnode);
        setVnode2Template(vnode.elm.getAttribute("v-model"),vnode);
    }
}

//正则匹配模板字符串
//function analysisTemplateString
// (vnode)
// setTemplate2Vnode(templateStrList[i],vnode);
// setVnode2Template(templateStrList[i],vnode);
function analysisTemplateString(vnode) {
    let templateStrList = vnode.text.match(/{{[a-zA-Z_.]+}}/g);
    for (let i = 0; templateStrList && i < templateStrList.length; i++) {
        setTemplate2Vnode(templateStrList[i], vnode);
        setVnode2Template(templateStrList[i], vnode);
    }
}
//设置模板映射虚拟dom
// function setTemplate2Vnode
// (template,vnode)
// template2Vnode.set(templateName,[vnode]);
// vnodeSet.push(vnode)
function setTemplate2Vnode(template, vnode) {
    //获取模板字符串中的字符串名字
    let templateName = getTemplateName(template);
    let vnodeSet = template2Vnode.get(templateName);
    //判断模板名字是否在template2Vnode变量中
    if (vnodeSet) {
        //如果有，就放入vnodeSet变量中，达到映射的一端
        vnodeSet.push(vnode)
    } else {
        //如果没有就在template2Vnode变量设置该值
        template2Vnode.set(templateName, [vnode]);
    }
}
//设置虚拟dom映射模板
// function setVnode2Template
// (template,vnode)
// templateSet.push(getTemplateName(template))
// vnode2Template.set(vnode,[getTemplateName(template)])
function setVnode2Template(template, vnode) {
    let templateSet = vnode2Template.get(vnode);
    if (templateSet) {
        templateSet.push(getTemplateName(template))
    } else {
        vnode2Template.set(vnode, [getTemplateName(template)])
    }
}
//获取模板，处理花括号
// function getTemplateName
// (template)
// return template.substring(2,template.length-2);
// return template;
function getTemplateName(template) {
    //判断是否有花括号，如果有，去除，如果没有直接返回
    if (template.substring(0, 2) == "{{" && template.substring(template.length - 2, template.length) == "}}") {
        return template.substring(2, template.length - 2);
    } else {
        return template;
    }
}
//获取模板的内容
function getTemplateValue(objs, templateName) {
    //当前节点的参数可以来自于Jue对象也可以来自于父级节点
    for (let i = 0; i < objs.length; i++) {
        let temp = getValue(objs[i], templateName);
        if (temp != null) {
            return temp;
        }
    }
    return null;
}
//导出getTemplate2Vnode
export function getTemplate2Vnode() {
    console.log(template2Vnode);
}
//导出getVnode2Template
export function getVnode2Template() {
    console.log(vnode2Template)
}