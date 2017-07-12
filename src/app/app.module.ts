import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule}from '@angular/http';
import {IonicStorageModule} from '@ionic/storage';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {NetworkComponent} from '../pages/SharedModule/network/network';

//native插件
import { AppMinimize } from '@ionic-native/app-minimize';
import {CodePush} from '@ionic-native/code-push';
import {CallNumber} from '@ionic-native/call-number';
import {AppVersion} from '@ionic-native/app-version';
import {Device} from '@ionic-native/device';
import {File} from '@ionic-native/file';
import {FileOpener} from '@ionic-native/file-opener';
import {Transfer} from '@ionic-native/transfer';
import {Network} from '@ionic-native/network';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

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
// import { PipesModule } from '../pipes/pipes.module';
// import {CustomerLevelTextPipe,CustomerLevelClassPipe} from '../pages/SharedModule/customer-level.pipe';
// import {HighlightPipe} from '../pages/SharedModule/highlight.pipe';
// import {HotBrandPipe} from '../pages/SharedModule/hot-brand.pipe';
// import {TrackStatusTextPipe,TrackResultTextPipe,TrackDateCalcTypePipe,CustomerStatusTextPipe} from '../pages/SharedModule/track-text.pipe';
// import {NumToTimePipe} from '../pipes/numtotimePipe';
// import {TrackResultPipe} from '../pipes/trackResultPipe';
// import {ContactTypePipe} from '../pipes/contactTypePipe';
// import {DataSubstringPipe} from '../pipes/dataSubstringPipe';
// import {notContactReasonPipe} from '../pipes/notContactReasonPipe';


//derective
import {HighlightDirective} from '../pages/SharedModule/highlight.directive';

// Component
import {ClearInputComponent} from '../components/clear-input/clear-input';

//页面出错
// import {ErrorPage} from '../pages/SharedModule/error/error';
// import {ServiceMaintenancePage} from '../pages/SharedModule/service-maintenance/service-maintenance';

@NgModule({
    declarations: [
        MyApp,
        NetworkComponent,

        //Directive
        HighlightDirective,

        //错误页面
        // ErrorPage,
        // ServiceMaintenancePage,

        //Pipe
        // CustomerLevelTextPipe,
        // CustomerLevelClassPipe,
        // HighlightPipe,
        // HotBrandPipe,
        // TrackStatusTextPipe,
        // TrackResultTextPipe,
        // TrackDateCalcTypePipe,
        // CustomerStatusTextPipe,
        // NumToTimePipe,
        // TrackResultPipe,
        // ContactTypePipe,
        // DataSubstringPipe,
        // notContactReasonPipe,

        //清除组件
        ClearInputComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        // PipesModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(MyApp, {
            tabsHideOnSubPages: true,
            //backButtonText: '返回',
            backButtonIcon: 'arrow-back',
            iconMode: 'ios',
            mode: 'ios',
            pageTransition: 'md-transition',
            pageTransitionDelay: 16,
            popoverEnter: 'picker-slide-in',
            popoverLeave: 'picker-slide-out',
            modalEnter: 'modal-slide-in',
            modalLeave: 'modal-slide-out',
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        NetworkComponent,

        //页面出错模块
        // ErrorPage,
        // ServiceMaintenancePage,

        //清除组件
        ClearInputComponent,
    ],
    providers: [
        AppMinimize,
        CodePush,
        AppVersion,
        CallNumber,
        Device,
        File,
        FileOpener,
        Transfer,
        Network,
        StatusBar,
        SplashScreen,
        // {provide: ErrorHandler, useClass: IonicErrorHandler},
        PopSer,
        HttpSer,
        CallSer,
        FileSer,
        NetworkSer,
        UpdateAppSer,
        AppInitSer,
        InterfaceLists,
        CustomerService,
        CRMService,
        DateService,
        CallNumberService
    ]
})
export class AppModule {
}
