<template>
   <div class="flex-col h-screen">
      <div class="flex items-center justify-between px-lg shadow"
           :style="{minHeight: `${appHeaderHeight}px`}">
         <router-link :to="{name: 'drive'}">
            <img src="../assets/images/logo.png" style="width: 32px" alt=""/>
         </router-link>
         <div class="flex-row">
            <router-link :to="{name: 'trash'}">
               <i class="el-icon-delete"></i>
            </router-link>
            <el-dropdown trigger="click" class="ml-md" @command="handleAction">
               <span class="el-dropdown-link">
                  {{ username }} <i class="el-icon-arrow-down el-icon--right"></i>
               </span>
               <template #dropdown>
                  <el-dropdown-menu>
                     <el-dropdown-item command="change-password">
                        Change Password
                     </el-dropdown-item>
                     <el-dropdown-item command="logout" divided>
                        <span class="text-danger">Logout</span>
                     </el-dropdown-item>
                  </el-dropdown-menu>
               </template>
            </el-dropdown>
         </div>
      </div>
      <div class="flex-1 flex-row">
         <div :style="{width: `${window.innerWidth - sidebarWidth}px`}" class="h-screen">
            <router-view/>
         </div>
      </div>
      <teleport to="body">
         <el-dialog title="Import Hash" v-model="changePasswordDialogVisibility">
            <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="150px"
                     class="">
               <el-form-item label="Current Password" prop="currentPassword">
                  <el-input v-model="ruleForm.currentPassword">
                  </el-input>
               </el-form-item>
               <el-form-item label="Password" prop="password">
                  <el-input v-model="ruleForm.password">
                  </el-input>
               </el-form-item>
               <el-form-item label="Password Confirmation" prop="passwordConfirmation">
                  <el-input v-model="ruleForm.passwordConfirmation">
                  </el-input>
               </el-form-item>
               <div style="height: 2rem" class="text-danger flex-col justify-center items-center">
                  <div class="text-lg py-xs px-xxl" v-if="message">{{message}}</div>
               </div>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="changePasswordDialogVisibility = false">Cancel</el-button>
                  <el-button type="primary" @click="handleChangePassword">Update</el-button>
                </span>
            </template>
         </el-dialog>
      </teleport>
   </div>
</template>

<script>
import {reactive, ref} from "vue";
import {LS_TOKEN} from "@/constants";
import agent from "@/agent";
import {mapState, useStore} from "vuex";
import {M_CLEAR_STATE, M_CURRENT_SET, M_ROOT_SET} from "@/store/mutations";
import AppMixin from "@/AppMixin";
import {FILE_INDEX} from "@/store/actions";

export default {
   name: "Dashboard",
   mixins: [AppMixin],
   setup() {
      const myDrive = ref([])
      const username = ref('')
      const message = ref('')
      const store = useStore()
      const ruleForm = reactive({
         currentPassword: '',
         password: '',
         passwordConfirmation: '',
      })
      const rules = reactive({
         currentPassword: [
            {
               required: true, message: 'Please input current password', trigger: 'submit'
            },
         ],
         password: [
            {
               required: true,
               message: 'Please type 8-50 characters',
               min: 8,
               max: 50,
               trigger: 'submit'
            },
         ],
         passwordConfirmation: [
            {
               trigger: 'submit', validator(_, value) {
                  const errors = [];
                  if (value !== ruleForm.password) {
                     errors.push('The password confirmation does not match.')
                  }
                  return errors;
               },
            },
         ],
      })

      if (!localStorage.getItem(LS_TOKEN)) {
         localStorage.clear()
         location.href = '/'
      } else {
         agent.account.show().then(resp => {
            store.commit(M_ROOT_SET, resp.data.root)
            store.commit(M_CURRENT_SET, resp.data.root)
            username.value = resp.data.username
            store.dispatch(FILE_INDEX, {folder: resp.data.root.id})
         })
      }

      return {
         myDrive,
         username,
         ruleForm,
         rules,
         message
      }
   },
   computed: mapState({
      paths: state => state.core.paths,
      textFileVisible: state => state.core.textFileVisible,
   }),
   methods: {
      clearState() {
         this.$store.commit(M_CLEAR_STATE)
      },
      handleAction(cmd) {
         if (cmd === 'logout') {
            localStorage.clear()
            location.href = '/'
         } else if (cmd === 'change-password') {
            this.changePasswordDialogVisibility = true
         }
      },
      handleChangePassword() {
         this.$refs['formRef'].validate((valid) => {
            if (!valid) return
            agent.account.changePassword(this.ruleForm).then(() => {
               this.$notify({
                  message: 'Change Password Success!',
                  type: 'success'
               });
               this.message = ''
               this.changePasswordDialogVisibility = false
            }).catch(error => {
               this.message = error.request.response
            })
         })
      }
   },
   data() {
      return {
         changePasswordDialogVisibility: false,

      }
   }
}
</script>

<style scoped>

.sidebar {
   background-color: #ededed;
}
</style>
