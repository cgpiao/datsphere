<template>
   <div class="flex flex-col items-center">
      <div style="width: 650px;">
         <h1 class="text-primary w-full flex justify-center mt-xxl">
            Sign up
         </h1>
         <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="150px"
                  class="demo-ruleForm">
            <el-form-item label="Email" prop="email">
               <el-input v-model="ruleForm.email">
                  <template #prefix>
                     <i class="el-icon-user"></i>
                  </template>
               </el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password">
               <el-input v-model="ruleForm.password" type="password" show-password>
                  <template #prefix>
                     <i class="el-icon-lock"></i>
                  </template>
               </el-input>
            </el-form-item>
            <el-form-item label="Verification Code" prop="code">
               <div class="flex">
                  <el-input v-model="ruleForm.code">
                     <template #prefix>
                        <i class="el-icon-bangzhu"></i>
                     </template>
                  </el-input>
                  <el-link href="" type="primary" class="ml-xs"
                             :disabled="seconds > 0" style="width: 100px"
                             @click.stop.prevent="sendVerificationCode">{{ textSend }}
                  </el-link>
               </div>
            </el-form-item>
         </el-form>
         <el-row style="height: 2rem">
            <el-col :span="24" class="text-danger flex justify-center items-center"
                    v-show="message">
               {{ message }}
            </el-col>
         </el-row>
         <el-row class="mt-xl">
            <el-col :span="4">

            </el-col>
            <el-col :span="16">
               <el-button type="primary" :round="true" style="width: 100%"
                          @click="()=>onSubmit('formRef')">Sign in
               </el-button>
            </el-col>
            <el-col :span="4">

            </el-col>
         </el-row>
      </div>
   </div>
</template>

<script>
import {ref, reactive} from "vue";
import {ElMessage} from "element-plus";
import agent from "@/agent";
import {LS_TOKEN} from "@/constants";

let sendCount = 0;
const INTERVAL = 10

export default {
   name: "Register",
   setup() {
      const seconds = ref(0)
      const textSend = ref('Send')
      const key = ref('key')
      const ruleForm = reactive({
         email: process.env.VUE_APP_USERNAME || '',
         password: process.env.VUE_APP_PASSWORD || '',
         code: '',
      })
      const rules = reactive({
         email: [
            {type: 'email', required: true, message: 'Please type your email', trigger: 'submit'},
         ],
         password: [
            {
               required: true, message: 'Please type 8-50 characters', min: 8, max: 50, trigger: 'submit'
            },
         ],
         code: [
            {
               required: true, message: 'Please type verification code', trigger: 'submit'
            },
         ],
      })
      const message = ref()

      const sendVerificationCode = async () => {
         agent.codes.send({email: ruleForm.email}).then((resp) => {
            seconds.value = INTERVAL
            sendCount += 1
            ElMessage.info({
               message: 'we have already sent a verification code to your email',
            });
            textSend.value = sendCount === 0 ? 'Send' : `Resend(${INTERVAL}s)`
            let interval = setInterval(() => {
               seconds.value -= 1
               if (seconds.value === 0) {
                  clearInterval(interval)
                  textSend.value = sendCount === 0 ? 'Send' : `Resend`
               } else {
                  textSend.value = sendCount === 0 ? 'Send' : `Resend(${seconds.value}s)`
               }
            }, 1000)
            key.value = resp.data
         }).catch(error => {
            message.value = error.request.response
         })
      }

      return {
         ruleForm,
         rules,
         textSend,
         message,
         sendVerificationCode,
         seconds,
         key
      }
   },
   data() {
      return {
      }
   },
   methods: {
      onSubmit(formName) {
         this.$refs[formName].validate((valid) => {
            if (!valid)
               return
            let params = {
               key: this.key,
               username: this.ruleForm.email,
               password: this.ruleForm.password,
               code: this.ruleForm.code,
            }
            agent.account.register(params).then(resp => {
               localStorage.setItem(LS_TOKEN, resp.data)
               this.$router.replace({name: 'drive'})
            }).catch(error => {
               this.message = error.request.response
            })
         })
      },

   }
}
</script>

<style scoped lang="scss">
.form-panel {
   display: flex;
   flex-direction: column;
   align-items: center;
   position: relative;

   .register-form {
      width: 700px;
      top: calc(20%);
      position: absolute;
      border: 1px solid #ddd;
      padding: 1rem;
   }
}
</style>
