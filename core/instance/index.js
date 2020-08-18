//instance索引文件
//引入初始化的实例对象initMixin
import { initMixin } from "./init.js";
//引入渲染混合函数renderMixin
import { renderMixin } from "./render.js"
//初始化option目标，对Jue进行配置
function Jue(option){
    this._init(option);
    this._render(option);
}
//混合初始化方法进入Jue对象
initMixin(Jue);
//混合渲染方法进入Jue对象
renderMixin(Jue);

//默认导出Jue对象
export default Jue;
