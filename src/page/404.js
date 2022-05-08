
function Not (props) {
    const {history} = props;
    return (
        <div style={{'font-size': '50px', color: '#831e2a', width: '100%', 'text-align': 'center'}}>
            <p>四零四</p>
            <p>小主迷路了哦😀</p>
            <p onClick={() => history.push({path: '#/'})}>顶我回到首页</p>
        </div>
    );
}

export default Not;
