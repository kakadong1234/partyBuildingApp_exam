String.prototype.myReplace = function (f, e) {//吧f替换成e
    var reg = new RegExp(f, "g"); //创建正则RegExp对象   
    return this.replace(reg, e);
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var version = GetQueryString("version");
function navClick(html) {
    if(html.indexOf("?") === -1) {
        window.location = html + "?version=" + version
    }
    else {
        window.location = html + "&version=" + version
    }
}

function getReadListInCache() {
    var key = 'have_read_id_list'
    var listString = window.localStorage.getItem(key)
    console.log('read listString:' + listString)
    var list = [];
    if(listString){
        list = listString.split(",")
    }
    return list
}

function goToDetailPage(id) {
    window.location = "detail2.html?id=" + id + "&version=" + version
}

function genArticleHtml(rel, htmlIdValue) {
    var innerHtml = '<div class="weui-cell" onClick="goToDetailPage({{id}})">'
    + '<div class="weui-cell__bd">'
    + '<a class="{{titleClass}}">{{title}}</a>'
    + '<span class="pub-time">{{pubTime}}</span>'
    + '<span class="pv">{{pv}}次阅读</span>'
    + '</div>'
    + '{{img}}'
    + '</div>';
    var innerImgHtml = '<div class="weui-cell__hd"><img class="item-cover" src="{{cover}}"></div>';
    var strHtml = [];
    var strInner = [];
    var imgHtml = '';
    for (var i = 0; i < rel.rows.length; i++) {
        if (rel.rows[i].cover != '' && rel.rows[i].cover != 'http://api.lpszzb.gov.cn/static/files/20180628103815_cover.jpg') {
            imgHtml = innerImgHtml.replace("{{cover}}", rel.rows[i].cover);
        }
        var titleClass = ''
        if (getReadListInCache().indexOf(rel.rows[i].article_id + '') === -1) {
            //该文章未读
            titleClass = 'title_a_no_read'
        }
        else {
            titleClass = 'title_a_have_read'
        }
        strInner.push(innerHtml.replace("{{titleClass}}", titleClass).replace("{{pubTime}}", rel.rows[i].pubtime).replace("{{pv}}", rel.rows[i].pv).replace("{{img}}", imgHtml).replace("{{id}}", rel.rows[i].article_id).replace("{{id}}", rel.rows[i].article_id).replace("{{title}}", rel.rows[i].title));
        imgHtml = ''
    }
    $("#" + htmlIdValue ).html(strInner.join(""));
}

function genStudyListHtml(rel, htmlIdValue) {
    var innerHtml = '<div class="weui-cell" onClick="goToDetailPage({{id}})">'
    + '<div class="weui-cell__bd">'
    + '<a class="{{titleClass}}">{{title}}</a>'
    + '<span class="pub-time">{{pubTime}}</span>'
    + '<span class="pv">{{pv}}次阅读</span>'
    + '</div>'
    + '{{img}}'
    + '</div>';
    var innerImgHtml = '<div class="weui-cell__hd"><img class="item-cover" src="{{cover}}"></div>';
    var strHtml = [];
    var strInner = [];
    var imgHtml = '';
    for (var i = 0; i < rel.rows.length; i++) {
        if (rel.rows[i].article.cover != '' && rel.rows[i].article.cover != 'http://api.lpszzb.gov.cn/static/files/20180628103815_cover.jpg') {
            imgHtml = innerImgHtml.replace("{{cover}}", rel.rows[i].article.cover);
        }
        var titleClass = ''
        if (getReadListInCache().indexOf(rel.rows[i].article.article_id + '') === -1) {
            //该文章未读
            titleClass = 'title_a_no_read'
        }
        else {
            titleClass = 'title_a_have_read'
        }
        strInner.push(innerHtml.replace("{{titleClass}}", titleClass).replace("{{pubTime}}", rel.rows[i].article.pubtime).replace("{{pv}}", rel.rows[i].article.pv).replace("{{img}}", imgHtml).replace("{{id}}", rel.rows[i].article.article_id).replace("{{id}}", rel.rows[i].article.article_id).replace("{{title}}", rel.rows[i].article.title));
        imgHtml = ''
    }
    $("#" + htmlIdValue ).html(strInner.join(""));
}

function openLink(name) {
    console.log('openLink: ' + name)
    getAppLinkList(function(appList){
        
        console.log(JSON.stringify(appLinkList))
        var link = findItemInList(appList, 'name', name).link
        dd.ready(function () {
            console.log('success dd ready')
            dd.biz.util.openLink({
                url: link,//要打开链接的地址
                onSuccess: function (result) {
                    /**/
                    console.log('openLink success')
                   console.log(JSON.stringify(result));
                },
                onFail: function (err) {
                  console.log('openLink error: ' + err)
                  console.log(JSON.stringify(err));
                }
            })
    
        });
    })
};

var appLinkList = []
function getAppLinkList(cb) {
    console.log(appLinkList.length)
    if(appLinkList.length > 0) {
        return cb(appLinkList)
    }
    getDDAppList(function(list){
        var constLink = 'dingtalk://dingtalkclient/action/switchtab?index=2&name=work&scene=1&corpid=ding1148af8a150e83ef35c2f4657eb6378f'
        //签到
        var agentId = findItemInList(list, 'name', '签到').agentId
        var link = constLink  + '&agentid=' + agentId
        appLinkList.push({name: 'singIn', link: link})
        //驻村日志 - 日志
        agentId = findItemInList(list, 'name', '日志').agentId
        link = constLink  + '&agentid=' + agentId
        appLinkList.push({name: 'log', link: link})
        //任务调度
        appLinkList.push({name: 'work', link: 'dingtalk://dingtalkclient/action/switchtab?index=1'})
        //共享交流
        appLinkList.push({name: 'concat', link: 'https://h5.m.taobao.com/alicare/meebot.html?corpId=ding1148af8a150e83ef35c2f4657eb6378f&type=dingding_inner&appKey=Z3NmjVBIva&auth_vendor=dd'})
        //工作审批 - 审批
        agentId = findItemInList(list, 'name', '审批').agentId
        link = constLink  + '&agentid=' + agentId
        appLinkList.push({name: 'shenpi', link: link})

        //请假申请 - 审批下请假 - 直接拼接 url
        link = 'https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?dd_share=false&showmenu=true&back=native&swfrom=corp&corpid=ding1148af8a150e83ef35c2f4657eb6378f&processCode=PROC-620972CD-FD23-43D2-96E2-E3D3790BA34B#/custom'
        appLinkList.push({name: 'leave', link: link})
        console.log(appLinkList)
        return cb(appLinkList)
    });

} 

function getDDAppList(cb){
    $.get("https://api.lpszzb.gov.cn/dding?key=get_microapp_list ", function (rel) {
        var list = rel.appList
        return cb(list)
    })
}

function upload(cb){
    alert('2323232')
    var form = document.getElementById("form_file");
    var formData = new FormData(form);
    console.log(formData)
    $.ajax({
        url:"http://api.lpszzb.gov.cn/upload",
        type:"post",
        data:formData,
        processData:false,
        contentType:false,
        success:function(res){
            if(res){
                alert(JSON.stringify(res))
                var httpurl="http://api.lpszzb.gov.cn" + res.url
                alert(httpurl)
                cb(httpurl)
            }else {
                alert("文件上传错误")
            }


        },
        error:function(err){
            alert("网络连接失败,稍后重试",err);
        }
    })
}


var showMenu = false;

$(function () {

    $("#btn-nav").on("click", function () {
        var $androidActionSheet = $('#androidActionsheet');
        var $androidMask = $androidActionSheet.find('.weui-mask');
        $androidMask.on('click', function () {
            $androidActionSheet.hide();
        });
        if (!showMenu) {
            showMenu = true;
            $androidActionSheet.show();
        } else {
            showMenu = false;
            $androidActionSheet.hide();
        }
    });



    $("#btn-test").click(function () {

        for (var i = 0; i < questions.length; i++) {

            console.log($("input[type=radio][name=radio_" + questions[i].eq_id + "]:checked").val());
            var answer = $("input[type=radio][name=radio_" + questions[i].eq_id + "]:checked").val();
            if (answer !== undefined) {
                if (answer == questions[i].answer) {
                    $("img#img_" + questions[i].eq_id).attr("src", "../img/right.png").show();
                } else {
                    $("img#img_" + questions[i].eq_id).attr("src", "../img/wrong.png").show();
                }
            }

        }


    });


    $("#btn-comment").click(function () {
        var user = userInfo || {};
        var content = $("#xd-content").val();

        if (content == "") {
            alert("请输入心得体会！");
            return false;
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.lpszzb.gov.cn/article/" + aritcleId + "/aq",
            "method": "POST",
            "headers": {},
            "data": {
                "title": articleTitle,
                "content": content,
                "user_id": user.emplId,
                "cover": user.avatar,
                "author": user.nickName
            }
        }

        //  alert(JSON.stringify(settings));

        $.ajax(settings).done(function (response) {
            //console.log(response);
            alert("提交成功，等待审核");
        });
    });


    $("#btn-feedback").click(function () {

        var user = userInfo || {};
        upload(function(url){
            alert(JSON.stringify(user.emplId));
            alert(url)
            var content = $("#xd-content").val();
        if (content == "") {
            alert("请输入宝贵意见！");
            return false;
        }

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.lpszzb.gov.cn/report/feedback",
            "method": "POST",
            "headers": {},
            "data": {
                "title": "意见反馈",
                "content": content,
                "user_id": user.emplId,
                "cover": user.avatar,
                "author": user.nickName,
                "urls": url
            }
        }

        $.ajax(settings).done(function (response) {
            //console.log(response);
            alert("提交成功，谢谢您的建议，我们会及时回复！");
        });
    });

        })
})


function getUserInfo(url, callback, callbackGps) {
    if(!isMobile()) { //pc上调试
        return typeof callback == "function" && callback({
            emplId: '065506030123353335',
            avatar: 'http://7xrsfo.com1.z0.glb.clouddn.com/tx123.png',
            nickName: '晓伟'
        });
    }
    $.get("https://api.lpszzb.gov.cn/jsapi-oauth?pwd=sddkhhyy&url=" + url, function (e) {
        var _config = {};
        _config = e;
        dd.config({
            agentId: _config.agentId,
            corpId: _config.corpId,
            timeStamp: _config.timestamp,
            nonceStr: _config.noncestr,
            signature: _config.signature,
            jsApiList: ['runtime.info', 'biz.contact.choose', 'device.notification.confirm', 'device.notification.prompt', 'biz.ding.post', 'biz.util.openLink', 'biz.util.uploadImage', 'biz.user.get', 'device.geolocation.get', 'biz.map.locate']
        });
        dd.error(function (error) {
            /**
             {
                message:"错误信息",//message信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
                errorCode:"错误码"
             }
            **/
            console.log('1')
            console.log('dd error: ' + JSON.stringify(error));
        });
        console.log('2')
        //    alert(JSON.stringify(_config));

        dd.ready(function () {
            dd.biz.user.get({
                corpId: 'ding1148af8a150e83ef35c2f4657eb6378f', // 可选参数，如果不传则使用用户当前企业的corpId。 
                onSuccess: function (info) {
                    //  alert('userGet success: ' + JSON.stringify(info));
                    typeof callback == "function" && callback(info);
                },
                onFail: function (err) {
                    console.log('userGet fail: ' + JSON.stringify(err));
                }
            });

        });
        console.log('3')
    });

}

function isMobile() {
    var userAgentInfo = navigator.userAgent;
    console.log('userAgentInfo' + userAgentInfo)
    var mobileAgents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad","iPod"];

    var mobile_flag = false;

    //根据userAgent判断是否是手机
    for (var v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobile_flag = true;
            break;
        }
    }
     return mobile_flag;
}

function findItemInList(list, key, value) {
    var item = {}
    for(var i=0; i<list.length; i++){
        var app = list[i]
        if(app[key] === value) {
            item = app
        }
    }
    return item
}
