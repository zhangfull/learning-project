/// <reference types="vite/client" />


import { DefineComponent } from 'vue';
declare module '*.vue' {
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
