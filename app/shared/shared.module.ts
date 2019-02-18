import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { ModalComponent } from "./modal/modal.component";

@NgModule({
  imports: [CommonModule, NativeScriptCommonModule],
  declarations: [
    ModalComponent,
  ],
  exports: [
    CommonModule,
    ModalComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}
