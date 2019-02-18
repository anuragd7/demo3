import { Injectable, Inject, EventEmitter } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import "rxjs/add/operator/do";
// import "rxjs";
import * as ApplicationSettings from "application-settings";
import * as platformModule from "tns-core-modules/platform"; //to get screen width to resize image
import { fromString } from "tns-core-modules/ui/gestures/gestures";

export interface Result {
  items: any[];
}

// import { ImageResult } from "../create-question/image-search/image-model";
// var LoadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;

@Injectable()
export class ImageSearchService {
  public imageResultx = new EventEmitter<any>();
  public imagePixabayEmitter = new EventEmitter<any>();
  public startSearchAt: number;
  public searchString: string;

  //for loading indicator
  // public loader = new LoadingIndicator();

  constructor(private http: HttpClient) {
    this.startSearchAt = 1;
  }

  public searchPhrase: string;

  public getImageSearchResult(value: string) {
    if (this.searchString === value) {
      console.log("this is the same search for " + value);

      this.startSearchAt = this.startSearchAt + 10;
    } else {
      this.searchString = value;
      this.startSearchAt = 1;
      console.log("this is a new search for " + value);
    }
    console.log("Next search starts at " + this.startSearchAt);
    console.log("THE PLATFORM IS " + platformModule.device.os);

    //sending the https request
    // const headers = new Headers({ "Content-Type": "application/json" });
    // const options = new RequestOptions({ headers: headers });
    // const valueSent = new HttpParams(value);
    // const myKey = "AIzaSyDW2KCmh_WsxrrlYGB_-e8hFsChhJNFMT0";
    const params = new HttpParams()
      .append("key", "AIzaSyDW2KCmh_WsxrrlYGB_-e8hFsChhJNFMT0")
      .append("cx", "018393489712562937455:lvr6nyqynuy")
      .append("searchType", "image")
      .append("imgType", "clipart")
      .append("safe", "high")
      .append("rights", "cc_publicdomain%2Ccc_attribute")
      .append("start", this.startSearchAt.toString())
      .append("q", value);

    // this.http
    //   .get(
    //     "https://www.googleapis.com/customsearch/v1?key=AIzaSyDW2KCmh_WsxrrlYGB_-e8hFsChhJNFMT0&cx=018393489712562937455:lvr6nyqynuy&searchType=image&imgType=clipart&safe=high&rights=cc_publicdomain%2Ccc_attribute&start=" +
    //       this.startSearchAt +
    //       "&q=" , { params: value }
    //   )
    //   .map(result => result.json())
    this.http
      .get<Result>("https://www.googleapis.com/customsearch/v1?", { params })
      .do(result => {
        console.log("image result is" + JSON.stringify(result));
        this.changeThumbnailDimensions(result);
      })
      .subscribe(
        result => {
          const self = this;
          const myImageArray = [];
          for (let key in result.items) {
            result.items[key].selected = false;
            console.log(
              "AFTER WIDTH " + result.items[key].image.thumbnailWidth
            );
            console.log(
              "AFTER HEIGHT" + result.items[key].image.thumbnailHeight
            );
            myImageArray.push(result.items[key]);
          }
          // self.loader.hide();

          console.log("Number of Images found is:", myImageArray.length);
          self.imageResultx.emit(myImageArray);
        },
        error => {
          alert(
            "Oops! There seems to be a problem getting images. Please try again in a few seconds."
          );
          // this.loader.hide();
        }
      );
  }

  public changeThumbnailDimensions(searchResult: any) {
    const screenWidth = platformModule.screen.mainScreen.widthPixels / 4;
    // tslint:disable-next-line:forin
    for (let key in searchResult.items) {
      console.log(
        "BEFORE WIDTH " + searchResult.items[key].image.thumbnailWidth
      );
      console.log(
        "BEFORE HEIGHT" + searchResult.items[key].image.thumbnailHeight
      );
      const scalingRatio: number =
        screenWidth / searchResult.items[key].image.thumbnailWidth;
      searchResult.items[key].image.thumbnailHeight =
        scalingRatio * searchResult.items[key].image.thumbnailHeight;
      searchResult.items[key].image.thumbnailWidth =
        scalingRatio * searchResult.items[key].image.thumbnailWidth;
    }
  }

  public firstSearch(value: string) {
    this.searchString = value;
    this.startSearchAt = 1;
    console.log("this is a new search for " + value);
    this.getImageSearchResult(value);
  }

  public nextSearch(value: string) {
    console.log("this is the same search for " + value);
    // this.startSearchAt = this.startSearchAt + 10;
    this.getImageSearchResult(value);
  }

  public getImageFromPixabay(imageNumber) {
    console.log("Image Number is " + imageNumber);
    // const valueSent = new URLSearchParams(imageNumber);
    // const headers = new Headers({ "Content-Type": "application/json" });
    // const options = new RequestOptions({ headers: headers });
    const params = new HttpParams()
      .set("key", "2981986-d3c98e6720f17319719d43b68")
      .set("id", imageNumber);
    this.http
      .get("https://pixabay.com/api/", { params })
      // this.http
      //   .get(
      //     "https://pixabay.com/api/?key=2981986-d3c98e6720f17319719d43b68&id=" +
      //       imageNumber
      //   )
      //   .map(res => res.json())
      // .do((res) => console.log("the Pixabay Image is " + res))
      .subscribe(res => {
        const self = this;
        const myImageArray = [];
        for (let key in res) {
          myImageArray.push(res[key]);
        }
        self.imagePixabayEmitter.emit(myImageArray);
      });
  }
}
