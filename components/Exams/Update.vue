<template>
  <section class="addExam add-update-section">
    <h6 class="mb-1"> {{ $i18n.locale == 'ar' ? 'تعديل امتحان' : 'update Exam' }} </h6>
    <el-form :model="exam" ref="updateExam" class="for-add-or-update ">
      <div
        :style="{
          left: $i18n.locale == 'ar' ? '31px' : 'auto',
          right: $i18n.locale != 'ar' ? '31px' : 'auto',
        }"
        class="after"
      ></div>
      <div class="inputs-grid row">
        <div class="col-md-2">
          <el-form-item
            prop="title"
            :rules="[
              {
                required: true,
                message: $t('subjects.Examtitle'),
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              :placeholder="$t('subjects.Examtitle')"
              v-model="exam.title"
            ></el-input>
          </el-form-item>
        </div>

        <div class="col-md-2">
          <el-form-item
            prop="passing_percentage"
            :rules="[
              {
                required: true,
                message: $t('subjects.Rate'),
                trigger: 'blur',
              },
              { type: 'number', message: $t('MustNumber') },
            ]"
          >
            <el-input
              :placeholder="$t('subjects.Rate')"
              v-model.number="exam.passing_percentage"
            ></el-input>
          </el-form-item>
        </div>

        <div class="col-md-2">
          <el-form-item
            prop="numberOfAllowedTimesToSolve"
            :rules="[
              {
                required: true,
                message: $t('subjects.Count'),
                trigger: 'blur',
              },
              { type: 'number', message: $t('MustNumber') },
            ]"
          >
            <el-input
              :placeholder="$t('subjects.Count')"
              v-model.number="exam.numberOfAllowedTimesToSolve"
            ></el-input>
          </el-form-item>
        </div>

        <div class="col-md-2" v-if="exam.isDuration">
          <el-form-item
            prop="duration"
            :rules="[
              {
                required: true,
                message: $t('subjects.Time'),
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              v-model="exam.duration"
              :placeholder="$t('subjects.Time')"
            ></el-input>
          </el-form-item>
        </div>

        <div class="col-md-1 switcher">
          <el-form-item :label="$t('subjects.available')" prop="availability">
            <el-switch
              v-model="exam.availability"
              active-color="var(--yellow)"
              inactive-color="#C4C4C4"
            >
            </el-switch>
          </el-form-item>
        </div>

        <div class="col-md-1 switcher">
          <el-form-item :label="$t('subjects.Time')" prop="isDuration">
            <el-switch
              v-model="exam.isDuration"
              active-color="var(--yellow)"
              inactive-color="#C4C4C4"
            >
            </el-switch>
          </el-form-item>
        </div>

        <div
          :class="{ 'col-md-2': true, 'col-md-4': exam.isDuration == false }"
        >
          <div class="d-flex flex-row-reverse">
            <el-form-item>
              <el-button
                class="btn btn-org"
                type="warning"
                @click="validateUpdateExam('updateExam')"
                >{{ $t("Validation.save") }}</el-button
              >
              <el-button
                class="btn btn-white"
                type="info"
                @click.native="closeExamModel"
                >{{ $t("Validation.close") }}</el-button
              >
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script>
export default {
  props: ["exam", "objectType"],
  mounted() {},
  methods: {
    closeExamModel() {
      this.$emit("ifModelClosed");
    },
    validateUpdateExam(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateExam();
        }
      });
    },
    updateExam() {
      const loading = this.$vs.loading();
      let exam = {
        id: this.exam.id,
        title: this.exam.title,
        numberOfAllowedTimesToSolve: Number(
          this.exam.numberOfAllowedTimesToSolve
        ),
        passing_percentage: Number(this.exam.passing_percentage),
      };

      if (this.exam.isDuration) {
        exam.duration = Number(this.exam.duration);
      } else {
        exam.duration = null;
      }

      if (this.exam.availability) {
        exam.availability = true;
      } else {
        exam.availability = false;
      }

      this.$axios
        .patch(`/exams/${exam.id}`, exam)
        .then((res) => {
          this.$message({
            message:
              this.$i18n.locale == "ar"
                ? "تم تعديل الامتحان بنجاح"
                : "Exam Updated Successfully",
            type: "success",
          });
          this.$emit("examUpdatedSuccessfully");
        })
        .finally(() => loading.close());
    },
  },
};
</script>

<style lang="scss">
.addExam{
  margin-bottom: 20px;
}
.switcher {
  .el-form-item__label {
    float: none !important;
    color: var(--yellow);
    font-size: 19px;
  }
  .el-form-item {
    display: flex;
  }
  .el-form-item__content {
    display: flex;
    margin-bottom: 0;
    padding-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
}

.for-add-or-update {
  margin-top: 10px;
  border-radius: 9px;
  padding: 15px;
  position: relative;

  .after {
    position: absolute;
    top: -24px;
    border-width: 12px;
    border-style: solid;
    border-color: transparent transparent #f9f9f9 transparent;
  }
}
</style>
