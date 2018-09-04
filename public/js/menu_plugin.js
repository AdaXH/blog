// author: Ada
// web:https://www.adaxh.applinzi.com

class Mobile {
    constructor(options){
        this.items = (options && options.menu && options.menu.length !== 0) ? options.menu : [
            {
                name : 'menu1',
                callback : () => console.log('click menu1')
            },
            {
                name:'menu2',
                callback : () => console.log('click menu2')
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
    start(){
        if (document.getElementById('_container') && document.getElementById('_container').childNodes.length !== 0) //判断页面是否已经存在插件
            return
        this.init()
        setTimeout(() => { //初始化载入插件时，首次自动旋转
            this.container.style.transform =  'rotateX(45deg) rotateY(68deg) rotateZ(-45deg) scale(1.3)'
            setTimeout(() => {
                this.container.style.transform = 'rotateX(60deg) rotateZ(45deg) rotateY(0deg) scale(1.3)'
            }, 1000);
        }, 1000);
    }
    end(){ //清楚定时器，并移除插件
        if (this.interval)
            clearInterval(this.interval)
        if(this.searchInterval)
            clearInterval(this.searchInterval)
        document.getElementById('_container') && this.appendTarget.removeChild(document.getElementById('_container'))
    }
    init(){ //初始化插件
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
        this.renderTime() //刷新手机屏幕上的时间
    }
    addMouseEnter({ ul, ul2 ,ul3}) {  //hover菜单时，侧屏hover效果
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
    createClock(){ //时间容器
        const clock = document.createElement('div')
        setStyle(clock , clockStyle )
        const time = document.createElement('p')
        time.setAttribute('id' , 'menu_plugin_clock')
        setStyle(time , timeStyle)
        clock.appendChild(time)
        return clock
    }
    renderTime(){ //刷新时间
        const clock = document.getElementById('menu_plugin_clock')
        const search = document.getElementById('_search')
        this.searchInterval = setInterval(()=>{
            search.style.opacity = '0.2'
            setTimeout(()=>{
                search.style.opacity = '1'
            },1500)
        },3000)
        this.interval = setInterval(()=>{
            const d = new Date()
            const h = d.getHours() < 10 ?  '0' + d.getHours() : d.getHours()
            const m = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
            const s = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
            clock.innerText = '' + h + ' : ' + m + ' : ' + s
        },1000)
    }
    createSearch(){ //搜索
        const _this = this
        const search = document.createElement('div')
        search.setAttribute('id' , '_search')
        const input = document.createElement('input')
        setStyle(input , inputStyle)
        setStyle(search , searchStyle)
        input.placeholder = 'O'
        input.addEventListener('focus', function(){
            this.style.width = '140px'
            clearInterval(_this.searchInterval)
            this.style.paddingLeft = '20px'
            this.style.textAlign = 'left'
            this.placeholder = ''
        },false)
        input.addEventListener('blur', function(){
            this.style.width = '25px'
            this.style.paddingLeft = '0px'
            this.style.textAlign = 'center'
            this.placeholder = 'O'
            _this.searchInterval = setInterval( () => {
                search.style.opacity = '0.2'
                setTimeout(() => {
                    search.style.opacity = '1'
                }, 1500)
            },3000)
        },false)
        input.addEventListener('keydown', function(e){
            const ev = e || window.event
            if(ev.keyCode === 13)
               _this.searchCallback(this.value)
        },false)
        search.appendChild(input)
        return search
    }
    createContainer(nodes){ //创建手机的容器，以及子元素
        const container = document.createElement('div')
        setStyle(container, containerStyle)
        container.setAttribute('id' , '_container')
        for(let item of nodes){
            if (/Object/.test(Object.prototype.toString.call(item.call(this)))){
                    const obj = item.call(this)
                    for(let key in obj)
                        container.appendChild(obj[key])
                }else 
                    container.appendChild(item.call(this))
        }
        this.container = container
        this.appendTarget.style.perspective = '1400px'
        this.appendTarget.style.transformStyle = 'preserve-3d'
        this.appendTarget.appendChild(container)
    }
    createOperation(){ //手机旋转
        const leftO = document.createElement('p')
        leftO.innerText = ' <'
        setStyle(leftO, leftOstyle)
        leftO.addEventListener('click',()=>{
            this.container.style.transform = 'rotateX(60deg) rotateZ(45deg) rotateY(0deg) scale(1.3)'
        },false)
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
    createTopface(){ //手机的上面
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
    createRight(){ //手机的右面
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
    createOperationUl(){ //菜单
        const ul = document.createElement('ul')
        const ul2 = document.createElement('ul')
        const ul3 = document.createElement('ul')
        for(let item of this.items){
            const li = document.createElement('li')
            const li2 = document.createElement('li')
            const li3 = document.createElement('li')
            li.innerText = item.name
            if(item.callback)
                li.addEventListener('click', item.callback , false)
            ul.appendChild(setStyle(li , li1Style))
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
        this.ul =  { ul, ul2, ul3 }
    }
}

// function

function recover(els, keys){ //恢复el的初识样式
    for(let item of els)
        for(let key in keys)
            item.style[key] = keys[key]
}

function setStyle(el , styles) { //设置el样式
    if(!el || !styles ) return null
    if(!styles) return el
    for(let key in styles)
        el.style[key] = styles[key]
    return el
}
/* 对应的元素的样式  */

const leftOstyle = {
    position : 'absolute',
    left : '300px',
    bottom : '50px',
    cursor : 'pointer',
    fontSize : '20px',
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
    position : 'absolute',
    bottom: '50px',
    cursor: 'pointer',
    fontSize: '20px',
    'text-shadow': '0px 10px 10px rgba(6, 5, 5, 0.9)',
    left : '400px'    
}

const rightOstyle = {
    position: 'absolute',
    right: '200px',
    bottom: '50px',
    cursor : 'pointer',
    fontSize : '20px',
    'text-shadow': '0px 10px 10px rgba(6, 5, 5, 0.9)',
}

const clockStyle = {
    position : ' absolute',
    width: '200px',
    height : '100px',
    top : '20px'
}

const inputStyle = {
    outline : 'none',
    border : 'none',
    display : 'block',
    margin : '0px auto',
    cursor : 'pointer',
    textAlign : 'center',
    width : '25px',
    transition : 'all .3s',
    height : '25px',
    background : 'rgba(255,255,255,0.7)',
    borderRadius : '12.5px',
    color : '#666',
    fontSize : '12px'
}

const searchStyle = {
    willChange : 'opacity',
    width : '200px',
    height : '30px',
    position : 'absolute',
    top : '130px',
    opacity : '0.2',
    filter : 'alpha(opacity = 20)',
    transition : 'all 1s',
    'transform-style': 'preserve-3d',
    'transform': 'translateZ(1px)'
}

const timeStyle = {
    textAlign : 'center',
    lineHeight : '100px',
    fontSize : '20px',
    color : 'white'
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
    left : '0',
    cursor: 'pointer',
    minHeight : '70px',
    'transform-style': 'preserve-3d',
    'transform': 'translateZ(0.1px)'
} 

const li1Style = {
    transformStyle : 'preserve-3d',
    transform : 'translateX(-1px)',
    padding: '0 0 0 10px',
    height: '30px',
    'line-height': '30px',
    width: '200px',
    // 'border-bottom': '1px solid #eee',
    fontSize : '12px',
    transition : 'all ease .3s',
    'box-sizing':'border-box',
    cursor : 'pointer'
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
    borderRadius : '10px',
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
    borderRadius : '10px',
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
    borderRadius : '5px',
    'box-sizing': 'border-box',
    transformStyle : 'preserve-3d',
    transform : 'translateZ(0px)'
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
    background : 'transparent',
    transform : 'translateZ(-100px)'
}

const containerStyle = {
    'will-change': 'transform',
    width: '700px',
    height: '600px',
    position: 'absolute',
    top: '50%',
    zIndex : '5',
    left: '41%',
    margin: '-300px 0 0 -350px',
    perspective: '1400px',
    'transform-style': 'preserve-3d',
    'transform-origin': 'center',
    transition : 'all 1s'
}