// ,["transform-runtime",
// {
//   "helpers": false,
//   "polyfill": false,
//   "regenerator": true,
//   "moduleName": "babel-runtime"
// }
// ]],
// import Test from './module.js'
// Test()
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
                body: JSON.stringify({ name, pwd })
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
                body: JSON.stringify({ name: na, pwd: $('#password').val(), state })
            }).then(res => {
                if(res.status >= 200 && res.status < 300)
                    return res.json()
                return res
            }).then(data => {
                if(data && data.success){
                    sessionStorage.setItem('user', na)
                    $('.register span').css('color', '#6fb2df').html(na);
                    $('.user_name').html(na);
                    // $('.msg_name').val(na);
                    $('#login_anchor').html('register');
                    exitLoginRegFace();
                    repeatCon(na)
                    uploadAvatar(sessionStorage.getItem('user'))
                    getAvatar(na)
                    $('#avatar').show()
                    messageOperation(na)
                    if(na==='Ada'){
                        adminToggle();
                        publishDynamic();
                        publishItem()
                        deleteDynamic();
                        deleteArticle();
                        adminEdit()
                        updateArticle()
                        editDynamic()
                    }
                    else{
                        $('.menu_toggle').on('click',_=>{infoContainer('你还没有这个权限哦' , false)})
                    }
                    $('.new_login span').text('注销')
                    // $('.all_user').html('register');
                    loginOut();
                }else infoContainer(data && data.errorMsg || '网络错误' + data.status)
            })
            // $.post('./login', {
            //     state: Number(state),
            //     name: na,
            //     pwd: $('#password').val()
            // }, function (res) {
            //     if (res) {
            //         $('.register span').css('color', '#6fb2df').html(na);
            //         $('.user_name').html(na);
            //         $('.msg_name').val(na);
            //         $('#login_anchor').html('register');
            //         exitLoginRegFace();
            //         repeatCon(na)
            //         uploadAvatar(na)
            //         getAvatar(na)
            //         $('#avatar').show()
            //         messageOperation(na)
            //         if(na==='Ada')
            //         {
            //             adminToggle();
            //             publishDynamic();
            //             publishItem()
            //             deleteDynamic();
            //             deleteArticle();
            //             adminEdit()
            //             updateArticle()
            //             editDynamic()
            //             uploadAvatar(na);
            //         }
            //         else{
            //             $('.menu_toggle').on('click',_=>{infoContainer('你还没有这个权限哦' , false)})
            //         }
            //         $('.new_login span').text('注销')
            //         // $('.all_user').html('register');
            //         loginOut();
            //     } else {
            //         // $('.register span').css('color', 'red').html('name and password is not match');
            //         infoContainer('用户名与密码不匹配' , false)
            //     }
            // })
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
        $(this).siblings().find('.article_date').css({
        	left:'-16%'
        });
        $(this).siblings().find('.article_close').hide(500);
        $(this).find('.article_tittle').addClass('article_title_toggle');
        $(this).find('.article_summary').addClass('toggleP');
        showArticlePrepare($(this));
        closeArticle($(this), tempObj);
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
    param.find('.article_date').stop().animate({
        left: -250
    }, 300);
}

function closeArticleNew(){
  $('.article_list').on('click  ','.article_close',function(e){
    $(this).closest('.article').find('.article_tittle').removeClass('article_title_toggle');
      $(this).closest('.article').removeClass('showArticle').find('.article_summary').removeClass('toggleP');
      $('.right_article_list').show(500);
      var e = e || window.event;
      e.stopPropagation();
      $('.context-menu').hide()
      $(this).hide();
      $(this).closest('.article').find('.article_date').stop().animate({
          left: '-16%'
      }, 300);
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
        $(this).hide();
        temp.find('.article_date').stop().animate({
            left: '-16%'
        }, 300);
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
        history.pushState('','',url[index]);
        function foo(item) {
            // setTimeout(() => {
                item.css({
                    opacity: 1,
                    transform: 'translateX(0) translateZ(0)'
                })
            //     item.animate({
            //         opacity: 1,
            //         left: 0
            //     }, 300)
            // }, 300);
        }

        function fo(item) {
            item.css({
                opacity: 0,
                transform: 'translateX(-40px) translateZ(0)'
            })
            // item.animate({
            //     opacity: 0,
            //     left: -40
            // }, 300);
        }

		if(index === 3){
			let i = 0;
			$.get('./../static/introduce.json',(res)=>{
				if(res){
					introduce(i,res.introduce);
				}else{
					introduce(i,'null');
				}
			})
			//var word = `先介绍一下自己的情况，大四学生，赶上了校招季，运气好加上人品爆发，前前后后只面了不过十场就签了Dream Offer，面试经历不算多，不过在自我介绍这个环节还算有些心得，分享给大家，如有不对的地方请指正。经验有限，所以此答案只针对校招生or找实习的孩子们。走进办公室后，坐好，抬头面带微笑，快速与诸位面试官逐一眼神交流过后，开始自我介绍：“各位面试官早上好，首先非常感谢各位能给予我这次面试机会，我是……，来自……，专业是……。我今天应聘的职务是……。简单用三个词来概括一下我这个人，分别是A B C，（随后用几句话简单列举两三件小事来证明以上ABC三点）。我认为这三个特点对于……（要应聘的职务）来说至关重要，所以，我才有勇气来参加今天的面试，我相信我的实力可以胜任这个岗位。感谢各位的耐心倾听，谢谢。”`

		}
        if (index === 1) {
            $('.right_article_list').show(500);
            foo($('.article_summary'));
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
        // face.eq(index).siblings().animate({
        //     left: -wd,
        //     opacity: 0,
        //     zIndex: -1
        // }, 300);
        face.eq(index).css('z-index', '3');
        face.eq(index).css({
            opacity: 1,
            transform: 'translateX(0) translateZ(0)'
        })
        // face.eq(index).animate({
        //     left: 0,
        //     opacity: 1,
        // }, 300);
    });
    // nav = null
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
    if(sessionStorage && sessionStorage.getItem('user') !== 'Ada')
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
        //$('.slide_photo').css('transition','all 1.5s')
        if (index === -1) {
            // $('.slide_photo').css('transition','all none').css(
            //     'transform', 'translateX(-'+this.wd * (count - 2)+'px)'
            // );
            $('.slide_photo').css({
                left: -this.wd * (count - 2)
            })
            index = this.current = count - 3;
        }
        if (index === count) {
            // $('.slide_photo').css('transition','none').css(
            //     'transform','translateX(-' +this.wd +'px)'
            // );
            $('.slide_photo').css({
                left: -1 * this.wd
            })
            index = this.current = 2;
        }
        let leftValue = -index * this.wd;
        $('.slide_photo').animate({
            left: leftValue
        }, 1500)
        // $('.slide_photo').css('transform','translateX('+leftValue+'px)');
        //.css('transition','all 1.5s');
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
        $(this).find('i').stop().shake(400, 3, 1.2)
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
    if(name === undefined || name.length >= 30) return
    const img = document.getElementsByClassName('avatar_img')
    fetch('/get-avatar',{
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
            'accept' : 'application/json'
        },
        body : JSON.stringify({ name : name })
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
    $('.cancel_repeat').click(_=>{

        $('.repeat_over').hide().removeClass('bounceIn')
    })
        $('.message_list').off('click').on('click','a.repeat_msg',function(){
    if(name === undefined || name.length >=30) {
        infoContainer('你还没有登陆' , false)
     return   
    }
            const _id = this.getAttribute('_id')
            if(name){
                $('.repeat_over').addClass('bounceIn').show()
                sendRepeat(name , _id)
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
    else    return str.replace(/<\/?script>+|傻逼+|SB+|sB+|sb+|操+|你妈/g,'*');
}

function sendRepeat(name ,_id){
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
        if(word === '' || word.trim() === '' || word.length > 280) {
            infoContainer('回复内容不能为空内容过长' , false)
            return
        }else{
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
                        date: d 
                    }
                })
            }).then(res => {
                if(res.status >= 200 && res.status < 300)
                    return res.json()
                return res.status
            }).then(result => {
                if(result && result.success){
                    console.log(result)
                    reRenderMsg(result.data)
                    $('.cancel_repeat').trigger('click')
                }else 
                    infoContainer(result && result.errorMsg || '网络繁忙' + result)
            })
        }
        
    })
}

function messageOperation(name){
    $('.message_list').on('click','a.delete_msg',function(){
        const _id = this.getAttribute('_id')
        const _this = this
        if(name === undefined || name !== 'Ada'){
            infoContainer('请登入管理员账号' , false)
            return
        }
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
            if(result && result.success){
                infoContainer('删除成功', true)
                $(_this).closest('li').remove()
            }else 
            infoContainer(result && result.errorMsg || '网络繁忙' + result)
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
        if(item[0] === 'user'){
            rememberLoginState(item[1]);
            $('.all_user span').text('注销');
            $('.user_name').html(item[1]);
            getAvatar(item[1])
            // $('.msg_name').val(item[1] || '')
            repeatCon(item[1])
            uploadAvatar(item[1])
            $('#avatar').show() 
            messageOperation(item[1]) 
            sessionStorage && sessionStorage.setItem('user', item[1])
            if(item[1] !== 'Ada'){
              $('.menu_toggle').on('click',_=>{infoContainer('你还没有这个权限哦' , false)})
            }
            if(item[1] === 'Ada'){
                        adminToggle();
                        publishDynamic();
                        publishItem()
                        deleteDynamic();
                        deleteArticle();
                        adminEdit()
                        updateArticle()
                        editDynamic()
                        uploadAvatar('Ada');
            }
            return
        }else count++
    }
    if(count === b.length){
            loginWarning();
           getAvatar('Ada')
            messageOperation(undefined)
            repeatCon(undefined)
            $('#avatar').hide()
            $('.all_user span').html('登陆');
            $('.user_name').html('Ada');       
    }
}

function adminToggle() {
    var wd = window.innerWidth;
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
                            $('.edit_ui').animate({
                                opacity: 1,
                                right: 0
                            }, 100, () => {
                                $('.select_line').show();
                            }).find('.edit_ul').show().addClass('bounceInRight')
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
            $('.edit_ui').animate({
                opacity: 0,
                right: -wd
            }).find('.edit_ul').hide().removeClass('bounceInRight');
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
        // $('.edit_ul li').eq(index).show().siblings().hide();
        // $('.edit_ul li').eq(index).show().siblings().hide();
    });
    // $('.admin_menu li a') = null
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
     }, 2500) 
     callback && callback() 
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
                if(result && result.success){
                    infoContainer('成功,你可以继续发布', true)
                    reRenderDynamic(result.data.reverse())
                    const title = $('#dw_title').val('')
                    const content = $('#short_article_textarea').val('')
                }else 
                    infoContainer(result && result.errorMsg || '网络繁忙' + result.status)
            })
            // $.ajax({
            //     url:'/saveDw',
            //     type:'POST',
            //     data:{
            //         title: title,
            //         content: content,
            //         date: d,
            //         upvote: 1
            //     },
            //     traditional : true,
            //     success: function (res) {
            //         if (res) {
            //             infoContainer('成功,你可以继续发布' , true);
            //             reRenderDynamic(res.reverse());
            //             var title = $('#dw_title').val('');
            //             var content = $('#short_article_textarea').val('');
            //         }
            //     }})
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

// function publishDw() {  //publish short article
//     $('#publish_dw').click(function () {
//         var title = $('#dw_title').val();
//         var content = $(this).prev().prev().val();
//         var count = $(this).prev().find('span').html();
//         var date = new Date();
//         var d = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
//         var temp = {
//             title: title,
//             content: content
//         }
//         if (checkBeforePublish(temp)) {
//             if (count < 0) {
//                 $('.err_info').show().html('文字超出限制');
//                 return;
//             }
//             $.ajax({
//                 url :'/saveDw',
//                 type : 'POST',
//                 data :{
//                     title: title,
//                     content: content,
//                     msg : [{context:'',date:''}],
//                     date: d,
//                     upvote: 1
//                 },
//                 traditional: true,
//                 success : function (res) {
//                     if (res.arr) {
//                         $('.err_info').show().html('成功,你可以继续发布');
//                         reRenderDynamic(res.arr.reverse());
//                     }
//                 }})
//         }
//         else {
//             $('.err_info').show();
//         }
//     })
// }

function reRenderDynamic(data) {  // reload dynamic
    var html = template('dynamic_tpl', {dynamics: data});
    $('.dynamic').find('li').remove();
    $('.dynamic').append($(html));
    var html2 = template('dynamic_operation_tpl', {dynamics: data});
    $('.all_short_article').find('li').remove();
    $('.all_short_article').append($(html2));
}

function checkBeforePublish(temp) { // title and content shouldn't be null
    // if (temp.title === '' || temp.content === '') {
    let resultBool = true
    // console.log(temp)
    for(let key in temp)
      // console.log(temp[key].trim())
      if(temp[key].trim() === ""){
        resultBool = false
        break
      }
      return resultBool
        // $('.edit_ul').removeClass('bounceInRight');
        // $('.edit_ul').removeClass('shake');
        // setTimeout(() => {
        //     $('.edit_ul').addClass('shake');
        // }, 0);
    //     return false;
    // }
    // else return true;
}

function publishItem() {  //publish item
    var t = $('.select_line').css('top');
    var obj = {
      url : null
    };
    $('.admin_menu li a').on('click  ', function () {
        var index = $(this).parent().index();
        $('.select_line').animate({
            top: parseInt(t) + index * 40
        }, 300);
        if(index === 0) {
            obj.url = 'saveDw';
            obj.type = 'content';
            $('.temp_operation').stop().removeClass('pulse').hide(0);
            $('.edit_li').stop().show().addClass('pulse');
        }
        else if(index === 2) {
           obj.url = 'saveArticle';
           obj.type = 'summary';
           $('.temp_operation').stop().removeClass('pulse').hide(0);
           $('.toggleitem').stop().show().addClass('pulse');
        }else if(index === 3){
            $('.temp_operation').stop().removeClass('pulse').hide(0);
          $('.operation').stop().show().addClass('pulse');
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
          publishBtn(obj , data)
    })
    // $('.publish-edit') = null
    // $('.admin_menu li a') = null
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

function publishBtn(obj , data){  //publish edit content
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

// function editDynamic() {  //edit dynamic
//     $('.all_short_article').on('click', 'a.edit_item_dynamic', function () {
//         $('.edit_ul').addClass('bounceOutRight');
//         $('.new_error_info').hide();
//         $('.edit_box').animate({
//             opacity: 1
//         }, 500);
//         var self = $(this).closest('li');
//         var index = self.index();
//         var title = self.find('p').html();
//         $.post(
//             '/editDynamic',
//             {
//                 title: title
//             }, function (res) {
//                 if (res) {
//                     var content = res.content;
//                     $('.new_title').val(title);
//                     $('.new_content').val(content);
//                     $('.new_count').html('' + (180 - content.length));
//                     var oldTitle = $('.new_title').val();
//                     var oldContent = $('.new_content').val();
//                     $('.new_publish').on('click', () => {
//                         var newTitle = $('.new_title').val();
//                         var newContent = $('.new_content').val();
//                         if (newTitle !== oldTitle || newContent !== oldContent) {
//                             updateDynamic(oldTitle,newTitle,newContent,index);
//                         } else {
//                             $('.new_error_info').show();
//                             $('.edit_box').removeClass('shake');
//                             setTimeout(()=>{
//                                 $('.edit_box').addClass('shake');
//                             })
//                         }
//                     })
//                 }
//             }
//         )
//     })
// }

// function updateDynamic(oTitle,title,content,index) {   //update dynamic due to old title
//     var date = new Date();
//     var d = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
//     $.post(
//         '/updateDynamic',
//         {
//             oldTitle:oTitle,
//             title:title,
//             date:d,
//             content:content,
//         },function(res){
//             if(res){
//                 $('.new_error_info').show().html('更新成功');
//                 $('.reset_value').val('');
//                 $('.dynamic_item').eq(index).find('.title').html(title);
//                 $('.dynamic_item').eq(index).find('.summary').html(content);
//                 $('.all_short_article li').eq(index).find('p').html(title);
//                 setTimeout(()=>{
//                     $('.edit_box').animate({
//                         opacity:0
//                     },500,()=>{
//                         $('.edit_ul').removeClass('bounceOutRight');
//                     })
//                 },800);
//             }else{
//                 $('.new_error_info').show().html('更新失败');
//             }
//         }
//     )
// }

// function updateArticle(oTitle,title,content,index) {   //update article due to old title
//     var date = new Date();
//     var d = (date.getMonth()+1)+'-'+date.getDate();
//     var year = date.getFullYear();
//     $.post(
//         '/updateArticle',
//         {
//             oldTitle:oTitle,
//             title:title,
//             date:d,
//             content:content,
//             year:year
//         },function(res){
//             if(res){
//                 $('.new_error_info').show().html('更新成功');
//                 $('.reset_value').val('');
//                 $('.article_list .article').eq(index).find('.article_tittle').html(title);
//                 $('.article_list .article').eq(index).find('.article_summary').html(content);
//                 $('.o_all_article li').eq(index).find('p').html(title);
//                 $('.article_list .article').eq(index).find('.article_date').text(date);
//                 $('.article_list .article').eq(index).find('.article_date p').html(year);
//                 setTimeout(()=>{
//                     $('.edit_box').animate({
//                         opacity:0
//                     },500,()=>{
//                         $('.edit_ul').removeClass('bounceOutRight');
//                     })
//                 },800);
//             }else{
//                 $('.new_error_info').show().html('更新失败');
//             }
//         }
//     )
// }

//  function editArticle() {  //edit article
//     $('.o_all_article').on('click', 'a.edit_item_article', function () {
//         $('.edit_ul').addClass('bounceOutRight');
//         $('.new_error_info').hide();
//         $('.edit_box').animate({
//             opacity: 1
//         }, 500);
//         var self = $(this).closest('li');
//         var index = self.index();
//         var title = self.find('p').html();
//         $.post(
//             '/editArticle',
//             {
//                 title: title
//             }, function (res) {
//                 if (res) {
//                     var content = res.content;
//                     $('.new_title').val(title);
//                     $('.new_content').val(content);
//                     $('.new_count').html('' + (180 - content.length));
//                     var oldTitle = $('.new_title').val();
//                     var oldContent = $('.new_content').val();
//                     $('.new_publish').on('click', () => {
//                         var newTitle = $('.new_title').val();
//                         var newContent = $('.new_content').val();
//                         console.log(oldTitle+' + '+newTitle)
//                         if (newTitle !== oldTitle || newContent !== oldContent) {
//                             updateArticle(oldTitle,newTitle,newContent,index);
//                         } else {
//                             $('.new_error_info').show();
//                             $('.edit_box').removeClass('shake');
//                             setTimeout(()=>{
//                                 $('.edit_box').addClass('shake');
//                             })
//                         }
//                     })
//                 }
//             }
//         )
//     })
// }

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
            $('.load').show()
            setTimeout(()=>{
                $('.loadimg').css('transform','rotate(360deg)')
            },100)
            fetch('/leaveMessage', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify( { date: d, content: msg, name } )
            }).then(res => {
                if(res.status >= 200 && res.status <300 )
                    return res.json()
                return res.status
            }).then(result => {
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
        console.log(111,$('.theme_containter'))
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
        $('.dynamic-msg-container').hide(300)

        $('.full_summary').text('').hide();
        // $('.error_search').hide()
		var $article = $('.article_list .article');
		$article.removeClass('showArticle').find('.article_tittle').removeClass('article_title_toggle');
        $article.find('.article_summary').removeClass('toggleP');
        $article.find('.article_date').css({
        	left:'-16%'
        });
        $article.find('.article_close').hide(500);
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
        $(this).parent().next().toggle(500);
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
        let msg = [{context : word,date : currentDay}];
        // alert(_id)
        if(word === '') {
            infoContainer('评论不能为空' , false)
            return ;
        }
        fetch('/leave-dynamic-mg', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify({ _id, msg })
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

(function(){
    let imgs = ['/resouce/gallery/1.png','/resouce/gallery/2.png','/resouce/gallery/3.png','/resouce/gallery/4.png','/resouce/gallery/5.png','/resouce/gallery/6.png','/resouce/gallery/7.png','/resouce/gallery/8.png','/resouce/gallery/9.png','/resouce/gallery/10.png','/resouce/gallery/11.png','/resouce/gallery/12.png','/resouce/images/1.jpg','/resouce/images/2.jpg','/resouce/images/3.jpg','/resouce/images/4.jpg','/resouce/images/5.jpg','/resouce/images/6.jpg','/resouce/images/admin_icon.jpg','/resouce/images/load.png','/resouce/images/loading.png','/resouce/images/loading1.png','/resouce/images/login.jpg','/resouce/images/loginbg.jpg','/resouce/images/ly.jpg','/resouce/images/lyy.jpg','/resouce/images/qaone.png','/resouce/images/wechat.jpg','/resouce/images/wechat.png'];
    let imgObj = new Image();
    let count = 0;
    for(let i = 0,len = imgs.length; i<len; i++){
        imgObj.src = imgs[i];
        imgObj.onload = function(){
            count++;
            $('.loadingUI').remove();
            randomTheme();
        }
        imgObj.onerror = function(){
         };
    }
})();

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
        '#c5d08d'
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
        ul.toggle(500,()=>{
           ul.css('display') === 'none' ? $(_this).text('展开回复列表') : $(_this).text('关闭回复列表')
        })

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
                    $(item).text() === item1.name && ($(item).parent().prev().find('img')[0].src = item1.avatar)        
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
        bg: './resouce/images/menu.jpg',
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

$(function () {
    loginApi()
    mobileEntry()
    // concoleEffect()
    // initMore()
    // initOverLay()
    // entryAboutMe()
    randomAbountMe()
    entryMoreOperation()
    allUserAvatar()
    messageBoxHover()
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
    asideTextHover();
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
});

function updateArticle(){
    $('.o_all_article').on('click','.update_article_icon',function(){
        const _id = this.attributes[0].value
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
            console.log($(item).prev())
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
    fetch('/updateArticleById', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({ _id, summary, type })
    }).then( res => { return res.json() } )
    .then(result => {
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
        $('.index').trigger('click')
        $('.canvas_box').css({
            zIndex: -100,
            transform: 'scale(0)'
        });
    })
}

function galleryApi() {  //gallery
    $('.gallery_api').on('click  ', () => {
        history.pushState('','','/gallery');
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
