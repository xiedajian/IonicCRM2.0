import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceMaintenancePage } from './service-maintenance';

@NgModule({
  declarations: [
    ServiceMaintenancePage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceMaintenancePage),
  ],
  exports: [
    ServiceMaintenancePage
  ]
})
export class ServiceMaintenancePageModule {}
