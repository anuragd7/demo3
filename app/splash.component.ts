import { Component, OnInit } from "@angular/core";
import { Page } from "ui/page";
import { RouterExtensions } from "nativescript-angular/router/router-extensions";

import { UserStatusService } from "./services/userStatus.service";

// import { LoadingService } from "../services/loading.service";

import { TabNavigationService } from "./services/tab-navigation.service";

@Component({
  moduleId: module.id,
  selector: "app-splash",
  template: `
            <StackLayout backgroundColor="white" verticalAlignment="center">
              <Label text="HELLO"></Label>
            </StackLayout>
    `
})
export class SplashComponent implements OnInit {
  public authorizationStatus: string;

  constructor(
    private routerExtensions: RouterExtensions,
    private page: Page,
    private userStatusService: UserStatusService,
    private tabNavigationService: TabNavigationService
  ) {
    page.actionBarHidden = true;
   
    
  }

  ngOnInit() {
    const self = this;
    setTimeout(() => {
      console.log("Navigating to tab");
      self.tabNavigationService.goToTab0(0);
    }, 100);
  }
}
