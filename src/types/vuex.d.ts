declare module 'vuex' {
  import { App } from 'vue'

  export function createStore<S>(options: any): any
  export function useStore<S = any>(): any

  export interface Store<S> {
    state: S
    getters: any
    dispatch: any
    commit: any
  }
}
