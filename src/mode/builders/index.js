import {useState} from "lib/useState.js";
import 'src/mode/builders/index.less';

function But () {
    const [data, setData] = useState({
        count: 0
    }, But);
    return {
        data,
        render() {
            return (
                <div onClick={() => {
                    setData((data) => {
                        data.count++;
                        return data;
                    });
                }}>点我累加 [[count]]</div>
            )
        }
    };
}

const Context = (props) => {
    const {setData: change} = props;
    const [data, setData] = useState({
        name: 123,
        a: <span style={{color: 'red'}}>我是span</span>,
        b: <span style={{color: '#488375'}}>span 2</span>,
        com: <But/>,
        list: Array.from({length: 5}, (_, index) => index + 1)
    }, Context);

    change((data) => {
        data.self = (d) => setData({name: d});
        return data;
    });

    return {
        data,
        render() {
            return (
                <div onClick={() => setData({name: 1, list: [<div>嘚嘚嘚</div>, 1,2,3]})}>
                    我是context-[[name]] - 点我修改name - a[[(d) => (d.name > 2)? d.a: d.b]] --a [[name * 3]]
                    <div>
                        a[[name]]b{`[[(o) => render('div', null, render('span', {style: {color: 'red'}}, o.name))]]`}
                    </div>
                    [[(d) => d.com]]
                    {`[[({list}) => render('div', null, list.map(res => (render('div', null, res))))]]`}
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
