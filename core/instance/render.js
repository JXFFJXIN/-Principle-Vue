//通过模板，找到哪些节点用到了这个模板
let template2Vnode = new Map();
//通过节点，找到这个节点下有哪些模板
let vnode2Template = new Map();
//主程序
//function prepareRender
// (vm,vnode)
//预渲染，将文本节点进行分析，得到模板字符
export function prepareRender(vm,vnode){
    if(vnode == null){
        return;
    }
    if(vnode.nodeType == 3 ){
        //文字节点处理
        analysisTemplateString(vnode);
    }
    if(vnode.nodeType == 1 ){
        for(let i = 0 ; i < vnode.children.length ; i ++){
        //递归
            prepareRender(vm,vnode.children[i]);
        }
    }
}
//工具程序
//正则匹配模板字符串
//function analysisTemplateString
// (vnode)
// setTemplate2Vnode(templateStrList[i],vnode);
// setVnode2Template(templateStrList[i],vnode);
function analysisTemplateString(vnode){
    let templateStrList = vnode.text.match(/{{[a-zA-Z_.]+}}/g);
    for (let i = 0 ; templateStrList&&i<templateStrList.length;i++){
        setTemplate2Vnode(templateStrList[i],vnode);
        setVnode2Template(templateStrList[i],vnode);
    }
}
//设置模板映射虚拟dom
// function setTemplate2Vnode
// (template,vnode)
// template2Vnode.set(templateName,[vnode]);
// vnodeSet.push(vnode)
function setTemplate2Vnode(template,vnode){
    //获取模板字符串中的字符串名字
    let templateName = getTemplateName(template);
    var vnodeSet = template2Vnode.get(templateName);
    //判断模板名字是否在template2Vnode变量中
    if(vnodeSet){
        //如果有，就放入vnodeSet变量中，达到映射的一端
        vnodeSet.push(vnode)
    }else{
        //如果没有就在template2Vnode变量设置该值
        template2Vnode.set(templateName,[vnode]);
    }
}
//设置虚拟dom映射模板
// function setVnode2Template
// (template,vnode)
// templateSet.push(getTemplateName(template))
// vnode2Template.set(vnode,[getTemplateName(template)])
function setVnode2Template(template,vnode){
    let templateSet = vnode2Template.get(vnode);
    if(templateSet){
        templateSet.push(getTemplateName(template))
    }else{
        vnode2Template.set(vnode,[getTemplateName(template)])
    }
}
//获取模板，处理花括号
// function getTemplateName
// (template)
// return template.substring(2,template.length-2);
// return template;
function getTemplateName(template){
    //判断是否有花括号，如果有，去除，如果没有直接返回
    if(template.substring(0,2)=="{{"&&template.substring(template.length-2,template.length)=="}}"){
        return template.substring(2,template.length-2);
    }else{
        return template;
    }
}
//导出getTemplate2Vnode
export function getTemplate2Vnode(){
    console.log(template2Vnode);
}
//导出getVnode2Template
export function getVnode2Template(){
    console.log(vnode2Template)
}