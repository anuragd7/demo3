import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular"; // for RadListView to work
import { ProfileComponent } from "./profile.component"; //CreateQuestionModule
import { profileRoutes } from "./profile-routing.module";

@NgModule({
    declarations: [
        ProfileComponent,
    ],
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(profileRoutes),
        NativeScriptFormsModule,
    ],
    exports: [
        NativeScriptRouterModule,
    ],
    schemas: [NO_ERRORS_SCHEMA],

})

export class ProfileModule { }
