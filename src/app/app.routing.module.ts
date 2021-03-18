
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './core/login/login.component';
import { Login2Component } from './core/login2/login2.component';
import { HomeComponent } from './core/home/home.component';
import { ReloadComponent } from './reload.component';

const routes: Routes = [
  { path: '', redirectTo : 'home', pathMatch : 'full'  },
  { path: 'login', component: LoginComponent },
  { path: 'login2', component: Login2Component },
  { path: 'home', component: HomeComponent },
  { path: 'reload', component: ReloadComponent },
  

  { path: 'Silver.Reports.General', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)},
  { path: 'Silver.Master', loadChildren: () => import('./master/master.module').then ( m => m.MasterModule)},  
  { path: 'Silver.SeaExport.Trans', loadChildren: () => import('./seaexport/seaexport.module').then(  m=> m.SeaExportModule)},  
  { path: 'Silver.AirExport.Trans', loadChildren: () => import('./airexport/airexport.module').then(m => m.AirExportModule)},  
  { path: 'Silver.SeaImport', loadChildren: () => import('./seaimport/seaimport.module').then( m =>m.SeaImportModule) }, 
  { path: 'Silver.AirImport.Trans', loadChildren:  () => import('./airimport/airimport.module').then(m => m.AirImportModule) }, 
  { path: 'Silver.Other.Trans', loadChildren: () => import('./other/other.module').then( m => m.OtherModule) }, 
  { path: 'Silver.USAccounts.Trans', loadChildren: () => import('./usaccounts/usaccounts.module').then( m => m.USAccountsModule) }, 
  { path: 'Silver.USAccounts.Master', loadChildren: () => import('./usaccounts/usaccounts.module').then( m => m.USAccountsModule) }, 
  { path: 'Silver.USAccounts.Reports', loadChildren: () => import('./usaccounts-reports/usaccounts-reports.module').then( m => m.UsAccountsReportsModule) }, 
  { path: 'Silver.Library', loadChildren: () => import('./shared/shared.module').then( m => m.SharedModule) }, 
  { path: 'Silver.BusinessModule', loadChildren: () => import('./business/business.module').then( m => m.BusinessModule) }, 
  { path: 'Silver.Marketing.Quotation', loadChildren: () => import('./marketing/marketing.module').then( m => m.MarketingModule) }, 
  { path: 'Silver.Marketing.Master', loadChildren: () => import('./marketing/marketing.module').then( m => m.MarketingModule) }, 
  { path: 'Silver.UserAdmin', loadChildren: () => import('./useradmin/useradmin.module').then( m => m.UserAdminModule) },  
  { path: 'Silver.ImportData', loadChildren: () => import('./importdata/importdata.module').then( m => m.ImportDataModule) },
  { path: 'reports', loadChildren: () => import('./reports/reports.module').then( m => m.ReportsModule) },  
  { path: 'seaexport', loadChildren: () => import('./seaexport/seaexport.module').then( m => m.SeaExportModule) },
  // { path: 'accounts', loadChildren: './accounts/accounts.module#AccountsModule' },
  
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

