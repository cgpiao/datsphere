<template>
   <div class="p-md">
      <el-alert
         title="Files in trash will be automatically deleted after 10 days."
         type="warning"
         effect="dark"
         :closable="false"
         show-icon>
      </el-alert>
      <el-table :data="data"
                class="file-list mt-md"
                row-class-name="file">
         <el-table-column
            prop="originalName"
            label="Name">
            <template #default="scope">
               <div
                  :class="{'file-name': true, 'is-folder': scope.row.file === null, 'is-text': scope.row.file && scope.row.file.mime.includes('text')}">
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
            prop="deletedAt"
            label="Deleted Date"
            width="180">
         </el-table-column>
         <el-table-column
            prop="file.size"
            label="File Size"
            width="220">
         </el-table-column>
         <el-table-column
            prop=""
            label=""
            width="180">
            <template #default="scope">
               <el-button type="primary" @click="()=>putBack(scope.row)" size="small">Put Back</el-button>
               <el-button type="danger" @click="()=>destroy(scope.row)" size="small">Delete</el-button>
            </template>
         </el-table-column>
      </el-table>
   </div>
</template>

<script>
import agent from "@/agent";
import {ref} from "vue";

export default {
   name: "Trash",
   setup() {
      const data = ref([])
      agent.files.index({from: '2'}).then(resp => {
         data.value = resp.data
      })
      return {
         data
      }
   },
   methods: {
      putBack(target) {
         agent.files.back(target.id).then(() => {
            agent.files.index({from: '2'}).then(resp => {
               this.data = resp.data
            })
         }).catch(error => {
            if (error.response && error.response.status === 400) {
               this.$confirm(error.response.data, 'Warning', {
                  confirmButtonText: 'Confirm',
                  cancelButtonText: 'Cancel',
                  type: 'warning'
               }).then(() => {
                  agent.files.back(target.id, {force: 1}).then(() => {
                     agent.files.index({from: '2'}).then(resp => {
                        this.data = resp.data
                     })
                  })
               })
            }
         })
      },
      destroy(target) {
         this.$confirm('Are you sure you want to permanently delete this file?', 'Warning', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
         }).then(() => {
            agent.files.clear(target.id).then(() => {
               let index = this.data.findIndex(item => item.id === target.id)
               this.data.splice(index, 1)
            })
         });
      }
   }
}
</script>
<style scoped lang="scss">

.file-list {
   .file {
      &-name {
         display: flex;
         align-items: center;

         &.is-folder, &.is-text {
            //cursor: pointer;
         }
      }
   }
}
</style>

