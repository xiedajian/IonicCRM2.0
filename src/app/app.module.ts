import {NgModule, ErrorHandler} from '@angular/core';
import { Storage } from '@ionic/storage';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';

//service
import {HttpSer} from '../providers/http-ser';
import {PopSer} from '../providers/pop-ser';
import {CallSer} from '../providers/call-ser';
import {FileSer} from '../providers/file-ser';
import {AppInitSer} from '../providers/appInit-ser';
import {InterfaceLists} from '../providers/interface_list';
import { UpdateAppSer }     from '../providers/updateApp-ser';
import { NetworkSer }     from '../providers/network-ser';
import {CustomerService} from '../pages/SharedModule/customer.service';
import {CRMService} from '../pages/SharedModule/crm.service';
import {DateService} from '../pages/SharedModule/date.service';
import {CallNumberService} from '../pages/SharedModule/callnumber.service';

//pipe
import {CustomerLevelTextPipe,CustomerLevelClassPipe} from '../pages/SharedModule/customer-level.pipe';
import {HighlightPipe} from '../pages/SharedModule/highlight.pipe';
import {HotBrandPipe} from '../pages/SharedModule/hot-brand.pipe';
import {TrackStatusTextPipe,TrackResultTextPipe,TrackDateCalcTypePipe,CustomerStatusTextPipe} from '../pages/SharedModule/track-text.pipe';
import {NumToTimePipe} from '../pipes/numtotimePipe';
import {TrackResultPipe} from '../pipes/trackResultPipe';
import {ContactTypePipe} from '../pipes/contactTypePipe';

//derective
import {HighlightDirective} from '../pages/SharedModule/highlight.directive';

//页面出错
import {ErrorPage} from '../pages/SharedModule/error/error';
import {ServiceMaintenancePage} from '../pages/SharedModule/service-maintenance/service-maintenance';

//登录模块
import {AccountDetailsComponent} from '../pages/LoginModule/account-details/account-details';
import {BeginGuideComponent} from '../pages/LoginModule/begin-guide/begin-guide';
import {ChangePasswordPage} from '../pages/LoginModule/change-password/change-password';
import {FindPasswordComponent} from '../pages/LoginModule/find-password/find-password';
import {LoginComponent} from '../pages/LoginModule/login/login';
import {SettingPasswordComponent} from '../pages/LoginModule/setting-password/setting-password';
import {SettingsPage} from '../pages/LoginModule/settings/settings';
import {TodayScheduleComponent} from '../pages/LoginModule/today-schedule/today-schedule';
import {VersionInfoPage} from '../pages/LoginModule/version-info/version-info';
import {NewsFeedComponent} from '../pages/LoginModule/news-feed/news-feed';
import {NewsDetailsComponent} from '../pages/LoginModule/news-details/news-details';

//跟踪模块
import { TrackingListComponent } from '../pages/TrackingModule/tracking-list/tracking-list';
import {SearchComponent} from '../pages/TrackingModule/search/search';
import {SearchMoreComponent} from '../pages/TrackingModule/search/search-more';
import {CustomerDetailsComponent} from '../pages/TrackingModule/customer-details/customer-details';
import {TrackingComponent} from '../pages/TrackingModule/tracking/tracking';
import {TrackingLogComponent} from '../pages/TrackingModule/tracking-log/tracking-log';
import {LogSavingComponent} from '../pages/TrackingModule/log-saving/log-saving';
import {NetworkComponent} from '../pages/SharedModule/network/network';

@NgModule({
    declarations: [
        MyApp,
        TabsPage,
        NetworkComponent,

        //登录模块
        AccountDetailsComponent,
        BeginGuideComponent,
        ChangePasswordPage,
        FindPasswordComponent,
        LoginComponent,
        SettingPasswordComponent,
        SettingsPage,
        TodayScheduleComponent,
        VersionInfoPage,
        NewsFeedComponent,
        NewsDetailsComponent,

        //跟踪模块
        TrackingListComponent,
        SearchComponent,
        CustomerDetailsComponent,
        TrackingComponent,
        LogSavingComponent,
        TrackingLogComponent,
        SearchMoreComponent,

        //Directive
        HighlightDirective,

        //错误页面
        ErrorPage,
        ServiceMaintenancePage,

        //Pipe
        CustomerLevelTextPipe,
        CustomerLevelClassPipe,
        HighlightPipe,
        HotBrandPipe,
        TrackStatusTextPipe,
        TrackResultTextPipe,
        TrackDateCalcTypePipe,
        CustomerStatusTextPipe,
        NumToTimePipe,
        TrackResultPipe,
        ContactTypePipe
    ],
    imports: [
        IonicModule.forRoot(MyApp,{
            //backButtonText: '返回',
            backButtonIcon:'arrow-back',
            iconMode: 'ios',
            mode:'ios',
            pageTransition:'md-transition',
            pageTransitionDelay:16,
            popoverEnter:'picker-slide-in',
            popoverLeave:'picker-slide-out',
            modalEnter:'modal-slide-in',
            modalLeave:'modal-slide-out',
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        TabsPage,
        NetworkComponent,
        //登录模块
        AccountDetailsComponent,
        BeginGuideComponent,
        ChangePasswordPage,
        FindPasswordComponent,
        LoginComponent,
        SettingPasswordComponent,
        SettingsPage,
        TodayScheduleComponent,
        VersionInfoPage,
        NewsFeedComponent,
        NewsDetailsComponent,
        //跟踪模块
        TrackingListComponent,
        SearchComponent,
        SearchMoreComponent,
        CustomerDetailsComponent,
        TrackingComponent,
        LogSavingComponent,
        TrackingLogComponent,

        //页面出错模块
        ErrorPage,
        ServiceMaintenancePage
    ],
    providers: [/*{provide: ErrorHandler, useClass: IonicErrorHandler},*/PopSer,HttpSer,CallSer,Storage,FileSer,NetworkSer,UpdateAppSer,AppInitSer,InterfaceLists,CustomerService,CRMService,DateService,CallNumberService]
})
export class AppModule {
}
