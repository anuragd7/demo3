import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular"; // for RadListView to work
import { RegistrationComponent } from "./registration.component"; //CreateQuestionModule
import { registrationRoutes } from "./registration-routing.module";
import { ReactiveFormsModule } from "@angular/forms"; //  for form validation
import { PermissionComponent } from "./permission/permission.component";
import { SharedModule } from "../shared/shared.module";
import { SlidesModule } from "nativescript-ngx-slides";

@NgModule({
  declarations: [RegistrationComponent, PermissionComponent],
  entryComponents: [PermissionComponent],
  imports: [
    NativeScriptCommonModule,
    NativeScriptUIListViewModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forChild(registrationRoutes),
    NativeScriptFormsModule,
    ReactiveFormsModule,
    SharedModule,
    SlidesModule
  ],
  exports: [NativeScriptRouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class RegistrationModule {}
