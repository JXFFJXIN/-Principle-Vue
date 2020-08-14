//创建对象的代理机制
function constructObjectProxy(vm,obj,namespace){
    let proxyObj = {};
    for(let prop in obj){
        //给代理对象指定代理
        Object.defineProperty(proxyObj,prop,{
            configurable:true,
            get(){
                return obj[prop];
            },
            set:function(value){
                obj[value] = value;
            }
        });
        //给虚拟dom创建代理
        Object.defineProperty(vm,prop,{
            configurable:true,
            get(){
                return obj[prop];
            },
            set:function(value){
                obj[prop] = value;
            }
        })
    }
    //将代理对象导出
    return proxyObj;
}
//实现数据同步修改时，需要知道哪个属性被修改了，才能进行下一步的修改 
//必须捕获修改的这个事件 
//利用代理的性质对修改事件进行捕获
export function constructProxy(vm,obj,namespace){
    //vm,需要代理的Jue对象
    //obj，需要代理的对象
    //namespace，命名空间
    //思路：递归代理
    let proxyObj = null;
    if(obj instanceof Array){
        //判断对象是否是数组
    }else if(obj instanceof Object){
        //判断对象是否是对象
        proxyObj = constructObjectProxy(vm,obj,namespace);
    }else{
        throw new Error("error");
    }
}