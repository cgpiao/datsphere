<template>
   <div class="text-detail flex-col ">
      <div class="flex-col flex-1">
         <div class="flex-row">
            <el-input v-model="name" class="flex-1" placeholder="file name"/>
            <el-button type="success" class="ml-md" @click.stop="save" size="small">Save</el-button>
         </div>

         <textarea v-model="content" class="mt-md h-full" placeholder="file content"></textarea>
      </div>

   </div>
</template>

<script>
import {ref} from "vue";
import {FILE_CREATE, FILE_INDEX, FILE_UPDATE} from "@/store/actions";
import {mapState, useStore} from "vuex";
import agent from "@/agent";
import {M_TOGGLE_FILE_TEXT} from "@/store/mutations";
import {ElMessageBox} from "element-plus";

export default {
   name: "TextDetail",
   setup() {
      const store = useStore()
      let name = ref('')
      let content = ref('')
      if (store.state.core.file) {
         name.value = store.state.core.file.originalName
         agent.files.show(store.state.core.file.id).then(resp => {
            content.value = resp.data
         })
      }
      return {
         name,
         content,
      }
   },
   computed: mapState({
      root: state => state.core.root,
   }),
   methods: {
      save() {
         if (!this.content.trim()) {
            ElMessageBox.alert('File content can not be empty.', 'Error');
            return
         }
         if (!this.name.trim()) {
            this.$alert('File name is empty', 'Error', {
               confirmButtonText: 'Confirm',
            });
         }
         if (this.$store.state.core.file) {
            this.$store.dispatch(FILE_UPDATE, {
               name: this.name,
               content: this.content
            }).then(() => {
               this.$store.dispatch(FILE_INDEX, {folder: this.root.id})
               this.$store.commit(M_TOGGLE_FILE_TEXT)
               this.$notify({
                  message: 'Update Success!',
                  type: 'success'
               });
            })
         } else {
            this.$store.dispatch(FILE_CREATE, {
               name: this.name,
               content: this.content
            }).then(() => {
               this.$store.dispatch(FILE_INDEX, {folder: this.root.id})
               this.$store.commit(M_TOGGLE_FILE_TEXT)
               this.$notify({
                  message: 'Create Success!',
                  type: 'success'
               });
            }).catch(error => {
               ElMessageBox.alert(error.response.data, 'Error');
            })
         }

      }
   }
}
</script>

<style scoped lang="scss">
.text-detail {
   width: 100%;
   height: 100%;
   padding: 1em;
   box-sizing: border-box;
   background: #ededed;
   textarea {
      border-width: 0;
      outline: none;
      background: transparent;
      &:focus {
         border-width: 0;
         outline: none;
      }
   }
}
</style>
