import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PhotoService {
  photoUploadBackendUrl =
    'https://storyimagesave.azurewebsites.net/api/HttpTriggerCSharp1?code=QP/nXo0T/Iys9LxgdesPbGI4Gl4rJgmFr2nai/ikCYYfnWZ2TSinJQ==';
  photoDeleteBackendUrl =
    'https://storyimagesave.azurewebsites.net/api/HttpDelete-Image?code=VaIlYTFDXaykD6XPOhnE2udxiUywOTHVhwL5hhOZEX2S98adLOftMg==';
  constructor(protected httpClient: HttpClient) {}

  uploadPhoto(base64String: string): Observable<string> {
    //  console.log(JSON.stringify(this.httpClient));
    return this.httpClient.post<string>(this.photoUploadBackendUrl, base64String);
  }
  deletePhoto(blobUrl: string): Observable<{}> {
    const blobname = blobUrl.split('/');
    return this.httpClient.post(this.photoDeleteBackendUrl, blobname[blobname.length - 1]);
  }
}
