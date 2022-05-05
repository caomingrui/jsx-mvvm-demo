import mode from './lib/mode.js';
/** @jsx window.React.createElement */
import { Input } from './src/mode/builders/index.js';

const dom = document.getElementById('root');

mode.render((
    <div>
        <Input/>
    </div>
), dom);
