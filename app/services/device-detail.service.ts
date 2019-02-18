import { Injectable, Inject, EventEmitter } from "@angular/core";
import * as ApplicationSettings from "application-settings";
import * as platformModule from "tns-core-modules/platform"; //to get screen width to resize image

@Injectable()
export class DeviceDetailService {
  public deviceScreen: {
    height: number;
    width: number;
  };

  currentPlatform: string;
  constructor() {
    this.deviceScreen = {
      height: platformModule.screen.mainScreen.widthDIPs,
      width: platformModule.screen.mainScreen.heightDIPs
    };
    if (platformModule.isAndroid) {
      this.currentPlatform = "Android";
    } else {
      this.currentPlatform = "IOS";
    }
  }
}
