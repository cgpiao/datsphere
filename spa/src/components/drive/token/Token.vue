<template>
   <div class="flex-col">
      <el-button type="primary" class="" @click="()=>$router.push({name: 'token_new'})">
         Generate New Token
      </el-button>
   </div>
</template>

<script>
export default {
   name: "Token"
}
</script>

<style scoped>

</style>
