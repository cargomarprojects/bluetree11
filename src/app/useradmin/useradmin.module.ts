import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserAdminRoutingModule } from './useradmin-routing.module';
import { ModulemComponent } from './module/modulem.component';
import { ModulemHeaderComponent } from './module/modulem-header.component';
import { ModulemEditComponent } from './module/modulem-edit.component';
import { MenuEditComponent } from './menu/menu-edit.component';
import { MenuComponent } from './menu/menu.component';
import { MenuHeaderComponent } from './menu/menu-header.component';
import { CompanyComponent } from './company/company.component';
import { CompanyEditComponent } from './company/company-edit.component';
import { CompanyHeaderComponent } from './company/company-header.component';
import { BranchComponent } from './branch/branch.component';
import { BranchEditComponent } from './branch/branch-edit.component';
import { BranchHeaderComponent } from './branch/branch-header.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit.component';
import { UserHeaderComponent } from './user/user-header.component';
import { RightsComponent } from './rights/rights.component';
import { RightsEditComponent } from './rights/rights-edit.component';
import { RightsHeaderComponent } from './rights/rights-header.component';
import { MailServerEditComponent } from './mailserver/mailserver-edit.component';
import { MailServerComponent } from './mailserver/mailserver.component';
import { MailServerHeaderComponent } from './mailserver/mailserver-header.component';

@NgModule({
  declarations: [
    ModulemComponent,
    ModulemHeaderComponent,
    ModulemEditComponent,
    MenuComponent,
    MenuHeaderComponent,
    MenuEditComponent,
    CompanyComponent,
    CompanyEditComponent,
    CompanyHeaderComponent,
    BranchComponent,
    BranchEditComponent,
    BranchHeaderComponent,
    UserComponent,
    UserEditComponent,
    UserHeaderComponent,
    RightsComponent,
    RightsHeaderComponent,
    RightsEditComponent,
    MailServerComponent,
    MailServerHeaderComponent,
    MailServerEditComponent,
  ],
  imports: [
    SharedModule,
    UserAdminRoutingModule,
  ]
})
export class UserAdminModule { }
