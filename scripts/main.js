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
