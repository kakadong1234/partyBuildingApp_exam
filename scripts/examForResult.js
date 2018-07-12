let counter = 0; //定时运行次数 == 消耗时间秒数
let submitStatus = "未交卷"; //未交卷, 交卷中, 已交卷, 交卷失败
let answer = [];
const isForm = getQueryString('isFrom')
const er_id = getQueryString('er_id')
const user_id = getQueryString('user_id')
let ep_id;
let eq1_ids;
let eq2_ids;


var userInfo = {};
var url = location.href;

//  alert(location.href);
function initConst(info) {
    userInfo = info;
    user_id = userInfo.emplId
}



$(function () {
    //getUserInfo(url, initConst); //TODO
    console.log('er_id is ' + er_id + ', user_id is ' + user_id)
    initExamList();
})

function initExamList() {
    getExamData();
};

function getExamData() {
    //TODO
    $.get('https://dangjain.ishoubei.com/exam/test?er_id=' + er_id, function(data){
        console.log(data);
        eq1_ids = data.eq1_ids ;
        eq2_ids = data.eq2_ids ;
        ep_id = data.plan.ep_id;
        const exam = convertAPIDataToExam(data)
        //set selected
        exam.question = exam.question.map(function(item){
            item.qList.map(function(qItem){
                qItem.items.map(function(x){
                    if(qItem.uAnswer){
                        x.selected =  qItem.uAnswer === x.key
                    }
                    return x;
                })
                answer.push({id: qItem.id, userAnswerKey: qItem.uAnswer ? qItem.uAnswer : ''})
                return qItem;
            })
            return item
        })
        if(!exam.uScore && exam.remainingSecond <= 0){ //0分 --> 未答 或 未提交
            console.log('已过答题时间 将 status 设置为已考完')
            exam.status = '已考完'
        }
        console.log(exam.status)
        initListHeader(exam);
        initListBodyForExamed(exam);
        initListFooter(exam);
    });
};

function convertAPIDataToExam(data) {
    const exam = {
        examId: data.er_id,
        title: data.plan.ep_name,
        status: getStatus(data.er_state),
        remainingSecond: getRemainingSecond(data.plan.epe_time), 
        uScore: data.er_mark,
        question: getQuestions(data)
    };
    exam.totalScore = getTotalScore(exam.question);
    console.log(exam);
    return exam;
}

function getTotalScore(data){ 
    const allScore = data.map(function(item){
        return item.typeScore
    }).reduce(function(a,b){
        return a + b
    })
    return allScore;
}

function getStatus(status){ 
    return status === 5 ? "已考完" : "考试中" //考试中, 已考完
}

function getRemainingSecond(endTime){ 
    const endTimeStamp = newDate(endTime).getTime()
    const currentTimeStamp = Date.now()
    return parseInt((endTimeStamp - currentTimeStamp) / 1000); //剩余秒数 -- status === '考试中' 才有意义
}

function getQuestions(data){
    const questions = [];
    const sInfo = {
        indexTxt: '一',
        key: '选择题',
        averageScore: data.plan.eq2_val, //每题分数
        typeScore: data.plan.eq2_val * data.plan.eq2_cnt,//类型总分
        qList: getDetailQList(data.eq2_obj, data.eq2_res, data.eq2_ids, '选择题')
    };//选择题
    questions.push(sInfo)
    const jInfo = {
        indexTxt: '二',
        key: '判断题',
        averageScore: data.plan.eq1_val, //每题分数
        typeScore: data.plan.eq1_val * data.plan.eq1_cnt,//类型总分
        qList: getDetailQList(data.eq1_obj, data.eq1_res, data.eq1_ids, '判断题')
    };//判断题
    questions.push(jInfo)
    return questions;
}


function getDetailQList(data, res, sortIds, type){
    const rIdList = sortIds.split(","); //保证顺序一致
    console.log(res)
    const rResList = res.split(","); //保证顺序一致
    const qList = [];
    data.map(function(q){
        const item =  {
            id: q.eq_id,
            showIndex: getShowIndex(q.eq_id, rIdList),
            title: q.question,
            uAnswer: getUAnswer(q.eq_id, rIdList, rResList), //用户的答案
            answer: q.answer, //题目的 answer
        };
        item.items = getSelectItems(q, type, item.answer)
        item.isRight = item.uAnswer === item.answer //是否答题正确
        qList.push(item);
        return q;
    })
    return qList.sort(function(a,b) { //以显示顺序排序
        return a.showIndex - b.showIndex
    });
}

function getSelectItems(data, type, answer){
    let items = []
    if(type === '判断题'){
        items = [
            {
                key: 'V',
                value: ''
            },
            {
                key: 'X',
                value: ''
            }
        ]
    }
    else { //选择题
        items = [
        {
            key: 'A',
            value: data.op_a
        },
        {
            key: 'B',
            value: data.op_b
        },
        {
            key: 'C',
            value: data.op_c
        },
        {
            key: 'D',
            value: data.op_d
        }]
        
    }
   return items.map(function(item){
    item.isRightAnswer = item.key === answer
    return item
})
}

function getShowIndex(id, rIdList){
    let returnId;
    for(let i=0; i<rIdList.length; i++){
        if(Number(rIdList[i]) === id) {
            returnId = i + 1;
        }
    }
    console.log('----')
    console.log(returnId)
    return returnId;
}

function getUAnswer(id, rIdList, rResList){
    console.log(rResList)
    const list = [];
    for(let i=0; i<rIdList.length; i++){
        list.push({id: rIdList[i], res:rResList[i]})
    }
    console.log(list)
    console.log(list.find(function(item){
        return item.id === id;
    }))
    return list.find(function(item){
        return Number(item.id) === id;
    }).res
}

function getLastEqRes(answer, ids){
    const realAnswerList = [];
    ids.split(',').map(function(id){
        const userA = answer.find(function(item){
            return Number(item.id) === Number(id);
        }).userAnswerKey
        console.log(userA)
        realAnswerList.push(userA)
        return id
    })
    return realAnswerList.reduce(function(a,b){
         return a + ',' + b
    })
}

function initListHeader(exam) {
    var list_header_template = [
        '<div class="weui-panel weui-panel_access test">',
        '<div class="weui-panel__bd">',
        '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">',
        '<div class="weui-media-box__bd">',
        '<h4 class="weui-media-box__title">{{title}}</h4>',
        '<p class="weui-media-box__desc">（总分：{{totalScore}}分）</p>',
        '</div>',
        '</a>',
        '</div>',
        '</div>',
    ].join('');
    //初始化这个模板
    Mustache.parse(list_header_template);
    $("#list_header").html(Mustache.render(list_header_template, exam))
};

function initListBodyForExamed(exam) {
    const list_body_template = [
        '{{#data}}<div class="weui-panel weui-panel_access test">',
        '<div class="weui-panel__hd">{{indexTxt}}、{{key}} (每题{{averageScore}}分, 总共{{typeScore}}分)</div>',
        '<div class="weui-panel__bd">',
        '{{#qList}}<span href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">',
        '<div class="weui-media-box__bd">',
        '{{^isRight}}<img class="rel_img" src="../img/wrong.png"/>{{/isRight}}',
        '{{#isRight}}<img class="rel_img" src="../img/right.png"/>{{/isRight}}',
        '<p class="weui-media-box__desc">{{showIndex}}. {{title}}</p>',
        '<div class="weui-cells weui-cells_radio">',
        '{{#items}}<label class="weui-cell weui-check__label" for="radio{{id}}{{key}}">',
        '<div class="weui-cell__bd">',
        '{{#isRightAnswer}}<div class="item_answer_div">{{key}}. {{value}} </div>{{/isRightAnswer}}',
        '{{^isRightAnswer}}<div class="item_div">{{key}}. {{value}} </div>{{/isRightAnswer}}',
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
}

function initListFooter(exam) {
    let text = '';
    // if(exam.status === '已考完'){
        text = "得分: " + exam.uScore + "分";
        submitStatus = "已交卷"
    // }
    // else {
    //     const time  = Number(exam.remainingSecond) ;
    //     const timeTxt = getTimeText(time) 
    //     text = timeTxt + "&nbsp; &nbsp; 交&nbsp;卷";
    // }
    console.log(text)
    $("#btn-submit").html(text);
};

function finishExam(){
    //
    console.log(submitStatus)
    // console.log('重新考试')
    // window.location = 'test.html?ep_id=' + ep_id + '&user_id=' + user_id;
}

function setUserAnswer(id, key) {
    console.log('---------')
    console.log(id);
    console.log(key);
    // answer = answer.filter(function(item){
    //     return item.id !== id
    // })
    // answer.push({id, userAnswerKey: key})
    // console.log(answer)
    // loopUserAnswer()
};

function backToList() {
    if(isForm === 'myList') {
        window.location = 'myTestList.html'
    }

    if(isForm === 'center') {
        window.location = 'center.html'
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function newDate(strdate) {  
    var arr = strdate.split(/[- : \/]/);  
    console.log(arr);
    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);  
    return date;  
} 