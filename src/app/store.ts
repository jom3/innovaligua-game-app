import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type LoginState = {
  userId: any;
  isLogged:boolean;
}

const initialState:LoginState = {
  userId:'',
  isLogged:false
}

export const LoginStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store)=>({
    setLogin(id:string):void{
      patchState(store,(state)=>({isLogged:true, userId:id}))
    },
    setLogout():void{
      patchState(store,(state)=>({isLogged:false, user:''}))
    }
  }))
)
