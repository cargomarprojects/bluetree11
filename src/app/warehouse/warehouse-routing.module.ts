import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WhInwardComponent } from './inward/wh-inward.component';
import { WhInwardEditComponent } from './inward/edit/wh-inward-edit.component';
import { WhProductComponent } from './product/wh-product.component';
import { WhProductEditComponent } from './product/edit/wh-product-edit.component';
import { WhOutwardComponent } from './outward/wh-outward.component';
import { WhOutwardEditComponent } from './outward/edit/wh-outward-edit.component';
import { StockReportComponent } from './stockreport/stock-report.component';

const routes: Routes = [
  { path: 'WhInwardPage', component: WhInwardComponent },
  { path: 'WhInwardEditPage', component: WhInwardEditComponent },
  { path: 'WhProductPage', component: WhProductComponent },
  { path: 'WhProductEditPage', component: WhProductEditComponent },
  { path: 'WhOutwardPage', component: WhOutwardComponent },
  { path: 'WhOutwardEditPage', component: WhOutwardEditComponent },
  { path: 'StockReportPage', component: StockReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
