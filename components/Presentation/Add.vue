<template>
  <div class="add-presentation-model">
    <section >
      <el-form :model="addPresentation" ref="addPresentation" class="for-add-or-update">
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
                  v-model="addPresentation.name"
                ></el-input>
              </el-form-item>
            </div>
          </div>
         
         
          <div class="col-md-8">
            <div class="d-flex flex-row-reverse">
              <el-form-item>
                <el-button
                  class="btn btn-org"
                  @click="submitForm('addPresentation')"
                  type="warning"
                >
                  {{ $t("Validation.save") }}
                </el-button>
                <el-button
                  class="btn btn-white"
                  @click="closeAddPresentation"
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
    props: ['objectType', 'objectId'],
    data:() => ({
        addPresentation: {}
    }),
    methods:{
        closeAddPresentation(){
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
            this.$axios.post(`/presentations`, {
                name: this.addPresentation.name,
                object: Number(this.objectId),
                objectType: this.objectType,
            }).finally(() => loading.close())
            this.$emit("presentationAdded");
        },

    }
};
</script>

<style>

</style>
