import './html/index.html';
import './sass/index.scss';


// 主题

class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}
// 订阅/发布模式

class Watcher {
    constructor(vm, node, name) {
        Dep.target = this;
        this.name = name;
        this.node = node;
        this.vm = vm;
        this.update();
        Dep.target = null;
    }
    update() {
        this.get();
        this.node.nodeValue = this.value;
    }
    // 获取data中的属性值
    get() {
        // 触发相应属性的get
        this.value = this.vm[this.name];
    }
}



// 响应式的数据绑定

function observe(obj, vm) {
    Object.keys(obj).forEach(key => {
        defineReactive(vm, key, obj[key]);
    })
}

function defineReactive(obj, key, val) {
    const dep = new Dep();

    Object.defineProperty(obj, key, {
        get() {
            // 添加订阅者watcher到主题对象Dep
            if (Dep.target) dep.addSub(Dep.target);
            return val;
        },
        set(newVal) {
            if (newVal === val) return;
            val = newVal;
            // 作为发布者发出通知
            dep.notify();
        }
    });
}


function nodeToFragment(node, vm) {
    var flag = document.createDocumentFragment();
    var child;
    while (child = node.firstChild) {
        compile(child, vm);
        // 劫持node的所有子节点
        flag.appendChild(child);
    }
    return flag;
}

/**
* 数据初始化绑定
*
* @param: {type} name description
* @return: {type} description
*/
function compile(node, vm) {
    var reg = /\{\{(.*)\}\}/;
    // 节点类型为元素
    if (node.nodeType === 1) {
        var attr = node.attributes;
        // 解析属性
        for (var i = 0; i < attr.length; i++) {
            if (attr[i].nodeName == 'v-model') {
                // 获取v-model绑定的属性名
                var name = attr[i].nodeValue;
                node.addEventListener('input', e => {
                    // 给相应的data属性赋值，进而触发该属性的set方法
                    vm[name] = e.target.value;
                })
                // 将data的值赋给该node
                node.value = vm[name];
                node.removeAttribute('v-model');
            }
        }
    }

    // 节点类型为text
    if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
            // 获取匹配到的字符串
            var name = RegExp.$1;
            name = name.trim();
            // 将data的值赋给该node
            // node.nodeValue = vm[name];

            new Watcher(vm, node, name);
        }
    }
}

// function Vue(options) {
//     this.data = options.data;
//     var data = this.data;

//     observe(data, this);

//     var id = options.el;
//     var dom = nodeToFragment(document.getElementById(id), this);
//     // 编译完成后，将dom返回到app中
//     document.getElementById('app').appendChild(dom);
// }

class Vue {
    constructor(options) {
        this.data = options.data;
        var data = this.data;

        observe(data, this);

        var id = options.el;
        var dom = nodeToFragment(document.getElementById(id), this);
        // 编译完成后，将dom返回到app中
        document.getElementById('app').appendChild(dom);
    }
}


var vm = new Vue({
    el: 'app',
    data: {
        text: 'hello world',
        text2: 'text2'
    }
});
