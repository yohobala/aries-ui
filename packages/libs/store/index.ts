import { ref, inject, provide, readonly, App,createApp } from 'vue';

type Calculator = {
    layeNum: number;
    increase: () => void;
    updateCount: (num: number) => void;
};

//provide的key,唯一令牌,  Symbol()返回的symbol值都是唯一的
const CalculatorSymbol = Symbol();

function calculatorProvide(app){
    //数目
    const layeNum = ref<number>(1);
    //递增方法
    const increase = () => {
        layeNum.value++;
    };
    //更新方法
    const updateCount = (num: number) => {
        layeNum.value = num;
    };
    //提供的共享状态对象
    const depends = {
        count: layeNum, //状态只读，通过方法进行修改
        increase,
        updateCount
    };
    //使用provide api实现状态对象提供(app.provide全局)
    app.provide(CalculatorSymbol, depends);
    //返回状态对象，让同级可调用
    return depends;
};


export const calculatorInject = () => {
    //使用inject api注入状态
    const calculatorContext = inject<Calculator>(CalculatorSymbol);
    // //未共享就注入的错误校验
    // if (!calculatorContext) {
    //     throw new Error('Inject must be used affer Provide');
    // }
    //返回注入的贡献状态
    return calculatorContext;
};

export default {
    install(app: App) {
        console.log("1111")
        calculatorProvide(app)
    }
}

