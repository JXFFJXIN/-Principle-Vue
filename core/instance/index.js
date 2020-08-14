//instance索引文件
//引入初始化的实例对象initMixin
import { initMixin } from "./init.js";

//初始化option目标，对Jue进行配置
function Jue(option){
    this._init(option);
}
//初始化Jue对象
initMixin(Jue);

//默认导出Jue对象
export default Jue;
