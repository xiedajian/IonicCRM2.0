angular.module('starter.controllers', [])

    //工作台
    .controller('DeskCtrl', function($scope, $ionicGesture, $window, $interval,$ionicActionSheet,$timeout,pageJump,BaseSer) {

        //跳转至会员详情
        $scope.member_details=function(){
            pageJump.go("desk_m_details");
        };


       //购买
        var ox;//初始触摸时，图标x轴的位置
        var  min =  document.getElementById("min").offsetLeft;//最小向左滑动距离
        var max =  document.getElementById("range").clientWidth ;//最大向左滑动距离
        //购买次数
        $scope.bnum_l=0;//购买次数左边指针百分比
        $scope.bnum_r=1;//购买次数右边边指针百分比
        $scope.bl=0;//购买次数左边指针的left值
        $scope.br=max;//购买次数右边指针left值
        var maxBuy=20;//购买次数最大值
        $scope.bn_left=0;//购买次数左边指针的购买次数值
        $scope.bn_right=maxBuy;//购买次数右边购买次数值

        //平均客单价
        $scope.pl=0;//购买次数左边指针的left值
        $scope.pr=max;//购买次数右边指针left值
        var maxPrice=2000;//购买次数最大值
        $scope.p_left=0;//购买次数左边指针的购买次数值
        $scope.p_right=maxPrice;//购买次数右边购买次数值

        $scope.timeTip="不限";
        $scope.onTouch = function($event){//触摸，获取初始位置
            ox = $event.target.offsetLeft;
        };
        $scope.onDrag = function($event,index){//拖拽发生函数
            if(index==1){
                var p =rangePercent($event);//获取百分比
                $event.target.style.left=p * max -5 +'px'; //指针移动的距离
                document.getElementById("time_range").style.width = p * max +'px'; //选中的滑动条的颜色改变
                var tipLeft = document.getElementById("tip").clientWidth / 2 - 1;
                document.getElementById("tip").style.left = p * max - tipLeft + 'px';//range上面图标的位置
                swich(p*100);
            }
            if(index==2){
                $scope.bnum_l =rangePercent($event);//获取百分比
                $scope.bl= $scope.bnum_l * max;
                $scope.bn_left = Math.ceil($scope.bnum_l * maxBuy);//左边指针上面的数值
                $event.target.style.left=$scope.bl -5 +'px'; //指针移动的距离
                document.getElementById("bn_left").style.left= $scope.bl -16 +'px';
                Length($scope.bl,$scope.br,"buy_range");//滑动时线的长度

            }
            if(index==3){
                $scope.bnum_r =rangePercent($event);//获取百分比
                $scope.br= $scope.bnum_r * max -5;
                $scope.bn_right = Math.ceil($scope.bnum_r * maxBuy);
                $event.target.style.left= $scope.br  +'px'; //指针移动的距离
                document.getElementById("bn_right").style.right="initial";
                document.getElementById("bn_right").style.left=  $scope.br -11 +'px';
                Length($scope.bl,$scope.br,"buy_range");//滑动时线的长度
            }
            if(index==4){
                var price_l =rangePercent($event);//获取百分比
                $scope.pl= price_l * max;
                $scope.p_left = parseInt(price_l * maxPrice);
                $event.target.style.left=$scope.pl +'px'; //指针移动的距离
                document.getElementById("price_left").style.left= $scope.pl -11 +'px';
                Length($scope.pl,$scope.pr,"price_range");//滑动时线的长度

            }
            if(index==5){
                document.getElementById("price_right").style.right="initial";
                var price_r =rangePercent($event);//获取百分比
                $scope.pr= price_r * max;
                $scope.p_right = Math.ceil(price_r * maxPrice);
                $event.target.style.left= $scope.pr +'px'; //指针移动的距离

                document.getElementById("price_right").style.left=  $scope.pr -11 +'px';
                Length($scope.pl,$scope.pr,"price_range");//滑动时线的长度

            }
        };


        var Length = function(left,right,skipLength){
            if(right <= left ){
                document.getElementById(skipLength).style.left= right +'px';//选中的滑动条的左边位置
            }
            else
            {
                document.getElementById(skipLength).style.left= left +'px';//选中的滑动条的左边位置
            }
            var buylength = Math.abs(  right - left );
            document.getElementById(skipLength).style.width = buylength + 'px'; //选中的滑动条的颜色改变
        };


        var rangePercent = function($event){
            var el = $event.target,
                dx = $event.gesture.deltaX,
                left = ox + dx ;
            var percent;
            if(left <=min){//如果向左滑动的距离小于最小向左滑动距离，则取最小值，也就是不动
                el.style.left = min + 'px';
                percent= 0;
            }
            else if(left >=max){//如果向左滑动的距离大于最大向左滑动距离，则取最大值，也就是不动
                el.style.left = max + 'px';
                percent= 1;
            }
            else {//否则就跟着图标动
                percent = (left / max).toFixed(2);
            }
            return percent;
        };

        //时间范围函数调用
        var swich  = function(percent){
            switch(true)
            {
                case ( percent <= 0):
                    $scope.timeTip="不限";
                    break;
                case (1< percent && percent<17 ):
                    $scope.timeTip="昨天";
                    break;
                case (17< percent && percent<34):
                    $scope.timeTip="近7天";
                    break;
                case (34< percent && percent <= 51 ):
                    $scope.timeTip="本月";
                    break;
                case ( 51< percent && percent <= 68 ):
                    $scope.timeTip="近3个月";
                    break;
                case (68< percent && percent <= 85 ):
                    $scope.timeTip="近6个月";
                    break;
                case (85< percent  &&  percent<= 100 ):
                    $scope.timeTip="近12个月";
                    break;

                default:
                    break;
            }
        };


        ////清空筛选
        //$scope.del_selected=function(){
        //    $scope.bn_left=0;//购买次数左边指针的购买次数值
        //    $scope.bn_right=20;//购买次数右边购买次数值
        //    $scope.p_left=0;//购买次数左边指针的购买次数值
        //    $scope.p_right=2000;//购买次数右边购买次数值
        //};


        //拨打电话
        $scope.Tel_input=true;//电话是否有录入的指标
        $scope.call = function() {
            if( $scope.Tel_input===true){
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        { text: '<div class="btn_free">免费电话</div>' },
                        { text: '<div class="btn_normal">普通电话</div>' },
                        { text: '<div class="btn_track">已跟踪 </wbr><small>(使用其他方式跟踪过了，直接填写跟踪日志)</small></div>' }
                    ],
                    cancelText: '<div class="btn_cancel">取消</div>',
                    cancel: function() {
                        // add cancel code..
                    },
                    buttonClicked: function(index) {
                        return true;
                    }
                });

                //$timeout(function() {
                //    hideSheet();
                //}, 2000);

            }
            //没有录入电话时提示
            else{
                var  obj={
                    //class:'call_tip',
                    content:'<div style="font-size:15.5px;text-align: left"><span class="yellow">"张三丰"</span>电话还未录入收银系统中....</br>'
                    + '请联系管理员，将他的电话录入到收</br>'
                    + '银系统中，以便及时跟踪</br></div>'
                };

                BaseSer.tip(obj);
            }
        }


    })

    //工作台--是否联系和联系上，未联系上共用一个控制器
    .controller('desk_contact_Ctrl', function($scope, pageJump,BaseSer,$stateParams) {
        $scope.title="张三丰跟踪日志";

        $scope.n_track=function(){//打开下次跟踪弹窗
            $scope.next_track=true;
        };
        $scope.close=function(){//关闭下次跟踪弹窗
            $scope.next_track=false;
        };

        $scope.if_contact=true;//用其真假来区分未联系与联系上页面
        $scope.contactTitle="联系上";
        $scope.contact=function(){//进入联系上页面
            $scope.if_contact=true;//用其真假来区分未联系与联系上页面
            $scope.contactTitle="联系上";
            pageJump.go("desk_contact",{"if_contact":$scope.if_contact,"contactTitle":$scope.contactTitle});//跳转时，传参给未联系或联系的页面
        };
        $scope.U_contact=function(){//进入未联系页面
            $scope.if_contact=false;
            $scope.contactTitle="未联系上";//未联系上
            pageJump.go("desk_contact",{"if_contact":$scope.if_contact,"contactTitle":$scope.contactTitle});//跳转时，传参给未联系或联系的页面
        };
        $scope.if_contact=$stateParams.if_contact;
        $scope.contactTitle=$stateParams.contactTitle;//接收是否联系页面的参数，来确定是打开联系还是未联系页面

        //选择未联系上的原因
        $scope.select_reason=function(){
            $scope.pop_show=true;
        };

        //未联系上原因的取消按钮
        $scope.cancel=function(){
            $scope.pop_show=false;
        };

        //未联系上原因的确定按钮
        $scope.reason_ok='请选择';
        $scope.btn_ok=function(){
            $scope.pop_show=false;
            $scope.reason_ok=$scope.reason;
        };

        //选择未联系的原因
        $scope.index=3;//由这个来进行页面切换
        $scope.U_contact_reason=function(index){
            $scope.index=index;
            switch(index){
                case 1:$scope.reason="停机";
                    break;
                case 2:$scope.reason="电话号码错误";
                    break;
                case 3:$scope.reason="空号";
                    break;
                case 4:$scope.reason="无人接听";
                    break;
                case 5:$scope.reason="占线";
                    break;
                case 6:$scope.reason="其他";
                    break;
                default:break;
            }
        };


        $scope.goBack=function(){
            pageJump.go("desk_if_contact");

        };


        //日期选择插件

        $scope.pickedDate='2016-09-09';//下次跟踪日期的初始值
        var now = new Date();
        //    console.log(now.getFullYear(),now.getMonth(),now.getDate() + 1);
        $scope.datePickerSettings = {
            theme : 'ios',
            lang : 'zh',
            display :'bottom',
            startYear : now.getFullYear(),
            endYear : now.getFullYear() + 1,
            min: new Date(now.getFullYear(),now.getMonth(), now.getDate() + 1),
            defaultValue : new Date(now.getFullYear(),now.getMonth(), now.getDate()+1),
            dateFormat: 'yy-m-d',
            onChange: function (valueText) {
                var tmp = valueText.valueText.split('-');
                $scope.pickedDate = new Date(tmp[0], tmp[1]-1, tmp[2]);
                $scope.isPicked = '';
            },
            onCancel:function (valueText) {
                var tmp = valueText.valueText.split('-');
                $scope.pickedDate = new Date(tmp[0], tmp[1]-1, tmp[2]);
                //       console.log(valueText,$scope.pickedDate);
            }
        };



        //日志保存成功
        $scope.saveLog=function(){
            var obj={
                img:"img/saveLog.png",
                okText:"确定",
                contentClass:"oT_content s_log_content",
                cHead:"保存成功！"
            };
            var go_desk=function(){
                pageJump.go()
            }
            BaseSer.pop(obj);

        }




    })
        //工作台--会员详情
    .controller('desk_m_details_Ctrl', function($scope, pageJump,BaseSer,$window,$ionicActionSheet,$timeout,$ionicScrollDelegate) {
        $scope.title="张三丰";
        $scope.go_back=function(){//跳到工作台
            pageJump.go("tab.desk");
        };
        //跳动到消费记录
        $scope.go_record = function () {
            $ionicScrollDelegate.$getByHandle('record').scrollTo(0,737);;
        };


    var totalConsum =function(){//总消费结构图表函数
        $scope.width = $window.innerWidth + 'px';
        $scope.height = '300px';

        $scope.config = {
            dataLoaded: true
        };

        $scope.option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                //left:'15%',
                //right:'10%',
                bottom:'0',
                x: 'center',
                data:['雅培婴幼儿奶粉','花王纸尿裤','帮宝适纸尿裤','用品','服饰','玩具','其他']
            },
            series: [
                {
                    name:'总消费结构',
                    type:'pie',
                    radius: ['30%', '65%'],
                    selectedMode:'multiple',//可以多选
                    selectedOffset:'5',
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'inner',
                            formatter: '{c}'
                        },
                        emphasis: {
                            show: true,
                            position: 'inner',
                            formatter: '{c}'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    center:['50%','40%'],
                    data:[
                        {
                            value:1721,
                            name:'雅培婴幼儿奶粉',
                            itemStyle: {
                                normal: {
                                    color: '#18A0E5'//设置背景色
                                }
                            },
                            selected:true
                        },
                        {
                            value:986,
                            name:'花王纸尿裤',
                            itemStyle: {
                                normal: {
                                    color: '#AD5EDB'//设置背景色
                                }
                            },
                            selected:true
                        },
                        {
                            value:1236,
                            name:'帮宝适纸尿裤',
                            itemStyle: {
                                normal: {
                                    color: '#32B16C'//设置背景色
                                }
                            },
                            selected:true
                        },
                        {
                            value:1420,
                            name:'用品',
                            itemStyle: {
                                normal: {
                                    color: '#1764C1'//设置背景色
                                }
                            },
                            selected:true
                        },
                        {
                            value:1530,
                            name:'服饰',
                            itemStyle: {
                                normal: {
                                    color: '#F05C5C'//设置背景色
                                }
                            },
                            selected:true
                        },
                        {
                            value:2210,
                            name:'玩具',
                            itemStyle: {
                                normal: {
                                    color: '#FFC000'//设置背景色
                                }
                            },
                            selected:true
                        },
                        {
                            value:6341,
                            name:'其他',
                            itemStyle: {
                                normal: {
                                    color: '#CCCCCC'//设置背景色
                                }
                            }
                        }

                    ]
                }
            ]
        };
    };
    totalConsum();//总消费结构图表
    var trackEffect =function(){//跟踪效果
        $scope.width1 = $window.innerWidth + 'px';
        $scope.height1 = '300px';

        $scope.config1 = {
            dataLoaded: true
        };

        $scope.option1 = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                //left:'15%',
                //right:'10%',
                bottom:'5%',
                x: 'center',
                data:['已购买','未购买','待评估']
            },
            series: [
                {
                    name:'会员跟踪效果',
                    type:'pie',
                    radius: ['30%', '65%'],
                    selectedMode:'multiple',//可以多选
                    selectedOffset:'5',
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'inner',
                            formatter: '{c}' + '次'
                        },
                        emphasis: {
                            show: true,
                            position: 'inner',
                            formatter: '{c}' + '次'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    center:['50%','45%'],
                    data:[
                        {
                            value:1,
                            name:'已购买',
                            itemStyle: {
                                normal: {
                                    color: '#18A0E5'//设置背景色
                                }
                            },
                            selected:true
                        },
                        {
                            value:6,
                            name:'未购买',
                            itemStyle: {
                                normal: {
                                    color: '#FFC000'//设置背景色
                                }
                            },
                            selected:true
                        },
                        {
                            value:1,
                            name:'待评估',
                            itemStyle: {
                                normal: {
                                    color: '#CCCCCC'//设置背景色
                                }
                            }
                        }

                    ]
                }
            ]
        };
    }
    trackEffect();//会员跟踪效果图表

    $scope.manege={//管理方式、是否跟踪、下次跟踪时间
        manageWay:'系统智能管理跟踪时间',
        track:'可跟踪',
        canTrack:true//如果不可跟踪，则为false
    };
    $scope.if_track = function() {//是否可跟踪
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<div class="yellow border_b">可跟踪</div>' },
                { text: '<span class="yellow">不可跟踪</span>' }
            ],
            cancelText: '<span class="text_grey_80">取消</span>',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {//可跟踪弹窗
                var obj,ok_function;
                if(index===0){
                    if($scope.manege.manageWay=="人工管理"){
                        $scope.n_track=true;
                    }
                    else{
                        obj={
                            class :'p_tip',
                            content:'您确定将该会员修改可跟踪？'
                        };

                        ok_function =function(){//确定按钮函数

                        };
                        BaseSer.tip_confirm(obj);//初次选择

                    }

                    $scope.manege.track='可跟踪';
                    $scope.manege.canTrack=true;
                    hideSheet();
                }
                if(index===1){
                     obj={//不可跟踪
                        class :'p_tip',
                        content:'您确定将该会员修改为不可跟踪？'
                    };

                    ok_function =function(){//确定按钮函数
                        $scope.manege.track='不可跟踪';
                        $scope.manege.canTrack=false;

                    };
                    hideSheet();
                    BaseSer.tip_confirm(obj,'',ok_function);

                }

                return true;//不能去掉，不然弹窗无法删除

            }

        });

        //$timeout(function() {
        //    hideSheet();
        //}, 2000);

    };

        $scope.n_track=false;//选择跟踪时间弹窗
        $scope.select_n_time=function(){//打开选择跟踪时间
            $scope.n_track=true;
        };
        $scope.close=function(){//关闭跟踪时间
            $scope.n_track=false;
        };

        //日期选择插件
        $scope.pickedDate = '2016-09-09';
        var now = new Date();
        //    console.log(now.getFullYear(),now.getMonth(),now.getDate() + 1);
        $scope.datePickerSettings = {
            theme : 'ios',
            lang : 'zh',
            display :'bottom',
            startYear : now.getFullYear(),
            endYear : now.getFullYear() + 1,
            min: new Date(now.getFullYear(),now.getMonth(), now.getDate() + 1),
            defaultValue : new Date(now.getFullYear(),now.getMonth(), now.getDate()+1),
            dateFormat: 'yy-m-d',
            onChange: function (valueText) {
                //var tmp = valueText.valueText.split('-');
                //$scope.pickedDate = new Date(tmp[0], tmp[1]-1, tmp[2]);
                //$scope.isPicked = '';
            },
            onCancel:function (valueText) {
                //var tmp = valueText.valueText.split('-');
                //$scope.pickedDate = new Date(tmp[0], tmp[1]-1, tmp[2]);
            }
        };

       $scope.next_track=function(){
           if($scope.manege.canTrack === false){
               var obj={//选择时间文字
                   img:'img/next_track.png',
                   contentClass :'oT_content next_track_t',
                   cHead :'当前跟踪状态为不可跟踪，无法</br>选择下次跟踪时间！',
                   okText:'确定'
               };

               BaseSer.pop(obj);
           }

       };

        //管理方式
        $scope.manageWay = function() {//是否可跟踪
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: '<div class="yellow border_b">系统智能管理跟踪时间</div>' },
                    { text: '<span class="yellow">人工管理</span>' }
                ],
                cancelText: '<span class="text_grey_80">取消</span>',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    if(index===0){
                        if($scope.manege.manageWay === '系统智能管理跟踪时间'){
                            BaseSer.alert('您当前管理方式为系统智能管理跟踪时间 ，无需更改~');
                        }else{
                            $scope.manege.manageWay='系统智能管理跟踪时间';
                        }

                        hideSheet();//隐掉弹窗
                    }
                    if(index===1){
                        $scope.manege.manageWay='人工管理';
                        hideSheet();//隐掉弹窗
                    }
                    return true;//不能去掉，不然弹窗无法删除

                }

            });

            //$timeout(function() {
            //    hideSheet();
            //}, 2000);

        };

        //拨打电话
        $scope.Tel_input=false;//电话是否有录入的指标
        $scope.call = function() {
            if($scope.Tel_input === true){
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        { text: '<div class="btn_free">免费电话</div>' },
                        { text: '<div class="btn_normal">普通电话</div>' },
                        { text: '<div class="btn_track">已跟踪 </wbr><small>(使用其他方式跟踪过了，直接填写跟踪日志)</small></div>' }
                    ],
                    cancelText: '<div class="btn_cancel">取消</div>',
                    cancel: function() {
                        // add cancel code..
                    },
                    buttonClicked: function(index) {
                        var obj;
                        if(index===0){//普通电话
                             obj={
                                class:'call_tip',
                                content:'普通通话已被管理员禁用</br>请选择免费通话服务'
                            };
                            BaseSer.tip(obj);
                        }
                        if(index===1){//免费通话
                             obj={
                                class:'call_tip',
                                content:'免费通话服务暂不可用</br>通话分钟数余量不足，请联系管理员'
                            };
                            BaseSer.tip(obj);
                        }
                        if(index===2){//其他方式，现在先存放呼叫时弹窗
                            obj={
                                class:'call_tip',
                                content:'即将拨打"张三丰"电话....',
                                class1:'yellow',
                                content1:'请在与会员沟通时注意保持礼节',
                                okText:"继续呼叫"
                            };
                            var callOn=function(){//拨打动作

                            };
                            BaseSer.tip_confirm(obj,callOn);
                        }
                        return true;
                    }
                });

                //$timeout(function() {
                //    hideSheet();
                //}, 2000);



        }

        //没有录入电话时提示
        else{
           var  obj={
                //class:'call_tip',
                content:'<div style="font-size:15.5px;text-align: left"><span class="yellow">"张三丰"</span>电话还未录入收银系统中....</br>'
                        + '请联系管理员，将他的电话录入到收</br>'
                         + '银系统中，以便及时跟踪</br></div>'
            };

            BaseSer.tip(obj);
        }





        }





    })


    //我的
//Chat
.controller('MineCtrl', function($scope, Chats,pageJump,BaseSer,$window) {

    $scope.go_setting=function(){ //跳转去跟踪日志
        pageJump.go("mine_setting");
    }
    $scope.go_trackLog=function(){ //跳转去跟踪日志
        pageJump.go("mine_trackLog");
    }

    var Completion_month =function(){//本月完成率
        $scope.width = $window.innerWidth +40+ 'px';
        $scope.height = '200px';

        $scope.config = {
            dataLoaded: true
        };

        $scope.option = {
            tooltip : {
                trigger: 'axis'
            },
            grid: {
                //show:false,
                left: '-30',
                //right: '-30',
                top:10,
                bottom: '-15',
                containLabel: true,
                //width:  $scope.width +100
            },
            xAxis : [
                {
                    show:false,
                    type : 'category',
                    boundaryGap : false,
                    data : ['周一','周二','周三','周四','周五','周六','周日']
                }
            ],
            yAxis : [
                {
                    show:false,
                    type : 'value'
                }
            ],

            series : [
                {//折线不动的位置
                    name:'等级表',
                    type:'line',
                    lineStyle: {normal: {
                        color:'#F39800'
                    }},
                    areaStyle: {normal: {
                        color:'#F4D9AB',
                        opacity:1
                    }},

                    data:[30, 40, 42, 50, 55, 74.4, 90,100]
                },
                {//折线滑动的位置
                    name:'本月完成率',
                    type:'line',
                    lineStyle:{normal: {
                        color:'#F39800',
                        opacity:1
                    }},
                    areaStyle: {normal: {
                        color:'#F39800',
                        opacity:1

                    }},
                    markPoint : {

                        data : [
                            {
                                type : 'max',
                                name: '本月完成率',
                                itemStyle:{
                                    normal:{
                                        color:'#F39800'
                                    }
                                },
                                symbolSize:[60,60],
                                label:{
                                    normal:{
                                        formatter:'{c}%'
                                    }
                                }
                            }
                        ]
                    },
                    data:[30, 40, 42, 50, 55, 74.4]



                }

            ]

        };
    }
    Completion_month();//本月完成率

    //		由会员的购买人数判断点亮小人的多少
    var buyPeople=function(){
        $scope.BuyCountImgs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.src = []; //定义数组，纯粹一个数的话，后面的变量会改
        if($scope.VipBuyCount <= 100) {//人数未满100人
            var num = parseInt($scope.VipBuyCount / 10);//满10人的数目
            var extra = $scope.VipBuyCount % 10;//有余数时，即未满10人

            for (var i in $scope.BuyCountImgs) {
                if (i < num) {
                    $scope.src[i] = './img/gust_4.png';	//满10人
                }

                else {
                    $scope.src[i] = './img/gust_5.png';//没有人数时
                }
            }

            if(extra!=0){
                $scope.src[num]='./img/gust_extra.png';//未满10人
            }
        }

        else{
            var num = parseInt($scope.VipBuyCount / 100);//满100人的数目
            var extra = $scope.VipBuyCount % 100;//有余数时，即未满100人

            for (var i in $scope.BuyCountImgs) {
                if (i < num+1) {

                    $scope.src[i] = './img/full_100.png';	//满100人}

                }

                else {
                    $scope.src[i] = './img/gust_5.png';//没有人数时
                }
            }
            if(extra!=0){
                $scope.src[num]='./img/Less_than_100.png';//未满100人
            }

        }


    }
    $scope.VipBuyCount=20;
    buyPeople();

    //1个小人代表10个会员提示
    $scope.tip=function(){
        var obj={
            class:"p_tip",
            content:"图中1个小人图像代表10个会员"
        };
        BaseSer.tip(obj);

    };


  //$scope.chats = Chats.all();
  //$scope.remove = function(chat) {
  //  Chats.remove(chat);
  //};
})



    //我的--跟踪日志

    .controller('mine_trackLog_Ctrl', function($scope, pageJump,BaseSer) {
        $scope.title="跟踪日志与效果";
        $scope.go_back=function(){
            pageJump.go("tab.mine");
        }
    })

//我的--设置
    .controller('mine_setting_Ctrl', function($scope, pageJump,BaseSer) {
        $scope.title="设置";
        //返回我的页面
        $scope.go_back=function(){
            pageJump.go("tab.mine");
        }
        $scope.go_version=function(){//进入版本信息
            pageJump.go("mine_version");
        }

        $scope.md_pwd=function(){//进入修改密码
            pageJump.go("mine_md_pwd");
        }
    })

    //我的--设置--版本信息
    .controller('mine_version_Ctrl', function($scope, pageJump,BaseSer) {
        $scope.title="版本信息";
        $scope.go_back=function(){//返回设置页
            pageJump.go("mine_setting");
        }
    })
//我的--设置--版本信息
    .controller('mine_md_pwd_Ctrl', function($scope, pageJump,BaseSer) {
        $scope.title="修改密码";
        $scope.go_back=function(){//返回设置页
            pageJump.go("mine_setting");
        }
    })


//.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//  $scope.chat = Chats.get($stateParams.chatId);
//})

//.controller('AccountCtrl', function($scope) {
//  $scope.settings = {
//    enableFriends: true
//  };
//})

//进入管理页
    .controller('manage_Ctrl', function($scope,pageJump,BaseSer) {

      //使用到期弹窗，先写今日待跟踪哪里
      $scope.overUse=function(){
        var obj={
          img:"img/use_over.png",
          okText:"好的",
          contentClass:"oT_content",
          cHead:"使用已到期！",
          content:"请联系管理员续费客满分，以便及时跟踪。"
        };
       BaseSer.pop(obj);

      };

        //填写跟踪日志
        $scope.fillLog=function(){
            var obj={
                img:"img/fill_log.png",
                okText:"继续填写",
                contentClass:"oT_content fill_log",
                cHead:'您上次对于会员<span class="yellow">"张三丰"</span>跟踪日志</br>还未填写完成...',
            };
            var goContact =function(){
                pageJump.go('desk_if_contact');
            }
            BaseSer.pop(obj,goContact);

        };


      //页面跳转
      $scope.track=function(){
        pageJump.go("tab.account");//跳转去工作台
      }
    })


    //登录页面
    .controller('login_Ctrl', function($scope,pageJump,BaseSer) {
        //网络出错时
        $scope.net_erro=function(){
            var obj={
                class:"p_tip",
                content:"网络请求失败，请检查网络设置",
                okText:'重试'

            };
            BaseSer.tip_confirm(obj)

        };

        //进入工作台
        $scope.goLogin=function(){
           pageJump.go("manage");

        };





    })


//进入搜索页
    .controller('search_Ctrl', function($scope,pageJump,BaseSer) {

    });

