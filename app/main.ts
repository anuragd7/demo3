// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { AppModule } from "./app.module";
import * as firebase from "nativescript-plugin-firebase"; // AD SEP 10 - MOVED FIREBASE TO LOGINCOMPONENT
//import { BackendService } from "./services/backend.service";
import { UserStatusService } from "./services/userStatus.service";
// import { SplashComponent } from "~/splash.component";

// Anurag 7 April Start of code to set background color of Status bar on phone
// import * as application from "application";
// import * as platform from "platform";
// declare var android: any;

// if (platform.isAndroid && platform.device.sdkVersion >= "21") {
//   application.android.onActivityStarted = function () {
//     let window = application.android.startActivity.getWindow();
//     let decorView = window.getDecorView();
//     decorView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
//   }
// }
// Anurag 7 April End of code to set background color of Status bar on phone

const deviceToken = "";

// Aug 13 Anurag - testing moving firebase init to SplashComponent
// if (firebase.ServerValue !== undefined) {
//     console.log("Firebase already there");
// } else {
//     setTimeout(() => {
//         firebase.init({
//             // Optionally pass in properties for database, authentication and cloud messaging,
//             // see their respective docs.
//             persist: true,
//             storageBucket: 'gs://quest-a4d78.appspot.com',
//             onAuthStateChanged: (data: any) => {
//                 console.log("LOGIN STATUS in main is " + JSON.stringify(data));
//                 if (data.loggedIn) {
//                     UserStatusService.token = data.user.uid;
//                     console.log("FROM FIREBASE INIT user's email address: " + (data.user.email ? data.user.email : "N/A"));
//                 }
//                 else {
//                     UserStatusService.token = "";
//                 }
//             },
//             // onMessageReceivedCallback: (message) => {
//             //     this.routerExtensions.navigate(["../main/tab/2"]);
//             //     this.firebaseMessagingService.getMessageFromFirebase(message);
//             // },

//             // tslint:disable-next-line:object-literal-shorthand
//         }).then(
//             function (instance) {
//                 console.log("firebase.init done");
//                 // instance.getDatabase().setPersistenceEnabled(true);
//                 // console.log("persist is " + instance.)
//             },
//             function (error) {
//                 console.log("firebase.init error: " + error);
//             },

//         );
//     }, 1000);
// }

// **************** FIREBASE INITIALISING SECTION - MOVING TO LOGIN PAGE TO GET MESSAGING WORKING ON IOS
// firebase.init({
//   // Optionally pass in properties for database, authentication and cloud messaging,
//   // see their respective docs.
//   persist: true,
//   storageBucket: 'gs://quest-a4d78.appspot.com',
//   onAuthStateChanged: (data: any) => {
//     console.log("LOGIN STATUS in main is " + JSON.stringify(data));
//     if (data.loggedIn) {
//       //Soumen[17/06/17]: removing backend service
//       //BackendService.token = data.user.uid;
//       UserStatusService.token = data.user.uid;
//       console.log("FROM FIREBASE INIT user's email address: " + (data.user.email ? data.user.email : "N/A"));
//     }
//     else {
//       //Soumen[17/06/17]: removing backend service
//       //BackendService.token = "";
//       UserStatusService.token = "";
//     }
//   },
//   onMessageReceivedCallback: (message) => {
//     console.log(`Title: ${message.title}`);
//     console.log(`Body: ${message.body}`);
//     alert(`Message received Title: ${message.title}`);
//     // if your server passed a custom property called 'foo', then do this:
//     // console.log(`Value of 'foo': ${message.data.foo}`);
//   },

//   onPushTokenReceivedCallback: function(token) {
//   console.log("Firebase push token: " + token);
// }
// }).then(
//   function (instance) {
//     console.log("firebase.init done");
//   },
//   function (error) {
//     console.log("firebase.init error: " + error);
//   },

// );

platformNativeScriptDynamic({ startPageActionBarHidden: true }).bootstrapModule(
  AppModule
);
