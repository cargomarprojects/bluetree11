import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AiRoutingModule } from './ai-routing.module';
import { aiformatEditComponent } from './aiformat/aiformat-edit.component';
import { aiformatHeaderComponent } from './aiformat/aiformat-header.component';
import { aiformatComponent } from './aiformat/aiformat.component';
import { aidocsEditComponent } from './aidocs/aidocs-edit.component';
import { aidocsHeaderComponent } from './aidocs/aidocs-header.component';
import { aidocsComponent } from './aidocs/aidocs.component';
import { aiverifyComponent } from './aiverifiy/aiverify.component';
import { aiHblComponent } from './aiverifiy/hbl/aihbl.component';




@NgModule({
  declarations: [
    aidocsComponent,
    aidocsHeaderComponent,
    aidocsEditComponent,

    aiformatHeaderComponent,
    aiformatEditComponent,
    aiformatComponent,
    aiverifyComponent,
    aiHblComponent


  ],
  imports: [
    SharedModule,    
    AiRoutingModule
  ]
})
export class AiModule { }
