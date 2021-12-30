import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AiRoutingModule } from './ai-routing.module';
import { aiformatEditComponent } from './aidata/aiformat-edit.component';
import { aiformatHeaderComponent } from './aidata/aiformat-header.component';
import { aiformatComponent } from './aidata/aiformat.component';
import { aidocsEditComponent } from './aidocs/aidocs-edit.component';
import { aidocsHeaderComponent } from './aidocs/aidocs-header.component';
import { aidocsComponent } from './aidocs/aidocs.component';
import { aiverifyComponent } from './aiverifiy/aiverify.component';




@NgModule({
  declarations: [
    aidocsComponent,
    aidocsHeaderComponent,
    aidocsEditComponent,

    aiformatHeaderComponent,
    aiformatEditComponent,
    aiformatComponent,
    aiverifyComponent

  ],
  imports: [
    SharedModule,    
    AiRoutingModule
  ]
})
export class AiModule { }
