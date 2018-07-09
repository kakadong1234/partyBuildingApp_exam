let user_id = 'xuehaifeng'
var userInfo = {};
var url = location.href;
//  alert(location.href);
function initConst(info) {
    userInfo = info;
    user_id = userInfo.emplId
}



$(function () {
    //getUserInfo(url, initConst); //TODO
    console.log('user_id is ' + user_id)
    initExamList();
})

function initExamList() {
    getExamList();
};

function getExamList() {
    //TODO
    $.get('https://dangjain.ishoubei.com/exam/result?user_id=' + user_id, function(data){
        console.log(data);
        data = data.rows.map(function(examPlan){
            examPlan.ep_name = examPlan.ep_name === undefined ? '考试测试01' : examPlan.ep_name
            examPlan.isInExaming = examPlan.er_state === 2
            examPlan.isExamed = !examPlan.isInExaming
            examPlan.show_status = examPlan.isInExaming ? '考试中' : '已考完'
            examPlan.exam_btn_txt = examPlan.show_status === '考试中' ? '继续考试' : '查看考试结果' 
            return examPlan
        })
        console.log(data);
        initListBody(data);
    });
};

function initListBody(data) {
    const exam_list_template = [
        '{{#data}}<div class="panel-body">',
            '<div class="card-alert">',
                '<div class="alert-title">{{ep_name}}</div>',
                '<div class="alert-body">',
                    '{{#isInExaming}}<div class="item">',                      
                        '<span>剩余时间：{{er_surp}} 分钟</span>',  
                    '</div>{{/isInExaming}}',
                    '{{#isExamed}}<div class="item btn">',       
                    '<span>考试得分：{{er_mark}}</span>',                
                    '<a href="test.html?ep_id={{ep_id}}&user_id={{user_id}}&restart=true">重新考试</a>',                   
                    '</div>{{/isExamed}}',
                    '<div class="item btn">',       
                        '<span>状态: {{show_status}}</span>',                   
                        '<a href="test.html?ep_id={{ep_id}}&user_id={{user_id}}">{{exam_btn_txt}}</a>',                   
                    '</div>',
                '</div>',
            '</div>',
        '</div>{{/data}}',
    ].join('')
    //初始化这个模板
    Mustache.parse(exam_list_template);
    $("#my_exam_list").html(Mustache.render(exam_list_template, { data: data }))
};

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

// function newDate(strdate) {  
//     var arr = strdate.split(/[- : \/]/);  
//     console.log(arr);
//     date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);  
//     return date;  
// } 