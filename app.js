import mode from './lib/mode.js';
/** @jsx window.React.createElement */
import { Input } from './src/mode/builders/index.js';
import router from "router/index.js";
const dom = document.getElementById('root');
import {JsxRouter} from "lib/route.js";

window.addEventListener('load', () => {
    mode.render((
        <JsxRouter routerList={router} mode="hash">
            <Input/>
        </JsxRouter>
    ), dom);
}, false);


window.addEventListener('hashchange', () => {
    mode.render((
        <JsxRouter routerList={router} mode="hash">
            <Input/>
        </JsxRouter>
    ), dom);
}, false);
