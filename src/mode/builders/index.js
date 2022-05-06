import {useState} from "lib/useState.js";
import 'src/mode/builders/index.less';

const Context = (props) => {
    const {setData: change} = props;
    const [data, setData] = useState({
        name: 123
    }, Context);

    change((data) => {
        data.self = (d) => setData({name: d});
        return data;
    });

    return {
        data,
        render() {
            return (
                <div onClick={() => setData({name: 111})}>
                    我是context-[[name]] - {props.name} [[name.length > 3? 1: 2]] [[name * 3]]
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
