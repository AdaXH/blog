
const src = [
    "./../resouce/bg/1.jpg",
    "./../resouce/bg/2.jpg",
    "./../resouce/bg/3.jpg",
    "./../resouce/bg/4.jpg",
    "./../resouce/bg/5.jpg",
    "./../resouce/bg/6.jpg",
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
    "./../resouce/images/wechat.png",
    "./../resouce/images/point.png",
    "./../resouce/images/time.png",
    "./../resouce/images/title.png",
    "./../resouce/images/type.png",
    "./../resouce/images/ly.jpg",
    "./../resouce/images/menu.jpg",
    "./../resouce/images/qzone.png",
]
let len = 0
const l = src.length
for(let item of src){
    const img = new Image()
    img.src = item
    img.onload = function(){
        len++
        check(len)
    }
    img.onerror = function(){
       len++
       check(len)
    }
}

function check(len){
    $('#percentText').text((parseFloat(len / l) * 100).toFixed(2))
    $('#percentProgress').css('width', len/l * 100 + '%')
    if(len === l)
        $('.srcLoading').remove()
}