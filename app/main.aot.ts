// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScript } from "nativescript-angular/platform-static";

import { AppModuleNgFactory } from "./app.module.ngfactory";

// import { AppModule } from "./app.module";
import * as firebase from "nativescript-plugin-firebase"; // AD SEP 10 - MOVED FIREBASE TO LOGINCOMPONENT
import { UserStatusService } from "./services/userStatus.service";

const deviceToken = "";
// if (firebase.ServerValue !== undefined) {
//     console.log("Firebase already there");
// } else {
//     firebase.init({
//         // Optionally pass in properties for database, authentication and cloud messaging,
//         // see their respective docs.
//         persist: true,
//         storageBucket: 'gs://quest-a4d78.appspot.com',
//         onAuthStateChanged: (data: any) => {
//             console.log("LOGIN STATUS in main is " + JSON.stringify(data));
//             if (data.loggedIn) {
//                 UserStatusService.token = data.user.uid;
//                 console.log("FROM FIREBASE INIT user's email address: " + (data.user.email ? data.user.email : "N/A"));
//             }
//             else {
//                 UserStatusService.token = "";
//             }
//         },
//     }).then(
//         function (instance) {
//             console.log("firebase.init done");
//         },
//         function (error) {
//             console.log("firebase.init error: " + error);
//         },

//     );
// }

platformNativeScript().bootstrapModuleFactory(AppModuleNgFactory);
