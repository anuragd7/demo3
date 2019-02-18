import { Injectable } from "@angular/core";
import {
  getString,
  setString,
  remove,
  getNumber,
  setNumber
} from "application-settings";
import * as firebase from "nativescript-plugin-firebase";

export class SearchStatusService {
  public searchStatus: boolean = true;

  public setSearchingFrom(searchingFrom: string) {
    setString("searchingFrom", searchingFrom);
  }

  public getSearchingFrom() {
    return getString("searchingFrom");
  }

  // for storing all details of the last search like type, subject, grade etc
  public setLastSearch(searchObject: string) {
    setString("lastSearch", searchObject);
  }

  public getLastSearch() {
    return getString("lastSearch");
  }

  public removeLastSearch() {
    remove("lastSearch");
  }

  // for storing the filters visible on search results page
  public setFilters(filterObject: string) {
    setString("filters", filterObject);
  }

  public getFilters() {
    return getString("filters");
  }

  public removeFilters() {
    remove("filters");
  }

  // for storing whether the last search is through lessons or by a searchPhrase
  public setSearchType(searchType: string) {
    setString("searchType", searchType);
  }

  public getSearchType() {
    return getString("searchType");
  }

  public removeSearchType() {
    remove("searchType");
  }

  // for storing and getting the search phrase from application settings
  public setSearchPhrase(phrase: string) {
    setString("searchPhrase", phrase);
  }

  public getSearchPhrase() {
    return getString("searchPhrase");
  }

  public removeSearchPhrase() {
    remove("searchPhrase");
  }

  // for storing and getting the grades for the search phrase
  public setSearchGrades(phrase: string) {
    setString("searchGrades", phrase);
  }

  public getSearchGrades() {
    return getString("searchGrades");
  }

  public removeSearchGrades() {
    remove("searchGrades");
  }

  // for storing and getting the subjects for the search phrase
  public setSearchSubjects(phrase: string) {
    setString("searchSubjects", phrase);
  }

  public getSearchSubjects() {
    return getString("searchSubjects");
  }

  public removeSearchSubjects() {
    remove("searchSubjects");
  }

  // for storing streams from the last lesson search
  public setStreams(streamNames: string) {
    setString("streams", streamNames);
  }

  public getStreams() {
    return getString("streams");
  }

  public removeStreams() {
    remove("streams");
  }

  // for storing lessons from the last lesson search
  public setLessons(lessonNames: string) {
    setString("lessons", lessonNames);
  }

  public getLessons() {
    return getString("lessons");
  }

  public removeLessons() {
    remove("lessons");
  }

  // for storing and getting the search list scroll position
  public setListPosition(position: number) {
    setNumber("listPosition", position);
  }

  public getListPosition() {
    return getNumber("listPosition");
  }

  public removeListPosition() {
    remove("listPosition");
  }

  // for storing and getting the search phrase along with automatically appended elements like subjects
  // public setCompleteSearchString(phrase: string) {
  //     setString('completeSearchString', phrase);
  // }

  // public getCompleteSearchString() {
  //     return getString('completeSearchString');
  // }

  // public removeCompleteSearchString() {
  //     remove('completeSearchString');
  // }

  setComingToSearchFrom(comingToSearchFrom: string) {
    setString("comingToSearchFrom", comingToSearchFrom);
  }

  getComingToSearchFrom() {
    const comingToSearchFrom: string = getString("comingToSearchFrom");
    return comingToSearchFrom;
  }

  removeComingToSearchFromFrom() {
    remove("comingToSearchFrom");
  }

  setSearchResult(SearchResult: any) {
    setString("storedSearch", JSON.stringify(SearchResult));
  }

  getSearchResult() {
    // return getString("storedSearch");
    const storedSearch: string = getString("storedSearch");
    if (storedSearch) {
      return JSON.parse(storedSearch);
    }
  }

  removeSearchResult() {
    remove("storedSearch");
  }

  logSearchEvent(
    searchType: string,
    searchString: string,
    uid: string,
    email: string,
    // time: string,
    numberOfResults: string
  ) {
    const searchNumber =
      searchType + "-" + searchString + "-" + numberOfResults;
    firebase.analytics
      .logEvent({
        key: "search_done",
        parameters: [
          { key: "searchType", value: searchType },
          { key: "searchTerm", value: searchNumber },
          { key: "userId", value: uid },
          { key: "email", value: email }
          // { key: "searchTime", value: time }
          // { key: "numberOfResults", value: numberOfResults }
        ]
      })
      .then(() => console.log("Search event logged"));
  }

  logSearchError(
    searchTerm: string,
    uid: string,
    time: string,
    numberOfResults: string
  ) {
    firebase.analytics
      .logEvent({
        key: "search_error reported",
        parameters: [
          { key: "searchTerm", value: searchTerm },
          { key: "userId", value: uid },
          { key: "searchTime", value: time },
          { key: "numberOfResults", value: numberOfResults }
        ]
      })
      .then(() => console.log("Search ERROR logged"));
  }

  logFeedScreen() {
    firebase.analytics
      .setScreenName({ screenName: "Test List Screen" })
      .then(function() {
        console.log("On Test List Screen");
      });
  }

  logSearchScreen() {
    firebase.analytics
      .setScreenName({ screenName: "Search Results Screen" })
      .then(function() {
        console.log("On Search Results Screen");
      });
  }

  logDetailedTestScreen() {
    firebase.analytics
      .setScreenName({ screenName: "Detailed Test Screen" })
      .then(function() {
        console.log("On Detailed Test Screen");
      });
  }

  // for storing and getting the total number of search results returned for every new search
  public setTotalSearchResults(nbhits: number) {
    setNumber("totalResults", nbhits);
  }

  public getTotalSearchResults() {
    return getNumber("totalResults");
  }

  public removeTotalSearchResults() {
    remove("totalResults");
  }

  // for storing and getting the currently received number of search results returned for the current search
  public setCurrentSearchResults(hits: number) {
    setNumber("currentResults", hits);
  }

  public getCurrentSearchResults() {
    return getNumber("currentResults");
  }

  public removeCurrentSearchResults() {
    remove("currentResults");
  }

  // THWO METHODS FOR THE DETAILED TEST COMPONENT

  // CAPTURE THE QUESTION TO BE MODIFIED
  setQuestionSelected(questionSelected: string) {
    setString("questionSelected", questionSelected);
  }

  getQuestionSelected() {
    const questionSelected: string = getString("questionSelected");
    return questionSelected;
  }

  removeQuestionSelected() {
    remove("questionSelected");
  }
  // CAPTURE THE INDEX OF THE QUESTION TO BE MODIFIED

  public setQuestionIndex(index: number) {
    setNumber("questionIndex", index);
  }

  public getQuestionIndex() {
    return getNumber("questionIndex");
  }

  public removeQuestionIndex() {
    remove("questionIndex");
  }
}
