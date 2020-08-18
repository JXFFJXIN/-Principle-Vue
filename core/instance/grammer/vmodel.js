//导入修改对象属性值的方法
import { setValue } from "../../util/ObjectUtil.js";
//主程序
//function vmodel
//(vm,elm,data)
export function vmodel(vm,elm,data){
    elm.onchange = function (event){
        setValue(vm._data,data,elm.value)
    }
}