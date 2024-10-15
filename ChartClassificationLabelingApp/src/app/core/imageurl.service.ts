import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageurlService {

  constructor() { }

  baseUrl: string = 'https://kdavila.com/chart2023';

  getImageUrl(key:string, ext?: string): string {
    var pcm_id = key.split("___")[0];
    var extension = ext == null ? 'jpg' : ext;
    return `${this.baseUrl}/${pcm_id}/${key}.${extension}`;
  }

}
