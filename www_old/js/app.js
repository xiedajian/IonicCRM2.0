// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','mobiscroll-datetime','ng-echarts'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  //dash
  .state('tab.desk', {//工作台
    url: '/desk',
    views: {
      'tab-dash': {
        templateUrl: 'templates/desk/index.html',
        controller: 'DeskCtrl'
      }
    }
  })

  .state('tab.mine', {//我的
      url: '/mine',
      views: {
        'tab-chats': {
          templateUrl: 'templates/mine/index.html',
          controller: 'MineCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  //进入管理台首页
  .state('manage', {
    url: '/manage',
    templateUrl: 'templates/index.html',
    controller: 'manage_Ctrl'
  })

  //搜索
  .state('search', {
    url: '/search',
    templateUrl: 'templates/desk/search.html',
    controller: 'search_Ctrl'
  })

  //我的--跟踪日志
  .state('mine_trackLog', {
    url: '/mine_trackLog',
    templateUrl: 'templates/mine/track_log.html',
    controller: 'mine_trackLog_Ctrl'
  })

  //我的--设置
      .state('mine_setting', {
        url: '/mine_setting',
        templateUrl: 'templates/mine/setting.html',
        controller: 'mine_setting_Ctrl'
      })

//我的--设置--版本号

      .state('mine_version', {
        url: '/mine_version',
        templateUrl: 'templates/mine/version.html',
        controller: 'mine_version_Ctrl'
      })

      //我的--设置--修改密码
      .state('mine_md_pwd', {
        url: '/mine_md_pwd',
        templateUrl: 'templates/mine/modify_pwd.html',
        controller: 'mine_md_pwd_Ctrl'
      })

      //工作台--是否联系上
      .state('desk_if_contact', {
        url: '/desk_if_contact',
        templateUrl: 'templates/desk/if_contact.html',
        controller: 'desk_contact_Ctrl'
      })

      //工作台--联系上(未联系上）
      .state('desk_contact', {
        url: '/desk_contact',
        params:{"if_contact":null,"contactTitle":null},
        templateUrl: 'templates/desk/contact.html',
        controller: 'desk_contact_Ctrl'
      })

      //工作台--会员详情
      .state('desk_m_details', {
        url: '/desk_m_details',
        templateUrl: 'templates/desk/member_details.html',
        controller: 'desk_m_details_Ctrl'
      })

  //登录页
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'login_Ctrl'
      })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/desk');

});
