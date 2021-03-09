import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QtnRateComponent } from './qtnrate/qtnrate.component';
import { QtnRateEditComponent } from './qtnrate/edit/qtnrate-edit.component';
import { SalesJournalsComponent } from './salesjournals/salesjournals.component';
import { SalesJournalsEditComponent } from './salesjournals/edit/salesjournals-edit.component';
import { QtnLclComponent } from './qtnlcl/qtnlcl.component';
import { QtnLclEditComponent } from './qtnlcl/edit/qtnlcl-edit.component';
import { QtnFclComponent } from './qtnfcl/qtnfcl.component';
import { QtnFclEditComponent } from './qtnfcl/edit/qtnfcl-edit.component';
import { QtnAirComponent } from './qtnair/qtnair.component';
import { QtnAirEditComponent } from './qtnair/edit/qtnair-edit.component';


const routes: Routes = [
  { path : 'QuotationRatePage', component : QtnRateComponent },
  { path : 'QuotationRateEditPage', component : QtnRateEditComponent },
  { path : 'MarkContactsPage', component : SalesJournalsComponent },
  { path : 'SalesJournalsEditPage', component : SalesJournalsEditComponent },
  { path : 'QuotationLCLPage', component : QtnLclComponent },
  { path : 'QuotationLclEditPage', component : QtnLclEditComponent },
  { path : 'QuotationFCLPage', component : QtnFclComponent },
  { path : 'QuotationFclEditPage', component : QtnFclEditComponent },
  { path : 'QuotationAIRPage', component : QtnAirComponent },
  { path : 'QuotationAirEditPage', component : QtnAirEditComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }