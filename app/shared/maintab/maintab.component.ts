import { Component, Input, OnInit, OnDestroy, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { Router } from "@angular/router";
import { TabNavigationService } from "../../services/tab-navigation.service";
// import { FirebaseMessagingService } from "../../services/firebase-messaging.service";
import { Subscription } from "rxjs/Subscription";
import { AndroidBackButtonHandlerService } from "../../services/androidBackButtonHandler.service";
import { isAndroid } from "platform";
import * as application from "application";
import { Page } from "ui/page";
declare var android: any;

@Component({
    selector: "maintab",
    moduleId: module.id,
    templateUrl: "./maintab.component.html",
})
export class MainTabComponent implements OnInit, OnDestroy {

    selected: number;
    messageSubscription: Subscription;
    public messagesNumber: number;
    public messagesNumberText: string;
    public mainBackButtonHandler: Subscription;

    constructor(
        private tabNavigationService: TabNavigationService,
        // private firebaseMessagingService: FirebaseMessagingService,
        private ngZone: NgZone,

    ) {
        console.log("Constructor of maintab is called");
        if (this.tabNavigationService.getCurrentTab() !== undefined &&
            this.tabNavigationService.getCurrentTab() !== null) {
            this.selected = this.tabNavigationService.getCurrentTab();
        } else {
            this.tabNavigationService.setCurrentTab(0);
            this.selected = 0;
        }
    }

    ngOnInit() {
        const self = this;
        //Subscribing android back button event emitter.
        if (!this.mainBackButtonHandler || this.mainBackButtonHandler.closed) {
            this.mainBackButtonHandler = this.tabNavigationService.androidBackEmitter.subscribe((tab) => {
                self.changeTab(tab);
            });
        }

        this.selected = this.tabNavigationService.getCurrentTab();

    }

    ngOnDestroy() {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
                data.cancel = true;
            });
        }
    }

    changeTab(tab) {
        const self = this;
        this.tabNavigationService.setCurrentTab(tab);
        this.selected = tab;
        this.tabNavigationService.goToTab(tab);
        if (tab === 2) {
            setTimeout(() => {
                self.messagesNumber = 0;
                self.messagesNumberText = self.messagesNumber.toString();
            }, 200);
        }
    }
}

@Component({
    selector: "main",
    moduleId: module.id,

    template: `<StackLayout>
                    <GridLayout rows="*, auto">
                    <GridLayout row="0">
                        <router-outlet></router-outlet>
                    </GridLayout>
                    <GridLayout row="1" backgroundColor="#ff415e">
                        <StackLayout>
                            <maintab></maintab>
                        </StackLayout>
                    </GridLayout>
                </GridLayout>
                </StackLayout>`,

})
export class MainComponent {
    backButtonSetup: any;

    constructor(
        private androidBackButtonHandlerService: AndroidBackButtonHandlerService,
        private router: Router,
        private page: Page,
        private tabNavigationService: TabNavigationService,
        private routerExtensions: RouterExtensions,
    ) {
        const self = this;
        console.log("Currently in Main Component");
        this.page.on(Page.loadedEvent, (event) => {
            if (application.android && !this.backButtonSetup) {
                this.androidBackButtonHandlerService.setExitApp(false);
                setTimeout(() => {
                    this.backButtonSetup = application.android.on(
                        application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
                            if (this.router.isActive("/main", false)) {
                                console.log("recognise main tab in router");
                                const tabNum = this.tabNavigationService.getCurrentTab();
                                switch (tabNum) {
                                    case 0: {
                                        if (!this.androidBackButtonHandlerService.getExitApp()) {
                                            data.cancel = true;
                                            this.androidBackButtonHandlerService.emitHomePageHandler();
                                        }
                                        else {
                                            console.log("SHOULD EXIT APP AFTER THIS");
                                            //the next line calls the native android function to kill the app
                                            android.os.Process.killProcess(android.os.Process.myPid());
                                        }
                                        break;
                                    }
                                    case 1: {
                                        data.cancel = true;
                                        this.androidBackButtonHandlerService.emitMyQuestionsHandler();
                                        break;
                                    }
                                    case 2: {
                                        data.cancel = true;
                                        this.androidBackButtonHandlerService.emitMyMessagesHandler();
                                        break;
                                    }
                                    case 3: {
                                        data.cancel = true;
                                        this.androidBackButtonHandlerService.emitMyProfileHandler();
                                        break;
                                    }
                                }
                            }
                        }
                    );
                }, 10);

            }
        });
        this.page.on(Page.unloadedEvent, (event) => {
            if (application.android) {
                application.android.off(application.AndroidApplication.activityBackPressedEvent, (data: application.AndroidActivityBackPressedEventData) => {
                    data.cancel = true;
                    self.backButtonSetup = undefined;
                });
            }
        });
    }

}
