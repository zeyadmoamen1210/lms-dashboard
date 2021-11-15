<template>
  <div class="add-presentation-model">
    <section >
      <el-form :model="presentation" ref="updatePresentation" class="for-add-or-update">
        <div class="row">
          <div class="col-md-4">
            <div>
              <el-form-item
                prop="name"
                :rules="[
                  {
                    required: true,
                    message: $t('Validation.VName'),
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  :placeholder="$t('Validation.name')"
                  v-model="presentation.name"
                ></el-input>
              </el-form-item>
            </div>
          </div>
         
         
          <div class="col-md-8">
            <div class="d-flex flex-row-reverse">
              <el-form-item>
                <el-button
                  class="btn btn-org"
                  @click="submitForm('updatePresentation')"
                  type="warning"
                >
                  {{ $t("Validation.save") }}
                </el-button>
                <el-button
                  class="btn btn-white"
                  @click="closeUpdatePresentation"
                  type="info"
                >
                  {{ $t("Validation.close") }}
                </el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
    props: ['presentation'],
    data:() => ({
        addPresentation: {}
    }),
    methods:{
        closeUpdatePresentation(){
            this.$emit("closeAddPresentation");
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.savePresentation();
                }
            });
        },
        savePresentation(){
            const loading = this.$vs.loading();
            this.$axios.patch(`/presentations/${this.presentation.id}`, {
                name: this.presentation.name,
                
            }).finally(() => loading.close())
            this.$emit("presentationUpdated");
        },

    }
};
</script>

<style>

</style>
