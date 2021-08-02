<template>
   <div>
      <el-form :model="formModels" :rules="formRules" ref="formRef">
         <el-form-item label="Name" prop="name">
            <el-input v-model="formModels.name"/>
         </el-form-item>
         <div class="text-lg">Select Scopes</div>
         <el-form-item prop="scope">
            <div class="flex-col">
               <div class="scope-file">
                  <el-checkbox label="files:manage" :indeterminate="isIndeterminate" v-model="formModels.scopeFileManage" @change="handleFileManageChange">
                     files:manage
                  </el-checkbox>
                  <div class="pl-md">
                     <div>
                        <el-checkbox label="files:read" v-model="formModels.scopeFileRead" @change="()=>handleFileScopeChange('files:read')">
                           files:read
                        </el-checkbox>
                        <span>Read All Files</span>
                     </div>
                     <div>
                        <el-checkbox label="files:write" v-model="formModels.scopeFileWrite" @change="()=>handleFileScopeChange('files:write')">
                           files:write
                        </el-checkbox>
                        <span>Write/Upload Files</span>
                     </div>
                     <div>
                        <el-checkbox label="files:delete" v-model="formModels.scopeFileDelete" @change="()=>handleFileScopeChange('files:delete')">
                           files:delete
                        </el-checkbox>
                        <span>Delete Files</span>
                     </div>
                  </div>
               </div>
               <div class="scope-cid">
                  <div>
                     <el-checkbox label="cid:pin" v-model="formModels.scopeCidPin">
                        cid:pin
                     </el-checkbox>
                     <span>Pin Remote IPFS CID</span>
                  </div>
               </div>
            </div>
         </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleSubmit">Generate Token</el-button>
   </div>
</template>

<script>
import {reactive} from "vue";

export default {
   name: "TokenDetail",
   setup() {
      let formModels = reactive({
         name: '',
         scope: [],
         scopeFileManage: false,
         scopeFileRead: false,
         scopeFileWrite: false,
         scopeFileDelete: false,
         scopeCidPin: false,
      });
      let formRules = reactive({
         name: [],
         scope: [],
      });
      return {
         formModels,
         formRules,
      }
   },
   computed: {
      isIndeterminate() {
         return (!(this.formModels.scopeFileRead && this.formModels.scopeFileWrite && this.formModels.scopeFileDelete))
            && (this.formModels.scopeFileRead || this.formModels.scopeFileWrite || this.formModels.scopeFileDelete)
      }
   },
   methods: {
      handleFileManageChange(value) {
         if (value) {
            let index = this.formModels.scope.indexOf('files:read')
            if (index < 0) {
               this.formModels.scope.push('files:read')
               this.formModels.scopeFileRead = true
            }
            index = this.formModels.scope.indexOf('files:write')
            if (index < 0) {
               this.formModels.scope.push('files:write')
               this.formModels.scopeFileWrite = true
            }
            index = this.formModels.scope.indexOf('files:delete')
            if (index < 0) {
               this.formModels.scope.push('files:delete')
               this.formModels.scopeFileDelete = true
            }
         } else {
            let index = this.formModels.scope.indexOf('files:read')
            if (index >= 0) {
               this.formModels.scope.splice(index, 1)
            }
            index = this.formModels.scope.indexOf('files:write')
            if (index >= 0) {
               this.formModels.scope.splice(index, 1)
            }
            index = this.formModels.scope.indexOf('files:delete')
            if (index >= 0) {
               this.formModels.scope.splice(index, 1)
            }
         }
      },
      handleFileScopeChange() {
         if (!(this.formModels.scopeFileRead && this.formModels.scopeFileWrite && this.formModels.scopeFileDelete)) {
            this.formModels.scopeFileManage = false
         }
      },
      handleSubmit() {
         this.$refs['formRef'].validate((valid) => {
            if (!valid)
               return
         })
      }
   }
}
</script>

<style scoped>

</style>
