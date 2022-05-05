function Mvvm (data = {}) {
    const dep = [];

    function handle () {
        return {
            set: function (target, attr, value) {
                target[attr] = value;
                dep.forEach(v => v.update());
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
    compile (node, data) {
        node.childNodes.forEach (node => {
            if (this.isInter(node)) {
                this.update (node, data);
            }
            else if (node.childNodes.length && !node.mode) {
                this.compile(node, data);
            }
        });
    }
    isInter (node) {
        node.tempStr = node.tempStr || node.textContent;
        return node.nodeType === 3 && (/\[\[(.*)\]\]/.test(node.textContent) || /\[\[(.*)\]\]/.test(node.tempStr));
    }
    update (node) {
        const updater = () => {
            node.textContent = render(node.tempStr, this.$data);
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
            if (!(dom instanceof HTMLElement)) {
                const {render, data} = dom;
                dom = render();
                let mvvm = new Mvvm(data);
                type.data = mvvm.data;
                new Compile(dom, mvvm.data);
            }
            dom.mode = 'Componet';
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


function render(template, context) {
    return template.replace(/\[\[(.*?)\]\]/g, (match, key) => context[key.trim()]);
}


function assignKey(template, context) {
    template.replace(/\[\[(.*?)\]\]/g, (match, key) => {
        context[key.trim()]
        return '';
    });
}

export default window.React;
