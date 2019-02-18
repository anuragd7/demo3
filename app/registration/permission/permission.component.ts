import { Component } from "@angular/core";
import { Page } from "ui/page";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
import { topmost } from "ui/frame";

import { UserStatusService } from "../../services/userStatus.service";
import { prompt } from "ui/dialogs";

@Component({
    selector: "permission",
    moduleId: module.id,
    templateUrl: "./permission.component.html",

})

export class PermissionComponent {

    permissionStatus: boolean;

    constructor(
        private page: Page,
        private userStatusService: UserStatusService,
        private modalDialogParams: ModalDialogParams,
    ) {
    }

    public permissionGranted() {
        this.permissionStatus = true;
        this.userStatusService.setModalPermission(this.permissionStatus);
        this.closeModal();
    }

    public permissionRefused() {
        this.permissionStatus = false;
        this.userStatusService.setModalPermission(this.permissionStatus);
        this.closeModal();
    }

    public closeModal() {
        console.log("closeModal");
        const page = topmost().currentPage;
        if (page && page.modal) {
            page.modal.closeModal();
        }
    }
}
