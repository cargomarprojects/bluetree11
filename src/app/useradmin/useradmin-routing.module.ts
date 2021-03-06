import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModulemComponent } from './module/modulem.component';
import { ModulemEditComponent } from './module/modulem-edit.component';
import { MenuComponent } from './menu/menu.component';
import { MenuEditComponent } from './menu/menu-edit.component';
import { CompanyComponent } from './company/company.component';
import { CompanyEditComponent } from './company/company-edit.component';
import { BranchComponent } from './branch/branch.component';
import { BranchEditComponent } from './branch/branch-edit.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit.component';
import { RightsComponent } from './rights/rights.component';
import { RightsEditComponent } from './rights/rights-edit.component';
import { MailServerComponent } from './mailserver/mailserver.component';
import { MailServerEditComponent } from './mailserver/mailserver-edit.component';


const routes: Routes = [
  {path:'ModulePage', component : ModulemComponent},
  {path:'ModulemEditPage', component : ModulemEditComponent},
  {path:'MenuPage', component : MenuComponent },
  {path:'MenuEditPage', component : MenuEditComponent}  ,
  {path:'CompanyPage', component : CompanyComponent },
  {path:'CompanyEditPage', component : CompanyEditComponent }    ,
  {path:'BranchPage', component : BranchComponent },
  {path:'BranchEditPage', component : BranchEditComponent } ,
  {path:'UserPage', component : UserComponent },
  {path:'UserEditPage', component : UserEditComponent } ,
  {path:'RightsPage', component  : RightsComponent  },
  {path:'RightsEditPage', component : RightsEditComponent } ,

  {path:'MailServerPage', component  : MailServerComponent  },
  {path:'MailServerEditPage', component  : MailServerEditComponent  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdminRoutingModule { }
