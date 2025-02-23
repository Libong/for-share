/*
类型声明文件 防止有些组件没有适配ts
*/
declare module "*.mjs";
declare module '*.vue' {
    import {DefineComponent} from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}
// src/shims.d.ts
declare module '@/components/common/button/test.js' {
    export function clickButton(): void;
}