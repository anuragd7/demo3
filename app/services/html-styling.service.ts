import { Injectable } from "@angular/core";

import * as htmlViewModule from "ui/html-view";
declare const android: any;
import * as fs from "file-system";

@Injectable()
export class HtmlStylingService {
    public path: any;

    constructor(
    ) {
        this.path = fs.knownFolders.currentApp().path;
    }

    setHtmlStyling(html) {
        console.log("html is" + html);
        const htmlNativeView = html.nativeView;
        console.log("html android is" + htmlNativeView);
        const typeface = android.graphics.Typeface.createFromFile(this.path + '/fonts/Bariol_Regular.otf');
        htmlNativeView.setTypeface(typeface);
        // const colorAndroid = new Color("#FF0000");
        htmlNativeView.setTextColor(0xff434d5b);
        htmlNativeView.setTextSize(16);
        htmlNativeView.setLineSpacing(0.0, 1.2);
    }

    setHtmlStylingTablet(html, fontsize) {
        console.log("html is" + html);
        const htmlNativeView = html.nativeView;
        console.log("html android is" + htmlNativeView);
        const typeface = android.graphics.Typeface.createFromFile(this.path + '/fonts/Bariol_Regular.otf');
        htmlNativeView.setTypeface(typeface);
        // const colorAndroid = new Color("#FF0000");
        htmlNativeView.setTextColor(0xff434d5b);
        htmlNativeView.setTextSize(fontsize);
        htmlNativeView.setLineSpacing(0.0, 1.2);
    }
}
