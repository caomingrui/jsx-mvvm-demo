import {useState} from "lib/useState.js";
import 'src/mode/builders/index.less';

const Context = (props) => {
    const {setData: change} = props;
    const [data, setData] = useState({
        name: 123,
        a: <span style={{color: 'red'}}>我是span</span>,
        b: <span style={{color: '#488375'}}>span 2</span>
    }, Context);

    change((data) => {
        data.self = (d) => setData({name: d});
        return data;
    });

    return {
        data,
        render() {
            return (
                <div onClick={() => setData({name: 1})}>
                    我是context-[[name]] - - a[[(d) => (d.name > 2)? d.a: d.b]] --a [[name * 3]]
                    <div>
                        [[() => <span>123123</span>]]
                    </div>
                </div>
            );
        }
    }
}


export function Input (props) {
    const [data, setData] = useState({
        name: 'cmr',
        age: '22',
        self: null
    }, Input);

    return {
        data: data,
        render() {
            return (
                <div>
                    <input type="text" onInput={keyUp}/>
                    我是[[name]]我的长度[[age]]米
                    <Context setData={setData}/>
                </div>
            )
        }
    }

    function keyUp (e) {
        let str = e.target.value;
        setData({
            name: str,
            age: str.length
        });
        data.self(str);
    }
}
