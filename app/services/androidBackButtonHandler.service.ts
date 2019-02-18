import { Injectable, EventEmitter, NgZone } from '@angular/core';
import { remove, setBoolean, getBoolean } from "application-settings";

@Injectable()
export class AndroidBackButtonHandlerService {

    detailTestBackHandler = new EventEmitter<any>();
    showSearchResultHandler = new EventEmitter<any>();
    questionInputHandler = new EventEmitter<any>();
    questionTypeHandler = new EventEmitter<any>();
    myQuestionsHandler = new EventEmitter<any>();
    myMessagesHandler = new EventEmitter<any>();
    myProfileHandler = new EventEmitter<any>();
    homePageHandler = new EventEmitter<any>();


    emitDetailTestBackHandler() {
        this.detailTestBackHandler.emit({ source: 'detailTest' });
    }

    emitshowSearchResultHandler() {
        this.showSearchResultHandler.emit({ source: 'showSearchResult' });
    }

    emitQuestionInputHandler() {
        this.questionInputHandler.emit({ source: 'questionInput' });
    }

    emitQuestionTypeHandler() {
        this.questionTypeHandler.emit({ source: 'questionType' });
    }

    emitMyQuestionsHandler() {
        this.myQuestionsHandler.emit({ source: 'myQuestions' });
    }

    emitHomePageHandler() {
        this.homePageHandler.emit({ source: 'homePage' });
    }

    emitMyProfileHandler() {
        this.myProfileHandler.emit({ source: 'myProfile' });
    }

    emitMyMessagesHandler() {
        this.myMessagesHandler.emit({ source: 'myMessages' });
    }

    //to store if the user should exit app on pressing back button in android

    setExitApp(exit: boolean) {
        setBoolean('exitApp', exit);
    }

    getExitApp(): boolean {
        return getBoolean('exitApp');
    }

    removeExitApp() {
        remove('exitApp');
    }

    //to store if the app component tracking of back button has already been setup

    setBackTrack(track: boolean) {
        setBoolean('backTrack', track);
    }

    getBackTrack(): boolean {
        return getBoolean('backTrack');
    }

    removeBackTrack() {
        remove('backTrack');
    }
}
