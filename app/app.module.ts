import {
  NgModule,
  NO_ERRORS_SCHEMA
  // NgModuleFactoryLoader
} from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import {
  NativeScriptRouterModule
} from "nativescript-angular/router";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { SlidesModule } from "nativescript-ngx-slides";

import { AppComponent } from "./app.component";
// import { SplashComponent } from "./splash.component";
import { routing, AppComponents } from "./app.routing";
import { SharedModule } from "./shared/shared.module";
import { AlphaCreateComponent } from "./feed/alphaCreate.component";
import { TestFeedComponent } from "./feed/testFeed.component";

import { FirebaseAuthService } from "./services/firebase-auth.service";
import { AuthGuard } from "./services/auth-guard.service";
import { UserStatusService } from "./services/userStatus.service";
import { ImageSearchService } from "./services/image-search.service";
import { AndroidBackButtonHandlerService } from "./services/androidBackButtonHandler.service";
import { SearchStatusService } from "./services/search-status.service";
import { HtmlStylingService } from "./services/html-styling.service";
import { DeviceDetailService } from "./services/device-detail.service";


//for applying different styles for tablet and phone as per tutorial
import { DeviceType } from "ui/enums";
import { device, isAndroid, isIOS } from "platform";
import * as application from "application";
import * as fs from "tns-core-modules/file-system";
import { setBoolean } from "application-settings";
import { TabNavigationService } from "./services/tab-navigation.service";
import { MinLengthDirective, IsEmailDirective } from "./shared/login.directive";
import { registerElement } from "nativescript-angular";
registerElement(
  "PreviousNextView",
  () => require("nativescript-iqkeyboardmanager").PreviousNextView
);
import "./bundle-config";

@NgModule({
  declarations: [
    AppComponent,
    ...AppComponents,
    AlphaCreateComponent,
    TestFeedComponent,
    MinLengthDirective,
    IsEmailDirective,
    // SplashComponent
  ],
  entryComponents: [
  ],
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptFormsModule,
    routing,
    NativeScriptUIListViewModule,
    SharedModule,
    NativeScriptHttpClientModule,
    SlidesModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    FirebaseAuthService,
    AuthGuard,
    UserStatusService,
    ImageSearchService,
    SearchStatusService,
    AndroidBackButtonHandlerService,
    TabNavigationService,
    HtmlStylingService,
    DeviceDetailService,
  ]
})
export class AppModule {
  constructor() {
    if (device.deviceType === DeviceType.Tablet) {
      setBoolean("isTablet", true);
      // if (isIOS) {
      const cssFileName = fs.path.join(
        fs.knownFolders.currentApp().path,
        "tablet.css"
      );
      fs.File.fromPath(cssFileName)
        .readText()
        .then((result: string) => {
          application.addCss(result);
        });
      console.log("tablet css is chosen");
    } else {
      setBoolean("isTablet", false);
      const cssFileName = fs.path.join(
        fs.knownFolders.currentApp().path,
        "phone.css"
      );
      fs.File.fromPath(cssFileName)
        .readText()
        .then((result: string) => {
          application.addCss(result);
        });
      console.log("phone css is chosen");
    }
  }
}
