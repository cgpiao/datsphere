<template>
   <div class="drive flex-col p-md overflow-y-scroll box-border"
        :style="{height: `${window.innerHeight - appHeaderHeight}px`}">
      <div class="flex-row justify-between items-center">
         <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="() => handleClickBreadCrumb(0)">
               My Drive
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(path, index) in paths" :key="path.id"
                                @click="() => handleClickBreadCrumb(index + 1, path)">
               {{ path.originalName }}
            </el-breadcrumb-item>
         </el-breadcrumb>
         <div class="flex">
            <input type="file" style="display: none" id="upload-file"
                   @change="handleFileChange"/>
            <input type="file" style="display: none" id="upload-folder" webkitdirectory
                   mozdirectory
                   @change="handleFolderChange"/>
            <el-dropdown split-button trigger="click" size="medium" @command="handleUploadCommand">
               <i class="el-icon-upload2"/>
               <span class="mx-sm">Upload</span>
               <template #dropdown>
                  <el-dropdown-menu>
                     <el-dropdown-item command="file">File</el-dropdown-item>
                     <el-dropdown-item command="folder">Folder</el-dropdown-item>
                     <el-dropdown-item command="hash" divided>IPFS CID</el-dropdown-item>
                  </el-dropdown-menu>
               </template>
            </el-dropdown>
            <el-dropdown trigger="click" split-button size="medium" class="ml-md" type="primary"
                         @command="handleCreateCommand">
               <i class="el-icon-plus"/>
               <span class="mx-sm">Create</span>
               <template #dropdown>
                  <el-dropdown-menu>
                     <el-dropdown-item command="file">Text File</el-dropdown-item>
                     <el-dropdown-item command="folder">Folder</el-dropdown-item>
                  </el-dropdown-menu>
               </template>
            </el-dropdown>
         </div>
      </div>
      <div class="flex-row flex-1">
         <div class="flex-1 flex-col" @click="clearState">

            <el-table
               class="file-list mt-md"
               row-class-name="file"
               :key="tableKey"
               :data="files"
            >
               <el-table-column
                  prop="originalName"
                  label="Name">
                  <template #default="scope">
                     <div
                        :class="{'file-name': true, 'is-folder': scope.row.file === null, 'is-text': scope.row.file && scope.row.file.mime.includes('text')}"
                        @click.stop="()=>handleClickFile(scope.row)">
                        <img src="../../assets/images/ic_folder.png" style="width: 2em"
                             v-if="scope.row.file === null"/>
                        <img src="../../assets/images/ic_file_text.png" style="width: 2em"
                             v-else-if="scope.row.file && scope.row.file.mime.includes('text')"/>
                        <img src="../../assets/images/ic_file.png" style="width: 2em" v-else/>
                        <span class="ml-sm">
                           {{ scope.row.originalName }}
                        </span>
                     </div>
                  </template>
               </el-table-column>
               <el-table-column
                  label="IPFS CID"
                  width="440">
                  <template #default="scope">
                     <div v-if="scope.row.file && scope.row.file.cid" class="flex-row items-center">
                        <span>{{scope.row.file.cid}}</span>
                        <i class="el-icon-copy-document ml-sm pointer" @click="()=>copyCid(scope.row.file.cid)"/>
                     </div>
                  </template>
               </el-table-column>
               <el-table-column
                  label="File Size"
                  width="180">
                  <template #default="scope">
                     <div v-if="scope.row.file">
                        {{niceBytes(scope.row.file.size)}}
                     </div>
                  </template>
               </el-table-column>

               <el-table-column
                  fixed="right"
                  label=""
                  width="240">
                  <template #default="scope">
                     <span class="text-primary text-sm pointer" @click.stop="()=>handleDownload(scope.row)">
                        Download
                     </span>
                     <el-dropdown size="medium" @command="handleMoreAction" trigger="click"
                                  class="ml-md">
                        <i class="el-icon-more"/>
                        <template #dropdown>
                           <el-dropdown-menu>
                              <el-dropdown-item :command="{action: 'rename', target: scope.row}"
                                                divided>
                                 <span class="">Rename</span>
                              </el-dropdown-item>
                              <el-dropdown-item :command="{action: 'delete', target: scope.row}"
                                                divided>
                                 <span class="text-danger">Delete</span>
                              </el-dropdown-item>
                           </el-dropdown-menu>
                        </template>
                     </el-dropdown>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <TextDetail
            :key="tableKey + 'td'"
            :style="{display: textFileVisible ? 'flex' : 'none', width: `${detailWidth}px`}"/>
      </div>
      <teleport to="body">
         <el-dialog title="Create Folder" v-model="folderDialogVisible">
            <el-input placeholder="folder name" v-model="folderName"/>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="folderDialogVisible = false">Cancel</el-button>
                  <el-button type="primary" @click="handleCreateFolder">Create</el-button>
                </span>
            </template>
         </el-dialog>
      </teleport>
      <teleport to="body">
         <el-dialog title="Rename" v-model="renameDialogVisible">
            <el-input v-model="fileName"/>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="renameDialogVisible = false">Cancel</el-button>
                  <el-button type="primary" @click="handleRename">Create</el-button>
                </span>
            </template>
         </el-dialog>
      </teleport>
      <teleport to="body">
         <el-dialog title="Import Hash" v-model="hashDialogVisible">
            <el-input placeholder="hash" v-model="hash"/>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="hashDialogVisible = false">Cancel</el-button>
                  <el-button type="primary" @click="handleUploadHash">Create</el-button>
                </span>
            </template>
         </el-dialog>
      </teleport>
   </div>
</template>

<script>
import {computed, ref} from "vue";
import {mapState, useStore} from "vuex";
import {FILE_INDEX, FOLDER_CREATE} from "@/store/actions";
import TextDetail from "@/components/drive/TextDetail";
import {
   M_CLEAR_STATE, M_CURRENT_FILE_SET,
   M_CURRENT_SET, M_FILE_DELETE, M_FILE_RENAME,
   M_GOTO_FOLDER,
   M_PUSH_PATH,
   M_TOGGLE_FILE_TEXT
} from "@/store/mutations";
import AppMixin from "@/AppMixin";
import reduce from "lodash/reduce";
import {encode} from "js-base64";
import agent from "@/agent";
import {ElMessageBox} from "element-plus";

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];


export default {
   name: "Drive",
   components: {TextDetail},
   mixins: [AppMixin],
   setup() {
      const store = useStore()
      const folderDialogVisible = ref(false)
      const renameDialogVisible = ref(false)
      const hashDialogVisible = ref(false)
      const folderName = ref('')
      const fileName = ref('')
      const hash = ref('')
      const selectedFile = ref(null)
      const uploadList = ref([])

      const currentFolder = computed(() => store.state.core.currentFolder)
      const files = computed(() => store.state.core.files)

      const handleUploadHash = () => {
         agent.hashes.pin(hash.value, {parent: currentFolder.value.id}).then(() => {
            ElMessageBox.alert('We have received your request, you can see it once it pin successfully. It will take several minutes.', 'Success', {
               confirmButtonText: 'OK',
               callback: () => {
                  hashDialogVisible.value = false;
               },
            });
         }).catch(error => {
            ElMessageBox.alert(error.response.data, 'Error');
         })
      };


      return {
         folderDialogVisible,
         hashDialogVisible,
         handleUploadHash,
         selectedFile,
         folderName,
         uploadList,
         files,
         hash,
         currentFolder,
         renameDialogVisible,
         fileName,
      }
   },
   computed: mapState({
      root: state => state.core.root,
      paths: state => state.core.paths,
      textFileVisible: state => state.core.textFileVisible,
   }),
   mounted() {
      if (this.root) {
         this.$store.dispatch(FILE_INDEX, {folder: this.root.id})
      }
   },
   data() {
      return {
         tableKey: new Date().getTime()
      }
   },
   methods: {
      handleUploadCommand(cmd) {
         if (cmd === 'file') {
            document.getElementById('upload-file').click()
         } else if (cmd === 'folder') {
            document.getElementById('upload-folder').click()
         } else if (cmd === 'hash') {
            this.hashDialogVisible = true
            this.hash = ''
         }
      },
      handleCreateCommand(cmd) {
         if (cmd === 'folder') {
            this.folderName = ''
            this.folderDialogVisible = true
         } else {
            this.$store.commit(M_TOGGLE_FILE_TEXT)
            this.tableKey = new Date().getTime()
         }
      },
      handleCreateFolder() {
         this.$store.dispatch(FOLDER_CREATE, this.folderName).then(() => {
            this.$store.dispatch(FILE_INDEX, {folder: this.root.id})
            this.folderDialogVisible = false
         }).catch(error => {
            ElMessageBox.alert(error.response.data, 'Error');
         })
      },
      handleRename() {
         agent.files.rename(this.selectedFile.id, {name: this.fileName}).then(() => {
            this.renameDialogVisible = false
            this.$store.commit(M_FILE_RENAME, {newName: this.fileName, file: this.selectedFile})
         }).catch(error => {
            ElMessageBox.alert(error.response.data, 'Error');
         })
      },
      handleDownload(target) {
         agent.files.download(target.id).then(resp => {
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            if (target.file) {
               // is file
               link.setAttribute('download', target.originalName);
            } else {
               link.setAttribute('download', target.originalName + '.zip');
            }
            document.body.appendChild(link);
            link.click();
         })
      },
      handleMoreAction(cmd) {
         if (cmd.action === 'rename') {
            this.fileName = cmd.target.originalName
            this.selectedFile = cmd.target
            this.renameDialogVisible = true
         } else if (cmd.action === 'delete') {
            let msg = 'Are you sure you want to delete this file?'
            if (cmd.target.file) {
               msg = 'Are you sure you want to delete this folder?'
            }
            this.$confirm(msg, 'Warning', {
               confirmButtonText: 'Confirm',
               cancelButtonText: 'Cancel',
               type: 'warning'
            }).then(() => {
               agent.files.delete(cmd.target.id).then(() => {
                  this.$store.commit(M_FILE_DELETE, cmd.target.id)
               })
            })

         }
      },
      handleFileChange(e) {
         if (e.target.files[0].size > 2 * 1024 * 1024) {
            this.$alert('File must be less than 2MB', 'Warning', {
               confirmButtonText: 'OK',
            });
            return
         }
         this.uploadList = e.target.files
         this.uploadFiles()
      },
      handleFolderChange(e) {
         let sum = reduce(e.target.files, (carry, a) => carry + a.size, 0)
         if (sum > 15 * 1024 * 1024) {
            this.$alert('Folder must be less than 15MB', 'Warning', {
               confirmButtonText: 'OK',
            });
            return
         }
         this.uploadList = e.target.files
         this.uploadFiles()
      },
      handleClickBreadCrumb(index, uf) {
         if (index === this.paths.length)
            return
         if (index > 0) {
            this.$store.dispatch(FILE_INDEX, {folder: uf.id})
            this.$store.commit(M_GOTO_FOLDER, {index})
            this.$store.commit(M_CURRENT_SET, uf)
         } else {
            this.$store.dispatch(FILE_INDEX, {folder: this.root.id})
            this.$store.commit(M_CURRENT_SET, this.root)
            this.$store.commit(M_GOTO_FOLDER, {index})
         }

      },
      handleClickFile(uf) {
         if (uf.file === null) {
            // folder
            this.$store.dispatch(FILE_INDEX, {folder: uf.id})
            this.$store.commit(M_CURRENT_SET, uf)
            this.$store.commit(M_PUSH_PATH, uf)
         } else if (uf.file.mime.includes("text")) {
            // click text file
            this.$store.commit(M_TOGGLE_FILE_TEXT)
            this.$store.commit(M_CURRENT_FILE_SET, uf)
            this.tableKey = new Date().getTime()
         }
      },
      clearState() {
         this.$store.commit(M_CLEAR_STATE)
      },
      copyCid(cid) {
         navigator.clipboard.writeText(cid).then(() => {
            this.$notify({
               title: '',
               message: 'Copied',
               type: 'success'
            });
         }, function(err) {
            console.error('Async: Could not copy text: ', err);
         });
      },
      // Private
      uploadFiles() {
         let formData = new FormData()
         for (let file of this.uploadList) {
            if (this.uploadList.length === 1) {
               formData.append('file_' + encode(file.name), file);
            } else {
               formData.append('file_' + encode(file.webkitRelativePath), file)
            }
         }
         formData.append('parent', this.currentFolder.id)
         agent.files.upload(formData)
            .then(() => {
               this.$store.dispatch(FILE_INDEX, {folder: this.root.id})
            })
            .catch(reason => {
               this.$alert(reason.response.data, 'Warning', {
                  confirmButtonText: 'OK',
               });
            })
      },
      niceBytes(x) {
         let l = 0, n = parseInt(x, 10) || 0;

         while (n >= 1024 && ++l) {
            n = n / 1024;
         }

         return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
      }
   }
}
</script>

<style scoped lang="scss">
.drive {
   box-sizing: border-box;
}

.file-list {
   .file {
      &-name {
         display: flex;
         align-items: center;

         &.is-folder, &.is-text {
            cursor: pointer;
         }
      }
   }
}
</style>
