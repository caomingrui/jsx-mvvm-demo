<h2>jsx-mvvm</h2>

<p style="color: aquamarine">模板语法[[ - ]]</p>

```javascript
我是context-[[name]]
```
<p style="color: aquamarine">通过useState(initData, componentName) 修改数据</p>   
<ul style="color: rosybrown">
    <li>initData - 初始化数据</li>
    <li>componentName - 组件名称</li>
</ul>

示例：
```javascript
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
```
