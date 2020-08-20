import VNode from "../../vdom/vnode.js";
import { getValue } from "../../util/ObjectUtil.js";
//v-for指令主程序
export function vforInit(vm,elm,parent,instructions){
    let virtualNode = new VNode(elm.nodeName,elm,[],"",getVirtualNodeData(instructions)[2],parent,0)
    virtualNode.instructions = instructions;
    parent.elm.removeChild(elm);
    parent.elm.appendChild(document.createTextNode(""));
    let resultSet = analysisInstructions(vm,instructions,elm,parent);
    return virtualNode;
}
//分析指令
//获取v-for="temp in list" 中的list
//创建节点
function analysisInstructions(vm,instructions,elm,parent){
    //获取指令数组
    let insSet = getVirtualNodeData(instructions);
    //查找数据
    let dataSet = getValue(vm._data,insSet[2]);
    if(!dataSet){
        throw new Error("error");
    }
    //创建节点
    let resultSet = [];
    for(let i = 0 ; i < dataSet.length ; i++){
        let tempDom = document.createElement(elm.nodeName);
        tempDom.innerHTML = elm.innerHTML;
        //获取局部变量
        let env = analysisKV(insSet[0],dataSet[i],i);
        //将变量设置到dom中
        tempDom.setAttribute("env",JSON.stringify(env));
        //将新dom添加到父级
        parent.elm.appendChild(tempDom);
        resultSet.push(tempDom);
    }
    return resultSet;
}
//获取指令，组装成数组
function getVirtualNodeData(instructions){
    let insSet = instructions.trim().split(" ");
    if(insSet.length != 3 || insSet[1] != "in" && insSet[1] != "of"){
        throw new Error("error");
    }
    return insSet;
}

function analysisKV(instructions,value,index){
    if(/([a-zA-Z0-9_$]+)/.test(instructions)){
        //带括号的形式
        instructions = instructions.trim();
        instructions = instructions.substring(1,instructions.length - 1 );
    }
    let keys = instructions.split(",");
    if(keys.length == 0){
        throw new Error("error");
    }
    let obj = {};
    if(keys.length >= 1){
        obj[keys[0].trim()] = value;
    }
    if(keys.length >= 2){
        obj[keys[1].trim()] = index;
    }
    return obj;
}