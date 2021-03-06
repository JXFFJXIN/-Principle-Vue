import { mount } from "./mount.js";
import { constructProxy } from "./proxy.js";
//声明Jid变量防止dom重复操作
let Jid = 0;

//导出initMixin方法
export function initMixin(Jue){
    //在使用initMixin函数时为Jue的原型上添加默认变量_init
    //并传递一个处理函数
    Jue.prototype._init = function(option){
        //声明变量vm，指代虚拟dom
        const vm = this;
        //防止dom初始化重复
        vm.Jid = Jid++;
        vm._isJue = true;
        //初始化步骤
        //1. data属性
        if(option && option.data){
            //定义虚拟对象_data属性
            vm._data = constructProxy(vm,option.data,"");
        }
        //2. created方法
        if(option && option.created){
            vm._created = option.created;
        }
        //3. methods属性
        if(option && option.methods){
            vm._methods = option.methods;
            for(let temp in option.methods){
                vm[temp] = option.methods[temp];
            }
        }
        //4. computed属性
        if(option && option.computed){
            vm._computed = option.computed;
        }
        //5. 初始化el并进行挂载
        if(option&&option.el){
            let rootDom = document.getElementById(option.el);
            mount(vm,rootDom);
        }
    }
}

