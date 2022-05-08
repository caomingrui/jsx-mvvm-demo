import Not from "src/page/404.js";

let routerList = [];

/**
 * 观察订阅
 * @returns {{listen: (function(*=): function(): void), push: push}}
 */
function routerOption () {

    const listen = (fn) => {
        routerList.push(fn);
        return function () {
            routerList = routerList.filter((listener) => listener !== fn);
        }
    }

    const push = (state) => {
        const {path} = state;
        window.location.hash = path;
        routerList.forEach((fn) => fn( path ));
    }

    window.addEventListener('hashchange', () => {
        const path = location.hash;
        routerList.forEach((fn) => fn( path ));
    }, false);

    window.addEventListener('load', () => {
        const path = location.hash;
        routerList.forEach((fn) => fn( path ));
    }, false);

    return {
        listen,
        push
    };
}


export default routerOption;

// 空占位符
const empty = <text/>;

/**
 * Router 路由标签
 * @param props
 * @returns {Element|*}
 * @constructor
 */
export function Router (props) {
    const { hash } = location;
    const {children, path, component} = props;
    const Com = component;
    const {push} = routerOption();
    if (hash) {
        console.log(hash, path, component, <Com history={{push}}/>)
        // 粗糙版待改
        if (hash.includes(path)) {
            if (Object.prototype.toString.call(component) === '[object Function]') {
                if (children) {
                    return <Com history={{push}}>{children}</Com>;
                }
                return <Com history={{push}}/>;
            }
            return component;
        }
    }

    return empty;
}

/**
 * 是否重定向
 * @param list
 * @returns {boolean}
 */
function isRedirect (list)  {
    let state = false;
    list.forEach((res) => {

        if (res.path === location.hash) {
            state =  true;
        }
        if (res.children?.length) {
            res.children?.forEach((item) => {
                console.log(item.path, location.hash)
                if (item.path === location.hash) {
                    state =  true;
                }
            })
        }
    })
    return state;
}


/**
 * 解析路由 先俩层
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function JsxRouter (props) {
    const {push} = routerOption();
    const {
        children,
        // history 模式待定
        mode = "hash",
        routerList = []
    } = props;

    console.log(isRedirect(routerList))

    // 是否重定向 404
    if (!isRedirect(routerList)) {
        return <Not history={{
            push
        }}/>
    }

    return (
        <div>
            {
                routerList.map(res => {
                    return (
                        <Router key={res.path} {...res}>
                            <div>
                                {res.children?.map(c => (<Router {...c}/>))}
                            </div>
                        </Router>
                    )
                })
            }
            {children}
        </div>
    );
}
