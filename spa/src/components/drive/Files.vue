<template>
   <div class="q-px-lg q-py-md full-width column">
      <q-tabs
            v-model="tab"
            align="left"
            inline-label
            class="bg-primary text-white shadow-2 full-width"
            :breakpoint="0"
      >
         <q-tab name="file" icon="upload_file" label="File"/>
         <q-tab name="folder" icon="folder" label="Folder"/>
         <q-tab name="hash" icon="push_pin" label="Pin"/>
      </q-tabs>
      <q-tab-panels v-model="tab" animated class="" style="border: 1px solid #777">
         <q-tab-panel name="file">
            <div class="row ">
               <input type="file" style="display: none" id="selectFile" @change="handleFileChange"
                      :accept="acceptFiles"/>
               <div class="col row bg-grey-3 items-center q-px-sm">
                  <label class="col cursor-pointer q-pa-sm"
                         for="selectFile">{{ files.length > 0 ? files[0].name : 'Select File…' }}</label>
                  <q-icon name="file_upload" size="1.5rem"></q-icon>
               </div>
               <q-btn color="primary" label="Upload" class="q-ml-xl" @click="handleUpload"/>
            </div>
         </q-tab-panel>
         <q-tab-panel name="folder">
            <div class="row">
               <input type="file" style="display: none" id="selectFolder" @change="handleFileChange"
                      :accept="acceptFiles" webkitdirectory mozdirectory/>

               <div class="col row bg-grey-3 items-center q-px-sm">
                  <label class="col cursor-pointer q-pa-sm"
                         for="selectFolder">{{ files.length > 0 ? files[0].name : 'Select File…' }}</label>
                  <q-icon name="file_upload" size="1.5rem"></q-icon>
               </div>
               <q-btn color="primary" label="Upload" class="q-ml-xl" @click="handleUpload"/>
            </div>
         </q-tab-panel>
         <q-tab-panel name="hash">
            <div class="row items-center q-px-sm">
               <div class="col row bg-grey-3 items-center q-px-sm">
                  <q-input v-model="hash" :dense="true" class="col" :borderless="true" :outlined="false"/>
               </div>
               <q-btn color="primary" label="Pin" class="q-ml-xl"/>
            </div>
         </q-tab-panel>
      </q-tab-panels>

   </div>
</template>

<script>
import {encode} from "js-base64";
import agent from "@/agent";

export default {
   name: "Files",
   data() {
      return {
         tab: "file",
         files: [],
         hash: '',
         acceptFiles: [
            'image/*', 'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/pdf',
            'application/json'
         ].join(',')
      }
   },
   methods: {
      handleFileChange(e) {
         this.files = e.target.files
      },
      handleFolderChange(e) {
         this.files = e.target.files
      },
      handleUpload() {
         let formData = new FormData()
         for (let file of this.files) {
            switch (this.tab) {
               case "file":
                  formData.append('file_' + encode(file.name), file);
                  break;
               case "folder":
                  formData.append('file_' + encode(file.webkitRelativePath), file)
                  break;
            }
         }
         agent.attachments.create(formData)
      },
      handlePin() {

      }
   }
}
</script>

<style scoped>

</style>
