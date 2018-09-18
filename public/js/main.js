//Base64
(function (global, factory) { typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(global) : typeof define === "function" && define.amd ? define(factory) : factory(global) })(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this, function (global) { "use strict"; var _Base64 = global.Base64; var version = "2.4.8"; var buffer; if (typeof module !== "undefined" && module.exports) { if (typeof navigator != "undefined" && navigator.product == "ReactNative") { } else { try { buffer = require("buffer").Buffer } catch (err) { } } } var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; var b64tab = function (bin) { var t = {}; for (var i = 0, l = bin.length; i < l; i++)t[bin.charAt(i)] = i; return t }(b64chars); var fromCharCode = String.fromCharCode; var cb_utob = function (c) { if (c.length < 2) { var cc = c.charCodeAt(0); return cc < 128 ? c : cc < 2048 ? fromCharCode(192 | cc >>> 6) + fromCharCode(128 | cc & 63) : fromCharCode(224 | cc >>> 12 & 15) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | cc & 63) } else { var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320); return fromCharCode(240 | cc >>> 18 & 7) + fromCharCode(128 | cc >>> 12 & 63) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | cc & 63) } }; var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g; var utob = function (u) { return u.replace(re_utob, cb_utob) }; var cb_encode = function (ccc) { var padlen = [0, 2, 1][ccc.length % 3], ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0), chars = [b64chars.charAt(ord >>> 18), b64chars.charAt(ord >>> 12 & 63), padlen >= 2 ? "=" : b64chars.charAt(ord >>> 6 & 63), padlen >= 1 ? "=" : b64chars.charAt(ord & 63)]; return chars.join("") }; var btoa = global.btoa ? function (b) { return global.btoa(b) } : function (b) { return b.replace(/[\s\S]{1,3}/g, cb_encode) }; var _encode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (u) { return (u.constructor === buffer.constructor ? u : buffer.from(u)).toString("base64") } : function (u) { return (u.constructor === buffer.constructor ? u : new buffer(u)).toString("base64") } : function (u) { return btoa(utob(u)) }; var encode = function (u, urisafe) { return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g, function (m0) { return m0 == "+" ? "-" : "_" }).replace(/=/g, "") }; var encodeURI = function (u) { return encode(u, true) }; var re_btou = new RegExp(["[À-ß][-¿]", "[à-ï][-¿]{2}", "[ð-÷][-¿]{3}"].join("|"), "g"); var cb_btou = function (cccc) { switch (cccc.length) { case 4: var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536; return fromCharCode((offset >>> 10) + 55296) + fromCharCode((offset & 1023) + 56320); case 3: return fromCharCode((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2)); default: return fromCharCode((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1)) } }; var btou = function (b) { return b.replace(re_btou, cb_btou) }; var cb_decode = function (cccc) { var len = cccc.length, padlen = len % 4, n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0), chars = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 255), fromCharCode(n & 255)]; chars.length -= [0, 0, 2, 1][padlen]; return chars.join("") }; var atob = global.atob ? function (a) { return global.atob(a) } : function (a) { return a.replace(/[\s\S]{1,4}/g, cb_decode) }; var _decode = buffer ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from ? function (a) { return (a.constructor === buffer.constructor ? a : buffer.from(a, "base64")).toString() } : function (a) { return (a.constructor === buffer.constructor ? a : new buffer(a, "base64")).toString() } : function (a) { return btou(atob(a)) }; var decode = function (a) { return _decode(String(a).replace(/[-_]/g, function (m0) { return m0 == "-" ? "+" : "/" }).replace(/[^A-Za-z0-9\+\/]/g, "")) }; var noConflict = function () { var Base64 = global.Base64; global.Base64 = _Base64; return Base64 }; global.Base64 = { VERSION: version, atob: atob, btoa: btoa, fromBase64: decode, toBase64: encode, utob: utob, encode: encode, encodeURI: encodeURI, btou: btou, decode: decode, noConflict: noConflict }; if (typeof Object.defineProperty === "function") { var noEnum = function (v) { return { value: v, enumerable: false, writable: true, configurable: true } }; global.Base64.extendString = function () { Object.defineProperty(String.prototype, "fromBase64", noEnum(function () { return decode(this) })); Object.defineProperty(String.prototype, "toBase64", noEnum(function (urisafe) { return encode(this, urisafe) })); Object.defineProperty(String.prototype, "toBase64URI", noEnum(function () { return encode(this, true) })) } } if (global["Meteor"]) { Base64 = global.Base64 } if (typeof module !== "undefined" && module.exports) { module.exports.Base64 = global.Base64 } else if (typeof define === "function" && define.amd) { define([], function () { return global.Base64 }) } return { Base64: global.Base64 } });

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
        if(!this.interval)
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

// const percentText = document.getElementById('percentText')
// const percentProgress = document.getElementById('percentProgress')

function check(len) {
    $('#percentText').text((parseFloat(len / l) * 100).toFixed(0))
    // $('#percentProgress').css('width', len / l * 100 + '%')
    if (len === l){
        // console.log($('#srcLoading'))
        setTimeout(() => $('#srcLoading').remove(), 800)
    }
}

//hashRoute
class HashRoute{
    constructor(map){
        this.map = map
        this.routes = {}
        this.curUrl = ''
    }
    reload(){
        this.curUrl = location.hash.substring(0) || '#/index'
        this.routes[this.curUrl]()
    }
    init(){
        for(let item of this.map)
            this.routes[item.url] = item.map
        window.addEventListener('hashchange', this.reload.bind(this))
    }
}
function hashRouter(){
    const navs = $('header .nav li')
    const router = new HashRoute([
            {
                url:'#/index',
                map: () => mapToHash('#/index')
            },
            {
                url:'#/article',
                map: () => mapToHash('#/article')
            },
            {
                url:'#/message',
                map: () => mapToHash('#/message')
            },
            {
                url:'#/about',
                map: () => mapToHash('#/about')
            }
        ])
    router.init()
    function mapToHash(url){
        // if(url === '#/gallery')
        //     $('.gallery_api').trigger('click')
        // else
        for(let nav of navs){
            if($(nav).find('a')[0].getAttribute('href') === url){
                // $('.exit_gallery').trigger('click')
                $(nav).find('a').trigger('click')
                return
            }
        }
    }
}
//glitch
(function ($) {
    $.fn.extend({
        glitch: function (config) {
            var option = {      //default configure
                zIndexDefault: 3,
                effect1TimeMin: 600,
                effect1TimeMax: 900,
                effect2TimeMin: 10,
                effect2TimeMax: 115,
                time: 100
            };
            option = $.extend(option, config);

            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function init(el, option) {
                var el1 = el.clone();
                el1.insertBefore(el).css({ 'z-index': option.zIndexDefault });

                var el2 = $(el).clone();
                el2.insertAfter(el).addClass('front-3').
                    css({ 'z-index': option.zIndexDefault + 1 });

                var el3 = el.clone();
                el3.insertAfter(el).css({ 'z-index': option.zIndexDefault + 2 });
            }

            function mix(el, option) {

                var clipPos1 = randomInt(10, 1900);
                var clipPos2 = 9999;
                var clipPos3 = randomInt(10, 1300);
                var clipPos4 = 0;
                var leftValue = randomInt(0, 40);
                var rightValue = randomInt(0, 40);
                var scaleValue = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);
                var randomTime = randomInt(option.effect2TimeMin, option.effect2TimeMax);
                $(el).next().next().css({
                    'clip': 'rect(' + clipPos1 + 'px, ' + clipPos2 + 'px, ' + clipPos3 + 'px,' + clipPos4 + 'px)',
                    'left': leftValue,
                    'right': rightValue,
                    '-webkit-transform': 'scale(' + scaleValue + ')',
                    '-ms-transform': 'scale(' + scaleValue + ')',
                    'transform': 'scale(' + scaleValue + ')',
                    'mix-blend-mode': 'hue'
                });
            }

            function glitch1(el, config) {
                var clip1 = randomInt(10, 1900);
                var clip2 = 9999;
                var clip3 = randomInt(10, 1300);
                var clip4 = 0;
                var left = randomInt(0, 16);
                var right = randomInt(0, 16);
                var randomTime = randomInt(config.effect1TimeMin, config.effect1TimeMax);

                $(el).css({   //attention to : the principle of glitch effect
                    'clip': 'rect(' + clip1 + 'px, ' + clip2 + 'px, ' + clip3 + 'px,' + clip4 + 'px)',
                    'right': right,
                    'left': left
                });
            }

            function glitch2(el, config) {
                var clip1 = randomInt(10, 1900);
                var clip2 = 9999;
                var clip3 = randomInt(10, 1300);
                var clip4 = 0;
                var left = randomInt(0, 40);
                var right = randomInt(0, 40);
                var randomTime = randomInt(config.effect2TimeMin, config.effect2TimeMax);
                var scale = (Math.random() * (1.1 - 0.9) + 0.9).toFixed(2);

                $(el).next().css({
                    'clip': 'rect(' + clip1 + 'px, ' + clip2 + 'px, ' + clip3 + 'px,' + clip4 + 'px)',
                    'left': left,
                    'right': right,
                    '-webkit-transform': 'scale(' + scale + ')',
                    '-ms-transform': 'scale(' + scale + ')',
                    'transform': 'scale(' + scale + ')',
                });
            }

            init(this, option);
            setInterval(() => {
                glitch1(this, option);
                glitch2(this, option);
                mix(this, option);
            }, option.time);
        }
    })
})(jQuery);

(function ($) {       //add shake 
    $.fn.extend({    //扩展实例方法
        shake: function (speed, param, scale) {

            let self = this;
            if (this.css('position') === 'static')
                this.css('position', 'relative');
            let status = {
                x: parseInt(this.css('left')),
                y: parseInt(this.css('top')),
                fsz: parseInt(this.css('font-size'))
            }

            function init() {
                self.animate({
                    fontSize: status.fsz + 5,
                    left: status.x - param
                }, speed / 2).animate({
                    left: status.x + param
                }, speed / 2);
            }

            init();

            function shake() {
                let temp = param * 2;
                self.id = setInterval(() => {
                    self.animate({
                        left: status.x - temp
                    }, speed / 2).animate({
                        left: status.x + temp
                    }, speed / 2);
                    temp -= 2;
                    if (temp === 0) {
                        temp = param;
                        clearInterval(self.id);
                    }
                }, speed)
            }

            shake();
            function stop() {
                self.closest('li').mouseout(() => {
                    clearInterval(self.id);
                    self.stop().animate({
                        fontSize: status.fsz,
                        left: status.x,
                        top: status.y
                    }, 50)
                })
            }

            stop();
            return this;
        }
    })
})(jQuery)

function closeAddArticle(wd, ht) {   //exit add_article_ui
    $('.close_add_article').on('click  ',() => {
        $('.error_information').hide();
        $('.add_article_overlay').animate({
            opacity: 0
        }, 750).find('.add_article_box').css('transform', 'scale(.7)');
        setTimeout(() => {
            $('.add_article_overlay').css('z-index', '-1');
        }, 1000);
    })
}

function exitLoginRegCancel() {
    $('.exit').on('click  ',() => {
        exitLoginRegFace();
    })
    // $('.exit') = null
}
function loginFn(name) {  //login
    $('.new_login').on('click.exitLogin  ', () => {
        $("#login").show();
        $('.login_register').find('#register').hide().prev().show();
        $('.login_register').find('#check_password').hide();
        showLoginRegFace();
        let regObj = new RegisterClass(name);
        regObj.signUp();
    })
    // $('.new_login') = null
}

function showLoginRegFace() {
    $('.login_register').show().css('z-index', '999').find('.bar').animate({
        height: $('.login_register').height() / 2
    }, 1000, () => {
        $('.login-effect').css('opacity', '1').css('transform', 'scale(1)');
    });
}

function register() { //register
    $('.new_register').on('click  ',() => {
        $('.login_register').find('#login').hide();
        $("#register").show().prev().hide();
        $("#check_password").show();
        showLoginRegFace();
        let regObj = new RegisterClass();
        regObj.reg();
        regObj.signUp();
    })
    // $('.new_register') = null
}

class RegisterClass {  //register fn

    constructor(name) {
        if(name === undefined) name = 'Ada';
        this.name = name;
    }

    reg() {
        $('#login').hide();
        $('#register').on('click  ',() => {
            const name = $('#username').val();
            const pwd = $('#check_password').val();
            const pwd1 = $('#password').val()
            if (/\s/.test(name)) {
                infoContainer('用户名不能包含空格', false)
                return
            }
            if (/\s/.test(pwd1)) {
                infoContainer('密码不能包含空格', false)
                return
            }
            if(name.length > 30){
                infoContainer('用户名字符长度不能超过30' , false)
                return
            }
            if (name === self.name) {
                infoContainer('请输入用户名' , false)
                return;
            }
            if (name === '') {
                infoContainer('请输入用户名' , false)
                return;
            }
            if (pwd1 === '') {
                infoContainer('请输入密码' , false)
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
                body: JSON.stringify({ name, pwd:Base64.encode(pwd) })
            }).then(res => {
                if(res.status >= 200 && res.status <300 )
                    return res.json()
                return res
            }).then(data => {
                if(data && data.success)
                    infoContainer('注册成功，请登录', true, () => setLogin() )
                else 
                    infoContainer(data && data.errorMsg || '网络出错' + data.status )
            })
        })
    }

    signUp() {
        $('.register span').css('color', '#6fb2df').html(' ');
        $('#login').on('click  ', () => {
            let na = $('#username').val();
            let state = $('.register input[type=checkbox]')[0].checked;
            if ($('#username').val() === '') {
                // $('.register span').css('color', 'red').html('please enter name');
                infoContainer('请输入用户名' , false)
                return;
            }
            if ($('#password').val() === '') {
                // $('.register span').css('color', 'red').html('please enter password');
                infoContainer('请输入密码' , false)
                return;
            }
            fetch('/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ name: na, pwd: Base64.encode($('#password').val()), state })
            }).then(res => {
                if(res.status >= 200 && res.status < 300)
                    return res.json()
                return res
            }).then(data => {
                if(data && data.success){
                    window.sessionStorage && sessionStorage.getItem('user') && sessionStorage.removeItem('user')
                    sessionStorage && sessionStorage.setItem('user', Base64.encode(na))
                    $('.register span').css('color', '#6fb2df').html(na);
                    $('.user_name').html(na);
                    // $('.msg_name').val(na);
                    $('#login_anchor').html('register');
                    exitLoginRegFace();
                    repeatCon(na)
                    uploadAvatar(Base64.decode(sessionStorage.getItem('user')))
                    getAvatar(Base64.decode(sessionStorage.getItem('user')))
                    $('#avatar').show()
                    $('.avatarTip').show()
                    $('#setAvatarTip').show()
                    if( data.avatar ) $('.avatar_img')[0].src = data.avatar
                    messageOperation(na)
                    if( data.admin ){
                        adminToggle()
                        publishDynamic()
                        publishItem()
                        deleteDynamic()
                        deleteArticle()
                        adminEdit()
                        updateArticle()
                        editDynamic()
                        adminUI()
                    }
                    $('.new_login span').text('注销')
                    // $('.all_user').html('register');
                    loginOut();
                }else infoContainer(data && data.errorMsg || '网络错误' + data.status)
            })
        })
    }
}

function exitLoginRegFace() {
    $('.login-effect')
        .css('transform', 'scale(.7)').css('opacity', '0');
    setTimeout(() => {
        $('.login_register').find('.bar').animate({
            height: 0
        }, 750, function () {
            $('.login_register').css('z-index', '0').hide();
        });
    }, 650);

}

function setLogin() {
    $('.register label').show();
    $('.label-con').show()
    $('#login').show() 
    $("#check_password").hide();
    $('.login-effect').animate({
        height: 267
    })
    $("#register").hide().next().show();
}

class MessageModel {         //message board model

    constructor(name) {
        this.name = name;
    }

    saveMsg() {
        let self = this;
        $('.message_board_input input[type=button]').on('click  ',() => {
            let na = $('.message_board_input input[type=text]').val();
            let d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            let currentDay = year + "-" + month + '-' + day;
            let msg = $('.message_board_input textarea').val();
            let msgObj = {
                name: na,
                content: msg,
                date: currentDay
            };
            if (na !== '' && msg !== '') {
                $.post('./addMessage', {
                    username: self.name,
                    name: na,
                    content: msg,
                    date: currentDay
                }, function (res) {
                    if (res) {
                        getMessage(self.name);
                    }
                });
            }
        })
    }
}

function getMessage(name) {
    let data = [];
    $.post(
        './messages',
        {username: name},
        function (res) {
            for (let i = res.length - 1; i >= 0; i--)
                data.push(res[i]);
            let html = template('message_tpl', {messages: data});
            $('.message_list li').remove();         //last li must been removed
            $('.message_list').append($(html));
            messageCount(data.length);
        }
    )
}

function messageCount(count) {
    $('.temp_ul li').eq(0).html(count + '评论').next().html(count + '人参与');
}

function articleData(name) { //get article's data
    $('.article_list li').remove();
    $('.all_article li').remove();
    let data = [];
    if (name === undefined) name = 'admin';
    $.post(
        './articles',
        {username: name},
        function (res) {
            let len = res.length;
            for (let i = len - 1; i >= 0; i--)
                data.push(res[i]);
            let temp = template('article_tpl', {articles: data});
            $(temp).appendTo($('.article_list'));
            showArticle();
            setTimeout(() => {
                allArticle();
            }, 0);
        }
    )
}

function showArticle() {  //show full article when click article's summary
    let articles = $('.article_list .article');
    let wd = $('.face').width();
    let ht = $('.face').height();

    let tempObj = {
        left: $('.article_list .article').width() * 0.25,
        width: $('.article_list .article').width(),
        height: $('.article_list .article').height(),
        spanWd: $('.article_list .article .article_date').width()
    }
    $('.article_list').on('click  ','.article',(function (e) {
//  	$(this).siblings().find('.article_close').trigger('click');
        var e = e || window.event;
        e.stopPropagation();
        $('.context-menu').hide()
//      var current = $(this).index();
       const _id = this.getAttribute('_id')
       const viewer = Number($(this).find('.article-viewer span:nth-of-type(2)').text())
        updateViewer(_id, viewer, $(this).find('.article-viewer span:nth-of-type(2)'), this)
        $(this).addClass('showArticle').
        siblings().removeClass('showArticle').find('.article_tittle').removeClass('article_title_toggle');
        $(this).siblings().find('.article_summary').removeClass('toggleP');
        // $(this).siblings().find('.article_date').css({
        // 	left:'-16%'
        // });
        $(this).find('.article_close').addClass('showClose')
        $(this).siblings().find('.article_close').removeClass('showClose');
        $(this).find('.article_tittle').addClass('article_title_toggle');
        $(this).find('.article_summary').addClass('toggleP');
        showArticlePrepare($(this));
        closeArticle($(this), tempObj);
        // $('main').addClass('articleMain')
    }))
    // $('.article_list') = null
}

function updateViewer(_id , viewer , el , _this){
    if (_this.isClick) return
    fetch('/updateArticleViewerById', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application'
        },
        body: JSON.stringify({_id, viewer})
    }).then(res => {
        if(res.json)    return res.json()
    }).then(data => {
        if(data && data.success){
            el.text(String(viewer + 1))
            _this.isClick = true
        }
    })
}

function showArticlePrepare(param) {   //before show full article
    $('.right_article_list').hide(500);
    param.find('.article_close').show(500);
    // param.find('.article_date').stop().animate({
    //     left: -250
    // }, 300);
}

function closeArticleNew(){
  $('.article_list').on('click  ','.article_close',function(e){
    $(this).closest('.article').find('.article_tittle').removeClass('article_title_toggle');
      $(this).closest('.article').removeClass('showArticle').find('.article_summary').removeClass('toggleP');
      $('.right_article_list').show(500);
      var e = e || window.event;
      e.stopPropagation();
      $('.context-menu').hide()
      $(this).removeClass('showClose');
    //   $('main').removeClass('articleMain')
    //   $(this).closest('.article').find('.article_date').stop().animate({
    //       left: '-16%'
    //   }, 300);
  })
  // $('.article_list') = null
}

function closeArticle(temp, k) {        //close full article
    temp.find('.article_close').on('click  ',function (e) {
    	temp.find('.article_tittle').removeClass('article_title_toggle');
        temp.removeClass('showArticle').find('.article_summary').removeClass('toggleP');
        $('.right_article_list').show(500);
        var e = e || window.event;
        e.stopPropagation();
        $('.context-menu').hide()
        $(this).removeClass('showClose');
        // $('main').removeClass('articleMain')
        // temp.find('.article_date').stop().animate({
        //     left: '-16%'
        // }, 300);
    })
    // temp.find('.article_close') = null
}

function face1LeftbaraShake() {
    let anchors = $('.face:nth-of-type(1) .left_bar .user_down .user_menu li a');

    anchors.mouseenter(function () {
        $(this).shake(400, 6, 1.2);
    });
    $('.sharetoqzone').mouseenter,(()=>{
        $('.qzone').shake(400,6,1.2);
    })
    // anchors = null
}

// function getMood(name) {  //get mood_board data
//     let data = [];
//     $.get(
//         './mood',
//         function (res) {
//             for (let i = 0, len = res.length; i < len; i++) {
//                 data.push(res[i]);
//             }
//             let html = template('mood_tpl', {moods: data});
//             $(html).appendTo($('.mood_board'));
//         }
//     )

// }

function mottoSlide(el) {
    let top = parseInt(el.css('top'));
    el.show().css({opacity: 0, top: top - 30}).animate({
        opacity: 1,
        top: top
    }, 700)
}

function selectNav() {      //nav
    let nav = $('header .nav li a');
    let face = $('.screen main .all .face');
    let ht = face.height();
    let wd = face.width();
    const url = ['index','article','message','about']
    nav.on('click  ',function () {
        face.css('display','block');
        $('.insert_dialog').hide();
        let index = $(this).parent().index();
        function foo(item) {
                item.css({
                    opacity: 1,
                    transform: 'translateX(0) translateZ(0)'
                })
        }
        function fo(item) {
            item.css({
                opacity: 0,
                transform: 'translateX(-40px) translateZ(0)'
            })
        }
        if (index === 1) {
            $('.right_article_list').show(500);
            foo($('.article_summary'));
        }
        else if(index === 3){
            const _this = this
            if (!this.isIntroduce) {
                const text = $('#introduce_textarea')
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
                        text.val(result.introduce)
                        _this.isIntroduce = true
                    }
                }).catch(err => infoContainer(err && err.errorMsg || err))
            }
        }
        else if (index !== 1) {
            $('.right_article_list').hide();
            fo($('.article_summary'));
        }
        if (index === 0) {
            sliderObj.autoSlide();
            foo($('.dynamic .title'));
            foo($('.mood_item p'));
        }
        else {
            sliderObj.stopSlide();
            fo($('.dynamic .title'));
            fo($('.mood_item p'));
        }
        if (index === 2)
            foo($('.message_list p'));
        else {

            fo($('.message_list p'));
        }
        face.eq(index).siblings().css({
            transform: `translateX(-${wd}px) translateZ(0)`,
            opacity: 0,
            zIndex: -1,
        })
        face.eq(index).css('z-index', '3');
        face.eq(index).css({
            opacity: 1,
            transform: 'translateX(0) translateZ(0)'
        })
    });
}

function init() {
    $('.motto').hide(); //set motto default status

    let wd = $('.screen main')[0].offsetWidth;
    sliderObj = new SetSlide(1);
    sliderObj.slideInit();
    sliderObj.slideStatus();
    sliderObj.autoSlide();

    $('.add_article_overlay').hide().css('opacity', '0');
    closeAddArticle(null, null);

    let w = $('.all .face').width();
    $('main').css({
        height: '90%'
    })
    $('.all .face').css({
        transform:`translateX(${w}) translateZ(0)`
    }).eq(0).css({
        transform: `translateX(0) translateZ(0)`
    })
    if (sessionStorage && Base64.decode(sessionStorage.getItem('user')) !== 'Ada')
        $('.delete_msg').css('cursor', 'not-allowed')
}

function SetSlide(current) {
    let wd;
    this.id = null;
    this.current = current;
    this.wd = $('.slide_photo li').width();

    let self = this;
    this.slideInit = function () {

        let liFirst = $('.slide_photo li').eq(0).clone();
        let liLast = $('.slide_photo li:last-of-type').clone();
        liFirst.appendTo('.slide_photo');
        liLast.prependTo('.slide_photo');
        count = $('.slide_photo li').length;
        $('.slide_photo').css({
            width: count * self.wd
        });
        $('.slide_photo').css('left', '-' + self.wd + 'px');
    }
    this.slideStatus = function () {
        $('.slide_photo_box .slide_photo').mouseenter(() => {
            self.stopSlide();
        });
        $('.slide_photo_box .slide_photo').mouseleave(() => {
            self.autoSlide();
        })
    }
    this.autoSlide = function () {
        clearInterval(self.id);
        this.id = setInterval(() => {
            self.slideNext();
        }, 3000);
    }
    this.stopSlide = function () {
        clearInterval(self.id);
    }

    this.slideNext = function () {
        this.current++;
        this.slideTo(this.current);
    }
    this.slideTo = function (index) {
        if (index === -1) {
            $('.slide_photo').css({
                left: -this.wd * (count - 2)
            })
            index = this.current = count - 3;
        }
        if (index === count) {
            $('.slide_photo').css({
                left: -1 * this.wd
            })
            index = this.current = 2;
        }
        let leftValue = -index * this.wd;
        $('.slide_photo').animate({
            left: leftValue
        }, 1500)
    }
}

function loading() {
    let temp = $('.loading .loading_top').height() / 2;
    let dots = $('.loading_dot div');
    let arr = [];
    let len = dots.length;
    for (let i = 0; i < len; i++) {
        arr.push(dots[i].offsetTop);
    }
    $('.loading_btn').mouseup(function () {
        dots.show();
        $('.loading_btn').css({
            top: 30
        });
        window.onmousemove = null;
        window.onmouseup = function () {
            dots.show();
            $('.loading_btn').css({
                top: 30
            })
            window.onmousemove = null;
            return false;
        };
        return false;
    });
    $('.loading_btn').mousedown(function (e) {  //loading
        var e = e || window.event;
        let top = $('.loading_center_box')[0].offsetTop;
        let downY = e.clientY;
        window.onmousemove = function (e) {
            var e = e || window.event;
            let y = e.clientY - downY + 25;
            eatDot(arr, y - 25, dots);
            $('.loading_btn').css({
                top: y
            });
            checkLoadingFinished(temp, y);
            return false;
        }
    });
}

function checkLoadingFinished(temp, y) { //load finished
    if (y >= 280) {
        window.onmousemove = null;
        $('.loading_center_box').hide()
        $('.loading_top').animate({
            height: 100
        }, 300).animate({
            height: 0
        }, 700)
        $('.loading_down').animate({
            height: 100
        }, 300).animate({
            height: 0
        }, 700)
        setTimeout(function () {
            $('.loading').hide();
        }, 1000);
        $('.screen').show(2000).find('main').show();
    }
} //loading finished

function eatDot(arr, y, dots) {//dot hide
    let long = arr.length;
    for (let j = 0; j < long; j++) {
        if (y >= arr[j])
            $(dots[j]).hide();
        else
            $(dots[j]).show();
    }
}

function asideTextHover() {
    let lis = $('aside .aside_menu li');
    lis.mouseenter(function () {
        $(this).find('i.shake').stop().shake(400, 3, 1.2)
    })
}

function loginWarning() {
    $('.menu_toggle').on('click.loginMove  ', () => {
        $('.new_login').removeClass('tada');
        setTimeout(() => {
            $('.new_login').addClass('tada');
        });
    });
}

function uploadAvatar(name){
    if(name === undefined || name.length >=30) return
    const upload = document.getElementById('avatar')
    const img = document.getElementsByClassName('avatar_img')
    upload.addEventListener('change' , function(){
        const file = this.files[0]
        const fileName = file.name
        if(!/image\/\w+/.test(file.type)){
            infoContainer("请确保文件为图像类型" , false)
            return
        }
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = function(){
            const avatar = this.result
            fetch('/set-avatar' ,
                {
                    method : 'POST' ,
                    body : JSON.stringify({ avatar, name, fileName }) ,
                    headers: {
               　　　　 'Accept': 'application/json',
               　　　　 'Content-Type': 'application/json',
             　　　　 }
                }).then(res => {
                    if(res.status <= 200 && res.status < 300)
                        return res.json()
                    return res
                }).then(data => {
                    (data && data.success) ?
                        infoContainer('更新头像成功', true, () => {
                            for(let item of img)
                                item.src = `/upload/user_avatar/${fileName}`
                        })
                    : 
                        infoContainer(data && data.errorMsg || '网络出错 ' + data.status)
                })
        }
    },false)
}

function getAvatar(name){
    if(name === undefined || name.length >= 100) return
    const img = document.getElementsByClassName('avatar_img')
    fetch('/get-avatar',{
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
            'accept' : 'application/json'
        },
        body: JSON.stringify({
            name: Base64.encode(JSON.stringify({ name : name })
        )})
    }).then(res => {
        if(res.status >=200 && res.status < 300)
            return res.json()
        return res
    }).then(data => {
        if(data && data.success)
            for (let item of img)
                item.src = data.data
        else 
            infoContainer(data && data.errorMsg || '网络出错' + data.status, false)
    })
}

function repeatCon(name){
        $('.message_list').off('click').on('click','a.repeat_msg',function(){
    if(name === undefined || name.length >=30) {
        infoContainer('你还没有登陆' , false)
     return   
    }
            const _id = this.getAttribute('_id')
            const toRepeat = this.getAttribute('_to_repeat')
            if(name){
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
                            $('.repeat_word').val('')
                            reRenderMsg(result.data)
                            $('.cancel_repeat').trigger('click')
                        } else
                            infoContainer(result && result.errorMsg || '网络繁忙' + result)
                    })
                })
                // console.log(_id)
            }
            else{
                infoContainer('你还没有登陆' , false , ()=>{
                    $('a.new_login').trigger('click')
                })
            }
        })
}

function escapeMessage(str){
    if(!str) return '';
    else    return str.replace(/<\/?script>+|傻逼+|爸爸+|你爸+|SB+|sB+|sb+|操+|你妈/g,'**');
}

function sendRepeat(callback){
    $('.repeat_over').addClass('bounceIn').show()
    $('.cancel_repeat').click(_ => {
        $('.repeat_over').hide().removeClass('bounceIn')
    })
    $('.submit_repeat').off('click').on('click',function(){
        const word = escapeMessage($('.repeat_word').val().replace(/<\/?script>/g , ''))
        let date = new Date()
        let minute = date.getMinutes()
        minute < 10 ? minute+1  : '0'+minute
        let seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let d = year + '/' + month + '/' + day + ' '+hour+':'+minute+':'+seconds
        if(word === '' || word.trim() === '' ) {
            infoContainer('回复内容不能为空' , false)
            return
        } 
        if ( word.length > 280) {
            infoContainer('内容不能超过280字', false)
            return
        }else{
            loadingUI('start')
            callback && callback(d, word) 
        }
    })
}

function messageOperation(name){
    name = name || sessionStorage && sessionStorage.getItem('user') || undefined
    if(!name) return
    isAdmin(name, () => {
            $('.message_list').on('click', 'a.delete_msg', function () {
                    const _id = this.getAttribute('_id')
                    const _this = this
                loadingUI('start')
                fetch('/deleteMsgById', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({ _id })
                }).then(res => {
                    if(res.status >= 200 && res.status < 300)
                        return res.json()
                    return res.status
                }).then(result => {
                    loadingUI('end')
                    if(result && result.success){
                        infoContainer('删除成功', true)
                        $(_this).closest('li').remove()
                    }else 
                    infoContainer(result && result.errorMsg || '网络繁忙' + result)
                })
            })
        }).catch(err => { })
}

function isAdmin(name , callback){
    if(!name || name === '') return
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
            if(res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            if(result && result.success ){
                resolve(result.data)
                callback && callback()
            }else
                reject(result && result.errorMsg || '获取权限失败' + result)
        })
    })
}

function checkPerssion(name){
    if(!name || Base64.decode(name) == undefined){
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
            adminEdit()
            updateArticle()
            editDynamic()
            deleteDynamicRepeat(true)
            adminUI()
        }
    }).catch(err => {
        $('.menu_toggle').on('click', _ => { infoContainer(err, false) })
        deleteDynamicRepeat(false)
    })
}

function adminUI(){
    $('.deleteDynamicRepeat').css('cursor', 'pointer')
    $('.delete_msg').css('cursor', 'pointer')
}

function deleteDynamicRepeat(perrsion){
    if (!perrsion) {
        $('.deleteDynamicRepeat').css('cursor', 'not-allowed')
        return
    }
    $('.deleteDynamicRepeat').css('cursor', 'cursor')
    $('.dynamic').on('click','.deleteDynamicRepeat', function(){
        const _id = this.getAttribute('_id')
        const msgId = this.getAttribute('_msgid')
        const li = $(this).closest('li')
        loadingUI('start')
        fetch('/deleteDynamicMsg', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ _id, msgId })
        }).then(ans => {
            if(200 <= ans.status && ans.status < 300)
                return ans.json()
            return ans.status
        }).then(result => {
            loadingUI('end')
            if(result && result.success){
                infoContainer('删除成功', true)
                li.remove()
            }else
                infoContainer('删除失败' + result && result.errorMsg || result)
        })
    })
}

function loginState() {
    let arr = document.cookie.split('; ')
    let b = []
    for(let i in arr)
        b.push(arr[i].split('='))
    let count = 0
    for(let item of b){
        if(item[0] === 'user' || window.sessionStorage && sessionStorage.getItem('user')){
            if(window.sessionStorage && !sessionStorage.getItem('user')) sessionStorage.setItem('user', item[1])
            rememberLoginState(Base64.decode(sessionStorage.getItem('user') || item[1]));
            $('.all_user span').text('注销');
            $('.user_name').html(Base64.decode(sessionStorage.getItem('user') || item[1]));
            getAvatar(Base64.decode(sessionStorage.getItem('user') || item[1]))
            repeatCon(Base64.decode(sessionStorage.getItem('user') || item[1]))
            uploadAvatar(Base64.decode(sessionStorage.getItem('user') || item[1]))
            $('#avatar').show() 
            $('#setAvatarTip').show()
            messageOperation(Base64.decode(sessionStorage.getItem('user') || item[1])) 
            checkPerssion(Base64.decode(sessionStorage.getItem('user') || item[1]))
            return
        }else count++
    }
    if(count === b.length){
        loginWarning();
        getAvatar('Ada')
        messageOperation(undefined)
        repeatCon(undefined)
        $('#avatar').hide()
        $('.all_user span').html('登陆')
        $('.user_name').html('Ada')  
        const name = sessionStorage && sessionStorage.getItem('user') && Base64.decode(sessionStorage.getItem('user')) || undefined 
        checkPerssion(name)   
    }
}

function adminToggle() {
    var wd = window.innerWidth;
    $('#editIntroduce').click(() => {
        const val = $('#introduce_textarea').val()
        if(val.length >= 300){
            infoContainer('不能超过300个字符', !1)
            return
        }
        if(val.trim() === ''){
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
    })
    $('.menu_toggle').off('.loginMove').on('click  ', () => {
        // $('.insert_dialog').hide();
        // $('.new_error_info').hide();
        $('.admin').toggleClass('adminToggle');
        $('header').toggleClass('headerToggle');
        $('main').toggleClass('mainToggle');
        $('.menu_toggle').toggleClass('btnToggle');
        if ($('.admin').hasClass('adminToggle')) {
            setTimeout(() => {
                $('.admin_menu li').eq(0).stop().animate({
                    opacity: 1,
                    left: 0
                }, 300, () => {
                    $('.admin_menu li').eq(1).stop().animate({
                        opacity: 1,
                        left: 0
                    }, 300, () => {
                        $('.admin_menu li').eq(2).stop().animate({
                            opacity: 1,
                            left: 0
                        }, 300, () => {
                            // ()=>{
                            $('.edit_ui').toggleClass('editToggle')
                            // $('.edit_ui').animate({
                            //     opacity: 1,
                            //     right: 0
                            // }, 100, () => {
                                $('.select_line').show();
                            $('.edit_ui').find('.edit_ul').show().addClass('bounceInRight')
                            //}
                            $('.admin_menu li').eq(3).stop().animate({
                                opacity: 1,
                                left: 0
                            }, 300)
                        })
                    })
                })
            }, 300)
        }
        else {
            $('.select_line').hide();
            $('.edit_ui').toggleClass('editToggle').find('.edit_ul').hide().removeClass('bounceInRight');
            $('.admin_menu li').stop().animate({
                left: -40,
                opacity: 0
            }, 0)
        }
    });
    // $('.menu_toggle') = null
} //admin menu

function rememberLoginState(name) { //user select remember login state
    $('.user_name').html(name);
    $('#login_anchor').html('register');
    $('.loading').hide();
    $('.screen').show();

    loginOut(name);  //current user click login out
}

function loginOut(name) { //delete current user's cookie
    let d = new Date(-1);
    $('.new_login').off('.exitLogin').on('click  ',() => {
        document.cookie = 'user=' + name + '; path=/; ' + 'expires=' + d;
        sessionStorage.removeItem('user')
        $('.login_register').show().css('z-index', '999').find('.bar').animate({
            height: $('.login_register').height() / 2
        }, 1000, () => {
            location.reload();
        });
    });
    // $('.new_login') = null
}

function allUserList() { //all user will be show in a list
    $('.all_user').on('click  ',() => {
        $('aside ul:nth-of-type(2)').toggleClass('all_users_show');
    });
    // $('.all_user') = null
}

function allArticle() { //all articles list
    let title = $('.article_tittle');
    let len = title.length;
    for (let i = 0; i < len; i++) {
        let t = $('<li>' + (i + 1) + '.' + $(title[i]).html() + '</li>');
        $(t).appendTo($('.all_article'));
    }
}

function adminEdit() {
    $('.admin_menu li a').on('click',function () {

        $('.edit_box').animate({
            opacity: 0
        }, 500, () => {
            $('.edit_ul').removeClass('bounceOutRight');
        });
        var index = $(this).parent().index();
        $('.select_line .dot').removeClass('bounce');
        setTimeout(() => {
            $('.select_line .dot').addClass('bounce');
        }, 10);
    });
}

function infoContainer(data , status , callback){
    // $('.result-info').removeClass('tada').addClass('tada')
    if(status) {
        $('.result-info').removeClass('false_dialog').addClass('true_dialog').show().find('p').text(data)
        $('.result-info i').css('color' , '#52c41a').html('&#xe6b3;')
    }else{
        $('.result-info').removeClass('true_dialog').addClass('false_dialog').show().find('p').text(data)
        $('.result-info i').css('color' , '#f5222d').html('&#xe67a;')
    }
 if($('.result-info').hasClass('tada')){
     setTimeout(() => {
         $('.result-info').hide()
         callback && callback()
     }, 2500) 
 }
}

function publishDynamic() {
    $('#publish_dw').on('click publish  ',function () {
        const title = $('#dw_title').val();
        const content = $('#short_article_textarea').val();
        const count = parseInt($('edit_li span').html());
        const date = new Date();
        const d = date.getFullYear() + '-'+((date.getMonth() + 1) <10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)) + '-' + (date.getDate() <10 ? `0${date.getDate()}` : date.getDate() );
        const temp = {
            title: title,
            summary: content
        };
        if (checkBeforePublish(temp)) {
            if (count < 0) {
                infoContainer('文字超出限制' , false);
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
                if(res.status >= 200 && res.status < 300)
                    return res.json()
                return res
            }).then(result => {
                loadingUI('end')
                if(result && result.success){
                    infoContainer('成功,你可以继续发布', true)
                    reRenderDynamic(result.data.reverse())
                    const title = $('#dw_title').val('')
                    const content = $('#short_article_textarea').val('')
                }else 
                    infoContainer(result && result.errorMsg || '网络繁忙' + result.status)
            })
        }
        else {
            infoContainer('输入不完整' ,false)
        }
    })
    // $('#publish_dw') = null
}

function reRenderArticle(data) {  // reload article
    var html = template('article_tpl', {articles: data});
    $('.article_list').find('li').remove();
    $('.article_list').append($(html));
    var html2 = template('article_operation_tpl', {articles: data});
    $('.o_all_article').find('li').remove();
    $('.o_all_article').append($(html2));
}

function reRenderDynamic(data) {  // reload dynamic
    var html = template('dynamic_tpl', {dynamics: data});
    $('.dynamic').find('li').remove();
    $('.dynamic').append($(html));
    var html2 = template('dynamic_operation_tpl', {dynamics: data});
    $('.all_short_article').find('li').remove();
    $('.all_short_article').append($(html2));
}

function checkBeforePublish(temp) { // title and content shouldn't be null
    let resultBool = true
    for(let key in temp)
      if(temp[key].trim() === ""){
        resultBool = false
        break
      }
      return resultBool
}

function publishItem() {  //publish item
    const t = $('.select_line').css('top');
    const obj = {
      url : null
    }
    const mapLi = $('.map_li')
    $('.admin_menu li a').on('click  ', function () {
        var index = $(this).parent().index();
        $('.select_line').animate({
            top: parseInt(t) + index * 40
        }, 300);
        mapLi.removeClass('pulse').hide().eq(index).addClass('pulse').show()
        if(index === 0) {
            obj.url = 'saveDw';
            obj.type = 'content';
            // $('.temp_operation').stop().removeClass('pulse').hide(0);
            // $('.edit_li').stop().show().addClass('pulse');
        }
        else if(index === 2) {
           obj.url = 'saveArticle';
           obj.type = 'summary';
        //    $('.temp_operation').stop().removeClass('pulse').hide(0);
        //    $('.toggleitem').stop().show().addClass('pulse');
        }
        else  obj.url = null;
    })
    $('.publish-edit').on('click  ',()=>{
          let data = $('.editor-container').html();
          let title = $('.ql-editor').eq(0);
          if(title.text() === ''){
            infoContainer('你还没有输入哦' , false);
            return;
          }
          publishBtn(obj , data, window.loadingUI)
    })
}

function cancleTextEdit(){
  $('.article_list').on('click  ','.ql-editor',function(){
    $(this).attr('contenteditable','false');
  });
}

function escapeData(data){
  return data.replace(/<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL">/g,'').replace(/<input\stype="text"\sdata-formula="e=mc\^2"\sdata-link="quilljs\.com"\sdata-video="Embed\sURL"\splaceholder="Embed\sURL">/g,'');
}

function setArticleType(){
  const inputs =   $('.article-type input')
  let articleType = 'HTML'
    for(let index in inputs)
      if(inputs[index].checked)
        articleType = inputs[index].value
  return articleType
}

function publishBtn(obj, data, loadingUI){  //publish edit content
        if(obj.url === null) return;
        const d = new Date();
        if(obj.url === 'saveDw' ){
          var date = `${d.getFullYear()}-${(d.getMonth()+1)}-${d.getDate()}`;

        }
        else if(obj.url === 'saveArticle' ){
          let months = d.getMonth() + 1
          let day = d.getDate()
          let date = (months < 10 ? `0${months}` : months) + '-' + (day < 10 ? `0${day}` : day)
          const year = ''+d.getFullYear()
          const h = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
          const m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
          const s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
          const time = `${h}:${m}:${s}`
          loadingUI('start')
          fetch('/'+obj.url, {
              method: 'POST',
              headers: {
                  'content-type': 'application/json',
                  'accept': 'application/json'
              },
              body: JSON.stringify({ time, date, year, summary: escapeData(data), type: setArticleType() })
          }).then(res => {
              if(res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
          }).then(result => {
              loadingUI('end');
            (result && result.success) ?
                  infoContainer('发布成功', true, () => window.location.reload() )
            :
                  infoContainer(result && result.errorMsg || '网络繁忙' + result)
          })
        }
        else return;
}

function shortArticleLimited() {  //short article limited
    const total = 180;
    $('.edit_textarea').on('change', function (e) {
        var e = e || window.event;
        var current = total - $(this).val().length;
        $(this).next().find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    });
    $('.edit_textarea').on('keydown', function (e) {
        var e = e || window.event;
        var current = total - $(this).val().length;
        $(this).next().find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    });
    $('.edit_textarea').on('keyup', function (e) {
        var e = e || window.event;
        var current = total - $(this).val().length;
        $(this).next().find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    })
}

function articleLimited() {  // article limited
    var total = 5000;
    $('#article_textarea').on('change', function (e) {
        var e = e || window.event;
        var current = total - $(this).val().length;
        $(this).next().find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    });
    $('#article_textarea').on('keydown', function (e) {
        var e = e || window.event;
        var current = total - $(this).val().length;
        $(this).next().find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    });
    $('#article_textarea').on('keyup', function (e) {
        var e = e || window.event;
        var current = total - $(this).val().length;
        $(this).next().find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    })
}

function clearErrorInfo() {  //hide error info
    $('.edit_ul li textarea').focus(() => {
        $('.err_info').hide();
    });
    $('.edit_ul li input[type=text]').focus(() => {
        $('.err_info').hide();
    });
    $('.admin_menu li a').on('click  ', () => {
        $('.err_info').hide();
    });
    $('.menu_toggle').on('click  ', () => {
        $('.err_info').hide();
    })
}

function hideNewError(){  //hide error info when insert new value
    $('.new_content').focus(()=>{
        $('.new_error_info').hide();
    });
    $('.new_title').focus(()=>{
        $('.new_error_info').hide();
    });
}

function deleteDynamic() {  //delete dynamic
    $('.all_short_article').on('click  ', 'a.delete_dynamic', function () {
        const self = $(this).closest('li');
        const _id = this.getAttribute('_id')
        fetch('/deleteDynamic', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ _id })
        }).then(res => { return res.json() })
        .then(result => {
            if(result && result.success){
                self.remove()
                infoContainer('删除成功' , true)
                const html = template('dynamic_tpl', {dynamics: result.data.reverse()})
                $('.dynamic').find('li').remove()
                $('.dynamic').append($(html)) 
            }
            else 
                infoContainer(result && result.errorMsg || '网络繁忙' , false)
        })
    })
}

function deleteArticle() {  //delete article
    $('.o_all_article').on('click  ', 'a.delete_article', function () {
        var info = $('.delete_info');
        info.hide().removeClass('slideInDown');
        let self = $(this).closest('li');
        const id = self[0].attributes[0].value
        loadingUI('start')
        fetch('/deleteArticle', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({_id: id})
        }).then(res => {
            if( res.status >= 200 && res.status < 300 )
                return res.json()
            return res
        }).then(data => {
            loadingUI('end')
            if(data && data.success){
                self.remove()
                infoContainer('删除成功', true, () => 
                    window.location.reload())
            }else infoContainer(data && data.errorMsg || '网络出错' + data.status)
        })
    })
}

function clearInfo() {  //remove info about result of leave message
    $('.msg').on('click  ', () => {
        $('.insert_dialog').hide();
    })
}

function loadingUI(type){
    if(type === 'start'){
        $('.loading-circle').addClass('runCircle')
        $('.screen').addClass('blurBg')
        $('.loadingUI').show()
    }else if(type === 'end'){
        setTimeout(()=>{
            $('.loading-circle').removeClass('runCircle')
            $('.screen').removeClass('blurBg')
            $('.loadingUI').hide()
        },1500)
    }
}

function leaveMsg() {  //message board
    $('.leave_msg').on('click  ', () => {
        let msg = escapeMessage($('.msg').val())
        let name = window.sessionStorage && sessionStorage.getItem('user')
        let date = new Date()
        let minute = date.getMinutes()
        minute < 10 ? minute+1  : '0'+minute
        let hour = date.getHours()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let d = year + '-' + month + '-' + day + '-----'+hour+' : '+minute
        if (msg === '') {
            infoContainer('输入不完整 ~'  , false)
            $('.msg').removeClass('shake')
            setTimeout(() => {
                $('.msg').addClass('shake')
            }, 0)
            return
        }
        if(!name) {
            infoContainer('你还没有登陆' , false)
            return
        }
        else {
            loadingUI('start')
            // $('.load').show()
            setTimeout(()=>{
                $('.loadimg').css('transform','rotate(360deg)')
            },100)
            fetch('/leaveMessage', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify( { date: d, content: msg, name:Base64.decode(name) } )
            }).then(res => {
                if(res.status >= 200 && res.status <300 )
                    return res.json()
                return res.status
            }).then(result => {
                loadingUI('end')
                if(result && result.success){
                    randomUserAvatar()
                    reRenderMsg(result.data) 
                }
                else 
                    infoContainer(result && result.errorMsg || '网络繁忙' + result)
                    $('.load').hide()
            })
        }
    })
}

function reRenderMsg(res){
    $('.loadimg').css('transform', 'rotate(0deg)');
    $('.load').hide();
    infoContainer('成功啦', true);
    $('.msg').val('');
    $('.msg_word_count span').text('280');
    $('.message_list li').remove();
    const html = template('message-tpl', { messages: res instanceof Array  && res.reverse() });
    $(html).appendTo($('.message_list'));
    $('.temp_ul li:first-of-type').html(res.length + '评论');
    $('.temp_ul li:last-of-type').html(res.length + '人参与');
    allUserAvatar()                 
}

function wordLimited() {
    $('.msg').on('change', function (e) {
        var e = e || window.event;
        let current = 280 - $(this).val().length;
        $('.msg_word_count').find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    })
    $('.msg').on('keydown', function (e) {
        var e = e || window.event;
        let current = 280 - $(this).val().length;
        $('.msg_word_count').find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    })
    $('.msg').on('keyup', function (e) {
        var e = e || window.event;
        let current = 280 - $(this).val().length;
        $('.msg_word_count').find('span').html(current);
        if (current <= 0 && e.keyCode != 8) {
            e.preventDefault();
        }
    })
}

function slidePhoto() { //slide photo
    $('.glitch_effect').glitch({
        zIndexDefault: 0,
        effect1TimeMin: 600,
        effect1TimeMax: 900,
        effect2TimeMin: 10,
        effect2TimeMax: 115,
    });
}

function upvoteDynamic() {
    $('.dynamic').on('click  ', '.awesome_dynamic', function () {
        const self = this
        const _id = self.getAttribute('_id')
        if (self.isUpvote) {
            return;
        } else {
            const upvote = Number($(this).next().html()) + 1
            fetch('/upvoteDynamic', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({_id, upvote})
            }).then(res => { return res.json() })
            .then(data => {
                if(data && data.success){
                    $(self).next().html(upvote)
                    self.isUpvote = true   
                    $(self).animate({
                        fontSize: 20,
                        width: 35
                    }, 300, () => {
                        $(this).animate({
                            fontSize: 16,
                            width: 25
                        }, 300).css({'color': '#f39e66', 'cursor': 'not-allowed'});
                    })               
                }else {
                    self.isUpvote = false
                    infoContainer('网络繁忙', false)
                }

            })
        }
    })
}

function bugReporter(){
    $('.bug-reporter').click((ev)=>{
        ev.stopPropagation()
       window.open('http://wpa.qq.com/msgrd?v=3&uin=3532371088&site=qq&menu=yes')
    })
}

function randomBg(){
    var pic = Math.floor(Math.random()*6)+1;
    // alert(pic);
    $('body').css({
            background:'url("./resouce/bg/'+pic+'.jpg") no-repeat',
            backgroundSize:'100% 100%'
        })
}

function changeTheme(){
	$('.change_theme').on('click  ',function(){
		$(this).toggleClass('themeapi');
		$('.theme_containter').toggleClass('theme_show');
        // console.log(111,$('.theme_containter'))
	});
	$('.theme_containter ul li').on('click  ',function(){
		var index = $(this).index()+1;
		$('body').css({
			background:'url("./resouce/bg/'+index+'.jpg") no-repeat',
			backgroundSize:'100% 100%'
		})
	})
}

function hideAllClickWindow(){   //hide sth when click anywhere
    const videos = document.getElementsByTagName('video')
    // console.log(videos)
	$('.search_result_container').on('click  ',e=>{
		var e = e || window.event;
		e.stopPropagation();
        $('.context-menu').hide()
	})
    // $('.dynamic-msg-container').click(ev=>{
    //     ev.stopPropagation();
    // })
	$('body').on('click  ',e=>{
        for(let i in videos)
            videos[i].paused = false
		var e = e || window.event;
        $('.dynamic-msg-container').hasClass('showMsg') && $('.dynamic-msg-container').removeClass('showMsg')

        $('.full_summary').text('').hide();
        // $('.error_search').hide()
		var $article = $('.article_list .article');
		$article.removeClass('showArticle').find('.article_tittle').removeClass('article_title_toggle');
        $article.find('.article_summary').removeClass('toggleP');
        // $article.find('.article_date').css({
        // 	left:'-16%'
        // });
        $article.find('.article_close').removeClass('showClose');
        // $('main').removeClass('articleMain')
		$('.right_article_list').show(500);
		$('.search_result_container').removeClass('show_search_container bounceInDown');
	})
}

function search(){  //search global
	$('.search_input').on('click  ',e=>{
        $('.get_search li').remove();
		var e = e || window.event;
        $('.search_result_container').addClass('show_search_container bounceInDown');
		e.stopPropagation();
        $('.context-menu').hide()
	})
	$('.search_input').on('keyup',ev=>{
		var e = ev || window.event;
		let word = $('.search_input').val();
        // $('.error_search').hide();
        $('.full_summary').text('')
        if(word !=='' && e.keyCode === 13){
		  search(word);
          return;
        }
	});
	function search(data){
        $('.get_search li').remove()
        fetch('/search', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ data })
        }).then(res => {
            if(res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            if(result && result.success && result.result.length !== 0){
                const html = template('search_result_tpl', { searchs: result.result })
                $(html).appendTo($('.get_search'))
            }else 
                infoContainer(result && result.errorMsg || '网络繁忙' + result || '找不到关于"'+data+'"的信息', false);
        })
	}
}

function fullSearch(){
    $('.search_result_container').on('mouseenter','li',function(){
      $('.article-type-text').removeClass('selectType')
        let t = $(this).find('.search_summary').offset().top ?
        $(this).find('.search_summary').offset().top : 86
        let h = $(this).find('.search_summary').height() || 40
        const _id = this.getAttribute('_id')
        const type = this.getAttribute('type')
        $('.full_summary').show()
        $('.full_summary')[0].setAttribute('_id' , _id)
        $('.full_summary').html($(this).find('.search_summary').text()).stop().animate({
            top:t-h-40
         },300)
         type === '动态' ? $('.full_summary').removeClass('artilce_type_summary').addClass('dynamic_type_summary') :
          $('.full_summary').removeClass('dynamic_type_summary').addClass('artilce_type_summary')
    })
}

function turnToSummary(){
    const target = document.querySelector('.full_summary')
    target.onclick = function(ev){
        var ev = ev || window.event
        ev.stopPropagation()
        const _id = this.getAttribute('_id')
        if(this.getAttribute('type') === '动态') return
        triggerArticle(_id)
    }
    // target = null
}

function triggerArticle(_id){
    $('.triggerArticle').trigger('click')
    const articlesList = document.getElementsByClassName('articles_list')
    $('.articles_list').hide()
    for(let i in articlesList)
        if(articlesList[i].getAttribute('_id') === _id){
            $(articlesList[i]).show().trigger('click')
            return
        }
}

function introduce(i,word){ //introduce
	var arr = word.split('');
	var len = arr.length;
	var introArea = $('.introduce');
	var w = '';
	introArea.focus();
	if(introArea.val() ==='') {
		lifeStep();
		var intro = setInterval(()=>{
		w+=arr[i];
		introArea.val(w);
		i++;
		if( i >= len ) {
			clearInterval(intro);
			introArea.blur();
			introArea[0].disabled = true;
		}
		},100);
	}
}

function lifeStep(){
	var c = $('.life .circle');
	var l = $('.life .line');
	var w = $('.life .step');

	c.eq(0).animate({
		opacity:1
	},1000,()=>{
		l.eq(0).animate({
			width:'100%'
		},1000);
		w.eq(0).animate({
			top:'40%',
			opacity:1
		},1000,()=>{
			c.eq(1).animate({
				opacity:1
			},1000,()=>{
				l.eq(1).animate({width:'100%'},1000);
				w.eq(1).animate({top:'40%',opacity:1},1000,()=>{
					c.eq(2).animate({opacity:1},1000,()=>{
						l.eq(2).animate({width:'100%'},1000);
						w.eq(2).animate({top:'40%',opacity:1},1000,()=>{
							c.eq(3).animate({opacity:1},1000,()=>{
								l.eq(3).animate({width:'100%'},1000);
								w.eq(3).animate({top:'40%',opacity:1},1000)
							})
						})
					})
				})
			})
		})
	})
}

function wechat(){
    $('.wechat').on('click  ',function(){
        $('.wechat_img').toggleClass('wechat_show');
        $(this).toggleClass('themeapi');
    })
}

function sina(){
    $('.sina_api').on('click  ',function(){
        $('.sina').toggleClass('sina_show');
        $(this).toggleClass('themeapi');
    })
}

function dynamicMsg(){   //leave a msg on dynamic

    $('.dynamic').on('click  ','.dynamic-msg-icon',function(ev){
        ev.stopPropagation();
        $('.context-menu').hide()
        $(this).parent().next().toggleClass('showMsg');
    })
    $('.dynamic').click(ev=>{
        ev.stopPropagation();
        $('.context-menu').hide()
    })
    $('.dynamic').on('click  ','.leave-dynamic-mg',function(ev){
        var container = $(this).closest('.dynamic-msg-container');
        ev.stopPropagation();
        $('.context-menu').hide()
        let d = new Date();
        let This = this;
        let year = d.getFullYear();
        let index = $(this).index('.leave-dynamic-mg');
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let count = $(This).parent().parent().prev().find('span');
        let currentDay = year + "-" + month + '-' + day + '--'+hour + ':'+minute;
        let word = $(this).prev().val();
        let _id = $(this).closest('li')[0].getAttribute('_id');
        let msg = {context : word,date : currentDay};
        const name = sessionStorage && sessionStorage.getItem('user')
        // alert(_id)
        if(word === '' || word.trim() === '') {
            infoContainer('评论不能为空' , false)
            return 
        }
        if(word.length > 100){
            infoContainer('字数不能超过100个字符', false)
            return
        }
        if(!name){
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
            if(result && result.success){
                 $(This).prev().val('');
                 count.text(parseInt(count.text()) +1 )
                 const html = template('dynamic_tpl',{dynamics: result.data.reverse()});
                 $('.dynamic').find('li').remove();
                 $(html).appendTo($('.dynamic'));
                 $('.dynamic_item .dynamic-msg i').eq(index).trigger('click');                
            }else 
                infoContainer(result && result.errorMsg || '网络繁忙', false)
        })
    })
}

function articleMsgBullet(){
    let spans = $('.article-msg-board span');
    for(let i = 0;i<spans.length; i++){
        setTimeout(()=>{
            animationBullet(spans.eq(i));
        },i*1000)
    }
}

function animationBullet(el){
    let t = Math.floor(Math.random()*20000+12000);
    let top = el.parent().height();
    let w = window.innerWidth / 4;

    let elW = 130; //should fix
    let left = Math.floor(Math.random()*w/2 + 100)
    el.css('left',left+'px');
    function move(){
        el.animate({
             bottom : top,
        },t,()=>{
            el.animate({bottom : 0},0,move)
        });
    }
    move();

    // let currentL = parseInt(el.css('left'));
    // let timer = setInterval(()=>{
    //     currentL++;
    //     el.css('left', currentL+'px');
    //     if(currentL >= w - elW) {
    //         currentL--;
    //     }
    // },100)

}

function randomTheme(){
    var index = Math.floor(Math.random()*5+1);
    $('body').css({
        background : `url("./../resouce/bg/${index}.jpg") no-repeat`,
        backgroundSize : 'cover'
    })
}

function textEdit(){  //config text-edit-plugin
  var quill = new Quill('#editor-container', {
      modules: {
        formula: true,
        syntax: true,
        toolbar: '#toolbar-container'
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    });
}

function articleDefault(){
  var articles = $('article_list li');
}
window.onload = function () {
  articleDefault();
}

function getCustomer(){
  return new Promise((resolve,reject)=>{
    // $.get('/get-customer', res => {
    //     if(res && res.success){
    //         $('.customer-word span').text(res.data.number);
    //         var number = res.number + 1;
    //         resolve(number)
    //     }else reject(res.errorMsg || '网络繁忙')
    // });
    fetch('/get-customer', {
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }).then(res => {
        if(res.status >= 200 && res.status < 300)
            return res.json()
        return res
    }).then(data => {
        if(data && data.success){
            document.getElementById('customer_number').innerText = '' + data.data.number
            resolve(data.data.number + 1)
        } else reject(data && data.errorMsg || '无法获取访问量' + data.status || '网络繁忙，无法获取访问量')
    })
  })
}

function customer(){
  getCustomer().then(number => {
    fetch('/add-customer', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application.json'
        },
        body: JSON.stringify({number})
    })
  }).catch(err => infoContainer(err, false))
}

function checkDevice(){
  var wd = window.innerWidth;
  if( wd < 750 ){
    alert('您正在使用移动端预览，移动端仅供预览，完整交互在pc端')
    let temp = $('.loading .loading_top').height() / 2;
    checkLoadingFinished(temp , 290)
  }
}

function callAllArticle(){
  return new Promise((resolve,reject)=>{
    $.get('/allArticle',res=>{
      res ? resolve(res) : reject([])
    })
  })
}

// async function getAllArticleToStorage(){
//   const allArtilce = await callAllArticle()
//   // sessionStorage.setItem('article' , JSON.stringify(allArtilce)
// }

function selectArticleType(){
    const typeEffects = $('.article-type-text')
  typeEffects.on('click',function(){
    typeEffects.removeClass('selectType flip')
    $(this).addClass('selectType').addClass('flip')
    let type = $(this).text()
    let articles = document.getElementsByClassName('articles')
    // let allArticles = Array.prototype.slice.call(articles)
    let allArticles = Array.from(articles)
    // console.log(allArticles)
    reducerArticle(type , allArticles)
  })
}

function reducerArticle(type , arr){
  if(type === '全部'){
      $(arr).hide().show().addClass('bounceInUp')
      return
  }
  $(arr).hide().removeClass('bounceInUp')
  for(let item of arr)
    item.getAttribute('type') === type ? $(item).addClass('bounceInUp').show() : $(item).hide()
}

function contextMenu(){
    const menu = $('.context-menu')
    randomBgColor()
    window.oncontextmenu = (ev) =>{
        ev.preventDefault()
        const l = ev.clientX
        const t = ev.clientY
        menu.css({
            left : l,
            top : t
        })
        menu.hide().removeClass('jello')
        setTimeout(()=>{
            menu.show().addClass('jello')
        },20)

    }
    $('.context-menu ul li').on('click',ev=>{
        ev.stopPropagation()
    })
    window.onclick = () => {
        menu.hide()
    }
}

function randomUserAvatar(){
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
    for(let item of avatars)
        item.style.background = color[Math.floor(Math.random()*len)]
}

function randomBgColor(){
    const defaultH = $('.loading_top').height()
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
    $('.random-bg').on('click',()=>{
        const c1 = Math.floor(Math.random()*len)
        const c2 = Math.floor(Math.random()*len)
        const c3 = Math.floor(Math.random()*len)
        $('body').css('background',`linear-gradient(to bottom, ${color[c1]}, ${color[c2]}, ${color[c3]})`)
    })
    $('.menu-reload').click(()=>{window.location.reload()})
    $('.close-blog').click(()=>{
        $('.tempexit').hide()
        $('.loading').show()
      $('.loading_top').animate({
            height: 0
        }, 0).animate({
            height: defaultH
        }, 700)
        $('.loading_down').animate({
            height: 0
        }, 0).animate({
            height: defaultH
        }, 700,()=>{
            setTimeout(()=>{window.location.href="https://www.baidu.com/";},500)
        })
    })
}
function fullScreen() {
  var element= document.documentElement; 
  if (window.ActiveXObject)
  {
    var WsShell = new ActiveXObject('WScript.Shell')
    WsShell.SendKeys('{F11}');
  }
  else if(element.requestFullScreen) {
    element.requestFullScreen();
  }
  else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
  else if(element.webkitRequestFullScreen ) {
    element.webkitRequestFullScreen();
  }
  else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
}
function editEffect() {
  $('.edit_textarea').focus(_=>{
    $('.effect_text').css('width','40px')
  })
  $('.edit_textarea').blur(_=>{
    $('.effect_text').css('width','0')
  })
}

// function throttle(func, wait, mustRun) {
//     let timeout
//     let startTime = new Date()
//     return function() {
//         const context = this
//         const args = arguments
//         let  curTime = new Date()
//         clearTimeout(timeout)
//         if(curTime - startTime >= mustRun){
//             func.apply(context,args)
//             startTime = curTime
//         }else{
//             timeout = setTimeout(func, wait)
//         }
//     }
// }

// function allScroll(){
//   const dynamicContainer = document.getElementById('dynamic_container')
//   const dynamicScroll = document.getElementById('fake_scroll_dynamic')
//   fakeScroll(dynamicContainer , dynamicScroll)
// }

// function fakeScroll(base , target){
//   const targetHeight = target.offsetHeight
//   const scale = base.offsetHeight*target.parentNode.offsetHeight / targetHeight
//   base.addEventListener('scroll',throttle(function(){
//     if(this.scrollTop){
//       target.style.top = (this.scrollTop/2.4)  + 'px'
//     }
//   },0,0),false)
// }

function toggleRepeatList(){
    $('.message_box').on('click','.togger_repeat_list',function(){
        let ul = $(this).next()
        let _this = this
        ul.toggle(300);
        (/展开/.test($(_this).text())) ? $(_this).text('收起') : $(_this).text('展开')
    })
}

function messageBoxHover(){
    $('.message_box').hover(()=>{
        $('.message_box').stop().animate({
            top:'30px',
            height:'100%'
        })
        $('.message_board_input').hide()
        $('.temp_ul').hide()
    },()=>{
     $('.message_box').stop().animate({
          top:'255px',
            height:'65%'
        },_=>{$('.message_board_input').show();$('.temp_ul').show()})
    })
}

function allUserAvatar(){
    const users = $('.user_name_msg')
    const names = []
    for(let item of users)
        names.push(item.innerText)
    const noRepeatName = [...new Set(names)] 
    fetch('/all_user_avatar', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({name : noRepeatName })
    }).then(res => {
        if(res.status >= 200 && res.status < 300)
            return res.json()
        return res
    }).then(data => {
        if(data && data.success)
            for (let item of users)
                for (let item1 of data.data)
                    $(item).text() === item1.name && ($(item).parent().prev().find('img')[0].src = item1.avatar )        
        else 
            infoContainer(data && data.errorMsg || '网络出错' + data.status, false)   
    })
}

function openSouceContainer(){
    if ($('.sourceContainer').css('display') === 'block')
        return
    $('.initDisplay').hide()
    $('.sourceContainer').show(500)
    randomAbountMe()
}

function entryMoreOperation(){
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
    const mC = $('.more_operation_container')
    $('.more_operation_entry').on('click' , function(){
        if (this.innerText === '更多'){
            menu.start()
            this.innerText = 'X'
            $('.body_overlay').animate({
                opacity : 1
            },_=>$('.body_overlay').css('z-index' , '5'))
            // $('.more_operation_container').css('background-image' , getBodyBg())
            mC.css('width' , '1%').stop().animate({
                height : '100%'
            },300,_=>mC.animate({width:'100%'}))
        }else{
            // menu.end()
            menu.endInterval()
            this.innerText = '更多'
            $('.body_overlay').animate({
                opacity : 0
            },_=>$('.body_overlay').css('z-index' , '0'))
            mC.stop().animate({
                width: '1%'
            }, 300,_ => {
                mC.animate({ height: '0%' },_=>mC.css('width' , '0'))
            })
            $('.another_entry').hasClass('another_toggel') && $('.another_entry').trigger('click') 
            $('.about_me_entry').hasClass('entry_about_me_toggle') && $('.about_me_entry').trigger('click') 
        }
    })
}

function randomAbountMe(){
    const box = $('.about_me_container .box')
    box.hide()
    for(let item of box){
        const x = (Math.random() + 1 )*300
        const duration = (Math.random() * 3)
        const op = parseInt(x) % 2 === 0 ? -1 : 1
        const y = (Math.random() + 1) * 300
        $(item).css({
            transition : `all ${duration}s`,
            opacity : '0',
            transform: `translateX(${op * x}px) translateY(${op*y}px)`
        })
    }
}

function startAnotherFace(bool){
    const boxs = $('.right_container .box_')
    if(bool) {
        $('.right_container').show()
        for(let item of boxs){
            const duration = (Math.random() * 7)
            $(item).css('animation-duration',duration+'s')
        }
        boxs.addClass('bounceIn').show() 
    }else{
    boxs.removeClass('bounceIn').hide()
    $('.right_container').hide()
    }
}

function initMore() {
    const menu = new Mobile({
        target : document.getElementsByClassName('left_container')[0],
        menu : [
        {
            name : '关于主页'
        },
        {
            name : 'menu-test'
        }
        ],
        bg : './resouce/images/menu.jpg',
    })
    menu.start()
}

function entryAboutMe(){
    $('.initDisplay').hide()
    $('.about_me_container').show()
    const box = $('.about_me_container .box')
    box.show().css({
        'transform' : 'translate(0) scale(1.009)',
        opacity : '1'
    })
}

function getBodyBg(){
    return $('body').css('background-image')
}

function initOverLay(){
    const p = $('.more_operation_container')
    for(let i =0;i<200;i++){
        const el = document.createElement('div')
        el.className = 'temp_overLay'
        $(el).appendTo(p)
    }
}

function concoleEffect(){
    const consoles = $('.consoel_container .temp_six')
    const defaultV = {
        l : $('.about_me_entry').css('left'),
        t : $('.about_me_entry').css('top'),
    }
    consoles.on('click',function(){   
        const l = $(this).css('left')
        const t =$(this).css('top')
        const marginL = $(this).css('margin-left')
        for(let item of consoles)
            if (($(item).css('left') === '200px') && ($(item).css('top') === '136px') && ($(item).css('margin-left') === '-50px') )
                $(item).css({
                    left : l,
                    top : t,
                    marginLeft: marginL
                })
        $(this).css({
            left: '50%',
            top: defaultV.t,
            marginLeft:'-50px'
        })
        consoles.addClass('concole_toggle')
        $(this).removeClass('concole_toggle')
    })
}

function mobileEntry(){
    $('.entry_mibile').click(_ => $('.mobile_entry').toggleClass('showSlideBar')  )
}

function loginApi(){
    $('.login-i').click(() => {
        const type = $('.registerbtn').css('display')
        type === 'block' ?
        $('.registerbtn').trigger('click')
        :
        $('.current-api').trigger('click')
    })
}

function share(){
    const title = '个人主页'
    const pic = "http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8tzjwvaj211l0hmq39.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8u9irlkj211x0hndnw.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8u5cwpsj211y0hltn0.jpg || http://wx4.sinaimg.cn/mw690/a99a6e98ly1fox8udqz9yj211x0hntde.jpg"
    $('.shareToSina').click(_ =>{ 
        (function (s, d, e) { try { } catch (e) { } var f = 'http://v.t.sina.com.cn/share/share.php?', u = d.location.href, p = ['url=', e(u), '&title=', e(title), '&appkey=2924220432', '&pic=', e(pic)].join(''); function a() { if (!window.open([f, p].join(''), 'mb', ['toolbar=0,status=0,resizable=1,width=620,height=450,left=', (s.width - 620) / 2, ',top=', (s.height - 450) / 2].join(''))) u.href = [f, p].join(''); }; if (/Firefox/.test(navigator.userAgent)) { setTimeout(a, 0) } else { a() } })(screen, document, encodeURIComponent);
    })
    $("#zone").click(function () {
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
        // window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=test")
    })
}

function innerRepeat(){
    $('.message_box').on('click', '.innerRepeatAPI', function () {
        const _id = this.getAttribute('_parent_id')
        const toRepeat = this.getAttribute('_to_repeat')
        const name = window.sessionStorage && sessionStorage.getItem('user') || undefined
        if(!name){
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
                    $('.repeat_word').val('')
                    $('.cancel_repeat').trigger('click')
                } else
                infoContainer(result && result.errorMsg || '网络繁忙' + result)
        })
    })
    })
    $('.message_box').on('click', '.innerDeleteMsg', function () {
        const _parent_id = this.getAttribute('_parent_id')
        const _id = this.getAttribute('_id')
        const name = sessionStorage.getItem('user') || undefined
        if(!sessionStorage.getItem('user')){
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
            if(res.status >= 200 && res.status < 300)
                return res.json()
            return res.status
        }).then(result => {
            loadingUI('end')
            if(result && result.success){
                infoContainer('删除成功', true)
                $(this).closest('li').remove()
            }
            else
                infoContainer(result && result.errorMsg || '网络繁忙' + result)
        })
    })
}

function navSelect(){
    const navs = document.querySelectorAll('.nav a')
    const select = document.getElementById('navSelect')

    for(let i = 0; i < navs.length; i++){
        navs[i].addEventListener('click', () => {
            let w = document.getElementById('navSelect').offsetWidth
            select.style.transform = `translateX(${i * w}px)`
        })
            
    }
}

$(function () {
    navSelect()
    innerRepeat()
    share()
    loginApi()
    hashRouter()
    mobileEntry()
    // concoleEffect()
    // initMore()
    // initOverLay()
    // entryAboutMe()
    randomBg()
    randomAbountMe()
    entryMoreOperation()
    allUserAvatar()
    // messageBoxHover()
    toggleRepeatList()
    randomUserAvatar()
    editEffect()
    turnToSummary()
    // getAvatar()
    bugReporter()
    contextMenu()
    selectArticleType();
    checkDevice();
    customer();
    // publishDynamic();
    cancleTextEdit();
    dynamicMsg();
    clearInfo();
    sina();
    wechat();
    fullSearch();
    hideAllClickWindow();
    changeTheme();
    search();
    //gallery();
    loginState();
    showArticle();
    loading();
    // asideTextHover();
    init();
    selectNav();
    face1LeftbaraShake();
    register();
    loginFn();
    exitLoginRegCancel();
    allUserList();
    allArticle();
    messageCount($('.message_list li').length);
    shortArticleLimited();
    articleLimited();
    // deleteDynamic();
    // deleteArticle();
    clearErrorInfo();
    leaveMsg();
    wordLimited();
    galleryApi();
    exitGallery();
    slidePhoto();
    upvoteDynamic();
    // editDynamic();
    // editArticle();
    hideNewError();
    test();
    randomArticleBg();
    mapToArticleList()
    closeTip()
});

function closeTip(){
    $('.closeTip').click(() => {
        $('.avatarTip').hide()
    })
}

function updateArticle(){
    $('.o_all_article').on('click','.update_article_icon',function(){
        const _id = this.attributes[0].value
        loadingUI('start')
        fetch('/queryArticleById', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({ _id })
        }).then(res => {
            if(res.status >= 200 && res.status < 300)
                return res.json()
            return res
        }).then(data => {
            loadingUI('end')
            if(data && data.success){
                const { summary, type } = data.data
                editArticle(summary, _id, type)
            }
            else 
                infoContainer(data && data.errorMsg || '网络出错 ' + data.status )
        })
    })
}
function editArticle(summary , _id , type){
    $('.admin_menu li:nth-of-type(3) a').trigger('click')
    $('.editor-container').html(summary)
    const spans = $('#artilce-type-label span')
    // console.log(spans)
    for(let item of spans){
        if(item.innerText === type ) {
            // console.log($(item).prev())
            $(item).prev()[0].checked = true
            break
        }
    }
    $('.publish-edit').off('click').on('click',()=>{
        const newSummary = $('.editor-container').html();
        if(newSummary === summary){
            infoContainer('内容未更改' , false)
            return
        }else
            updateArticleById(_id , newSummary)
    })
}

function updateArticleById(_id , summary){
    const type = setArticleType()
    loadingUI('start')
    fetch('/updateArticleById', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({ _id, summary, type })
    }).then( res => { return res.json() } )
    .then(result => {
        loadingUI('end');
        (result && result.success) ?
            infoContainer('更新成功', true, () => window.location.reload())
        :
            infoContainer(result && result.errorMsg || '网络繁忙')
    })
}

function reloadArticle(){
    $('.article_list').empty()
    $.get('allArticle',(res)=>{
        for(let index in res){
            const li = ` <li class="article" _id=${res[index]._id}>
                      <i class="article_close linkfont">&#xe629;</i>
                      <span class="article_date">${res[index].date}<p class="year">${res[index].year}</p></span>
                      <div class="article_summary">${res[index].summary}</div>
                  </li>`
            $('.article_list').prepend($(li))
            randomArticleBg();
        }
    })
}

function getDynamic(_id){
    return new Promise((resolve,reject)=>{
    $.post('/dynamicQueryById',{_id},(res)=>{
            res ? resolve(res) : reject([])
        })
    })
}

function dynamicResult(_id){
    getDynamic(_id).then(result=>{
         setText(result)
    })
}

function setText(obj){
    $('#dw_title').val(obj.title)
    $('.edit_textarea ').val(obj.content)
    $('span.count').html(''+180-obj.content.length)
    $('#publish_dw').off('click').on('click',()=>{
        const val = $('.edit_textarea ').val()
        const title = $('#dw_title').val()
        if(val === obj.content && title === obj.title) {
            infoContainer('内容为更改!!!' , false);
            return
        }else
            updateDynamicById(obj._id,val , title)
    })
}

function updateDynamicById(_id,content , title){
    $.post('/updateDynamic',{_id,content , title},(res)=>{
        res ? infoContainer('更新成功', true , ()=>{
            window.location.reload()
        }) : infoContainer('更新失败，请稍后重试' , false)
    })
}

function editDynamic(){
    $('.all_short_article').on('click','a.edit_item_dynamic',function(){
        const _id = this.getAttribute('_id')
        $('.admin_menu li:nth-of-type(1) a').trigger('click')
        dynamicResult(_id)
    })
}

function mapToArticleList(){
    const articles = $('.article_list li.article').slice()
    if(articles.length === 1) return
    let datas = []
    let temp = {}
    for(var key = 0,len = articles.length; key<len; key++){
        let title = articles.eq(key).find('h2').text()
        let date = articles.eq(key).find('span.article_date').text()
        let _id = articles[key].attributes._id.value
        temp = { date , title , _id}
        datas.push(temp)
    }
    mapToOperation(datas)
}

function mapToOperation(data){
    let html = template('article_operation_tpl',{data});
    $('.o_all_article').append($(html))
}

function randomArticleBg(){
	const bg=[{
			bgc:'#d9edf7',
            color:'#31708f',
		},{
			bgc:'#f2dede',
			color:'#a94442'
		},{
			bgc:'#fff3cc',
			color:'#ffc100'
		},{
			bgc:'#f6edfb',
			color:'#cd97eb'
		},{
			bgc:'#fcf8e3',
			color:'#8a6d3b',
		},{
            bgc:'rgb(225, 249, 220)',
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
	const lis = $('.article_list .article');
	for(var i = 0,len = lis.length;i<len;i++){
		var index = Math.floor(Math.random()* ( bg.length ));
		lis.eq(i).css('background',bg[index].bgc);
	}
}

function test(){
    $('.leave_message').on('click  ',()=>{
        $('header .nav li a').eq(2).trigger('click');
    })
}

function exitGallery() {  //exit gallery
    $('.exit_gallery').on('click  ', () => {
        $('.canvas_box').css({
            zIndex: -100,
            transform: 'scale(0)'
        });
    })
}

function galleryApi() {  //gallery
    $('.gallery_api').on('click  ', () => {
        // history.pushState('','','/gallery');
        $('.canvas_box').css({
            zIndex: 1000,
            transform: 'scale(1)'
        });
    })
}

//gallery
    (function(){
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
                    ) ;
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
                {img: './../resouce/gallery/1.jpg', x: -1000, y: 0, z: 1500, nx: 0, nz: 1},
                {img: './../resouce/gallery/2.jpg', x: 0, y: 0, z: 1500, nx: 0, nz: 1},
                {img: './../resouce/gallery/3.jpg', x: 1000, y: 0, z: 1500, nx: 0, nz: 1},
                // east
                {img: './../resouce/gallery/4.jpg', x: 1500, y: 0, z: 1000, nx: -1, nz: 0},
                {img: './../resouce/gallery/5.jpg', x: 1500, y: 0, z: 0, nx: -1, nz: 0},
                {img: './../resouce/gallery/6.jpg', x: 1500, y: 0, z: -1000, nx: -1, nz: 0},
                // south
                {img: './../resouce/gallery/7.jpg', x: 1000, y: 0, z: -1500, nx: 0, nz: -1},
                {img: './../resouce/gallery/8.jpg', x: 0, y: 0, z: -1500, nx: 0, nz: -1},
                {img: './../resouce/gallery/9.jpg', x: -1000, y: 0, z: -1500, nx: 0, nz: -1},
                // west
                {img: './../resouce/gallery/10.jpg', x: -1500, y: 0, z: -1000, nx: 1, nz: 0},
                {img: './../resouce/gallery/11.jpg', x: -1500, y: 0, z: 0, nx: 1, nz: 0},
                {img: './../resouce/gallery/12.jpg', x: -1500, y: 0, z: 1000, nx: 1, nz: 0}
            ],
            structure: [
                {
                    // wall
                    fill: {r: 255, g: 255, b: 255, light: 1},
                    x: [-1001, -490, -490, -1001],
                    z: [-500, -500, -500, -500],
                    y: [500, 500, -500, -500]
                }, {
                    // wall
                    fill: {r: 255, g: 255, b: 255, light: 1},
                    x: [-501, 2, 2, -500],
                    z: [-500, -500, -500, -500],
                    y: [500, 500, -500, -500]
                }, {
                    // wall
                    fill: {r: 255, g: 255, b: 255, light: 1},
                    x: [0, 502, 502, 0],
                    z: [-500, -500, -500, -500],
                    y: [500, 500, -500, -500]
                }, {
                    // wall
                    fill: {r: 255, g: 255, b: 255, light: 1},
                    x: [490, 1002, 1002, 490],
                    z: [-500, -500, -500, -500],
                    y: [500, 500, -500, -500]
                }, {
                    // shadow
                    fill: {r: 0, g: 0, b: 0, a: 0.2},
                    x: [-420, 420, 420, -420],
                    z: [-500, -500, -500, -500],
                    y: [150, 150, -320, -320]
                }, {
                    // shadow
                    fill: {r: 0, g: 0, b: 0, a: 0.2},
                    x: [-20, 20, 20, -20],
                    z: [-500, -500, -500, -500],
                    y: [250, 250, 150, 150]
                }, {
                    // shadow
                    fill: {r: 0, g: 0, b: 0, a: 0.2},
                    x: [-20, 20, 20, -20],
                    z: [-500, -500, -500, -500],
                    y: [-320, -320, -500, -500]
                }, {
                    // shadow
                    fill: {r: 0, g: 0, b: 0, a: 0.2},
                    x: [-20, 20, 10, -10],
                    z: [-500, -500, -100, -100],
                    y: [-500, -500, -500, -500]
                }, {
                    // base
                    fill: {r: 32, g: 32, b: 32},
                    x: [-50, 50, 50, -50],
                    z: [-150, -150, -50, -50],
                    y: [-500, -500, -500, -500]
                }, {
                    // support
                    fill: {r: 16, g: 16, b: 16},
                    x: [-10, 10, 10, -10],
                    z: [-100, -100, -100, -100],
                    y: [300, 300, -500, -500]
                }, {
                    // frame
                    fill: {r: 255, g: 255, b: 255},
                    x: [-320, -320, -320, -320],
                    z: [0, -20, -20, 0],
                    y: [-190, -190, 190, 190]
                }, {
                    // frame
                    fill: {r: 255, g: 255, b: 255},
                    x: [320, 320, 320, 320],
                    z: [0, -20, -20, 0],
                    y: [-190, -190, 190, 190]
                },
                {img: true},
                {
                    // ceilingLight
                    fill: {r: 255, g: 128, b: 0},
                    x: [-50, 50, 50, -50],
                    z: [450, 450, 550, 550],
                    y: [500, 500, 500, 500]
                }, {
                    // groundLight
                    fill: {r: 255, g: 128, b: 0},
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
