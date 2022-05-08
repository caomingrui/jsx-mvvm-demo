import {useState} from "lib/useState.js";
import routerOption from "lib/route.js";

function Home (props) {
    const {push, listen} = routerOption();
    const [data, setData] = useState({
        count: 0,
        children: 1
    }, Home);

    return {
        data,
        render() {
            return (
                <div>
                    <p onClick={() => {
                        setData((data) => {
                            data.count += 1;
                            return data;
                        });
                    }}>我是home✌</p>
                    <div>[[(d) => d.count]]</div>
                    <div onClick={() => push({path: '#/App/a'})}>跳转home/a</div>
                    <div onClick={() => push({path: '#/App'})}>跳转home</div>
                    {props.children}
                </div>
            )
        }
    }
};


export function A () {
    return <div>我是home 子路由</div>
}

export default Home;
