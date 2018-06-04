//dd.ready(function () {

//    //dd.device.notification.confirm({
//    //    message: "你爱我吗",
//    //    title: "提示",
//    //    buttonLabels: ['爱', '不爱'],
//    //    onSuccess: function (result) {
//    //        //onSuccess将在点击button之后回调
//    //        /*
//    //        {
//    //            buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
//    //        }
//    //        */
//    //    },
//    //    onFail: function (err) { }
//    //});



//    dd.biz.navigation.setRight({
//        show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
//        control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
//        text: '导航',//控制显示文本，空字符串表示显示默认文本
//        onSuccess: function (result) {
//            var $androidActionSheet = $('#androidActionsheet');
//            var $androidMask = $androidActionSheet.find('.weui-mask');
//            $androidMask.on('click', function () {
//                $androidActionSheet.hide();
//            });
//            if (!showMenu) {
//                showMenu = true;
//                $androidActionSheet.show();
//            } else {
//                showMenu = false;
//                $androidActionSheet.hide();
//            }



//            //如果control为true，则onSuccess将在发生按钮点击事件被回调
//            /*
//            {}
//            */
//        },
//        onFail: function (err) { }
//    });


//});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
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
})


function getUserInfo(url, callback) {


    $.get("https://dangjain.ishoubei.com:8443/jsapi-oauth?pwd=sddkhhyy&url=" + url, function (e) {
        var _config = {};
        _config = e;
        //  alert(JSON.stringify(_config));
        dd.config({
            agentId: _config.agentId,
            corpId: _config.corpId,
            timeStamp: _config.timestamp,
            nonceStr: _config.noncestr,
            signature: _config.signature,
            jsApiList: ['runtime.info', 'biz.contact.choose', 'device.notification.confirm', 'device.notification.prompt', 'biz.ding.post', 'biz.util.openLink', 'biz.util.uploadImage','biz.user.get']
        });
        //  alert(JSON.stringify(_config));
        dd.error(function (error) {
            /**
             {
                message:"错误信息",//message信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
                errorCode:"错误码"
             }
            **/
            alert('dd error: ' + JSON.stringify(error));
        });

        //   alert(JSON.stringify(_config));

        dd.ready(function () {

            dd.biz.user.get({
                corpId: 'dinge7eb51e20be94cb635c2f4657eb6378f', // 可选参数，如果不传则使用用户当前企业的corpId。
                onSuccess: function (info) {
                    //alert('userGet success: ' + JSON.stringify(info));

                    typeof callback == "function" && callback(info);

                },
                onFail: function (err) {
                    alert('userGet fail: ' + JSON.stringify(err));
                }
            });

        });

    });

}
