<template>
  <div class="update-delete-question">
      <template>

            

    </template>
  </div>
</template>

<script>
export default {
    props:['question'],
    methods:{
        
        emitUpdateEvent(){
            this.$emit("onUpdateEvent", this.question);
        }
    }
}
</script>

<style lang="scss">

</style>