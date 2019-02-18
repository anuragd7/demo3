import { PreloadAllModules } from "@angular/router";
import { SplashComponent } from "./splash.component";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { MainComponent, MainTabComponent } from "./shared/maintab/maintab.component";
import { AlphaCreateComponent } from "./feed/alphaCreate.component";
import { TestFeedComponent } from "./feed/testFeed.component";

import { AuthGuard } from "./services/auth-guard.service";

const AppRoutes: any = [
    // { path: "search-result", loadChildren: './questionselect/search-results.module#SearchResultsModule' },
    // { path: "create-question", loadChildren: './create-question/create-question.module#CreateQuestionModule' },
    // { path: "question-type", loadChildren: './question-type/question-type.module#QuestionTypeModule' },
    // { path: "detailed-test", loadChildren: './detailed-test/detailed-test.module#DetailedTestModule' },
    // { path: "registration", loadChildren: './registration/registration.module#RegistrationModule' },
    // { path: "splash", component: SplashComponent },
    {
        path: "main", component: MainComponent,
        children: [
            { path: "tab/0", component: TestFeedComponent },
            { path: "tab/1", component: AlphaCreateComponent },
            // { path: "tab/2", loadChildren: './messaging/messaging.module#MessagingModule' },
            { path: "tab/3", loadChildren: './profile/profile.module#ProfileModule' },
            { path: "", redirectTo: "tab/0", pathMatch: "full" },
        ],
    },
    { path: "", redirectTo: "main/tab/0", pathMatch: "full" },
];

export const routing = NativeScriptRouterModule.forRoot(AppRoutes, { preloadingStrategy: PreloadAllModules });
export const AppComponents: any = [
    MainTabComponent,
    MainComponent,
    // LoginComponent,
];
