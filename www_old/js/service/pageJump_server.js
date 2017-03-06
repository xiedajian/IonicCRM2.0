/**
 * Created by admin on 2016/6/24.
 */
angular.module('starter')
    .factory('pageJump', function($window ,$state, $ionicHistory, $ionicViewSwitcher){
        //返回对象
        var go_direction = function(pageName, para, direction){
            $state.go(pageName, para);
            if(direction==null || direction=='' || direction==undefined)
                direction = 'forwoard';
            $ionicViewSwitcher.nextDirection(direction);
        };
        return {
            go : function (pageName, para) {
                $state.go(pageName, para);
            },
	        go_direction : function (pageName, para, direction) {
		        go_direction(pageName, para, direction);
	        },
            go_back:function(){
                $ionicHistory.goBack();
	            $ionicViewSwitcher.nextDirection('back');
            },
            reload : function () {
                $state.reload();
            },
            back_mine_setting:function(){
                go_direction('mine_setting',{},'back');
            },
            back_mine:function(){
                go_direction('tab.mine',{},'back');

            }
        };
    });