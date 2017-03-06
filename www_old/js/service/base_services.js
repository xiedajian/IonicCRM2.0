/**
 * Created by lin on 2016/4/26.
 */
/*  用户数据处理 */
angular.module('starter')
    .factory("BaseSer",function($http,$window,$ionicPopup,$ionicLoading,$rootScope,pageJump,$timeout,$compile,$sce){

        var alert = function(content,okTap){
            $ionicPopup.alert({
                title: '提示',
                content: '<div style="text-align:center">' + content + '</div>',
                buttons:[
                    {
                        text:'确定',
                        type:'button-positive',
                        onTap: function(e) {
                            if(typeof okTap === 'function'){
                                okTap(e);
                            }
                        }
                    }
                ]
            });
        };

        //ajax请求方法
        var ajax = function(confPara){
            var initConf = {
                url: '',
                type: 'POST',
                data : {},
                success: function (data) {},
                error : function (data) {}
            };
            var conf = angular.extend({},initConf,confPara);
            
            var token = $window.localStorage['auth_key'];
            var req = {
                method : conf.type,
                url : conf.url,
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'IPVP-APP-TOKEN' : token
                }
            };

            var tmpData = angular.copy(conf.data);
            if(conf.type === 'GET'){
                req.params = tmpData;
            }else {
                req.data = tmpData;
            }

            $http(req).success(function (response) {
                if(response.no == 3825){
                    if($window.localStorage['token_repeat']==1){
                        return;
                    }
                    $window.localStorage['token_repeat']=1;
                    alert(response.msg,function(){
                        $window.localStorage['token_repeat']='';
                    });
                    pageJump.go('login');
                }
                conf.success(response);
            }).error(function (response) {
                conf.error(response);
            });
        };
        
        var showRedConfirm = function(confPara){
            var initConf = {
                scope : $rootScope,
                title : '',
                content : '',
                ok : {
                    text:'确定',
                    onClick : function () {
                        $ionicLoading.hide();
                    }
                },
                okClass:'btn_red_block',
                cancel : {},
                cancelClass : 'btn_grey_block'
            };

            var conf = angular.extend({},initConf,confPara);
//          mask_content
            var tpl = '<div class="reset_psw_content"><h1>' + conf.title + '</h1><div>' + conf.content + '</div>' ;
            
            conf.scope.redConfirm = {};
            if(Object.keys(conf.ok).length){
                conf.scope.redConfirm.okClick =  conf.ok.onClick;
                tpl += '<button class="'+ conf.okClass +'" ng-click="redConfirm.okClick()">' + conf.ok.text +'</button>';
            }
            
            if(Object.keys(conf.cancel).length){
                conf.scope.redConfirm.cancelClick =  conf.cancel.onClick;
                tpl += '<button class="'+ conf.cancelClass +'" ng-click="redConfirm.cancelClick()">' + conf.cancel.text +'</button>';
            }
            
            tpl += '</div>';
            $ionicLoading.show({
                scope : conf.scope,
                template : tpl
            });
        };

        return {
            var_dump : function(obj){
                var description = "";
                for(var i in obj){
                    var property=obj[i];
                    description += (i + " = "+property+";\r\n");
                }
                alert(description);
            },
            uploadFile : function (conf) {
                uploadFile(conf);
            },
            getPhonePic : function (type, callback) {
                getPhonePic(type,callback);
            },
            alert : function (str,okTap) {
                alert(str,okTap);
            },

            ajax : function(conf){
                ajax(conf)
            },
            getRedConfirm : {
                show :function (conf) {
                    showRedConfirm(conf);
                },
                hide : function () {
                    $ionicLoading.hide();
                }
            },
            getCurrentUser:function (field) {
                var userData = angular.fromJson($window.localStorage['userdata']);
                if(userData) {
                    if(field === undefined){
                        return userData;
                    }else {
                        return userData[field];
                    }
                }
                else {
                    return null;
                }
            },
            editCurrentUser:function (obj) {
                var userData = angular.fromJson($window.localStorage['userdata']);
                userData = angular.extend({}, userData, obj);
                $window.localStorage['userdata'] = angular.toJson(userData);
                return userData; 
            },
            //判断是否到期 超期返回负值  expire_date : 2017-05-23
            daysBetween:function (expire_date) {
                var DateTwo=expire_date;
                var myDate=new Date();
                var DateOne=myDate.toLocaleDateString();
                var TwoMonth = DateTwo.substring(5,7);
                var TwoDay = DateTwo.substring(8,10);
                var TwoYear = DateTwo.substring(0,4);
                var cha=((Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear)-Date.parse(DateOne))/86400000);
                //console.log(cha);
                return cha; //如果为负值 则超期
            },
            //获取焦点
            getFocus:function (id) {
                $timeout(function () {
                    var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
                });
            },
            //查找字符的首字母
            find_initial:function (str) {
                if(str == "") return;
                var arrRslt = makePy(str);
                return arrRslt[0];//忽略多音字 取第一个读音
            },
            loading:function (op) {
                if(op=='show'){
                    $ionicLoading.show({
                        template: '正在加载数据<ion-spinner icon="ios-small"></ion-spinner>'
                    });
                    $timeout(function () {
                        $ionicLoading.hide();
                    }, 5000);
                    // var html='';
                    //  var template = angular.element.html(html);
                    //  var mobileDialogElement = $compile(template)($rootScope);
                    //  angular.element(document.getElementById('starter')).append(mobileDialogElement);
                }else {
                    // if (mobileDialogElement) {
                    //     mobileDialogElement.remove();
                    // }
                    $ionicLoading.hide();
                }
            },

            pop:function(obj,callback){//有个图标凸出弹框
                $rootScope.obj=obj;
              var html=' <div class="pop_panel flex_ul flex_center">'
                + '<div class="PopContent"> '
                +   ' <div class="content_img"><img  src="{{obj.img}}" class="img"/></div>'//内容图片
                  +  '<div class="{{obj.contentClass}}">'//内容样式
                   +'<h2 class="h2" ng-bind-html="obj.cHead|to_trusted"></h2>'//内容标题
                 +'<p class="p1" ng-bind-html="obj.content|to_trusted"></p>'//具体内容
                  +'</div>'
                +'<div class="pop_btn" ng-click="esc_alert()">{{obj.okText}}</div>'//确定按钮
                +   ' </div>'
                 +'</div>';
                 var template = angular.element(html);
                 var mobileDialogElement = $compile(template)($rootScope);
                 angular.element(document.getElementById('starter')).append(mobileDialogElement);


                 $rootScope.esc_alert=function () {
                     if (mobileDialogElement) {
                     mobileDialogElement.remove();
                     }
                     if (callback != undefined && callback != null && typeof callback == 'function') {
                         callback();
                     }
                 }
            },

            tip:function(obj,callback){//单个图片+ 一个确定+提示弹框
                $rootScope.obj=obj;
                var html='<div class="pop_panel flex_ul flex_center ">'
                    +'<div class="PopContent text-center">'
                    +'<div class="warm_tip"><img src="img/warm.png" class="img"/></div>'
                    +'<div class="oT_content">'
                   +' <div class="{{obj.class }}" ng-bind-html="obj.content|to_trusted"></div>'
                    +'</div>'
                    +'<div class="pop_btn"  ng-click="esc_alert()">好的</div>'
                   +' </div>'
                    +'</div>';

                var template = angular.element(html);
                var mobileDialogElement = $compile(template)($rootScope);
                angular.element(document.getElementById('starter')).append(mobileDialogElement);


                $rootScope.esc_alert=function () {
                    if (mobileDialogElement) {
                        mobileDialogElement.remove();
                    }
                    if (callback != undefined && callback != null && typeof callback == 'function') {
                        callback();
                    }
                }
            },
            tip_confirm:function(obj,callback,ok_callback,seletTime){//单个图片+ 一个确定+一个取消+提示弹框
                $rootScope.obj=obj;
                if(obj.okText == undefined || obj.okText == null  ||obj.okText == ""){//如果确定按钮文字没设置，就默认为 确定
                   obj.okText="确定";
                }
                var html='<div class="pop_panel flex_ul flex_center ">'
                    +'<div class="PopContent_c text-center">'
                    +'<div class="warm_tip"><img src="img/warm.png" class="img"/></div>'
                    +'<div class="oT_content">'
                    +' <div class="{{obj.class }}" ng-bind-html="obj.content|to_trusted"></div>'
                    +' <div class="{{obj.class1 }} "  ng-click="dateSettings()" ng-bind-html="obj.content1|to_trusted"></div>'
                    +'</div>'
                    +'<ul class="flex_ul flex_center tip_confirm_btn" >'
                    +'<li class="text_grey_80" ng-click="esc_alert()">取消</li>'
                    +'<li class="yellow" ng-click="tip_confirm_ok()">{{obj.okText}}</li>'
                    +'</ul>'
                    +' </div>'
                    +'</div>';

                var template = angular.element(html);
                var mobileDialogElement = $compile(template)($rootScope);
                angular.element(document.getElementById('starter')).append(mobileDialogElement);

                $rootScope.esc_alert=function () {//取消
                    if (mobileDialogElement) {
                        mobileDialogElement.remove();
                    }
                    if (callback != undefined && callback != null && typeof callback == 'function') {
                        callback();
                    }
                };

                $rootScope.tip_confirm_ok=function () {//确定
                    if (mobileDialogElement) {
                        mobileDialogElement.remove();
                    }
                    if (ok_callback != undefined && ok_callback != null && typeof ok_callback == 'function') {
                        ok_callback();
                    }
                };





            }
        };
    });
