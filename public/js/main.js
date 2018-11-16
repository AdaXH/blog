//Base64
(function (global, factory) { typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(global) : typeof define === "function" && define.amd ? define(factory) : factory(global) })(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this, function (global) { "use strict"; var _Base64 = global.Base64; var version = "2.4.8"; var buffer; if (typeof module !== "undefined" && module.exports) { if (typeof navigator != "undefined" && navigator.product == "ReactNative") { } else { try { buffer = require("buffer").Buffer } catch (err) { } } } var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; var b64tab = function (bin) { var t = {}; for (var i = 0, l = bin.length; i < l; i++)t[bin.charAt(i)] = i; return t }(b64chars); var fromCharCode = String.fromCharCode; var cb_utob = function (c) { if (c.length < 2) { var cc = c.charCodeAt(0); return cc < 128 ? c : cc < 2048 ? fromCharCode(192 | cc >>> 6) + fromCharCode(128 | cc & 63) : fromCharCode(224 | cc >>> 12 & 15) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | cc & 63) } else { var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320); return fromCharCode(240 | cc >>> 18 & 7) + fromCharCode(128 | cc >>> 12 & 63) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | cc & 63) } }; var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g; var utob = function (u) { return u.replace(re_utob, cb_utob) }; var cb_encode = function (ccc) { var padlen = [0, 2, 1][ccc.length % 3], ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0), chars = [b64chars.charAt(ord >>> 18), b64chars.charAt(ord >>> 12 & 63), padlen >= 2 ? "=" : b64chars.charAt(ord >>> 6 & 63), padlen >= 1 ? "=" : b64chars.charAt(ord & 63)]; return chars.join("") }; var btoa = global.btoa ? function (b) { return global.btoa(b) } : function (b) { return b.replace(/[\s\S]{1,3}/g, cb_encode) }; var _encode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (u) { return (u.constructor === buffer.constructor ? u : buffer.from(u)).toString("base64") } : function (u) { return (u.constructor === buffer.constructor ? u : new buffer(u)).toString("base64") } : function (u) { return btoa(utob(u)) }; var encode = function (u, urisafe) { return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g, function (m0) { return m0 == "+" ? "-" : "_" }).replace(/=/g, "") }; var encodeURI = function (u) { return encode(u, true) }; var re_btou = new RegExp(["[À-ß][-¿]", "[à-ï][-¿]{2}", "[ð-÷][-¿]{3}"].join("|"), "g"); var cb_btou = function (cccc) { switch (cccc.length) { case 4: var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536; return fromCharCode((offset >>> 10) + 55296) + fromCharCode((offset & 1023) + 56320); case 3: return fromCharCode((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2)); default: return fromCharCode((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1)) } }; var btou = function (b) { return b.replace(re_btou, cb_btou) }; var cb_decode = function (cccc) { var len = cccc.length, padlen = len % 4, n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0), chars = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 255), fromCharCode(n & 255)]; chars.length -= [0, 0, 2, 1][padlen]; return chars.join("") }; var atob = global.atob ? function (a) { return global.atob(a) } : function (a) { return a.replace(/[\s\S]{1,4}/g, cb_decode) }; var _decode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (a) { return (a.constructor === buffer.constructor ? a : buffer.from(a, "base64")).toString() } : function (a) { return (a.constructor === buffer.constructor ? a : new buffer(a, "base64")).toString() } : function (a) { return btou(atob(a)) }; var decode = function (a) { return _decode(String(a).replace(/[-_]/g, function (m0) { return m0 == "-" ? "+" : "/" }).replace(/[^A-Za-z0-9\+\/]/g, "")) }; var noConflict = function () { var Base64 = global.Base64; global.Base64 = _Base64; return Base64 }; global.Base64 = { VERSION: version, atob: atob, btoa: btoa, fromBase64: decode, toBase64: encode, utob: utob, encode: encode, encodeURI: encodeURI, btou: btou, decode: decode, noConflict: noConflict }; if (typeof Object.defineProperty === "function") { var noEnum = function (v) { return { value: v, enumerable: false, writable: true, configurable: true } }; global.Base64.extendString = function () { Object.defineProperty(String.prototype, "fromBase64", noEnum(function () { return decode(this) })); Object.defineProperty(String.prototype, "toBase64", noEnum(function (urisafe) { return encode(this, urisafe) })); Object.defineProperty(String.prototype, "toBase64URI", noEnum(function () { return encode(this, true) })) } } if (global["Meteor"]) { Base64 = global.Base64 } if (typeof module !== "undefined" && module.exports) { module.exports.Base64 = global.Base64 } else if (typeof define === "function" && define.amd) { define([], function () { return global.Base64 }) } return { Base64: global.Base64 } });

//querySelectAll兼容IE
if (!document.querySelectorAll) {
    document.querySelectorAll = function (selectors) {
        var style = document.createElement('style'), elements = [], element;
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];

        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);
        style.parentNode.removeChild(style);

        while (document._qsa.length) {
            element = document._qsa.shift();
            element.style.removeAttribute('x-qsa');
            elements.push(element);
        }
        document._qsa = null;
        return elements;
    };
}

if (!document.querySelector) {
    document.querySelector = function (selectors) {
        var elements = document.querySelectorAll(selectors);
        return (elements.length) ? elements[0] : null;
    };
}

// 用于在IE6和IE7浏览器中，支持Element.querySelectorAll方法
var qsaWorker = (function () {
    var idAllocator = 10000;

    function qsaWorkerShim(element, selector) {
        var needsID = element.id === "";
        if (needsID) {
            ++idAllocator;
            element.id = "__qsa" + idAllocator;
        }
        try {
            return document.querySelectorAll("#" + element.id + " " + selector);
        }
        finally {
            if (needsID) {
                element.id = "";
            }
        }
    }

    function qsaWorkerWrap(element, selector) {
        return element.querySelectorAll(selector);
    }

    // Return the one this browser wants to use
    return document.createElement('div').querySelectorAll ? qsaWorkerWrap : qsaWorkerShim;
})();
//


// author: Ada
// web:https://www.adaxh.applinzi.com
class Mobile {
    constructor(options) {
        this.items = (options && options.menu && options.menu.length !== 0) ? options.menu : [
            {
                name: 'menu1',
                callback: () => console.log('click menu1')
            },
            {
                name: 'menu2',
                callback: () => console.log('click menu2')
            }
        ] //初始化菜单，以及点击菜单的操作
        this.appendTarget = options && options.target || document.body //插件将插入的容器
        /*手机的背景图*/
        this.bg = options && options.bg || 'http://www.rui2.net/uploadfile/output/3/2013/1001/4acf64758d420524.jpg'
        this.ul = {} //菜单列表
        this.interval = undefined //刷新时间的定时器
        this.menuColor = options && options.menuColor || 'black' //菜单文字颜色
        this.searchInterval = undefined //搜索入口的特效定时器
        this.searchCallback = options && options.searchCallback || function (search) { console.log(search) } //点击搜索触发的操作
        this.appendNodes = [] //需要插入手机容器的元素集合
    }
    start() {
        if (this.appendNodes.length !== 0)
            this.renderTime() //刷新手机屏幕上的时间
        if (document.getElementById('_container') && document.getElementById('_container').childNodes.length !== 0) //判断页面是否已经存在插件
            return
        this.init()
        setTimeout(() => { //初始化载入插件时，首次自动旋转
            this.container.style.transform = 'rotateX(45deg) rotateY(68deg) rotateZ(-45deg) scale(1.3)'
            setTimeout(() => {
                this.container.style.transform = 'rotateX(60deg) rotateZ(45deg) rotateY(0deg) scale(1.3)'
            }, 1000);
        }, 1000);
    }
    end() { //清楚定时器，并移除插件
        if (this.interval)
            clearInterval(this.interval)
        if (this.searchInterval)
            clearInterval(this.searchInterval)
        document.getElementById('_container') && this.appendTarget.removeChild(document.getElementById('_container'))
    }
    endInterval() { //仅清楚定时器
        if (this.interval)
            clearInterval(this.interval)
        if (this.searchInterval)
            clearInterval(this.searchInterval)
    }
    init() { //初始化插件
        this.createOperationUl()
        this.addMouseEnter(this.ul)
        this.appendNodes = [
            this.createTopface,
            this.createBackface,
            this.createRight,
            this.createLeft,
            this.createBottom,
            this.createForward,
            this.createOperation
        ]
        this.createContainer(this.appendNodes) //创建手机容器，并将需要插入的元素的集合传递过去，在this.createContainer中插入
        if (!this.interval)
            this.renderTime() //刷新手机屏幕上的时间
    }
    addMouseEnter({ ul, ul2, ul3 }) {  //hover菜单时，侧屏hover效果
        const _this = this
        const li1 = ul.getElementsByTagName('li')
        const li2 = ul2.getElementsByTagName('li')
        const li3 = ul3.getElementsByTagName('li')
        for (let i = 0; i < li1.length; i++) {
            li1[i].onmouseover = function () {
                recover(li1, {
                    background: 'none',
                    paddingLeft: '10px',
                    color: _this.menuColor,
                })
                recover(li2, { background: 'none' })
                recover(li3, { background: 'none' })
                this.style.background = '#A4D768'
                this.style.paddingLeft = '20px'
                this.style.color = 'white'
                li2[i].style.background = '#A4D768'
                li3[i].style.background = '#A4D768'
            }
        }
        ul.onmouseleave = function () {
            recover(li1, {
                background: 'none',
                paddingLeft: '10px',
                color: _this.menuColor
            })
            recover(li2, {
                background: 'none'
            })
            recover(li3, {
                background: 'none'
            })
        }
    }
    createClock() { //时间容器
        const clock = document.createElement('div')
        setStyle(clock, clockStyle)
        const time = document.createElement('p')
        time.setAttribute('id', 'menu_plugin_clock')
        setStyle(time, timeStyle)
        clock.appendChild(time)
        return clock
    }
    renderTime() { //刷新时间
        const clock = document.getElementById('menu_plugin_clock')
        const search = document.getElementById('_search')
        this.searchInterval = setInterval(() => {
            search.style.opacity = '0.2'
            setTimeout(() => {
                search.style.opacity = '1'
            }, 1500)
        }, 3000)
        this.interval = setInterval(() => {
            const d = new Date()
            const h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
            const m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
            const s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
            clock.innerText = '' + h + ' : ' + m + ' : ' + s
        }, 1000)
    }
    createSearch() { //搜索
        const _this = this
        const search = document.createElement('div')
        search.setAttribute('id', '_search')
        const input = document.createElement('input')
        setStyle(input, inputStyle)
        setStyle(search, searchStyle)
        input.placeholder = 'O'
        input.addEventListener('focus', function () {
            this.style.width = '140px'
            clearInterval(_this.searchInterval)
            this.style.paddingLeft = '20px'
            this.style.textAlign = 'left'
            this.placeholder = ''
        }, false)
        input.addEventListener('blur', function () {
            this.style.width = '25px'
            this.style.paddingLeft = '0px'
            this.style.textAlign = 'center'
            this.placeholder = 'O'
            _this.searchInterval = setInterval(() => {
                search.style.opacity = '0.2'
                setTimeout(() => {
                    search.style.opacity = '1'
                }, 1500)
            }, 3000)
        }, false)
        input.addEventListener('keydown', function (e) {
            const ev = e || window.event
            if (ev.keyCode === 13)
                _this.searchCallback(this.value)
        }, false)
        search.appendChild(input)
        return search
    }
    createContainer(nodes) { //创建手机的容器，以及子元素
        const container = document.createElement('div')
        setStyle(container, containerStyle)
        container.setAttribute('id', '_container')
        for (let item of nodes) {
            if (/Object/.test(Object.prototype.toString.call(item.call(this)))) {
                const obj = item.call(this)
                for (let key in obj)
                    container.appendChild(obj[key])
            } else
                container.appendChild(item.call(this))
        }
        this.container = container
        this.appendTarget.style.perspective = '1400px'
        this.appendTarget.style.transformStyle = 'preserve-3d'
        this.appendTarget.appendChild(container)
    }
    createOperation() { //手机旋转
        const leftO = document.createElement('p')
        leftO.innerText = ' <'
        setStyle(leftO, leftOstyle)
        leftO.addEventListener('click', () => {
            this.container.style.transform = 'rotateX(60deg) rotateZ(45deg) rotateY(0deg) scale(1.3)'
        }, false)
        const rightO = document.createElement('p')
        rightO.innerText = ' >'
        setStyle(rightO, rightOstyle)
        rightO.addEventListener('click', () => {
            this.container.style.transform = 'rotateX(45deg) rotateZ(-45deg) rotateY(0deg) scale(1.3)'
        }, false)
        const closeO = document.createElement('p')
        closeO.innerText = 'x'
        closeO.addEventListener('click', () => {
            this.container.style.transform = 'rotateX(0deg) rotateZ(0deg) rotateY(0deg) scale(1)'
        }, false)
        setStyle(closeO, closeOStyle)
        return { leftO, rightO, closeO }
    }
    createTopface() { //手机的上面
        const top = document.createElement('div')
        const barrery = document.createElement('div')
        const barreryStatus = document.createElement('div')
        const sign = document.createElement('div')
        const statusBar = document.createElement('div')
        sign.innerText = '.....'
        barreryStatus.innerText = '100%'
        setStyle(statusBar, statusBarStyle)
        setStyle(barrery, barreryStyle)
        setStyle(barreryStatus, barreryStatusStyle)
        setStyle(top, topStyle)
        setStyle(sign, singStyle)
        top.appendChild(this.ul.ul)
        const lis = this.ul.ul.getElementsByTagName('li')
        top.style.background = `url(${this.bg})`
        top.style.backgroundSize = 'cover'
        statusBar.appendChild(barreryStatus)
        statusBar.appendChild(barrery)
        statusBar.appendChild(sign)
        top.appendChild(statusBar)
        top.appendChild(this.createClock())
        top.appendChild(this.createSearch())
        return top
    }
    createBackface() { //手机的背面
        const back = document.createElement('div')
        setStyle(back, backStyle)
        back.style.background = `url(${this.bg})`
        back.style.backgroundSize = 'cover'
        return back
    }
    createLeft() { //手机的左面
        const left = document.createElement('div')
        setStyle(left, leftStyle)
        left.style.background = `url(${this.bg}) left`
        left.style.backgroundSize = 'cover'
        left.appendChild(this.ul.ul3)
        return left
    }
    createRight() { //手机的右面
        const right = document.createElement('div')
        setStyle(right, rightStyle)
        right.style.background = `url(${this.bg}) right`
        right.style.backgroundSize = 'cover'
        right.appendChild(this.ul.ul2)
        return right
    }
    createBottom() { //手机的下面
        const bottom = document.createElement('div')
        setStyle(bottom, bottomStyle)
        bottom.style.background = `url(${this.bg}) bottom`
        bottom.style.backgroundSize = 'cover'
        return bottom
    }
    createForward() { //手机的前面
        const forward = document.createElement('div')
        setStyle(forward, forwardStyle)
        forward.style.background = `url(${this.bg}) top`
        forward.style.backgroundSize = 'cover'
        return forward
    }
    createOperationUl() { //菜单
        const ul = document.createElement('ul')
        const ul2 = document.createElement('ul')
        const ul3 = document.createElement('ul')
        for (let item of this.items) {
            const li = document.createElement('li')
            const li2 = document.createElement('li')
            const li3 = document.createElement('li')
            li.innerText = item.name
            if (item.callback)
                li.addEventListener('click', item.callback, false)
            ul.appendChild(setStyle(li, li1Style))
            li.style.color = this.menuColor
            li2.style.height = '30px'
            li2.style.transition = 'all ease .3s'
            li2.style.boxSizing = 'border-box'
            li3.style.height = '30px'
            li3.style.transition = 'all ease .3s'
            li3.style.boxSizing = 'border-box'
            ul2.appendChild(li2)
            ul3.appendChild(li3)
        }
        setStyle(ul, ul1Style)
        setStyle(ul2, ul2Style)
        setStyle(ul3, ul2Style)
        this.ul = { ul, ul2, ul3 }
    }
}

// function

function recover(els, keys) { //恢复el的初识样式
    for (let item of els)
        for (let key in keys)
            item.style[key] = keys[key]
}

function setStyle(el, styles) { //设置el样式
    if (!el || !styles) return null
    if (!styles) return el
    for (let key in styles)
        el.style[key] = styles[key]
    return el
}
/* 对应的元素的样式  */

const leftOstyle = {
    position: 'absolute',
    left: '300px',
    bottom: '50px',
    cursor: 'pointer',
    fontSize: '20px',
    'text-shadow': '0px 10px 10px rgba(6, 5, 5, 0.9)',
}

const statusBarStyle = {
    position: 'absolute',
    width: '100%',
    height: '20px',
    top: '6x'
}

const barreryStyle = {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '20px',
    height: '8px',
    background: 'white',
    borderRadius: '3px',
}

const singStyle = {
    position: 'absolute',
    top: '-2px',
    left: '6px',
    color: 'white',
    fontSize: '25px',
    lineHeight: '8px'
}

const barreryStatusStyle = {
    position: 'absolute',
    width: '20px',
    top: '6px',
    right: '35px',
    lineHeight: '8px',
    textAligin: 'center',
    color: 'white',
    fontSize: '12px',
    transform: 'scale(0.7)'
}

const closeOStyle = {
    position: 'absolute',
    bottom: '50px',
    cursor: 'pointer',
    fontSize: '20px',
    'text-shadow': '0px 10px 10px rgba(6, 5, 5, 0.9)',
    left: '400px'
}

const rightOstyle = {
    position: 'absolute',
    right: '200px',
    bottom: '50px',
    cursor: 'pointer',
    fontSize: '20px',
    'text-shadow': '0px 10px 10px rgba(6, 5, 5, 0.9)',
}

const clockStyle = {
    position: ' absolute',
    width: '200px',
    height: '100px',
    top: '20px'
}

const inputStyle = {
    outline: 'none',
    border: 'none',
    display: 'block',
    margin: '0px auto',
    cursor: 'pointer',
    textAlign: 'center',
    width: '25px',
    transition: 'all .3s',
    height: '25px',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '12.5px',
    color: '#666',
    fontSize: '12px'
}

const searchStyle = {
    willChange: 'opacity',
    width: '200px',
    height: '30px',
    position: 'absolute',
    top: '130px',
    opacity: '0.2',
    filter: 'alpha(opacity = 20)',
    transition: 'all 1s',
    'transform-style': 'preserve-3d',
    'transform': 'translateZ(1px)'
}

const timeStyle = {
    textAlign: 'center',
    lineHeight: '100px',
    fontSize: '20px',
    color: 'white'
}

const ul2Style = {
    width: '20px',
    position: 'absolute',
    bottom: '20px',
    minHeight: '70px',
}

const ul1Style = {
    position: 'absolute',
    bottom: '20px',
    left: '0',
    cursor: 'pointer',
    minHeight: '70px',
    'transform-style': 'preserve-3d',
    'transform': 'translateZ(0.1px)'
}

const li1Style = {
    transformStyle: 'preserve-3d',
    transform: 'translateX(-1px)',
    padding: '0 0 0 10px',
    height: '30px',
    'line-height': '30px',
    width: '200px',
    // 'border-bottom': '1px solid #eee',
    fontSize: '12px',
    transition: 'all ease .3s',
    'box-sizing': 'border-box',
    cursor: 'pointer'
}

const bottomStyle = {
    'transform-style': 'preserve-3d',
    transform: 'rotateX(90deg) rotateY(0deg) rotateZ(0deg) translateY(-10px) translateZ(-10px)',
    position: 'absolute',
    'box-sizing': 'border-box',
    width: '200px',
    top: '430px',
    left: '300px',
    height: '20px',
    'transform-origin': 'left',
    'background-size': 'auto',
    borderRadius: '10px',
}

const forwardStyle = {
    'transform-style': 'preserve-3d',
    transform: 'rotateX(90deg) rotateY(0deg) rotateZ(0deg) translateY(-10px) translateZ(-10px)',
    position: 'absolute',
    'box-sizing': 'border-box',
    width: '200px',
    top: '30px',
    left: '300px',
    height: '20px',
    'transform-origin': 'left',
    'background-size': 'auto',
    borderRadius: '10px',
}

const rightStyle = {
    'transform-style': 'preserve-3d',
    position: 'absolute',
    'box-sizing': 'border-box',
    width: '20px',
    height: '400px',
    left: '480px',
    top: '50px',
    'background-size': 'cover',
    transform: 'rotateY(90deg) translateZ(10px)  translateX(10px)',
    borderRadius: '10px',
}

const leftStyle = {
    'transform-style': 'preserve-3d',
    position: 'absolute',
    'box-sizing': 'border-box',
    width: '20px',
    'transform-style': 'preserve-3d',
    height: '400px',
    left: '280px',
    top: '50px',
    'background-size': 'cover',
    transform: 'rotateY(-90deg) translateX(-10px) translateY(0px) translateZ(-10px)',
    borderRadius: '10px',
}

const topStyle = {
    width: '200px',
    height: '400px',
    left: '300px',
    top: '50px',
    zIndex: '1',
    'transform-origin': 'top',
    'background-size': 'cover',
    border: '0.5px solid white',
    position: 'absolute',
    borderRadius: '5px',
    'box-sizing': 'border-box',
    transformStyle: 'preserve-3d',
    transform: 'translateZ(0px)'
}

const backStyle = {
    width: '200px',
    height: '400px',
    left: '300px',
    top: '50px',
    'transform-origin': 'top',
    'background-size': 'cover',
    position: 'absolute',
    borderRadius: '10px',
    'box-sizing': 'border-box',
    'box-shadow': '0px 50px 50px rgba(6, 5, 5, 0.9)',
    transformStyle: 'preserve-3d',
    transform: 'translateZ(-20px)'
}

const shadowStyle = {
    'transform-style': 'preserve-3d',
    width: '200px',
    height: '400px',
    left: '300px',
    top: '50px',
    'transform-origin': 'top',
    position: 'absolute',
    'box-sizing': 'border-box',
    background: 'transparent',
    transform: 'translateZ(-100px)'
}

const containerStyle = {
    'will-change': 'transform',
    width: '700px',
    height: '600px',
    position: 'absolute',
    top: '50%',
    zIndex: '5',
    left: '41%',
    margin: '-300px 0 0 -350px',
    perspective: '1400px',
    'transform-style': 'preserve-3d',
    'transform-origin': 'center',
    transition: 'all 1s'
}

// Author:AdaXH
// 2018-1-31
//loading
const src = [
    "./../upload/user_avatar/lyy.jpg",
    "./../resouce/images/qq.png",
    "./../resouce/images/load.png",
    "./../resouce/images/qzone.png",
    "./../resouce/images/wechat.png",
    "./../resouce/images/ly.jpg",
    "./../resouce/bg/1.jpg",
    "./../resouce/bg/2.jpg",
    "./../resouce/bg/3.jpg",
    "./../resouce/bg/4.jpg",
    "./../resouce/bg/5.jpg",
    "./../resouce/bg/6.jpg",
    './../upload/user_avatar/default_avatar.jpg',
    "./../resouce/gallery/1.jpg",
    "./../resouce/gallery/2.jpg",
    "./../resouce/gallery/3.jpg",
    "./../resouce/gallery/4.jpg",
    "./../resouce/gallery/5.jpg",
    "./../resouce/gallery/6.jpg",
    "./../resouce/gallery/7.jpg",
    "./../resouce/gallery/8.jpg",
    "./../resouce/gallery/9.jpg",
    "./../resouce/gallery/10.jpg",
    "./../resouce/gallery/11.jpg",
    "./../resouce/gallery/12.jpg",
    "./../resouce/images/loading.png",
    "./../resouce/images/loading1.png",
    "./../resouce/images/point.png",
    "./../resouce/images/time.png",
    "./../resouce/images/title.png",
    "./../resouce/images/type.png",
    "./../resouce/images/menu.jpg"
]
let len = 0
const l = src.length
for (let item of src) {
    const img = new Image()
    img.src = item
    img.onload = function () {
        len++
        check(len)
    }
    img.onerror = function () {
        len++
        check(len)
    }
}

function check(len) {
    document.getElementById('percentText').innerText = '' + (parseFloat(len / l) * 100).toFixed(0)
    if (len === l) {
        const childEle = document.getElementById('srcLoading')
        setTimeout(() => childEle.parentNode.removeChild(childEle), 800)
    }
}

//hashRoute
class HashRoute {
    constructor(map) {
        this.map = map
        this.routes = {}
        this.curUrl = ''
    }
    reload() {
        this.curUrl = location.hash.substring(0) || '#/index'
        this.routes[this.curUrl]()
    }
    init() {
        for (let item of this.map)
            this.routes[item.url] = item.map
        window.addEventListener('hashchange', this.reload.bind(this))
    }
}
function hashRouter() {
    const navs = document.querySelectorAll('header .nav li')
    const router = new HashRoute([
        {
            url: '#/index',
            map: () => mapToHash('#/index')
        },
        {
            url: '#/article',
            map: () => mapToHash('#/article')
        },
        {
            url: '#/message',
            map: () => mapToHash('#/message')
        },
        {
            url: '#/about',
            map: () => mapToHash('#/about')
        }
    ])
    router.init()
    function mapToHash(url) {
        for (let nav of navs) {
            if (nav.firstChild.getAttribute('href') === url) {
                nav.firstChild.click()
                return
            }
        }
    }
}
//glitch
class Glitch {
    constructor(el) {
        this.option = {
            el: el,
            zIndexDefault: 3,
            effect1TimeMin: 600,
            effect1TimeMax: 900,
            effect2TimeMin: 10,
            effect2TimeMax: 115,
            time: 100
        }
    }
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    init() {
        const el1 = this.option.el.cloneNode(true)
        el1.style.zIndex = '' + this.option.zIndexDefault
        this.option.el.parentNode.appendChild(el1)

        const el2 = this.option.el.cloneNode(true)
        this.option.el.parentNode.appendChild(el2)
        el2.className += ' front-3'
        el2.style['z-index'] = '' + (this.option.zIndexDefault + 1);

        const el3 = this.option.el.cloneNode(true)
        this.option.el.parentNode.appendChild(el3)
        el3.style['z-index'] = '' + (this.option.zIndexDefault + 2);
    }
    setStyle(el, styles) {
        for (let key in styles)
            el.style[key] = styles[key]
        return el
    }
    mix() {
        const clipPos1 = this.randomInt(10, 1900);
        const clipPos2 = 9999;
        const clipPos3 = this.randomInt(10, 1300);
        const clipPos4 = 0;
        const leftValue = this.randomInt(0, 40);
        const rightValue = this.randomInt(0, 40);
        const scaleValue = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);
        const randomTime = this.randomInt(this.option.effect2TimeMin, this.option.effect2TimeMax);

        this.setStyle(this.option.el.parentNode.children[1], {
            'clip': 'rect(' + clipPos1 + 'px, ' + clipPos2 + 'px, ' + clipPos3 + 'px,' + clipPos4 + 'px)',
            'left': leftValue,
            'right': rightValue,
            '-webkit-transform': 'scale(' + scaleValue + ')',
            '-ms-transform': 'scale(' + scaleValue + ')',
            'transform': 'scale(' + scaleValue + ')',
            'mix-blend-mode': 'hue'
        })
    }
    glitch1() {
        const clip1 = this.randomInt(10, 1900);
        const clip2 = 9999;
        const clip3 = this.randomInt(10, 1300);
        const clip4 = 0;
        const left = this.randomInt(0, 16);
        const right = this.randomInt(0, 16);
        const randomTime = this.randomInt(this.option.effect1TimeMin, this.option.effect1TimeMax);

        this.setStyle(this.option.el.parentNode.children[2], {
            'clip': 'rect(' + clip1 + 'px, ' + clip2 + 'px, ' + clip3 + 'px,' + clip4 + 'px)',
            'right': right,
            'left': left
        })
    }
    glitch2() {
        const clip1 = this.randomInt(10, 1900);
        const clip2 = 9999;
        const clip3 = this.randomInt(10, 1300);
        const clip4 = 0;
        const left = this.randomInt(0, 40);
        const right = this.randomInt(0, 40);
        const randomTime = this.randomInt(this.option.effect2TimeMin, this.option.effect2TimeMax);
        const scale = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);

        this.setStyle(this.option.el.parentNode.children[3], {
            'clip': 'rect(' + clip1 + 'px, ' + clip2 + 'px, ' + clip3 + 'px,' + clip4 + 'px)',
            'left': left,
            'right': right,
            '-webkit-transform': 'scale(' + scale + ')',
            '-ms-transform': 'scale(' + scale + ')',
            'transform': 'scale(' + scale + ')',
        })
    }
    start() {
        this.init()
        setInterval(() => {
            this.glitch1();
            this.glitch2();
            this.mix();
        }, this.option.time);
    }
}

function exitLoginRegCancel() {
    document.getElementsByClassName('exit')[0].onclick = () => {
        exitLoginRegFace();
    }
}
function loginFn(name) {  //login
    const regObj = new RegisterClass(name)
    const registerInfo = document.getElementsByClassName('registerInfo')
    const loginInfo = document.getElementsByClassName('loginInfo')[0]
    const loginRegister = document.getElementsByClassName('login_register')[0]
    const d = new Date(-1)

    _('.new_login', 'click', function () {
        const text = this.children[1].innerText
        showLoginRegFace()
        // return
        if (/登陆/.test(text)) {
            document.getElementById("login").style.display = 'block'
            for (let item of registerInfo)
                item.style.display = 'none'
            loginInfo.style.display = 'block'
            regObj.signUp()
        }
        else {
            document.cookie = 'user=' + name + '; path=/; ' + 'expires=' + d;
            sessionStorage.removeItem('user')
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
    })
}

function setStyle(el, styles) {
    for (let key in styles)
        el.style[key] = styles[key]
    return el
}

function showLoginRegFace() {
    const loginRegister = document.getElementsByClassName('login_register')[0]
    const bars = document.getElementsByClassName('bar')
    const effect = document.getElementsByClassName('login-effect')[0]
    setStyle(loginRegister, {
        display: 'block',
        'z-index': '999'
    })
    setTimeout(() => {
        for (let item of bars)
            toggleClass(item, 'showBar')
        toggleClass(effect, 'setLogin')
    }, 10)
}

function toggleClass(el, name) {
    const className = el.className
    if (eval('/' + name + '/').test(className))
        el.className = className.replace(eval('/' + name + '/g'), '')
    else
        el.className = className + ' ' + name
}

function register() { //register
    const regObj = new RegisterClass()
    const login = document.getElementById('login')
    const registerInfo = document.getElementsByClassName('registerInfo')
    _('.new_register', 'click', function () {
        login.style.display = 'none'
        for (let el of registerInfo)
            el.style.display = 'block'
        document.getElementsByClassName('loginInfo')[0].style.display = 'none'
        showLoginRegFace()
        regObj.reg()
        regObj.signUp()
    })
}

class RegisterClass {  //register fn

    constructor(name) {
        if (name === undefined) name = 'Ada';
        this.name = name;
    }

    reg() {
        const register = document.getElementById('register')
        register.onclick = () => {
            const name = document.getElementById('username').value
            const pwd = document.getElementById('check_password').value
            const pwd1 = document.getElementById('password').value
            if (/\s/.test(name)) {
                infoContainer('用户名不能包含空格', false)
                return
            }
            if (name.length > 30) {
                infoContainer('用户名字符长度不能超过30', false)
                return
            }
            if (/\s/.test(pwd1)) {
                infoContainer('密码不能包含空格', false)
                return
            }
            if (name === self.name) {
                infoContainer('请输入用户名', false)
                return;
            }
            if (name === '') {
                infoContainer('请输入用户名', false)
                return;
            }
            if (pwd1 === '') {
                infoContainer('请输入密码', false)
                return;
            }
            if (pwd1 && pwd1.length < 6 || pwd1 && pwd1.length > 15) {
                infoContainer('密码长度:6-15位', false)
                return;
            }
            if (pwd1 !== pwd) {
                infoContainer('两次密码不一致', false)
                return;
            }
            fetch('/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ name, pwd: Base64.encode(pwd) })
            }).then(res => {
                if (res.status >= 200 && res.status < 300)
                    return res.json()
                return res
            }).then(data => {
                if (data && data.success)
                    infoContainer('注册成功，请登录', true, () => setLogin())
                else
                    infoContainer(data && data.errorMsg || '网络出错' + data.status)
            })
        }
    }

    signUp() {
        const login = document.getElementById('login')
        login.onclick = () => {
            const na = document.getElementById('username').value
            const state = document.querySelectorAll('.register input[type=checkbox]')[0].checked
            const password = document.getElementById('password').value
            if (na === '') {
                infoContainer('请输入用户名', false)
                return;
            }
            if (password === '') {
                infoContainer('请输入密码', false)
                return;
            }
            fetch('/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ name: na, pwd: Base64.encode(password), state })
            }).then(res => {
                if (res.status >= 200 && res.status < 300)
                    return res.json()
                return res
            }).then(data => {
                if (data && data.success) {
                    const naText = document.getElementsByClassName('user_name')[0]
                    const showLoginSuccess = document.getElementsByClassName('showLoginSuccess')
                    window.sessionStorage && sessionStorage.getItem('user') && sessionStorage.removeItem('user')
                    sessionStorage && sessionStorage.setItem('user', Base64.encode(na))
                    naText.innerText = na
                    exitLoginRegFace()
                    repeatCon(na)
                    uploadAvatar(Base64.decode(sessionStorage.getItem('user')))
                    getAvatar(Base64.decode(sessionStorage.getItem('user')))
                    if ((window.innerWidth > 750)) 
                        for (let item of showLoginSuccess)
                            item.style.display = 'block'
                    if (data.avatar)
                        for (let el of document.getElementsByClassName('.avatar_img'))
                            el.src = data.avatar
                    messageOperation(na)
                    if (data.admin) {
                        adminToggle()
                        publishDynamic()
                        publishItem()
                        deleteDynamic()
                        deleteArticle()
                        // adminEdit()
                        updateArticle()
                        editDynamic()
                        adminUI()
                    }
                    document.querySelectorAll('.new_login span')[0].innerText = '注销'
                    loginFn();
                } else infoContainer(data && data.errorMsg || '网络错误' + data.status)
            })
        }
    }
}

function exitLoginRegFace() {
    const bars = document.getElementsByClassName('bar')
    const loginRegister = document.getElementsByClassName('login_register')[0]

    toggleClass(document.getElementsByClassName('login-effect')[0], 'setLogin')
    setTimeout(() => {
        for (let item of bars)
            toggleClass(item, 'showBar')
        setTimeout(() => {
            setStyle(loginRegister, {
                'z-index': '0',
                display: 'none'
            })
        }, 1000);
    }, 650);

}

function setLogin() {
    const setLoginItem = document.getElementsByClassName('setLoginItem')

    for (let el of setLoginItem)
        el.style.display = 'block'
    document.getElementById("check_password").style.display = 'none'
    document.getElementsByClassName('login-effect')[0].style.height = '267px'
}

function messageCount(count) {
    const repeatCount = document.querySelectorAll('.repeatCount')
    repeatCount[0].innerText = count + '评论'
    repeatCount[1].innerText = count + '人参与'
}

function removeClass(el, name) {
    //console.log(el,eval('/' + name + '/').test(el.getAttribute('class')))
    if (!eval('/' + name + '/').test(el.getAttribute('class')))
        return
    el.className = el.className.replace(eval('/' + name + '/g'), '')
}
function addClass(el, name) {
    //console.log('add', el.getAttribute('class'),eval('/' + name + '/').test(el.getAttribute('class')))
    if (eval('/' + name + '/').test(el.getAttribute('class')))
        return
    el.className += ' ' + name
}

function showArticle() {  //show full article when click article's summary
    const articlesTarget = document.querySelectorAll('.article_list .article')

    _('.article_list .article', 'click', function (e) {
        if (document.querySelector('.context-menu').style.display === 'block')
            document.querySelector('.context-menu').style.display = 'none'
        for (let el of articlesTarget) {
            removeClass(el, 'showArticle')
            removeClass(el.childNodes[7], 'toggleP')
            removeClass(el.childNodes[3], 'showClose')
        }
        const _id = this.getAttribute('_id')
        const viewer = this.childNodes[1].children[1]
        updateViewer(_id, Number(viewer.innerText), viewer.childNodes[1], this)
        addClass(this, 'showArticle')
        addClass(this.childNodes[3], 'showClose')
        addClass(this.childNodes[7], 'toggleP')
        showArticlePrepare(this.childNodes[3])
        closeArticle(this)
        e.stopPropagation()
    })
}

function updateViewer(_id, viewer, el, _this) {
    if (_this.isClick) return
    fetch('/updateArticleViewerById', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application'
        },
        body: JSON.stringify({ _id, viewer })
    }).then(res => {
        if (res.json) return res.json()
    }).then(data => {
        if (data && data.success) {
            el.innerText = String(viewer + 1)
            _this.isClick = true
        }
    })
}

function showArticlePrepare(param) {   //before show full article
    addClass(document.querySelectorAll('.right_article_list')[0], 'rightArticleHide')
    param.style.display = 'block'
}

function closeArticle(temp, k) {        //close full article
    temp.childNodes[3].onclick = function (e) {
        removeClass(temp, 'showArticle')
        removeClass(temp.childNodes[7], 'toggleP')
        removeClass(document.querySelectorAll('.right_article_list')[0], 'rightArticleHide')
        var e = e || window.event;
        e.stopPropagation();
        document.querySelector('.context-menu').style.display = 'none'
        removeClass(this, 'showClose')
    }
}

function selectNav() {      //nav
    const navs = document.querySelectorAll('header .nav li a')
    const face = document.querySelectorAll('.screen main .all .face')
    const url = ['index', 'article', 'message', 'about']
    const ps = document.querySelectorAll('.screen main .all .face:nth-of-type(3) .message_box .message_list .message_item p.message_content')
    const users = document.querySelectorAll('.screen main .all .face:nth-of-type(3) .message_box .message_list .message_item .user')
    const infos = document.querySelectorAll('.screen main .all .face:nth-of-type(2) .article_list li .article-info')
    const h2s = document.querySelectorAll('.screen main .all .face:nth-of-type(2) .article_list li .article_summary h2:nth-of-type(1)')
    const titles = document.querySelectorAll('.screen main .all .center_bar .dynamic li.dynamic_item .title')
    const summarys = document.querySelectorAll('.screen main .all .center_bar .dynamic li.dynamic_item .summary')
    addClass(face[0], 'face1')
    _('.leave_message', 'click', () => {
        navs[2].click()
    })
    for (let i = 0; i < navs.length; i++)
        navs[i].onclick = function () {
            removeClass(face[0], 'face1')
            if (i === 2) {
                for (let i = 0; i < users.length; i++) {
                    addClass(users[i], 'titleShow')
                    addClass(ps[i], 'titleShow')
                }
            } else
                for (let i = 0; i < users.length; i++) {
                    removeClass(users[i], 'titleShow')
                    removeClass(ps[i], 'titleShow')
                }
            if (i === 0) {
                for (let i = 0; i < titles.length; i++) {
                    addClass(titles[i], 'titleShow')
                    addClass(summarys[i], 'titleShow')
                }
            } else
                for (let i = 0; i < titles.length; i++) {
                    removeClass(titles[i], 'titleShow')
                    removeClass(summarys[i], 'titleShow')
                }
            if (i === 1) {
                for (let i = 0; i < h2s.length; i++) {
                    addClass(h2s[i], 'titleShow')
                    addClass(infos[i], 'titleShow')
                }
            } else
                for (let i = 0; i < h2s.length; i++) {
                    removeClass(h2s[i], 'titleShow')
                    removeClass(infos[i], 'titleShow')
                }
            if (i === 3) {
                const _this = this
                if (!this.isIntroduce) {
                    const text = document.getElementById('introduce_textarea')
                    fetch('/introduce', {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'content-type': 'application/json'
                        }
                    }
                    ).then(res => {
                        if (200 <= res.status && res.status < 300)
                            return res.json()
                        return res.status
                    }).then(result => {
                        if (result && result.success) {
                            introduce(0, result.introduce);
                            text.value = result.introduce
                            _this.isIntroduce = true
                        }
                    }).catch(err => infoContainer(err && err.errorMsg || err))
                }
            }
            for (let f of face)
                removeClass(f, 'faceShow')
            addClass(face[i], 'faceShow')
        }
}

function loading() {
    const dots = document.querySelectorAll('.loading_dot div');
    let arr = [];
    let len = dots.length;
    const btn = document.getElementsByClassName('loading_btn')[0]
    for (let i = 0; i < len; i++) {
        arr.push(dots[i].offsetTop);
    }
    btn.onmouseup = function () {
        for (let el of dots)
            el.style.display = 'block'
        btn.style.top = '30px'
        window.onmousemove = null;
        window.onmouseup = function () {
            for (let el of dots)
                el.style.display = 'block'
            btn.style.top = '30px'
            window.onmousemove = null;
            return false;
        };
        return false;
    };
    btn.onmousedown = function (e) {  //loading
        var e = e || window.event;
        let downY = e.clientY;
        window.onmousemove = function (e) {
            var e = e || window.event;
            let y = e.clientY - downY + 25;
            eatDot(arr, y - 25, dots);
            btn.style.top = y + 'px'
            checkLoadingFinished(y);
            return false;
        }
    };
}

function checkLoadingFinished(y) { //load finished
    const box = document.getElementsByClassName('loading_center_box')[0]
    const load = document.querySelectorAll('.loadingY')
    if (y >= 280) {
        window.onmousemove = null;
        box.style.display = 'none'
        for (let el of load)
            el.style.height = '0'
        setTimeout(function () {
            document.getElementsByClassName('loading')[0].style.display = 'none'
        }, 1000);
        addClass(document.getElementsByClassName('screen')[0], 'screenShow')
    }
} //loading finished

function eatDot(arr, y, dots) {//dot hide
    let long = arr.length;
    for (let j = 0; j < long; j++) {
        (y >= arr[j]) ?
            dots[j].style.display = 'none'
            :
            dots[j].style.display = 'block'
    }
}

function loginWarning() {
    const btn = document.querySelector('.menu_toggle')
    btn.onclick = () => {
        removeClass(document.querySelectorAll('.new_login')[1], 'tada')
        setTimeout(() => addClass(document.querySelectorAll('.new_login')[1], 'tada'))
    }
}

function uploadAvatar(name) {
    if (name === undefined || name.length >= 30) return
    const upload = document.getElementById('avatar')
    const img = document.getElementsByClassName('avatar_img')
    upload.addEventListener('change', function () {
        const file = this.files[0]
        const fileName = file.name
        if (!/image\/\w+/.test(file.type)) {
            infoContainer("请确保文件为图像类型", false)
            return
        }
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = function () {
            const avatar = this.result
            fetch('/set-avatar',
                {
                    method: 'POST',
                    body: JSON.stringify({ avatar, name, fileName }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(res => {
                    if (res.status <= 200 && res.status < 300)
                        return res.json()
                    return res
                }).then(data => {
                    (data && data.success) ?
                        infoContainer('更新头像成功', true, () => {
                            for (let item of img)
                                item.src = `/upload/user_avatar/${fileName}`
                        })
                        :
                        infoContainer(data && data.errorMsg || '网络出错 ' + data.status)
                })
        }
    }, false)
}

function getAvatar(name) {
    if (name === undefined || name.length >= 100) return
    const img = document.getElementsByClassName('avatar_img')
    fetch('/get-avatar', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            name: Base64.encode(JSON.stringify({ name: name })
            )
        })
    }).then(res => {
        if (res.status >= 200 && res.status < 300)
            return res.json()
        return res
    }).then(data => {
        if (data && data.success)
            for (let item of img)
                item.src = data.data
        else
            infoContainer(data && data.errorMsg || '网络出错' + data.status, false)
    })
}

function repeatCon(name) {
    const p = document.querySelectorAll('.message_list')[0]
    const users = document.getElementsByClassName('_user')
    const ps = document.getElementsByClassName('message_content')
    p.addEventListener('click', function (e) {
        const ev = e || window.event
        if (/repeat_msg/.test(ev.target.className)) {
            if (name === undefined || name.length >= 30) {
                infoContainer('你还没有登陆', false)
                return
            }
            const _id = ev.target.getAttribute('_id')
            const toRepeat = ev.target.getAttribute('_to_repeat')
            if (name) {
                sendRepeat((d, word) => {
                    fetch('/repeatMsg', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            'accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _id,
                            msg: {
                                info: word,
                                name,
                                date: d,
                                toRepeat
                            }
                        })
                    }).then(res => {
                        if (res.status >= 200 && res.status < 300)
                            return res.json()
                        return res.status
                    }).then(result => {
                        loadingUI('end')
                        if (result && result.success) {
                            document.querySelectorAll('.repeat_word')[0].value = ''
                            reRenderMsg(result.data)
                            for (let i = 0; i < users.length; i++) {
                                addClass(users[i], 'titleShow')
                                addClass(ps[i], 'titleShow')
                            }
                            document.querySelectorAll('.cancel_repeat')[0].click()
                        } else
                            infoContainer(result && result.errorMsg || '网络繁忙' + result)
                    })
                })
            }
            else {
                infoContainer('你还没有登陆', false)
            }
        }
    }, false)
}

function escapeMessage(str) {
    if (!str) return '';
    else return str.replace(/<\/?script>+|傻逼+|爸爸+|你爸+|SB+|sB+|sb+|操+|你妈/g, '**');
}

function sendRepeat(callback) {
    const overLay = document.querySelectorAll('.repeat_over')[0]
    overLay.style.display = 'block'
    addClass(overLay, 'bounceIn')
    document.querySelectorAll('.cancel_repeat')[0].onclick = () => {
        overLay.style.display = 'none'
        removeClass(overLay, 'bounceIn')
    }
    document.querySelectorAll('.submit_repeat')[0].onclick = function () {
        const word = escapeMessage(document.querySelectorAll('.repeat_word')[0].value)
        let date = new Date()
        let minute = date.getMinutes()
        minute < 10 ? minute + 1 : '0' + minute
        let seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let d = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + seconds
        if (word === '' || word.trim() === '') {
            infoContainer('回复内容不能为空', false)
            return
        }
        if (word.length > 280) {
            infoContainer('内容不能超过280字', false)
            return
        } else {
            loadingUI('start')
            callback && callback(d, word)
        }
    }
}

function messageOperation(name) {
    name = name || sessionStorage && sessionStorage.getItem('user') || undefined
    const p = document.querySelectorAll('.message_list')[0]

    if (!name) return

    isAdmin(name, () => {
        p.addEventListener('click', function (e) {
            const ev = e || window.event
            if (/delete_msg/.test(ev.target.className)) {
                const _id = ev.target.getAttribute('_id')
                const _this = ev.target
                const li = this
                loadingUI('start')
                fetch('/deleteMsgById', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({ _id })
                }).then(res => {
                    if (res.status >= 200 && res.status < 300)
                        return res.json()
                    return res.status
                }).then(result => {
                    loadingUI('end')
                    if (result && result.success) {
                        const defaultV = _('.temp_ul li:first-of-type')
                        _('.temp_ul li:first-of-type').innerText = (parseInt(defaultV.innerText) - 1) + '评论'
                        _('.temp_ul li:last-of-type').innerText = (parseInt(defaultV.innerText) - 1) + '人参与'
                        infoContainer('删除成功', true)
                        li.removeChild(_this.parentNode.parentNode)
                    } else
                        infoContainer(result && result.errorMsg || '网络繁忙' + result)
                })
            }
        }, false)
    }).catch(err => { })
}

function isAdmin(name, callback) {
    if (!name || name === '') return
    return new Promise((resolve, reject) => {
        fetch('/checkAdmin', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                name: Base64.encode(JSON.stringify({ name: name })
                )
            })
        }).then(res => {
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            if (result && result.success) {
                resolve(result.data)
                callback && callback()
            } else
                reject(result && result.errorMsg || '获取权限失败' + result)
        })
    })
}

function checkPerssion(name) {
    if (!name || Base64.decode(name) == undefined) {
        deleteDynamicRepeat(false)
        return
    }
    isAdmin(name).then(perssion => {
        if (perssion) {
            adminToggle();
            publishDynamic();
            publishItem()
            deleteDynamic();
            deleteArticle();
            // adminEdit()
            updateArticle()
            editDynamic()
            deleteDynamicRepeat(true)
            adminUI()
        }
    }).catch(err => {
        const menus = document.querySelectorAll('.menu_toggle')
        for (let m of menus)
            m.addEventListener('click', _ =>
                infoContainer(err, false))
        deleteDynamicRepeat(false)
    })
}

function adminUI() {
    const deleteDynamicRepeat = document.querySelectorAll('.deleteDynamicRepeat')
    const deleteMsg = document.querySelectorAll('.delete_msg')
    for (let el of deleteDynamicRepeat)
        el.style.cursor = 'pointer'
    for (let el of deleteMsg)
        el.style.cursor = 'pointer'
}

function deleteDynamicRepeat(perrsion) {
    const deleteDynamicRepeat = document.querySelectorAll('.deleteDynamicRepeat')
    for (let el of deleteDynamicRepeat)
        el.style.cursor = !perrsion ? 'not-allowed' : 'pointer'
    if (perrsion) {
        const dynamics = document.querySelectorAll('.dynamic')[0]
        dynamics.addEventListener('click', function (ev) {
            if (/deleteDynamicRepeat/.test(ev.target.className)) {
                const _id = ev.target.getAttribute('_id')
                const msgId = ev.target.getAttribute('_msgid')
                const li = ev.target.parentNode

                loadingUI('start')
                fetch('/deleteDynamicMsg', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({ _id, msgId })
                }).then(ans => {
                    if (200 <= ans.status && ans.status < 300)
                        return ans.json()
                    return ans.status
                }).then(result => {
                    loadingUI('end')
                    if (result && result.success) {
                        infoContainer('删除成功', true)
                        li.parentNode.removeChild(li)
                    } else
                        infoContainer('删除失败' + result && result.errorMsg || result)
                })
            }
        }, false)
    }
}

function loginState() {
    const arr = document.cookie.split('; ')
    const b = []
    const spans = document.querySelectorAll('.all_user span')
    for (let i in arr)
        b.push(arr[i].split('='))
    let count = 0
    loginFn(name)
    for (let item of b) {
        if (item[0] === 'user' || window.sessionStorage && sessionStorage.getItem('user')) {
            if (window.sessionStorage && !sessionStorage.getItem('user')) sessionStorage.setItem('user', item[1])
            rememberLoginState(Base64.decode(sessionStorage.getItem('user') || item[1]));
            for (let el of spans) el.innerText = '注销'
            getAvatar(Base64.decode(sessionStorage.getItem('user') || item[1]))
            repeatCon(Base64.decode(sessionStorage.getItem('user') || item[1]))
            uploadAvatar(Base64.decode(sessionStorage.getItem('user') || item[1]))
            document.querySelector('#avatar').style.display = 'block'
            messageOperation(Base64.decode(sessionStorage.getItem('user') || item[1]))
            checkPerssion(Base64.decode(sessionStorage.getItem('user') || item[1]))
            return
        } else count++
    }
    if (count === b.length) {
        loginWarning();
        getAvatar('Ada')
        messageOperation(undefined)
        repeatCon(undefined)
        document.querySelector('#avatar').style.display = 'none'
        for (let el of spans) el.innerText = '登陆'
        document.querySelector('.user_name').innerText = 'Ada'
        const name = sessionStorage && sessionStorage.getItem('user') && Base64.decode(sessionStorage.getItem('user')) || undefined
        checkPerssion(name)
    }
}

function _(el, type, callback) {
    const els = document.querySelectorAll(el)
    if (!callback && !type) { //only get elements
        if (els.length > 1) return els
        else return els[0]
    }
    if (!!type && !!callback) //event callback
        for (let item of els)
            item.addEventListener(type, callback.bind(item), false)
    if (!type && !!callback) //another way to handle element
        for (let item of els)
            callback.call(item)
}

function adminToggle() {
    document.querySelector('#editIntroduce').onclick = () => {
        const val = document.querySelector('#introduce_textarea').value
        if (val.length >= 300) {
            infoContainer('不能超过300个字符', !1)
            return
        }
        if (val.trim() === '') {
            infoContainer('不能为空', !1)
            return
        }
        fetch('/updateIntroduce', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ introduce: val })
        }).then(res => {
            if (200 <= res.status && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            result && result.success ?
                infoContainer('更新成功', 1)
                :
                infoContainer(result, !1)
        }).catch(err => infoContainer(err && err.errorMsg || err))
    }
    _('.adminMobile', 'click', () => {
        _('.menu_toggle').click()
    })
    document.querySelector('.menu_toggle').onclick = function () {
        _('.admin', !1, function () {
            toggleClass(this, 'adminToggle')
        })
        _('header', !1, function () {
            toggleClass(this, 'headerToggle')
        })
        _('main', !1, function () {
            toggleClass(this, 'mainToggle')
        })
        _('.menu_toggle', !1, function () {
            toggleClass(this, 'btnToggle')
        })
        _('.adminContainer', !1, function () {
            toggleClass(this, 'showADminContainer')
        })
        const lis = _('.admin_menu li')
        if (/adminToggle/.test(_('.admin').className)) {
            _('.admin_menu li:nth-of-type(1) a').click()
            setTimeout(() => {
                for (let i = 0; i < lis.length; i++)
                    setTimeout(() => {
                        addClass(lis[i], 'liShow')
                    }, i * 300)
                _('.edit_ui', !1, function () {
                    addClass(this, 'uiFromRight')
                })
            }, 300)
        }
        else {
            _('.edit_ui', !1, function () {
                removeClass(this, 'uiFromRight')
            })
            for (let el of lis)
                removeClass(el, 'liShow')
        }
    }
} //admin menu

function rememberLoginState(name) { //user select remember login state
    _('.user_name').innerHTML = name

    _('.loading').style.display = 'none'
    addClass(document.getElementsByClassName('screen')[0], 'screenShow')
}

function infoContainer(data, status, callback) {
    _('.result-info p').innerText = data
    setTimeout(() => {
        if (status) {
            _('.result-info', !1, function () {
                removeClass(this, 'false_dialog')
                addClass(this, 'true_dialog')
            })
            _('.result-info i', !1, function () {
                this.style.color = '#52c41a'
                this.innerHTML = '&#xe6b3;'
            })
        } else {
            _('.result-info i', !1, function () {
                this.style.color = '#f5222d'
                this.innerHTML = '&#xe67a;'
            })
            _('.result-info', !1, function () {
                removeClass(this, 'true_dialog')
                addClass(this, 'false_dialog')
            })
        }
    }, 0);
    _('.result-info').style.display = 'block'
    if (/tada/.test(_('.result-info').className)) {
        setTimeout(() => {
            _('.result-info').style.display = 'none'
            callback && callback()
        }, 2500)
    }
}

function publishDynamic() {
    _('#publish_dw', 'click', function () {
        const title = _('#dw_title').value
        const content = _('#short_article_textarea').value
        const count = parseInt(_('.edit_li span').innerHTML)
        const date = new Date();
        const d = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
        const temp = {
            title: title,
            summary: content
        };
        if (checkBeforePublish(temp)) {
            if (count < 0) {
                infoContainer('文字超出限制', false);
                return;
            }
            loadingUI('start')
            fetch('/addDynamic', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ title, content, date: d, upvote: 1 })
            }).then(res => {
                if (res.status >= 200 && res.status < 300)
                    return res.json()
                return res
            }).then(result => {
                loadingUI('end')
                if (result && result.success) {
                    infoContainer('成功,你可以继续发布', true)
                    reRenderDynamic(result.data.reverse())
                    _('#dw_title').value = ''
                    _('#short_article_textarea').value = ''
                } else
                    infoContainer(result && result.errorMsg || '网络繁忙' + result.status)
            })
        }
        else {
            infoContainer('输入不完整', false)
        }
    })
}

function reRenderDynamic(data) {  // reload dynamic
    const html = template('dynamic_tpl', { dynamics: data })
    const lis = _('.dynamic .dynamic_item')
    const liss = _('.all_short_article li')
    for (let i = 0; i < lis.length; i++) {
        lis[i].parentNode.removeChild(lis[i])
        liss[i].parentNode.removeChild(liss[i])
    }
    _('#dynamic_container').innerHTML = html
    const html2 = template('dynamic_operation_tpl', { dynamics: data })
    _('.all_short_article').innerHTML = html2
}

function checkBeforePublish(temp) { // title and content shouldn't be null
    let resultBool = true
    for (let key in temp)
        if (temp[key].trim() === "") {
            resultBool = false
            break
        }
    return resultBool
}

function publishItem() {  //publish item
    const obj = {
        url: null
    }
    const mapLi = _('.map_li')
    const as = _('.admin_menu li a')
    for (let index = 0; index < as.length; index++)
        as[index].addEventListener('click', function () {
            _('.select_line').style.transform = `translateY(${index * 40}px)`
            for (let item of mapLi) {
                // removeClass(item, 'pluse')
                item.style.display = 'none'
            }
            index !== 4 && (mapLi[index].style.display = 'block')
            // addClass(mapLi[index], 'pluse')
            // mapLi.removeClass('pulse').hide().eq(index).addClass('pulse').show()
            if (index === 0) {
                obj.url = 'saveDw';
                obj.type = 'content';
            }
            else if (index === 2) {
                obj.url = 'saveArticle';
                obj.type = 'summary';
            }
            else if (index === 4) {
                _('.menu_toggle').click()
            }
            else obj.url = null;
        }, false)
    _('.publish-edit', 'click', function () {
        if (this.getAttribute('type') === 'type') return
        let data = _('.editor-container').innerHTML
        let title = _('.ql-editor')[0]
        console.log(_('.editor-container'), data)
        if (!/<h2>\w<\/h2>/.test(title.innerText)) {
            infoContainer('标题需被h2标签包裹', false);
            return;
        }
        publishBtn(obj, data, window.loadingUI)
    })
}

function cancleTextEdit() {
    _('.article_list .ql-editor', !1, function () {
        this.setAttribute('contentEditable', false)
    })
}

function escapeData(data) {
    return data.replace(/<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL">/g, '').replace(/<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL"\splaceholder="Embed\sURL">/g, '');
}

function setArticleType() {
    const inputs = _('.article-type input')
    let articleType = 'HTML'
    for (let input of inputs)
        if (input.checked)
            articleType = input.value
    return articleType
}

function publishBtn(obj, data, loadingUI) {  //publish edit content
    if (obj.url === null) return;
    const d = new Date();
    if (obj.url === 'saveDw') {
        var date = `${d.getFullYear()}-${(d.getMonth() + 1)}-${d.getDate()}`;

    }
    else if (obj.url === 'saveArticle') {
        let months = d.getMonth() + 1
        let day = d.getDate()
        let date = (months < 10 ? `0${months}` : months) + '-' + (day < 10 ? `0${day}` : day)
        const year = '' + d.getFullYear()
        const h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
        const m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
        const s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
        const time = `${h}:${m}:${s}`
        loadingUI('start')
        fetch('/' + obj.url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ time, date, year, summary: escapeData(data), type: setArticleType() })
        }).then(res => {
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            loadingUI('end');
            (result && result.success) ?
                infoContainer('发布成功', true, () => window.location.reload())
                :
                infoContainer(result && result.errorMsg || '网络繁忙' + result)
        })
    }
    else return;
}

function shortArticleLimited() {  //short article limited
    const total = 180
    const type = ['change', 'keydown', 'keyup']

    for (let key of type)
        _('#short_article_textarea').addEventListener(key, function (e) {
            var e = e || window.event
            var current = total - this.value.length;
            _('.count').innerHTML = current
            if (current <= 0 && e.keyCode != 8) {
                e.preventDefault();
            }
        }, false)
}

function deleteDynamic() {  //delete dynamic
    _('.all_short_article', 'click', function (ev) {
        if (/delete_dynamic/.test(ev.target.parentNode.className)) {
            const self = ev.target.parentNode.parentNode
            const _id = ev.target.parentNode.getAttribute('_id')
            fetch('/deleteDynamic', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ _id })
            }).then(res => { return res.json() })
                .then(result => {
                    if (result && result.success) {
                        self.parentNode.removeChild(self)
                        infoContainer('删除成功', true)
                        const html = template('dynamic_tpl', { dynamics: result.data.reverse() })
                        for (let li of _('.dynamic li'))
                            _('.dynamic').removeChild(li)
                        _('.dynamic').innetHTML = html
                    }
                    else
                        infoContainer(result && result.errorMsg || '网络繁忙', false)
                })
        }
    })
}

function deleteArticle() {  //delete article
    _('.o_all_article', 'click', function (ev) {
        if (/delete_article/.test(ev.target.parentNode.className)) {
            const _id = ev.target.parentNode.getAttribute('_id')
            const self = ev.target.parentNode.parentNode
            loadingUI('start')
            fetch('/deleteArticle', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ _id })
            }).then(res => {
                if (res.status >= 200 && res.status < 300)
                    return res.json()
                return res
            }).then(data => {
                loadingUI('end')
                if (data && data.success) {
                    self.parentNode.removeChild(self)
                    infoContainer('删除成功', true, () =>
                        window.location.reload())
                } else infoContainer(data && data.errorMsg || '网络出错' + data.status)
            })
        }
    })
}

function loadingUI(type) {
    if (type === 'start') {
        addClass(_('.screen'), 'blurBg')
        _('.loadingUI').style.display = 'block'
    } else if (type === 'end') {
        setTimeout(() => {
            removeClass(_('.screen'), 'blurBg')
            _('.loadingUI').style.display = 'none'
        }, 1500)
    }
}

function leaveMsg() {  //message board
    _('.leave_msg', 'click', () => {
        const msg = escapeData(_('.msg').value)
        const name = window.sessionStorage && sessionStorage.getItem('user')
        let date = new Date()
        let minute = date.getMinutes()
        minute < 10 ? minute + 1 : '0' + minute
        let hour = date.getHours()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let d = year + '-' + month + '-' + day + '-----' + hour + ' : ' + minute
        if (msg === '') {
            infoContainer('留言不能为空 ~', false)
            return
        }
        if (!name) {
            infoContainer('你还没有登陆', false)
            return
        }
        else {
            loadingUI('start')
            fetch('/leaveMessage', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ date: d, content: msg, name: Base64.decode(name) })
            }).then(res => {
                if (res.status >= 200 && res.status < 300)
                    return res.json()
                return res.status
            }).then(result => {
                loadingUI('end')
                if (result && result.success) {
                    // randomUserAvatar()
                    reRenderMsg(result.data, true)
                }
                else
                    infoContainer(result && result.errorMsg || '网络繁忙' + result)
            })
        }
    })
}

function reRenderMsg(res, cb) {
    infoContainer('成功啦', true);
    _('.msg').value = ''
    _('.msg_word_count span').innerText = '280'
    for (let l of _('.message_list li'))
        l.parentNode.removeChild(l)
    const html = template('message-tpl', { messages: res instanceof Array && res.reverse() });
    _('.message_list').innerHTML = html
    if (cb){
        _('.temp_ul li:first-of-type').innerText = res.length  + '评论'
        _('.temp_ul li:last-of-type').innerText = res.length  + '人参与'
    }
    _('.message_content', !1, function () {
        addClass(this, 'titleShow')
    })
    _('._user', !1, function () {
        addClass(this, 'titleShow')
    })
    allUserAvatar()
}

function wordLimited() {
    const total = 280
    const type = ['change', 'keydown', 'keyup']

    for (let key of type)
        _('#msg').addEventListener(key, function (e) {
            var e = e || window.event
            var current = total - this.value.length;
            _('.msg_count').innerHTML = current
            if (current <= 0 && e.keyCode != 8) {
                e.preventDefault();
            }
        }, false)
}

function slidePhoto() { //slide photo
    const glitch = new Glitch(document.getElementsByClassName('glitch_effect')[0])
    glitch.start()
}

function upvoteDynamic() {
    _('.dynamic', 'click', ev => {
        if (/awesome_dynamic/.test(ev.target.className)) {
            const self = ev.target
            const _id = self.getAttribute('_id')
            if (self.isUpvote) {
                return;
            } else {
                const upvote = Number(self.parentNode.children[1].innerText) + 1
                fetch('/upvoteDynamic', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({ _id, upvote })
                }).then(res => { return res.json() })
                    .then(data => {
                        if (data && data.success) {
                            self.parentNode.children[1].innerText = upvote
                            self.isUpvote = true
                            self.style.fontSize = '20px'
                            setTimeout(() =>
                                setStyle(self, {
                                    fontSize: '16px',
                                    cursor: 'not-allowed',
                                    color: '#f39e66'
                                })
                                , 500)
                        } else {
                            self.isUpvote = false
                            infoContainer('网络繁忙', false)
                        }

                    })
            }
        }
    })
}

function bugReporter() {
    _('.bug-reporter', 'click', ev => {
        ev.stopPropagation()
        window.open('http://wpa.qq.com/msgrd?v=3&uin=3532371088&site=qq&menu=yes')
    })
}

function randomBg() {
    var pic = Math.floor(Math.random() * 6) + 1;
    // alert(pic);
    setStyle(_('body'), {
        background: (window.innerWidth < 750) ? '#333333d9' : 'url("./resouce/bg/' + pic + '.jpg") no-repeat',
        backgroundSize: '100% 100%'
    })
}

function changeTheme() {
    _('.change_theme', 'click', function () {
        toggleClass(this, 'themeapi')
        toggleClass(_('.theme_containter'), 'theme_show')
    })
    const lis = _('.theme_containter ul li')
    for (let i = 0; i < lis.length; i++) {
        lis[i].addEventListener('click', () => {
            setStyle(_('body'), {
                background: 'url("./resouce/bg/' + (i + 1) + '.jpg") no-repeat',
                backgroundSize: '100% 100%'
            })
        })
    }
}

function hideAllClickWindow() {   //hide sth when click anywhere
    const videos = document.getElementsByTagName('video')
    _('body', 'click', e => {
        for (let i in videos)
            videos[i].paused = false
        var e = e || window.event
        _('.dynamic-msg-container', !1, function () {
            removeClass(this, 'showMsg')
        })
        _('.full_summary').innerText = ''
        _('.article_list .article', !1, function () {
            removeClass(this, 'showArticle')
            removeClass(this.children[1], 'showClose')
            removeClass(this.children[3], 'toggleP')
        })
        removeClass(document.querySelectorAll('.right_article_list')[0], 'rightArticleHide')
        removeClass(_('.search_result_container'), 'show_search_container bounceInDown');
    })
}

function search() {  //search global
    _('.search_input', 'click', e => {
        _('.get_search li', !1, function () {
            this.parentNode.removeChild(this)
        })
        var e = e || window.event
        addClass(_('.search_result_container'), 'show_search_container bounceInDown')
        e.stopPropagation()
        _('.context-menu').style.display = 'none'
    })
    _('.search_input', 'keyup', ev => {
        var e = ev || window.event
        const word = _('.search_input').value
        _('.full_summary').innerText = ''
        if (word !== '' && e.keyCode === 13) {
            loadingUI('start')
            search(word)
            return
        }
    })
    function search(data) {
        _('.get_search li', !1, function () {
            this.parentNode.removeChild(this)
        })
        fetch('/search', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ data })
        }).then(res => {
            loadingUI('end')
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            if (result && result.success && result.result.length !== 0) {
                _('.get_search').innerHTML = template('search_result_tpl', { searchs: result.result })
            } else
                infoContainer(result && result.errorMsg || '找不到关于"' + data + '"的信息', false);
        })
    }
}

function fullSearch() {
    _('.search_result_container', 'click', function (ev) {
        ev.stopPropagation()
    })
    _('.search_result_container', 'mouseover', function (e) {
        if (e.target.tagName.toUpperCase() !== 'A') return
        _('.article-type-text', !1, function () {
            removeClass(this, 'selectType')
        })
        const t = e.target.offsetTop || 86
        const _id = e.target.getAttribute('_id')
        const type = e.target.getAttribute('type')
        _('.full_summary').style.display = 'block'
        _('.full_summary').setAttribute('_id', _id)
        _('.full_summary').setAttribute('type', type)
        _('.full_summary').innerHTML = e.target.innerText
        //_('.full_summary').style.transform = `translate3D(0, ${(t - 40 - 40) > 300 ? 280 : t - 40 - 40}px,0)`
        removeClass(_('.full_summary'), type === '动态' ? 'artilce_type_summary' : 'dynamic_type_summary')
        addClass(_('.full_summary'), type === '动态' ? 'dynamic_type_summary' : 'artilce_type_summary')
    })
}

function turnToSummary() {
    const target = document.querySelector('.full_summary')
    target.onclick = function (ev) {
        var ev = ev || window.event
        ev.stopPropagation()
        const _id = this.getAttribute('_id')
        if (this.getAttribute('type') === '动态') return
        triggerArticle(_id)
    }
}

function triggerArticle(_id) {
    _('.triggerArticle').click()
    const articlesList = document.getElementsByClassName('articles_list')
    _('.articles_list', !1, function () {
        this.style.display = 'none'
    })
    for (let item of articlesList)
        if (item.getAttribute('_id') === _id) {
            item.style.display = 'block'
            item.click()
            return
        }
}

function introduce(i, word) { //introduce
    var arr = word.split('');
    var len = arr.length;
    var introArea = _('.introduce');
    var w = '';
    introArea.setAttribute('autofocus', "true")
    if (introArea.value === '') {
        lifeStep();
        var intro = setInterval(() => {
            w += arr[i];
            introArea.value = w;
            i++;
            if (i >= len) {
                clearInterval(intro);
                introArea.setAttribute('autofocus', "false")
                introArea.disabled = true;
            }
        }, 100);
    }
}

function lifeStep() {
    const steps = _('.life .step')
    const cs = _('.life .circle')
    const lines = _('.life .line')
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.transitionDelay = `${i}s`
        cs[i].style.transitionDelay = `${i}s`
        lines[i].style.transitionDelay = `${i}s`
        steps[i].style.opacity = '1'
        lines[i].style.opacity = '1'
        cs[i].style.opacity = '1'
        lines[i].style.transform = 'translate3D(0, 0,0)'
        steps[i].style.transform = 'translate3D(0, 550%,0)'
    }
}

function wechat() {
    _('i.wechat', 'click', function () {
        toggleClass(_('.wechat_img'), 'wechat_show')
        toggleClass(this, 'themeapi')
    })
}

function sina() {
    _('.sina_api', 'click', function () {
        toggleClass(_('.sina'), 'sina_show');
        toggleClass(this, 'themeapi');
    })
}

function dynamicMsg() {   //leave a msg on dynamic
    _('.dynamic', 'click', function (ev) {
        _('.context-menu').style.display = 'none'
        ev.stopPropagation();
        if (/dynamic-msg-icon/.test(ev.target.className)) {
            ev.stopPropagation()
            toggleClass(ev.target.parentNode.parentNode.children[5], 'showMsg')
        }
        if (!/leave-dynamic-mg/.test(ev.target.className)) return
        const d = new Date()
        const This = this
        const year = d.getFullYear()
        // const index = $(this).index('.leave-dynamic-mg')
        const month = d.getMonth() + 1
        const day = d.getDate()
        const hour = d.getHours()
        const minute = d.getMinutes()
        const el = ev.target.parentNode.parentNode.parentNode.children[4].children[1]
        // const count = $(This).parent().parent().prev().find('span')
        const currentDay = year + "-" + month + '-' + (day < 10 ? '0' + day : day) + '--' + hour + ':' + minute
        const word = ev.target.parentNode.children[0].value
        const _id = ev.target.getAttribute('_id')
        const msg = { context: word, date: currentDay }
        const name = sessionStorage && sessionStorage.getItem('user')

        if (word === '' || word.trim() === '') {
            infoContainer('评论不能为空', false)
            return
        }
        if (word.length > 100) {
            infoContainer('字数不能超过100个字符', false)
            return
        }
        if (!name) {
            infoContainer('登录才能评论哦', false)
            return
        }
        fetch('/leave-dynamic-mg', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ _id, msg, name })
        }).then(res => { return res.json() })
            .then(result => {
                if (result && result.success) {
                    el.innerText = (Number(el.innerText) + 1)
                    ev.target.previousElementSibling.value = ''
                    const html = `<li class="dynamic-msg-item">
                                        <i _msgid={{dynamic._id}} _id={{ temp._id }} class="deleteDynamicRepeat linkfont">&#xe603;</i>
                                        <p class="dynamic-msg-date">
                                            <span class="dynamic-repeat-name">${Base64.decode(name)}：</span>
                                            <span class="date">${currentDay}</span>
                                        </p>
                                        <p class="dynamic-msg-context">${word}</p>
                                    </li>${ev.target.parentNode.parentNode.children[1].innerHTML}`
                    ev.target.parentNode.parentNode.children[1].innerHTML = html
                } else
                    infoContainer(result && result.errorMsg || '网络繁忙', false)
            })
    })
}

function getCustomer() {
    return new Promise((resolve, reject) => {
        fetch('/get-customer', {
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        }).then(res => {
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res
        }).then(data => {
            if (data && data.success) {
                document.getElementById('customer_number').innerText = '' + data.data.number
                resolve(data.data.number + 1)
            } else reject(data && data.errorMsg || '无法获取访问量' + data.status || '网络繁忙，无法获取访问量')
        })
    })
}

function customer() {
    getCustomer().then(number => {
        fetch('/add-customer', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application.json'
            },
            body: JSON.stringify({ number })
        })
    }).catch(err => infoContainer(err, false))
}

function checkDevice() {
    if (window.innerWidth < 750) {
        alert('您正在使用移动端，移动端仅供预览，完整交互在pc端')
        checkLoadingFinished(290)
    }
}

function selectArticleType() {
    const typeEffects = _('.article-type-text')
    for (let i = 0; i < typeEffects.length; i++) {
        typeEffects[i].addEventListener('click', function () {
            _('.article-type-text', !1, function () {
                removeClass(this, 'selectType flip')
            })
            addClass(this, 'selectType flip')
            reducerArticle(this.innerText, _('.articles'))
        }, false)
    }
}

function reducerArticle(type, arr) {
    if (type === '全部') {
        for (let item of arr)
            item.style.display = 'block'
        return
    }
    for (let item of arr)
        item.getAttribute('type') === type ? (addClass(item, 'bounceInUp'), item.style.display = 'block') : item.style.display = 'none'
}

function contextMenu() {
    const menu = _('.context-menu')
    randomBgColor()
    window.oncontextmenu = (ev) => {
        ev.preventDefault()
        const l = ev.clientX
        const t = ev.clientY
        setStyle(menu, {
            left: l + 'px',
            top: t + 'px'
        })
        menu.style.display = 'none'
        removeClass(menu, 'jello')
        setTimeout(() => {
            menu.style.display = 'block'
            addClass(menu, 'jello')
        }, 20)

    }
    _('.context-menu ul li', 'click', ev => {
        ev.stopPropagation()
    })
    window.onclick = () => {
        menu.style.display === 'block' && (menu.style.display = 'none')
    }
}

function randomUserAvatar() {
    const color = [
        '#abd0bc',
        '#62cf8e',
        '#f46c3c',
        '#b2b2b2',
        '#ddc49c',
        '#62b78d',
        '#d1f9f1',
        '#c4c4c4',
        '#b89168',
        '#ff766e',
        '#1e89bd',
        '#d34694',
        '#c5d08d'
    ]
    const len = color.length
    const avatars = document.getElementsByClassName('user_avatar')
    for (let item of avatars)
        item.style.background = color[Math.floor(Math.random() * len)]
}

function randomBgColor() {
    const color = [
        '#abd0bc',
        '#62cf8e',
        '#f46c3c',
        '#b2b2b2',
        '#ddc49c',
        '#62b78d',
        '#d1f9f1',
        '#c4c4c4',
        '#b89168',
        '#ff766e',
        '#1e89bd',
        '#d34694',
        '#c5d08d',
        '#4ae488'
    ]
    const len = color.length
    _('.random-bg', 'click', () => {
        const c1 = Math.floor(Math.random() * len)
        const c2 = Math.floor(Math.random() * len)
        const c3 = Math.floor(Math.random() * len)
        setStyle(_('body'), {
            background: `linear-gradient(to bottom, ${color[c1]}, ${color[c2]}, ${color[c3]})`
        })
    })
    _('.menu-reload', 'click', () => { window.location.reload() })
    const h = _('.loadingY')[0].offsetHeight + 'px'
    _('.close-blog', 'click', () => {
        _('.loading').style.display = 'block'
        _('.tempexit', !1, function (params) {
            this.style.display = 'none'
        })
        _('.loadingY', !1, function () {
            this.style.display = 'block'
            this.style.height = '0px'
            setTimeout(() => {
                this.style.height = h
            }, 10)
            setTimeout(() => {
                window.location.href = "https://www.baidu.com/"
            }, 2000)
        })
    })
}

function editEffect() {
    const el = _('.edit_textarea1')
    el.addEventListener('focus', () => _('.effect_text').style.width = '40px')
    el.addEventListener('blur', () => _('.effect_text').style.width = '0')
}

function toggleRepeatList() {
    _('.message_box', 'click', function (ev) {
        if (!/togger_repeat_list/.test(ev.target.className)) return
        let ul = ev.target.parentNode.children[5]
        // $(ul).toggle(300)
        toggleClass(ul, 'repeat_list_toggle')
        ev.target.innerText = /展开/.test(ev.target.innerText) ? '收起' : '展开'
    })
}

function allUserAvatar() {
    const users = _('.user_name_msg')
    const names = []
    for (let item of users)
        names.push(item.innerText)
    const noRepeatName = [...new Set(names)]
    fetch('/all_user_avatar', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({ name: noRepeatName })
    }).then(res => {
        if (res.status >= 200 && res.status < 300)
            return res.json()
        return res
    }).then(data => {
        if (data && data.success)
            for (let item of users)
                for (let item1 of data.data)
                    item.innerText === item1.name && (item.parentNode.parentNode.children[0].children[0].src = item1.avatar)
        else
            infoContainer(data && data.errorMsg || '网络出错' + data.status, false)
    })
}

function openSouceContainer() {
    if (_('.sourceContainer').style['display'] === 'block')
        return
    _('.initDisplay', !1, function (params) {
        this.style.display = 'none'
    })
    _('.sourceContainer').style['display'] = 'block'
    randomAbountMe()
}

function entryMoreOperation() {
    const menu = new Mobile({
        target: document.getElementsByClassName('left_container')[0],
        // menuColor:'white',
        menu: [
            {
                name: '关于主页',
                callback: entryAboutMe
            },
            {
                name: '资源管理',
                callback: openSouceContainer
            }
        ],
        bg: './resouce/images/menu.jpg'
    })
    const mC = _('.more_operation_container')
    _('.more_operation_entry', 'click', function () {
        toggleClass(mC, 'moreContainerToggle')
        if (this.innerText === '更多') {
            menu.start()
            this.innerText = 'X'
            _('.body_overlay').style.opacity = 1

        } else {
            // menu.end()
            menu.endInterval()
            this.innerText = '更多'
            _('.body_overlay').style.opacity = 0
        }
    })
}

function randomAbountMe() {
    const box = _('.about_me_container .box')
    for (let item of box) {
        const x = (Math.random() + 1) * 300
        const duration = (Math.random() * 3)
        const op = parseInt(x) % 2 === 0 ? -1 : 1
        const y = (Math.random() + 1) * 300
        setStyle(item, {
            transition: `all ${duration}s`,
            opacity: '0',
            display: 'none',
            transform: `translateX(${op * x}px) translateY(${op * y}px)`
        })
    }
}

function startAnotherFace(bool) {
    const boxs = _('.right_container .box_')
    if (bool) {
        _('.right_container').style.display = 'block'
        for (let item of boxs) {
            const duration = (Math.random() * 7)
            item.style['animation-duration'] = duration + 's'
            item.style['display'] = 'block'
            addClass(item, 'bounceIn')
        }
    } else {
        for (let item of boxs) {
            item.style['display'] = 'none'
            removeClass(item, 'bounceIn')
        }
        boxs.removeClass('bounceIn').hide()
        _('.right_container').style.display = 'none'
    }
}

function initMore() {
    const menu = new Mobile({
        target: document.getElementsByClassName('left_container')[0],
        menu: [
            {
                name: '关于主页'
            },
            {
                name: 'menu-test'
            }
        ],
        bg: './resouce/images/menu.jpg',
    })
    menu.start()
}

function entryAboutMe() {
    _('.initDisplay', !1, function () {
        this.style.display = 'none'
    })
    _('.about_me_container').style.display = 'block'
    const box = _('.about_me_container .box')
    for (let item of box) {
        item.style.display = 'block'
        setTimeout(() => {
            setStyle(item, {
                'transform': 'translate(0) scale(1.009)',
                opacity: '1'
            })
        }, 10)
    }
}

function mobileEntry() {
    _('.entry_mibile', 'click', __ => toggleClass(_('.mobile_entry'), 'showSlideBar'))
}

function loginApi() {
    _('.login-i', 'click', () => {
        const type = _('.registerbtn').style['display']
        type === 'block' ?
            _('.registerbtn').click()
            :
            _('.current-api').click()
    })
}

function share() {
    const title = '个人主页'
    const pic = "http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8tzjwvaj211l0hmq39.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8u9irlkj211x0hndnw.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8u5cwpsj211y0hltn0.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8udqz9yj211x0hntde.jpg"
    _('.shareToSina', 'click', _ => {
        (function (s, d, e) { try { } catch (e) { } var f = 'http://v.t.sina.com.cn/share/share.php?', u = d.location.href, p = ['url=', e(u), '&title=', e(title), '&appkey=2924220432', '&pic=', e(pic)].join(''); function a() { if (!window.open([f, p].join(''), 'mb', ['toolbar=0,status=0,resizable=1,width=620,height=450,left=', (s.width - 620) / 2, ',top=', (s.height - 450) / 2].join(''))) u.href = [f, p].join(''); }; if (/Firefox/.test(navigator.userAgent)) { setTimeout(a, 0) } else { a() } })(screen, document, encodeURIComponent);
    })
    _("#zone", 'click', function () {
        const p = {
            url: 'http://adaxh.applinzi.com',
            showcount: '1',/*是否显示分享总数,显示：'1'，不显示：'0' */
            summary: '个人主页，快来看看吧！',/*分享摘要(可选)*/
            title,/*分享标题(可选)*/
            pics: 'https://camo.githubusercontent.com/55b9bef92d318357c3688e135d9723519f7085f1/687474703a2f2f7778322e73696e61696d672e636e2f6d773639302f61393961366539386c7931666f783962396c3434696a32307367306c633435372e6a7067', /*分享图片的路径(可选)*/
            style: '203',
            width: 98,
            height: 22
        };
        const s = []
        for (let key in p)
            s.push(key + '=' + encodeURIComponent(p[key] || ''))
        window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join('&'))
    })
}

function innerRepeat() {
    _('.message_box', 'click', function (ev) {
        if (!/innerRepeatAPI/.test(ev.target.className)) return
        const _id = ev.target.getAttribute('_parent_id')
        const toRepeat = ev.target.getAttribute('_to_repeat')
        const name = window.sessionStorage && sessionStorage.getItem('user') || undefined
        if (!name) {
            infoContainer('你还没有登录哦', false)
            return
        }
        sendRepeat((d, word) => {
            fetch('/repeatMsg', {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    _id,
                    msg: {
                        name: Base64.decode(name),
                        toRepeat,
                        info: word,
                        date: d,
                    }
                })
            }).then(res => {
                if (res.status >= 200 && res.status < 300)
                    return res.json()
                return res.status
            }).then(result => {
                loadingUI('end')
                if (result && result.success) {
                    reRenderMsg(result.data)
                    _('.repeat_word').value = ''
                    _('.cancel_repeat').click()
                } else
                    infoContainer(result && result.errorMsg || '网络繁忙' + result)
            })
        })
    })
    _('.message_box', 'click', function (ev) {
        if (!/innerDeleteMsg/.test(ev.target.className)) return
        const _parent_id = ev.target.getAttribute('_parent_id')
        const _id = ev.target.getAttribute('_id')
        const name = sessionStorage.getItem('user') || undefined
        if (!sessionStorage.getItem('user')) {
            infoContainer('你还没有登录', false)
            return
        }
        loadingUI('start')
        fetch('/deleteInnerRepeat', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ _id, _parent_id, name: Base64.decode(name) })
        }).then(res => {
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            loadingUI('end')
            if (result && result.success) {
                infoContainer('删除成功', true)
                ev.target.parentNode.parentNode.parentNode.removeChild(ev.target.parentNode.parentNode)
            }
            else
                infoContainer(result && result.errorMsg || '网络繁忙' + result)
        })
    })
}

function navSelect() {
    const navs = document.querySelectorAll('.nav a')
    const select = document.getElementById('navSelect')

    for (let i = 0; i < navs.length; i++) {
        navs[i].addEventListener('click', () => {
            let w = document.getElementById('navSelect').offsetWidth
            select.style.transform = `translateX(${i * w}px)`
        })

    }
}

window.onload = () => {
    navSelect()
    innerRepeat()
    share()
    loginApi()
    hashRouter()
    mobileEntry()
    randomBg()
    randomAbountMe()
    entryMoreOperation()
    allUserAvatar()
    toggleRepeatList()
    randomUserAvatar()
    editEffect()
    turnToSummary()
    bugReporter()
    contextMenu()
    selectArticleType();
    checkDevice();
    customer();
    cancleTextEdit();
    dynamicMsg();
    sina();
    wechat();
    fullSearch();
    hideAllClickWindow();
    changeTheme();
    search();
    loginState();
    showArticle();
    loading();
    selectNav();
    register();
    exitLoginRegCancel();
    messageCount(_('.message_item').length);
    shortArticleLimited();
    leaveMsg();
    wordLimited();
    galleryApi();
    exitGallery();
    slidePhoto();
    upvoteDynamic();
    randomArticleBg();
    mapToArticleList()
    closeTip()
}

function closeTip() {
    _('.closeTip', 'click', () => {
        _('.avatarTip').style.display = 'none'
    })
}

function updateArticle() {
    _('.o_all_article', 'click', function (ev) {
        if (!/update_article_icon/.test(ev.target.className)) return
        const _id = ev.target.getAttribute('_id')
        loadingUI('start')
        fetch('/queryArticleById', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ _id })
        }).then(res => {
            if (res.status >= 200 && res.status < 300)
                return res.json()
            return res
        }).then(data => {
            loadingUI('end')
            if (data && data.success) {
                const { summary, type } = data.data
                editArticle(summary, _id, type)
            }
            else
                infoContainer(data && data.errorMsg || '网络出错 ' + data.status)
        })
    })
}
function editArticle(summary, _id, type) {
    _('.admin_menu li:nth-of-type(3) a').click()
    _('.editor-container').innerHTML = summary
    _('.publish-edit').setAttribute('type', 'type')
    const spans = _('#artilce-type-label span')
    for (let item of spans) {
        if (item.innerText === type) {
            item.parentNode.children[0].checked = true
            break
        }
    }
    _('.update_article', 'click', function () {
        const newSummary = _('.editor-container').innerHTML
        if (newSummary === summary) {
            infoContainer('内容未更改', false)
            return
        }
        else
            updateArticleById(_id, newSummary)
    })
}

function updateArticleById(_id, summary) {
    const type = setArticleType()
    loadingUI('start')
    fetch('/updateArticleById', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({ _id, summary, type })
    }).then(res => { return res.json() })
        .then(result => {
            loadingUI('end');
            (result && result.success) ?
                infoContainer('更新成功', true, () => window.location.reload())
                :
                infoContainer(result && result.errorMsg || '网络繁忙')
        })
}

function getDynamic(_id) {
    return new Promise((resolve, reject) => {
        fetch('/dynamicQueryById', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: JSON.stringify({ _id })
        }).then(res => {
            if (res.status >= 200 && res.status < 300) return res.json()
            return res.status
        }).then(result => {
            resolve(result)
        }).catch(_ => reject([]))
    })
}

function dynamicResult(_id) {
    getDynamic(_id).then(result => {
        setText(result)
    })
}

function setText(obj) {
    _('#dw_title').value = obj.title
    _('.edit_textarea1').value = obj.content
    _('span.count').innerHTML = '' + (180 - obj.content.length)
    _('#update_dw').onclick =  () => {
        const val = _('.edit_textarea1').value
        const title = _('#dw_title').value
        if (val === obj.content && title === obj.title) {
            infoContainer('内容为更改!!!', false);
            return
        } else
            updateDynamicById(obj._id, val, title)
    }
}

function updateDynamicById(_id, content, title) {
    fetch('/updateDynamic', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            accept: 'application/json'
        },
        body: JSON.stringify({ _id, content, title })
    }).then(res => {
        if (res.status >= 200 && res.status < 300) return res.json()
        return res.status
    }).then(res => {
        res ? infoContainer('更新成功', true, () => {
            window.location.reload()
        }) : infoContainer('更新失败，请稍后重试', false)
    }).catch(_ => infoContainer(_, !1))
}

function editDynamic() {
    _('.all_short_article', 'click', function (ev) {
        if (!/edit_item_dynamic_icon/.test(ev.target.className)) return
        const _id = ev.target.parentNode.getAttribute('_id')
        _('.admin_menu li:nth-of-type(1) a').click()
        getDynamic(_id).then(result => {
            setText(result)
        })
    })
}

function mapToArticleList() {
    const articles = _('.article_list li.article')
    if (articles.length === 1) return
    let datas = []
    let temp = {}
    let lis = ''
    for (let item of articles) {
        const date = item.children[item.children.length - 2].innerText
        const _id = item.getAttribute('_id')
        const title = item.children[item.children.length - 1].children[0].children[0].innerText || 'title error'
        lis += `<li _id=${_id} >
            <a class="delete_item delete_article" _id=${_id}><i class="fl linkfont">&#xe603;</i></a>
            <a class="fl edit_item_article" _id=${_id}><i _id=${_id} class="update_article_icon linkfont">&#xe759;</i></a>
            <p class="fl">${title}</p>
            <span class="fr short_article_date">${date}</span>
        </li>`
    }
    _('.o_all_article').innerHTML = lis
}

function randomArticleBg() {
    const bg = [{
        bgc: '#d9edf7',
        color: '#31708f',
    }, {
        bgc: '#f2dede',
        color: '#a94442'
    }, {
        bgc: '#fff3cc',
        color: '#ffc100'
    }, {
        bgc: '#f6edfb',
        color: '#cd97eb'
    }, {
        bgc: '#fcf8e3',
        color: '#8a6d3b',
    }, {
        bgc: 'rgb(225, 249, 220)',
        color: '#31708f'
    },
    {
        bgc: 'rgb(212, 253, 204)',
        color: '#31708f'
    },
    {
        bgc: '#fcfcfc',
        color: '#31708f'
    }]
    const lis = _('.article_list .article')
    for (var i = 0, len = lis.length; i < len; i++) {
        var index = Math.floor(Math.random() * (bg.length))
        lis[i].style.background = bg[index].bgc
    }
}

function exitGallery() {  //exit gallery
    _('.exit_gallery', 'click', () => {
        setStyle(_('.canvas_box'), {
            zIndex: '-100',
            transform: 'scale(0)'
        });
    })
}

function galleryApi() {  //gallery
    _('.gallery_api', 'click', () => {
        // history.pushState('','','/gallery');
        setStyle(_('.canvas_box'), {
            zIndex: '1000',
            transform: 'scale(1)'
        });
    })
}

//gallery
(function () {
    "use strict";

    (function () {
        /* ==== definitions ==== */
        var diapo = [], layers = [], ctx, pointer, scr, camera, light, fps = 0, quality = [1, 2],
            // ---- poly constructor ----
            Poly = function (parent, face) {
                this.parent = parent;
                this.ctx = ctx;
                this.color = face.fill || false;
                this.points = [];
                if (!face.img) {
                    // ---- create points ----
                    for (var i = 0; i < 4; i++) {
                        this.points[i] = new ge1doot.transform3D.Point(
                            parent.pc.x + (face.x[i] * parent.normalZ) + (face.z[i] * parent.normalX),
                            parent.pc.y + face.y[i],
                            parent.pc.z + (face.x[i] * parent.normalX) + (-face.z[i] * parent.normalZ)
                        );
                    }
                    this.points[3].next = false;
                }
            },
            // ---- diapo constructor ----
            Diapo = function (path, img, structure) {
                // ---- create image ----
                this.img = new ge1doot.transform3D.Image(
                    this, path + img.img, 1, {
                        isLoaded: function (img) {
                            img.parent.isLoaded = true;
                            img.parent.loaded(img);
                        }
                    }
                );
                this.visible = false;
                this.normalX = img.nx;
                this.normalZ = img.nz;
                // ---- point center ----
                this.pc = new ge1doot.transform3D.Point(img.x, img.y, img.z);
                // ---- target positions ----
                this.tx = img.x + (img.nx * Math.sqrt(camera.focalLength) * 20);
                this.tz = img.z - (img.nz * Math.sqrt(camera.focalLength) * 20);
                // ---- create polygons ----
                this.poly = [];
                for (var i = -1, p; p = structure[++i];) {
                    layers[i] = (p.img === true ? 1 : 2);
                    this.poly.push(
                        new Poly(this, p)
                    );
                }
            },
            // ---- init section ----
            init = function (json) {
                // draw poly primitive
                Poly.prototype.drawPoly = ge1doot.transform3D.drawPoly;
                // ---- init screen ----
                scr = new ge1doot.Screen({
                    container: "canvas"
                });
                ctx = scr.ctx;
                scr.resize();
                // ---- init pointer ----
                pointer = new ge1doot.Pointer({
                    tap: function () {
                        if (camera.over) {
                            if (camera.over === camera.target.elem) {
                                // ---- return to the center ----
                                camera.target.x = 0;
                                camera.target.z = 0;
                                camera.target.elem = false;
                            } else {
                                // ---- goto diapo ----
                                camera.target.elem = camera.over;
                                camera.target.x = camera.over.tx;
                                camera.target.z = camera.over.tz;
                                // ---- adapt tesselation level to distance ----
                                for (var i = 0, d; d = diapo[i++];) {
                                    var dx = camera.target.x - d.pc.x;
                                    var dz = camera.target.z - d.pc.z;
                                    var dist = Math.sqrt(dx * dx + dz * dz);
                                    var lev = (dist > 1500) ? quality[0] : quality[1];
                                    d.img.setLevel(lev);
                                }
                            }
                        }
                    }
                });
                // ---- init camera ----
                camera = new ge1doot.transform3D.Camera({
                    focalLength: Math.sqrt(scr.width) * 10,
                    easeTranslation: 0.025,
                    easeRotation: 0.06,
                    disableRz: true
                }, {
                        move: function () {
                            this.over = false;
                            // ---- rotation ----
                            if (pointer.isDraging) {
                                this.target.elem = false;
                                this.target.ry = -pointer.Xi * 0.01;
                                this.target.rx = (pointer.Y - scr.height * 0.5) / (scr.height * 0.5);
                            } else {
                                if (this.target.elem) {
                                    this.target.ry = Math.atan2(
                                        this.target.elem.pc.x - this.x,
                                        this.target.elem.pc.z - this.z
                                    );
                                }
                            }
                            this.target.rx *= 0.9;
                        }
                    });
                camera.z = -10000;
                camera.py = 0;
                // ---- create images ----
                for (var i = 0, img; img = json.imgdata[i++];) {
                    diapo.push(
                        new Diapo(
                            json.options.imagesPath,
                            img,
                            json.structure
                        )
                    );
                }
                // ---- start engine ---- >>>
                setInterval(function () {
                    quality = (fps > 50) ? [2, 3] : [1, 2];
                    fps = 0;
                }, 1000);
                run();
            },
            // ---- main loop ----
            run = function () {
                // ---- clear screen ----
                ctx.clearRect(0, 0, scr.width, scr.height);
                // ---- camera ----
                camera.move();
                // ---- draw layers ----
                for (var k = -1, l; l = layers[++k];) {
                    light = false;
                    for (var i = 0, d; d = diapo[i++];) {
                        (l === 1 && d.draw()) ||
                            (d.visible && d.poly[k].draw());
                    }
                }
                // ---- cursor ----
                if (camera.over && !pointer.isDraging) {
                    scr.setCursor("pointer");
                } else {
                    scr.setCursor("move");
                }
                // ---- loop ----
                fps++;
                requestAnimFrame(run);
            };
        /* ==== prototypes ==== */
        Poly.prototype.draw = function () {
            // ---- color light ----
            var c = this.color;
            if (c.light || !light) {
                var s = c.light ? this.parent.light : 1;
                // ---- rgba color ----
                light = "rgba(" +
                    Math.round(c.r * s) + "," +
                    Math.round(c.g * s) + "," +
                    Math.round(c.b * s) + "," + (c.a || 1) + ")";
                ctx.fillStyle = light;
            }
            // ---- paint poly ----
            if (!c.light || this.parent.light < 1) {
                // ---- projection ----
                for (
                    var i = 0;
                    this.points[i++].projection();
                );
                this.drawPoly();
                ctx.fill();
            }
        }
        /* ==== image onload ==== */
        Diapo.prototype.loaded = function (img) {
            // ---- create points ----
            var d = [-1, 1, 1, -1, 1, 1, -1, -1];
            var w = img.texture.width * 0.5;
            var h = img.texture.height * 0.5;
            for (var i = 0; i < 4; i++) {
                img.points[i] = new ge1doot.transform3D.Point(
                    this.pc.x + (w * this.normalZ * d[i]),
                    this.pc.y + (h * d[i + 4]),
                    this.pc.z + (w * this.normalX * d[i])
                );
            }
        }
        /* ==== images draw ==== */
        Diapo.prototype.draw = function () {
            // ---- visibility ----
            this.pc.projection();
            if (this.pc.Z > -(camera.focalLength >> 1) && this.img.transform3D(true)) {
                // ---- light ----
                this.light = 0.5 + Math.abs(this.normalZ * camera.cosY - this.normalX * camera.sinY) * 0.6;
                // ---- draw image ----
                this.visible = true;
                this.img.draw();
                // ---- test pointer inside ----
                if (pointer.hasMoved || pointer.isDown) {
                    if (
                        this.img.isPointerInside(
                            pointer.X,
                            pointer.Y
                        )
                    ) camera.over = this;
                }
            } else this.visible = false;
            return true;
        }
        return {
            // --- load data ----
            load: function (data) {
                window.addEventListener('load', function () {
                    ge1doot.loadJS(
                        "./js/imageTransform3D.js",
                        init, data
                    );
                }, false);
            }
        }
    })().load({
        imgdata: [
            // north
            { img: './../resouce/gallery/1.jpg', x: -1000, y: 0, z: 1500, nx: 0, nz: 1 },
            { img: './../resouce/gallery/2.jpg', x: 0, y: 0, z: 1500, nx: 0, nz: 1 },
            { img: './../resouce/gallery/3.jpg', x: 1000, y: 0, z: 1500, nx: 0, nz: 1 },
            // east
            { img: './../resouce/gallery/4.jpg', x: 1500, y: 0, z: 1000, nx: -1, nz: 0 },
            { img: './../resouce/gallery/5.jpg', x: 1500, y: 0, z: 0, nx: -1, nz: 0 },
            { img: './../resouce/gallery/6.jpg', x: 1500, y: 0, z: -1000, nx: -1, nz: 0 },
            // south
            { img: './../resouce/gallery/7.jpg', x: 1000, y: 0, z: -1500, nx: 0, nz: -1 },
            { img: './../resouce/gallery/8.jpg', x: 0, y: 0, z: -1500, nx: 0, nz: -1 },
            { img: './../resouce/gallery/9.jpg', x: -1000, y: 0, z: -1500, nx: 0, nz: -1 },
            // west
            { img: './../resouce/gallery/10.jpg', x: -1500, y: 0, z: -1000, nx: 1, nz: 0 },
            { img: './../resouce/gallery/11.jpg', x: -1500, y: 0, z: 0, nx: 1, nz: 0 },
            { img: './../resouce/gallery/12.jpg', x: -1500, y: 0, z: 1000, nx: 1, nz: 0 }
        ],
        structure: [
            {
                // wall
                fill: { r: 255, g: 255, b: 255, light: 1 },
                x: [-1001, -490, -490, -1001],
                z: [-500, -500, -500, -500],
                y: [500, 500, -500, -500]
            }, {
                // wall
                fill: { r: 255, g: 255, b: 255, light: 1 },
                x: [-501, 2, 2, -500],
                z: [-500, -500, -500, -500],
                y: [500, 500, -500, -500]
            }, {
                // wall
                fill: { r: 255, g: 255, b: 255, light: 1 },
                x: [0, 502, 502, 0],
                z: [-500, -500, -500, -500],
                y: [500, 500, -500, -500]
            }, {
                // wall
                fill: { r: 255, g: 255, b: 255, light: 1 },
                x: [490, 1002, 1002, 490],
                z: [-500, -500, -500, -500],
                y: [500, 500, -500, -500]
            }, {
                // shadow
                fill: { r: 0, g: 0, b: 0, a: 0.2 },
                x: [-420, 420, 420, -420],
                z: [-500, -500, -500, -500],
                y: [150, 150, -320, -320]
            }, {
                // shadow
                fill: { r: 0, g: 0, b: 0, a: 0.2 },
                x: [-20, 20, 20, -20],
                z: [-500, -500, -500, -500],
                y: [250, 250, 150, 150]
            }, {
                // shadow
                fill: { r: 0, g: 0, b: 0, a: 0.2 },
                x: [-20, 20, 20, -20],
                z: [-500, -500, -500, -500],
                y: [-320, -320, -500, -500]
            }, {
                // shadow
                fill: { r: 0, g: 0, b: 0, a: 0.2 },
                x: [-20, 20, 10, -10],
                z: [-500, -500, -100, -100],
                y: [-500, -500, -500, -500]
            }, {
                // base
                fill: { r: 32, g: 32, b: 32 },
                x: [-50, 50, 50, -50],
                z: [-150, -150, -50, -50],
                y: [-500, -500, -500, -500]
            }, {
                // support
                fill: { r: 16, g: 16, b: 16 },
                x: [-10, 10, 10, -10],
                z: [-100, -100, -100, -100],
                y: [300, 300, -500, -500]
            }, {
                // frame
                fill: { r: 255, g: 255, b: 255 },
                x: [-320, -320, -320, -320],
                z: [0, -20, -20, 0],
                y: [-190, -190, 190, 190]
            }, {
                // frame
                fill: { r: 255, g: 255, b: 255 },
                x: [320, 320, 320, 320],
                z: [0, -20, -20, 0],
                y: [-190, -190, 190, 190]
            },
            { img: true },
            {
                // ceilingLight
                fill: { r: 255, g: 128, b: 0 },
                x: [-50, 50, 50, -50],
                z: [450, 450, 550, 550],
                y: [500, 500, 500, 500]
            }, {
                // groundLight
                fill: { r: 255, g: 128, b: 0 },
                x: [-50, 50, 50, -50],
                z: [450, 450, 550, 550],
                y: [-500, -500, -500, -500]
            }
        ],
        options: {
            imagesPath: ""
        }
    });
})();
