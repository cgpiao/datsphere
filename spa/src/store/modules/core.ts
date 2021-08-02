import {
   M_CLEAR_STATE, M_CURRENT_FILE_SET,
   M_CURRENT_SET, M_FILE_DELETE,
   M_FILE_LIST_SET, M_FILE_RENAME, M_GOTO_FOLDER, M_PUSH_PATH,
   M_ROOT_SET,
   M_TOGGLE_FILE_TEXT
} from "../mutations";
import {FILE_CREATE, FILE_INDEX, FILE_UPDATE, FOLDER_CREATE} from "../actions";
import {ACTION_TYPE_FILE, ACTION_TYPE_FOLDER} from "../../constants";
import agent from "../../agent";

interface IState {
   root: Object|null;
   files: Array<IUserFile>;
   currentFolder: IUserFile|null;
   paths: Array<IUserFile>;
   textFileVisible: boolean;
   file: IUserFile|null,
}
interface IFile {
   cid: string|null;
   isDirectory: boolean;
   mime: string;
   size: number
}
interface IUserFile {
   id: number;
   originalName: string|null;
   file: IFile
}
const state = (): IState => {
   return {
      root: null,
      files: [],
      currentFolder: null,
      paths: [],
      textFileVisible: false,
      file: null
   }
}

const getters = {
}

const mutations = {
   [M_ROOT_SET](state: IState, folder: Object) {
      state.root = folder
   },
   [M_FILE_LIST_SET](state: IState, files: Array<IUserFile>) {
      state.files = files
   },
   [M_CURRENT_SET](state: IState, folder: IUserFile) {
      state.currentFolder = folder
   },
   [M_CLEAR_STATE](state: IState) {
      state.textFileVisible = false
      state.file = null
   },
   [M_CURRENT_FILE_SET](state: IState, file: IUserFile) {
      state.file = file
   },
   [M_TOGGLE_FILE_TEXT](state: IState) {
      state.textFileVisible = !state.textFileVisible
   },
   [M_PUSH_PATH](state: IState, folder: IUserFile) {
      state.paths = [...state.paths, folder]
   },
   [M_GOTO_FOLDER](state: IState, data: {index: number}) {
      state.paths.splice(data.index, state.paths.length)
   },
   [M_FILE_DELETE](state: IState, ufid: number) {
      let index = state.files.findIndex(f => f.id === ufid)
      state.files.splice(index, 1)
   },
   [M_FILE_RENAME](state: IState, payload: {file: IUserFile, newName: string}) {
      let index = state.files.findIndex(f => f.id === payload.file.id)
      state.files[index].originalName = payload.newName
   }
}

const actions = {
   [FILE_INDEX]({commit}, {folder, from}) {
      if (from) {
         agent.files.index({from}).then(resp => {
            commit(M_FILE_LIST_SET, resp.data)
         })
      } else {
         agent.files.index({folder}).then(resp => {
            commit(M_FILE_LIST_SET, resp.data)
         })
      }

   },
   [FOLDER_CREATE]({state}, name) {
      let params = {
         fileName: name,
         parent: state.currentFolder.id,
         actionType: ACTION_TYPE_FOLDER
      }
      return agent.files.create(params)
   },
   [FILE_CREATE]({state}, {name, content}) {
      let params = {
         fileName: name,
         content,
         parent: state.currentFolder.id,
         actionType: ACTION_TYPE_FILE
      }
      return agent.files.create(params)
   },
   [FILE_UPDATE]({state}, {name, content}) {
      let params = {
         fileName: name,
         content,
      }
      return agent.files.update(state.file.id, params)
   },
}


export default {
   state,
   getters,
   mutations,
   actions,
}
