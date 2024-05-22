import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Word } from '../interfaces/word.interface';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private _http = inject(HttpClient)

  getAllWord():Observable<Word[]>{
    return this._http.get<Word[]>('http://localhost:3000/api/words')
  }

}
