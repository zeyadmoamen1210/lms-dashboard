<template>
  <div class="add-true add-new-question">
    <div class="inner-head">
      <div class="d-flex justify-content-between">
        <div>
          <h6 class="mt-2">
            {{ $t("subjects.Questiontype") }}
            <span> {{ $t("subjects.Group") }}</span>
          </h6>
        </div>
      </div>
    </div>

    <el-form
      :model="question"
      ref="questiongroup"
      :class="{
        'add-question-form': true,
        'arabic-form': $i18n.locale == 'ar',
        'english-form': $i18n.locale == 'en',
      }"
    >
      <el-form-item
        :label="$t('subjects.questionHead')"
        prop="head"
        :rules="[{ required: true, message: $t('subjects.questionHead') }]"
      >
        <el-input
          type="textarea"
          :autosize="{ minRows: 4 }"
          clearable
          :placeholder="$t('subjects.questionHead')"
          v-model="question.head"
        >
        </el-input>
      </el-form-item>

      <el-form-item :label="$t('subjects.AddPic')" prop="image">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          action="#"
          :show-file-list="true"
          :auto-upload="false"
          :on-change="handlePictureCardPreview"
          :limit="1"
          :on-remove="handleRemove"
          :file-list="fileList"
          ref="groupPhoto"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-camera-solid avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <ManyQuestions
        :toAddGroupQuestion="true"
        @saveGroupQuestionSuccess="saveGroupQuestion"
      />
    </el-form>
  </div>
</template>
<script>
import ManyQuestions from "./ManyQuestions.vue";
export default {
  components: { ManyQuestions },
  props: ["lesson"],
  data() {
    return {
      question: {},
      questions: [],
      fileList: [],
      categoryIcon: "",
      imageUrl: "",
    };
  },

  methods: {
    handlePictureCardPreview(file) {
      // console.log(file.raw)
      this.categoryIcon = file.raw;
      // var img = new Image();
      // let that = this;

      // let url = URL.createObjectURL(file.raw);

      // img.src = url;

      // img.onload = function () {
      //   console.log(this.width + "x" + this.height);
      //   if (
      //     this.width > 600 &&
      //     this.height > 200 &&
      //     this.height < 650 &&
      //     this.width < 800
      //   ) {
      //     console.log("image good");

      //     that.categoryIcon = file.raw;
      //   } else {
      //     console.log("bad img");
      //     that.fileList = [];
      //     that.$refs.groupPhoto.clearFiles();
      //     (that.categoryIcon = ""), (that.imageUrl = "");

      //     that.$message.error({
      //       message: "العرض يجب ان لا يقل عن 600 و الطول لا يذيد عن 650",
      //     });
          // that.$vs.notify({text:"العرض يجب ان لا يقل عن 600 و الطول لا يذيد عن 650", color:"danger", time: 7000});
        // }
      // };

      // img.src = this.imageUrl;
    },

    handleRemove() {
      this.categoryIcon = "";
    },

    saveGroupQuestion(e) {
      this.questions = [...e];
      if (!(this.question.head && this.question.head.toString().trim() != "")) {
        this.$message.error({
          message:
            this.$i18n.locale == "ar"
              ? "ادخل رأس السؤال او القطعة"
              : "Head Of Group Question Is Required ",
        });
        return;
      }

      const loading = this.$vs.loading();
      let question = {};

      let groupQues = new FormData();
      groupQues.append("head", this.question.head);
      groupQues.append("type", "group");
      if (this.categoryIcon) {
        groupQues.append("image", this.categoryIcon);
      }

      let addGroup = this.$axios
        .post(`/lessons/${this.lesson}/questions`, groupQues)
        .then((res) => {
          question = res.data;
        }).catch(err => {
          if (err.response.status == 403) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? "غير مسموح لك بإضافة السؤال في هذا الدرس لانه خاص بمدرس اخر"
                  : "Dont Allow To Add This Question To This Lesson Because its belongs to another teacher",
            });
          } else {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? `يوجد خطا ما`
                  : `There Are Something Wrong!`,
            });
          }
        });

      Promise.all([addGroup])
        .then((res) => {
          this.$axios
            .post(`/questions-group/${question.id}/children`, [...e])
            .then((res) => {
              this.$message({
                message:
                  this.$i18n.locale == "ar"
                    ? "تم إضافة السؤال بنجاح"
                    : "Questions Added Successfully",
                type: "success",
              });
              this.question.head = "";
              this.$refs.groupPhoto.clearFiles();
              this.$emit("saveGroupQuestionSuccess");
            }).catch(err => {
          if (err.response.status == 403) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? "غير مسموح لك بإضافة السؤال في هذا الدرس لانه خاص بمدرس أخر"
                  : "Dont Allow To Add This Question To This Lesson Because it belongs to another teacher",
            });
          } else {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? `يوجد خطا ما`
                  : `There Are Something Wrong!`,
            });
          }
        });
        })
        .finally(() => loading.close());
    },
  },
};
</script>

<style>
</style>
