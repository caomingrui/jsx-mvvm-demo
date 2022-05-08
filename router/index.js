import home, { A } from 'src/page/home.js';

/**
 * 路由注册表
 * @type {[{path: string, component: (function(*): {data: *|update, render(): *}), children: [{path: string, component: ((function(): *)|*)}], name: string}, {path: string, component: ((function(): *)|*)}]}
 */
const router = [
    {
        path: '#/App',
        component: home,
        name: 'Home',
        children: [
            {
                path: '#/App/a',
                component: A
            }
        ]
    },
    {
        path: '#/jjj',
        component: A
    }
];

export default router;
