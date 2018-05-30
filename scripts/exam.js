let counter = 0; //定时运行次数 == 消耗时间秒数
let submitStatus = "未交卷"; //未交卷, 交卷中, 已交卷, 交卷失败
let answer = [];
$(function () {
    console.log('helloWord exam')
    initExamList();
})

function initExamList() {
    getExamData();
};

function getExamData() {
    //TODO
    $.get('https://dangjain.ishoubei.com:8443/exam/plan/2', function(data){
        console.log(data);
        const exam = {
            examId: 1,
            title: '中国共产党纪律处分条例测试',
            totalScore: 100,
            duration: 90,  //分钟
            status: "考试中", //未开考, 考试中, 已考完
            remainingSecond: 1 * 60 - 32, //剩余秒数 -- status === '考试中' 才有意义
            uScore: "85", //考生得分 --- status === '已考完' 才有意义
            question: [
                {
                    index: 1,
                    indexTxt: '一',
                    key: '选择题',
                    qList: [
                        {
                            id: 1,
                            showIndex: '1',
                            title: '下列___项是最根本的党内法规，是管党治党的总规矩:',
                            uAnswer: 'D',
                            items: [
                                {
                                    key: 'A',
                                    value: '《中国共产党纪律处分条例》'
                                },
                                {
                                    key: 'B',
                                    value: '《中国共产党章程》'
                                },
                                {
                                    key: 'C',
                                    value: '《中国共产党廉洁自律准则》'
                                },
                                {
                                    key: 'D',
                                    value: '《中国共产党党员领导干部廉洁从政若干准则》'
                                }
                            ]
                        },
                        {
                            id: 2,
                            showIndex: '2',
                            title: '以下_____项不是对党员的纪律处分:',
                            // uAnswer: 'C',
                            items: [
                                {
                                    key: 'A',
                                    value: '记过'
                                },
                                {
                                    key: 'B',
                                    value: '警告'
                                },
                                {
                                    key: 'C',
                                    value: '撤销党内职务'
                                },
                                {
                                    key: 'D',
                                    value: '开除党籍'
                                }
                            ]
                        }
                    ]
                },
                {
                    index: 2,
                    indexTxt: '二',
                    key: '判断题',
                    qList: [
                        {
                            id: 3,
                            showIndex: '1',
                            title: '下列___项是最根本的党内法规，是管党治党的总规矩:',
                            uAnswer: 'B',
                            items: [
                                {
                                    key: 'A',
                                    value: '对'
                                },
                                {
                                    key: 'B',
                                    value: '错'
                                },
                            ]
                        },
                        {
                            id: 4,
                            showIndex: '2',
                            title: '以下_____项不是对党员的纪律处分:',
                            uAnswer: 'A',
                            items: [
                                {
                                    key: 'A',
                                    value: '对'
                                },
                                {
                                    key: 'B',
                                    value: '错'
                                },
                            ]
                        },
                    ]
                }
            ]
        };
        //set selected
        exam.question = exam.question.map(function(item){
            item.qList.map(function(qItem){
                qItem.items.map(function(x){
                    if(qItem.uAnswer){
                        x.selected =  qItem.uAnswer === x.key
                    }
                    return x;
                })
                return qItem;
            })
            return item
        })
        initListHeader(exam);
        initListBody(exam);
        initListFooter(exam);
        if(exam.status !== '已考完'){
            const rTime  = exam.remainingSecond ? Number(exam.remainingSecond) : exam.duration * 60;
            startCountDown(rTime);
            startLoopUserAnswer(rTime)
        }
    });
};

function initListHeader(exam) {
    var list_header_template = [
        '<div class="weui-panel weui-panel_access test">',
        '<div class="weui-panel__bd">',
        '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">',
        '<div class="weui-media-box__bd">',
        '<h4 class="weui-media-box__title">{{title}}</h4>',
        '<p class="weui-media-box__desc">（总分：{{totalScore}}分；测试时间：{{duration}}分钟）</p>',
        '</div>',
        '</a>',
        '</div>',
        '</div>',
    ].join('');
    //初始化这个模板
    Mustache.parse(list_header_template);
    $("#list_header").html(Mustache.render(list_header_template, exam))
};

function initListBody(exam) {
    const list_body_template = [
        '{{#data}}<div class="weui-panel weui-panel_access test">',
        '<div class="weui-panel__hd">{{indexTxt}}、{{key}}</div>',
        '<div class="weui-panel__bd">',
        '{{#qList}}<span href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">',
        '<div class="weui-media-box__bd">',
        '<p class="weui-media-box__desc">{{showIndex}}. {{title}}</p>',
        '<div class="weui-cells weui-cells_radio">',
        '{{#items}}<label class="weui-cell weui-check__label" for="radio{{id}}{{key}}">',
        '<div class="weui-cell__bd">',
        '<p>{{key}}. {{value}} </p>',
        '</div>',
        '<div class="weui-cell__ft">',
        '{{^selected}}<input type="radio" class="weui-check" name="radio{{id}}" id="radio{{id}}{{key}}" value="{{key}}" onclick="setUserAnswer({{id}}, this.value)">{{/selected}}',
        '{{#selected}}<input type="radio" class="weui-check" name="radio{{id}}" checked="checked" id="radio{{id}}{{key}}" value="{{key}}" onclick="setUserAnswer({{id}}, this.value)">{{/selected}}',
        '<span class="weui-icon-checked"></span>',
        '</div>',
        '</label>{{/items}}',
        '</div>',
        '</div>',
        '</span>',
        '</div>{{/qList}}',
        '</div>{{/data}}',
    ].join('');
    //初始化这个模板
    Mustache.parse(list_body_template);
    const data = exam.question;
    $("#list_body").html(Mustache.render(list_body_template, { data: data }))
};

function initListFooter(exam) {
    let text = '';
    if(exam.status === '已考完'){
        text = "得分: " + exam.uScore + "分";
        submitStatus = "已交卷"
    }
    else {
        const time  = exam.remainingSecond ? Number(exam.remainingSecond) : exam.duration * 60;
        const timeTxt = getTimeText(time) 
        text = timeTxt + "&nbsp; &nbsp; 交&nbsp;卷";
    }
    console.log(text)
    $("#btn-submit").html(text);
};

function startCountDown(remainingTime){
    var timer = function () {
        setTimeout(function () {
            console.log('-------------startCountDown')
            if(submitStatus === "未交卷") {
                counter++;
                const rTime = remainingTime - counter;
                console.log(rTime);
                if(rTime <= 0){
                    $("#btn-submit").html(getTimeText(rTime) + "交卷中"); 
                    finishExam()
                }
                else{
                    $("#btn-submit").html(getTimeText(rTime) + "&nbsp; &nbsp; 交&nbsp;卷");
                    timer();
                }
            }
        }, 1000);

    }
    timer();
}


function startLoopUserAnswer(remainingTime){
    var timer = function () {
        setTimeout(function () {
            console.log('-------------loopAnswer')
            if(submitStatus === "未交卷") {
                const rTime = remainingTime - counter;
                console.log(rTime);
                if(rTime > 0){
                    loopUserAnswer()
                    timer();
                }
            }
        }, 10000);
    }
    timer();
}
function finishExam(){
    //交卷
    if(submitStatus === "未交卷" || submitStatus === "交卷失败"){
        console.log('-----用户的答案是')
        console.log(answer)
        // TODO
        submitStatus = "交卷中"
        $("#btn-submit").html("交卷中"); 
        console.log(submitStatus)
        $.ajax({  
            type: "post",  
            url: "https://dangjain.ishoubei.com:8443/exam/plan",  
            contentType : "application/x-www-form-urlencoded; charset=UTF-8",  
            data: $.param({
                user_id: "xuehaifeng",
                ep_name: "六盘水钟山区学习习近平智慧党建考试",
                ep_type: "一试一卷",
                eps_time: "2018-06-01 08:00:00",
                epe_time: "2018-06-01 16:00:00",
                ep_limit: 120,
                eq1_cnt: 10,
                eq1_val: 6,
                eq2_cnt: 10,
                eq2_val: 5
            }),  
            success: function (res) {  
                console.log(res)
                submitStatus = "已交卷"
                $("#btn-submit").html(submitStatus); 
                console.log(submitStatus)
                window.location = "test.html"; //TODO: 写成云学习中心的 url
            },
            error: function () {
                /*错误信息处理*/
                submitStatus = "交卷失败"
                $("#btn-submit").html("交卷失败, 点击重新交卷"); 
                console.log(submitStatus)
            }  
        });  
    }
    else{
        console.log(submitStatus)
    }
}

function loopUserAnswer(){
     //轮训用户答题情况
     console.log('轮训用户答题情况')
     console.log('-----用户的答案是')
     console.log(answer)
    // TODO
    $.ajax({  
        type: "post",  
        url: "https://dangjain.ishoubei.com:8443/exam/plan",  
        contentType : "application/x-www-form-urlencoded; charset=UTF-8",  
        data: $.param({
            user_id: "xuehaifeng",
            ep_name: "六盘水钟山区学习习近平智慧党建考试",
            ep_type: "一试一卷",
            eps_time: "2018-06-01 08:00:00",
            epe_time: "2018-06-01 16:00:00",
            ep_limit: 120,
            eq1_cnt: 10,
            eq1_val: 6,
            eq2_cnt: 10,
            eq2_val: 5
        }),  
        success: function (res) {  
            console.log(res)
            // window.location = "testRel.html";    
        }  
    }); 
}

function getTimeText(time){
    const minute = parseInt(Number(time) / 60) 
    const second = parseInt(Number(time) % 60) 
    const minuteTxt = minute < 10 ? '0' + minute : '' + minute
    const secondTxt = second < 10 ? '0' + second : '' + second
    return  minuteTxt + ' : ' + secondTxt
};

function setUserAnswer(id, key) {
    console.log('---------')
    console.log(id);
    console.log(key);
    answer = answer.filter(function(item){
        return item.id !== id
    })
    answer.push({id, userAnswerKey: key})
};

function sendUserAnswer(data) {
    console.log(data)
    console.log('---sendUserAnswer')
    $.ajax({  
        type: "post",  
        url: "https://dangjain.ishoubei.com:8443/exam/plan",  
        contentType : "application/x-www-form-urlencoded; charset=UTF-8",  
        data: $.param({
            user_id: "xuehaifeng",
            ep_name: "六盘水钟山区学习习近平智慧党建考试",
            ep_type: "一试一卷",
            eps_time: "2018-06-01 08:00:00",
            epe_time: "2018-06-01 16:00:00",
            ep_limit: 120,
            eq1_cnt: 10,
            eq1_val: 6,
            eq2_cnt: 10,
            eq2_val: 5
        }),  
        success: function (res) {  
            console.log(res)
            // window.location = "testRel.html";    
        }  
    });  
};