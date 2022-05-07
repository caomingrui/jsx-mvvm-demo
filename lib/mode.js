function Mvvm (data = {}) {
    const dep = [];
    function handle () {
        return {
            set: function (target, attr, value) {
                if (target[attr] !== value) {
                    target[attr] = value;
                    dep.forEach(v => v.update());
                }
                return true;
            },
            get: function (target, attr) {
                Mvvm.target && dep.push(Mvvm.target);
                return target[attr];
            }
        };
    }

    this.data = new Proxy(data, handle());
}

class Compile {
    constructor (el, data) {
        this.$el = el;
        this.$data = data ?? {};
        this.compile (this.$el);
    }
    compile (node) {
        node.childNodes.forEach (node => {
            if (this.isInter(node)) {
                // 保存父节点信息
                node.parent = node.parentNode;
                this.update (node);
            }
            else if (node.childNodes.length && !node.mode) {
                this.compile(node);
            }
            else if (node.mode) {
            }
        });
    }
    isInter (node) {
        // 保存原始模板
        node.tempStr = node.tempStr || node.textContent;
        return node.nodeType === 3 && (/\[\[(.*)\]\]/.test(node.textContent) || /\[\[(.*)\]\]/.test(node.tempStr));
    }
    update (node) {
        const updater = () => {
            let templateData = templateRender(node, this.$data);
            if (templateData instanceof HTMLElement) {
                // 是否为替换后的node
                if (!node.parentNode) {
                    // 在将要替换 node.render 也就是旧值
                    // node.parent.insertBefore(node, node.render);
                    // node.parent.removeChild(node.render);
                    node.parent.replaceChild(templateData, node.render);
                }
                else {
                    node.parentNode.replaceChild(templateData, node);
                }
                // 替换节点会让node 信息丢失， 设定 render 指针 保存
                node.render = templateData;
                node.textContent = "";
            }
            else {
                node.textContent = templateData;
            }
        };
        updater ();
        Mvvm.target = {update: updater};
        assignKey(node.tempStr, this.$data);
        Mvvm.target = null;
    }
}



function Mode () {
    this.createElement = function (type, props , ...children) {
        if (Object.prototype.toString.call(type) == '[object Function]') {
            let dom = new type({
                ...props,
                children: children[0]
            })
            let d = props;
            if (!(dom instanceof HTMLElement)) {
                const {render, data} = dom;
                dom = render();
                let mvvm = new Mvvm(data);
                type.data = mvvm.data;
                new Compile(dom, mvvm.data);
                d = mvvm.data;
            }
            dom.mode = type.bind(null, {
                ...d,
                children: children[0]
            });
            return dom;
        }
        const dom = document.createElement(type);

        for (let key in props) {
            const attribute = props[key];
            switch (key) {
                case 'className': {
                    attribute && dom.setAttribute('class', attribute);
                    break;
                }
                case 'style': {
                    const style = Object.keys(attribute ?? {}).reduce((str, item) => {
                        str += `${item}: ${attribute[item]};`;
                        return str;
                    }, "");
                    style && dom.setAttribute('style', style);
                    break;
                }
                default: {
                    if (key.slice(0, 2) === 'on') {
                        dom.addEventListener(key.toLowerCase().slice(2), attribute.bind(null));
                    }
                    else {
                        dom.setAttribute(key, attribute);
                    }
                }
            }
        }

        children.forEach((item, index) => {
            switch (typeof item) {
                case "object": {
                    if (Array.isArray(item)) {
                        item.forEach(res => {
                            if (res instanceof HTMLElement) {
                                dom.appendChild(res);
                            }
                            else {
                                dom.appendChild(document.createTextNode(item));
                            }
                        })
                    }
                    else {
                        if (item instanceof HTMLElement) {
                            dom.appendChild(Array.isArray(item)? item[0]: item);
                        }
                        else {
                            dom.appendChild(document.createTextNode(item));
                        }
                    }

                    break;
                }
                case "string": {
                    // console.log(item, render(item, {name: 'cmr'}))
                    // break;
                }
                default: {
                    dom.appendChild(document.createTextNode(item));
                }
            }
        })

        return dom;
    }

    this.render = function (el, dom) {
        try {
            let element = el;
            if (Object.prototype.toString.call(el) === '[object Function]') {
                element = el();
            }
            dom.appendChild(element);
        }
        catch (e) {
            console.log(e);
        }
    }
}
window.React = new Mode();


/**
 * templateRender
 * @param node
 * @param context
 * @returns {HTMLSpanElement|*}
 */
function templateRender (node, context) {
    let template = node.tempStr;
    let arr = template.match(/\[\[(.*?)\]\]/g);
    // 单纯模板 非函数返回
    if (!arr.find(res => res.indexOf('=>') !== -1)) {
        return template.replace(/\[\[(.*?)\]\]/g, (match, key) => {
            return (function (o) {
                return eval('o.' + key);
            })(context);
        });
    }
    // 函数回调模板
    let el = document.createElement('span');
    el.parent = node.parentNode;
    let start = 0;
    template.replace(/\[\[(.*?)\]\]/g, (match, key, ...arg) => {
        el.appendChild(document.createTextNode(template.slice(start, arg[0])))

        let templateData = (function (o) {
            if (key.indexOf('=>') != -1) {
                return eval( `let fn = ${key}; fn(o)` );
            }
            else {
                return eval('o.' + key);
            }
        })(context);

        if (templateData instanceof HTMLElement) {
            el.appendChild(templateData);
        }
        else {
            el.appendChild(document.createTextNode(templateData));
        }

        start = match.length + arg[0];
        return "";
    });
    // console.log(el, '生成dom')
    return el;
}


/**
 * assignKey
 * @param template
 * @param context
 */
function assignKey(template, context) {
    template.replace(/\[\[(.*?)\]\]/g, (match, key) => {
        context[key.trim()]
        return '';
    });
}

export default window.React;
