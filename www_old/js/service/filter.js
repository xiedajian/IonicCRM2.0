/**
 * Created by jane on 2016/12/2.
 */
//过滤器
angular.module('starter')
        .filter('to_trusted', ['$sce', function ($sce) {//转html
            return function (text) {
                return $sce.trustAsHtml(text);
                //return 1;
            }
        }])











;