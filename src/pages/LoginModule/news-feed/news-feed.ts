import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NewsDetailsComponent} from '../news-details/news-details';
/*
  Generated class for the NewsFeed page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-news-feed',
  templateUrl: 'news-feed.html'
})
export class  NewsFeedComponent{

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  newsFeedImg:boolean;
  setStyle(img){
    let style={
      'display': '-webkit-box',
      'webkitLineClamp': 0,
      'webkitBoxOrient': 'vertical',
      'overflow': 'hidden'

    };
    if(img){
      style.webkitLineClamp=2;
      }

    else {
      style.webkitLineClamp=4;
    }
    return style;
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewsFeedPage');

    this.newsFeedImg=true;



  }

  //转到会员详情页
  gotoNewsDetails() {
    this.navCtrl.push(NewsDetailsComponent);
    console.log(1);
  }



}
