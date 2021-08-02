import core from './modules/core'
import {createStore} from "vuex";

export const store = createStore({
   modules: {
      core,
   },
})
