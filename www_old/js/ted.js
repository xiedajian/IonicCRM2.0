angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicGesture, $window, $interval) {

  var ox;//初始触摸时，图标x轴的位置
  var  min =  document.getElementById("min").offsetLeft;//最小向左滑动距离
  var max =  document.getElementById("range").clientWidth -2;//最大向左滑动距离
  $scope.timeTip="不限";
  $scope.onTouch = function($event){//触摸，获取初始位置
    ox = $event.target.offsetLeft;
  };
  $scope.onDrag = function($event,index){//拖拽发生函数
    var el = $event.target,
        dx = $event.gesture.deltaX,
        left = ox + dx ;
    if(left <=min){//如果向左滑动的距离小于最小向左滑动距离，则取最小值，也就是不动
      el.style.left = min + 'px';
      document.getElementById("tip").style.left = '-12px';
    }
    else if(left >=max){//如果向左滑动的距离大于最大向左滑动距离，则取最大值，也就是不动
        el.style.left = max + 'px';
        document.getElementById("time_range").style.width = max + 'px';
      }
    else{//否则就跟着图标动
        var tipLeft = document.getElementById("tip").clientWidth / 2 - 1;
        el.style.left = left + 'px';
        var percent=(left/max).toFixed(2) * 100;
        document.getElementById("time_range").style.width = left + 'px';//选中的长度
        document.getElementById("tip").style.left = left - tipLeft + 'px';//range上面图标的位置
        swich(percent);




    }


  };

   var range = function($event){
       var el = $event.target,
           dx = $event.gesture.deltaX,
           left = ox + dx ;
       if(left <=min){//如果向左滑动的距离小于最小向左滑动距离，则取最小值，也就是不动
           el.style.left = min + 'px';
       }
       else if(left >=max){//如果向左滑动的距离大于最大向左滑动距离，则取最大值，也就是不动
           el.style.left = max + 'px';
           document.getElementById("time_range").style.width = max + 'px';
       }
       else{//否则就跟着图标动
           el.style.left = left + 'px';
           document.getElementById("time_range").style.width = left + 'px';
           var percent=(left/max).toFixed(2) * 100;
           swich(percent);
       }
   }

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
    }


})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

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
        }
       BaseSer.pop(obj);

      }

      //页面跳转
      $scope.track=function(){
        pageJump.go("tab.account");//跳转去工作台
      }


    })

;
