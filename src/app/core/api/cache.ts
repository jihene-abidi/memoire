import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})

export class CacheApi  {


  constructor(private  http: HttpClient) {  }



  removeMultipleItems(keys: string[], start: string) {
    const filteredKeys = keys.filter(key => key.startsWith(start));
    filteredKeys.forEach(key => {
      localStorage.removeItem(key);

    });
  }

  getAllKeys() {
    return Object.keys(localStorage);
  }



}
