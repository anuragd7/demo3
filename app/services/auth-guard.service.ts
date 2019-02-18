import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { UserStatusService } from "./userStatus.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate() {
    if (UserStatusService.isLoggedIn()) {
      return true;
    }
    else {
      this.router.navigate(["/main"]);
      return false;
    }
  }
}

