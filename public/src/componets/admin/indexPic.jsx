import React from 'react'
import './admin.css'
import { Toast } from 'antd-mobile'
import { API } from '../../request/request';
export const PicManage = () => {
    return(
        <div className="picContainer contentSlideFromRight">
            <div className='itemPic'>
                <img src="/resouce/images/glitch.jpg" alt="" className="imgContainer"/>
                <input type='file' className='handlePicInput' onChange={info => handleFile(info.nativeEvent.target.files[0], 'glitch')} />
            </div>
            <div className='itemPic'>
                <img src="/resouce/images/fly.jpg" alt="" className="imgContainer" />                
                <input type='file' className='handlePicInput' onChange={info => handleFile(info.nativeEvent.target.files[0], 'fly')} />
            </div>
        </div>
    )
}

function handleFile(file, type) {
    if (!/png+|jpeg+|gif+|GIF+|PNG+|JPEG/.test(file.type)) {
        Toast.fail('不支持的图片类型', 1)
        return
    }
    const fileReader = new FileReader()
    fileReader.readAsBinaryString(file)
    fileReader.onload = e => {
        API('/setPics', 'POST', { binary: e.target.result, type }).then(res => {
            if (res.success) {
                Toast.success('首页' + type + '图已更新', 1)
            } else Toast.fail(res)
        })
    }
}