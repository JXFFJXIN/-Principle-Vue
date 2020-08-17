//主程序区域
//定义虚拟dom和dom的代理proxy
//创建对象的代理机制
//function constructObjectProxy
//(vm,obj,namespace)
//return proxyObj;
function constructObjectProxy(vm, obj, namespace) {
    let proxyObj = {};
    for (let prop in obj) {
        //给代理对象指定代理
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set: function (value) {
                console.log(getNameSpace(namespace, prop))
                obj[value] = value;
            }
        });
        //给虚拟dom创建代理
        Object.defineProperty(vm, prop, {
            configurable: true,
            get() {
                return obj[prop];
            },
            set: function (value) {
                console.log(getNameSpace(namespace, prop))
                obj[prop] = value;
            }
        });
        if (obj[prop] instanceof Object) {
            //判断是否为嵌套nesting
            proxyObj[prop] = constructProxy(vm, obj[prop], getNameSpace(namespace, prop))
        }
    }
    //将代理对象导出
    return proxyObj;
}
//实现数据同步修改时，需要知道哪个属性被修改了，才能进行下一步的修改 
//必须捕获修改的这个事件 
//利用代理的性质对修改事件进行捕获
//function constructProxy
//(vm,obj,namespace)
//return proxyObj
export function constructProxy(vm, obj, namespace) {
    //vm,需要代理的Jue对象
    //obj，需要代理的对象
    //namespace，命名空间
    //思路：递归代理
    let proxyObj = null;
    if (obj instanceof Array) {
        //判断对象是否是数组
        //新建一个新的数组
        proxyObj = new Array(obj.length);
        //循环源数组
        for (let i = 0; i < obj.length; i++) {
            //返回值的每一项都进行递归
            proxyObj[i] = constructProxy(vm,obj[i],namespace)
        }
    } else if (obj instanceof Object) {
        //判断对象是否是对象
        proxyObj = constructObjectProxy(vm, obj, namespace);
    } else {
        throw new Error("error");
    }
    console.log(proxyObj);
    return proxyObj;
}
//设置数组的代理方法
function proxyArray(vm, arr, namespace) {
    var obj = {
        //用一个对象进行代理
        eleType: "Array",
        toString: function () {
            let result = "";
            for (let i = 0; i < arr.length; i++) {
                result += arr[i] + ",";
            }
            return result.substring(0, result.length - 1);
        },
        push() {},
        pop() {},
        shift(){},
        unshift() {},
    };
    defArrayFunc.call(vm, obj, "push", namespace, vm);
    defArrayFunc.call(vm, obj, "pop", namespace, vm);
    defArrayFunc.call(vm, obj, "shift", namespace, vm);
    defArrayFunc.call(vm, obj, "unshift", namespace, vm);
    arr.__proto__ = obj;
    return arr;
}

//工具程序区域
// 设置命名空间，展示需要修改数据的位置
//function getNameSpace
//(nowNamespace,nowProp)
//return nowNamespace +"."+nowProp;
function getNameSpace(nowNamespace, nowProp) {
    //传递当前的命名空间以及当前项
    if (nowNamespace == null || nowNamespace == "") {
        return nowProp;
    } else if (nowProp == null || nowProp == "") {
        return nowNamespace;
    } else {
        return nowNamespace + "." + nowProp;
    }
}
//将数组原型提取出来
//function defArrayFunc
//(obj,func,namespace,vm)
//return result;
const arrayProto = Array.prototype;
//设置数组方法的初始方法
function defArrayFunc(obj, func, namespace, vm) {
    Object.defineProperty(obj, func, {
        enumerable: true,
        configurable: true,
        value: function (...args) {
            //将数组原型的func方法传递给original变量
            let original = arrayProto[func];
            //应用到返回变量result传递给初始化函数的value属性中
            const result = original.apply(this, args);
            console.log(getNameSpace(namespace, ""));
            return result;
        }
    })
}