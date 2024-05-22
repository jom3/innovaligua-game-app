import { HttpClient } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { Activity } from '../interfaces/activity.interface';
import { LoginStore } from '../../store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private _http = inject(HttpClient)
  readonly store = inject(LoginStore)

  getActivitiesByUser(): Observable<Activity[]>{
    return this._http.get<Activity[]>(`http://localhost:3000/api/activity/user/${this.store.userId()}`)
  }

  getActivity(id:string):Observable<Activity>{
    return this._http.get<Activity>(`http://localhost:3000/api/activity/${id}`)
  }

  checkActivity(id:string, score:number):Observable<any>{
    return this._http.patch<any>(`http://localhost:3000/api/activity/checked/${id}`, {score})
  }
}
