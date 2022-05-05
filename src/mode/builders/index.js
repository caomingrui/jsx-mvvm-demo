import {useState} from "lib/useState.js";
import 'src/mode/builders/index.less';

const Context = (props) => {
    const [data, setData] = useState({
        name: props.name
    }, Context);

    return {
        data,
        render() {
            return (
                <div onClick={() => {
                    setData({name: 'change'})
                }}>
                    我是context-[[name]]
                </div>
            );
        }
    }
}


export function Input (props) {
    const [data, setData] = useState({
        name: 'cmr',
        age: '22'
    }, Input);

    return {
        data: data,
        render() {
            return (
                <div>
                    <input type="text" onInput={keyUp}/>
                    我是[[name]]我的长度[[age]]m
                    <Context name={data.name}/>
                </div>
            )
        }
    }

    function keyUp (e) {
        let str = e.target.value;
        setData({
            name: str,
            age: str.length
        })
    }
}
