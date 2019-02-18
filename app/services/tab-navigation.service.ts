import { Injectable, Inject, Output, EventEmitter } from '@angular/core';
import { RouterExtensions } from "nativescript-angular";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { getNumber, setNumber, remove } from "application-settings";

@Injectable()
export class TabNavigationService {
    androidBackEmitter = new EventEmitter<any>();

    constructor(
        private router: Router,
        private routerExtensions: RouterExtensions,
    ) {
    }

    goToTab(tab: number): void {
        this.setCurrentTab(tab);
        console.log("Going to tab zero. Tab number is: " + this.getCurrentTab());
        this.routerExtensions.navigate(["/main/tab/" + tab]);
    }

    goToTabWithClear(tab: number): void {
        this.setCurrentTab(tab);
        console.log("Going to tab zero. Tab number is: " + this.getCurrentTab());
        this.routerExtensions.navigate(["/main/tab/" + tab], { clearHistory: true });
    }

    goToMessageReceived(tab: number) {
        this.setCurrentTab(tab);
        const navigationParams: NavigationExtras = {
            queryParams: {
                selectedTab: 2,
            },
        };
        this.router.navigate(["/main/tab/" + tab], navigationParams);
    }

    goToTab0(tab: number): void {
        if (tab !== this.getCurrentTab()) {
            this.setCurrentTab(tab);
            console.log("in settab Current tab selected in maintab is: " + this.getCurrentTab());
        }
        console.log("IN NAVIGATION SERVICE");
        this.routerExtensions.navigate(["/main/tab/" + tab], { clearHistory: true });
    }

    setCurrentTab(tab: number) {
        setNumber('currentTab', tab);
    }

    getCurrentTab() {
        return getNumber('currentTab');
    }

    androidBackPressed() {
        this.androidBackEmitter.emit(0);
    }

}
