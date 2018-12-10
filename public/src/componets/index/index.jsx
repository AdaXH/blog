import React from 'react'
import { SearchBar, Toast } from 'antd-mobile'
import './index.css'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { API } from '../../request/request'

export class UI extends React.Component {
    constructor() {
        super()
        this.state = {
            customer: 0                   
        }
    }
    componentDidMount() {
        loadBg('/resouce/images/glitch.jpg').then(src => {
            const glitch = new window.Glitch(src, document.getElementsByClassName('glitchContainer')[0], {
                width: '100%',
                height: '100%',
                title: 'Blog',
                info: `where'd you go ?`
            })
            glitch.init()
        })

        API('/get-customer').then(result => {
            if (result.success)
                this.setState({ customer: result.data.number }, handleFly)
        })
    }
    handleChange(e) {
        if (!e || e.trim() === '') {
            Toast.fail('请输入搜索关键词', 2)
            return
        }
        this.props.set('search', '搜索')
        this.props.history.push('/search/' + e)
    }
    resetView() {
        document.getElementsByClassName('view')[0].scrollIntoView(false)
    }
    render() {
        return (
            <div className="indeContainer contentSlideFromLeft">
                <div className="bannerCOntainer itemFromLeft" style={{ position: "absolute" }}>
                    <div className="glitOverflow" style={{ zIndex: '1', position: "absolute", width: "350px", left: "50%", transform: 'translateX(-50%)', overflow: 'hidden', height: '100%' }}>
                        <div className="glitchContainer">
                        </div>
                    </div>
                </div>
                <div className="IndexVIew">
                    <div className='saerchContainer flyItem'>
                        <SearchBar onSubmit={(e) => this.handleChange(e)} onBlur={() => this.resetView()} placeholder="搜索" maxLength={8} />
                    </div>
                    <div className="flyContainer">
                        <div className='flyItem'>Believe</div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'><p style={{ bottom: '16px' }}><Icon type="bar-chart" /> {this.state.customer}</p></div>
                        <div className='flyItem' style={{ textAlign: 'left' }}></div>
                        <div className='flyItem'></div>
                        <div className='flyItem'><p className="fly" style={{ right: '-25px', bottom: '15px' }}>Fly</p> </div>
                    </div>

                </div>
            </div>
        )
    }
}
export const Index = connect(state => {
    return {
        type: state.logo.src
    }
}, dispatch => {
    return {
        set(src, item) {
            dispatch({ type: 'LOGO', payload: { src, item } })
        }
    }
})(UI)

function loadBg(bg) {
    return new Promise(resolve => {
        const f = new Image()
        f.src = bg || '/resouce/images/fly.jpg'
        f.onload = e => {
            if (f.complete) {
                resolve(f.src)
                return
            }
        }
    })
}

function handleFly(type) {
    if (window.location.pathname !== '/index') return
    const els = document.getElementsByClassName('flyItem')
    loadBg().then(src => {
        for (let el of els) {
            const x = (Math.random() + 1) * 300
            const op = parseInt(x) % 2 === 0 ? -1 : 1
            const y = (Math.random() + 1) * 300
            el.style.backgroundImage = `url(${src})`
            el.style.transform = `translateX(${op * x}px) translateZ(${op * x}px) translateY(${op * y}px)`
        }
        setTimeout(() => {
            for (let el of els) {
                const duration = (Math.random() * 3)
                el.style.transform = `translate3d(0,0,0)`
                el.style.opacity = '1'
                el.style['transition-duration'] = duration + 's'
            }
        }, 250)
    })
}