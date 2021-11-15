<template>
  <div class="updateQuestionCom">
    <el-form
      :model="updateQuestion"
      ref="updateQuestion"
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
          v-model="updateQuestion.head"
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
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-camera-solid avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!-- If Type Is Paragraph -->
      <template v-if="updateQuestion.type == 'paragraph'">
        <el-form-item
          :label="$t('subjects.Answer')"
          prop="modelAnswer"
          :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            clearable
            :placeholder="$t('subjects.Answer')"
            v-model="updateQuestion.modelAnswer"
          >
          </el-input>
        </el-form-item>
      </template>

      <!-- If Type Is Choose -->
      <template v-if="updateQuestion.type == 'choose'">
        <div class="row">
          <div class="col-md-6">
            <div class="d-flex">
              <el-form-item
                label=" "
                prop="modelAnswer"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-radio v-model="updateQuestion.modelAnswer" :label="0">
                  {{ " " }}
                </el-radio>
              </el-form-item>
              <el-form-item
                style="flex:1 "
                :label="$t('subjects.Answer')"
                prop="choices[0]"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  :placeholder="$t('subjects.FirstChoose')"
                  v-model="updateQuestion.choices[0]"
                >
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div class="col-md-6">
            <div class="d-flex">
              <el-form-item
                label=" "
                prop="modelAnswer"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-radio v-model="updateQuestion.modelAnswer" :label="1">
                  {{ " " }}
                </el-radio>
              </el-form-item>
              <el-form-item
                style="flex:1 "
                :label="$t('subjects.Answer')"
                prop="choices[1]"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  :placeholder="$t('subjects.Secondchoice')"
                  v-model="updateQuestion.choices[1]"
                >
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div class="col-md-6">
            <div class="d-flex">
              <el-form-item
                label=" "
                prop="modelAnswer"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-radio v-model="updateQuestion.modelAnswer" :label="2">
                  {{ " " }}
                </el-radio>
              </el-form-item>

              <el-form-item
                style="flex:1 "
                :label="$t('subjects.Answer')"
                prop="choices[2]"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  :placeholder="$t('subjects.Thirdchoice')"
                  v-model="updateQuestion.choices[2]"
                >
                </el-input>
              </el-form-item>
            </div>
          </div>

          <div class="col-md-6">
            <div class="d-flex">
              <el-form-item
                label=" "
                prop="modelAnswer"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-radio v-model="updateQuestion.modelAnswer" :label="3">
                  {{ " " }}
                </el-radio>
              </el-form-item>

              <el-form-item
                style="flex:1 "
                :label="$t('subjects.Answer')"
                prop="choices[3]"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  :placeholder="$t('subjects.Fourthchoice')"
                  v-model="updateQuestion.choices[3]"
                >
                </el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </template>

      <!-- If Type Is True Or False -->
      <template v-if="updateQuestion.type == 'truefalse'">
        <div class="row">
          <div class="col-md-6 true-false">
            <div>
              <el-form-item
                :label="$t('subjects.True')"
                prop="modelAnswer"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-radio v-model="updateQuestion.modelAnswer" :label="true">
                  {{ $t("subjects.True") }}
                </el-radio>
              </el-form-item>
            </div>
          </div>

          <div class="col-md-6 true-false">
            <div>
              <el-form-item
                :label="$t('subjects.False')"
                prop="modelAnswer"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-radio v-model="updateQuestion.modelAnswer" :label="false">
                  {{ $t("subjects.False") }}
                </el-radio>
              </el-form-item>
            </div>
          </div>
        </div>
      </template>

      <!-- If Type Is Complete -->
      <template v-if="updateQuestion.type == 'complete'">
        <vs-button
          color="warn"
          class="mb-3"
          @click.prevent="updateQuestion.modelAnswer.push('')"
        >
          {{ $t("subjects.Addanswer") }}
        </vs-button>
        <div class="row">
          <div
            class="col-md-6"
            v-for="(answer, index) in updateQuestion.modelAnswer"
            :key="index"
          >
            <div class="d-flex">
              <el-form-item
              style="flex:1 "
                :prop="'modelAnswer[' + index + ']'"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  v-model="updateQuestion.modelAnswer[index]"
                >
                </el-input>
              </el-form-item>

              <div v-if="index != 0">
                <vs-button
                  class="close"
                  @click.prevent="updateQuestion.modelAnswer.splice(index, 1)"
                  ><i class="el-icon-circle-close"></i
                ></vs-button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <el-form-item class="mt-4 d-flex justify-content-end">
        <div class="d-flex flex-row-reverse">
          <el-button
            class="btn btn-white mt-0 mr-2 ml-2"
            @click.prevent="$emit('closeUpdateQuestionModel')"
            type="danger"
            @click="cancelAdd"
          >
            {{ $t("Validation.close") }}</el-button
          >
          <el-button
            class="btn btn-org"
            type="warning"
            @click="validateUpdateQuestion('updateQuestion')"
            >{{ $t("Validation.save") }}</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["updateQuestion", "type"],
  data() {
    return {
      fileList: [],
      imageUrl: "",
      categoryIcon: "",
    };
  },
  created() {
    this.fileList = []; this.categoryIcon = "";
    if (this.updateQuestion.image && this.updateQuestion.image != '[object Object]' ) {
      // this.imageUrl = this.updateQuestion.image;
      this.fileList.push({});
      this.categoryIcon = this.updateQuestion.image;
      this.fileList[0].url = this.updateQuestion.image;
      this.fileList[0].name = "question";
    }
  },
  methods: {
    validateUpdateQuestion(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateTheQuestion();
        } else {
          return false;
        }
      });
    },
    updateTheQuestion() {
      console.log(this.updateQuestion);

      let formData = new FormData();
      formData.append("head", this.updateQuestion.head);

      if (this.categoryIcon) {
        formData.append("image", this.categoryIcon);
      }

      if (this.updateQuestion.type != "complete") {
        formData.append("modelAnswer", this.updateQuestion.modelAnswer);
      }

      formData.append("type", this.updateQuestion.type);

      switch (this.updateQuestion.type) {
        case "choose":
          for (let i = 0; i < this.updateQuestion.choices.length; i++) {
            formData.append(`choices[${i}]`, this.updateQuestion.choices[i]);
          }

          break;
        case "complete":
          formData.append(
            "numberOfInputs",
            this.updateQuestion.modelAnswer.length
          );
          for (let i = 0; i < this.updateQuestion.modelAnswer.length; i++) {
            formData.append(
              `modelAnswer[${i}]`,
              this.updateQuestion.modelAnswer[i]
            );
          }

          break;
      }

      const loading = this.$vs.loading();

      this.$axios
        .patch(`/questions/${this.updateQuestion.id}`, formData)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم تعديل السؤال بنجاح"
                : "Question updated Successfully",
          });

          this.$emit("questionUpdatedSuccessfully");
          window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? "غير مسموح لك بتعديل هذا السؤال لانه خاص بمدرس أخر"
                  : "Dont Allow To update This Question Because it belongs to another teacher",
            });
            this.$emit('closeUpdateQuestionModel')
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
        })
        .finally(() => loading.close());
    },

    handlePictureCardPreview(file) {
      console.log(file);
      this.categoryIcon = file.raw;
      this.imageUrl = "";
    },

    cancelAdd() {
      this.categoryIcon = {};
      this.imageUrl = "";
      this.addQuestion = {};
      this.$emit("addIsCaceled");
    },

    handleRemove() {
      this.categoryIcon = "";
    },
  },
};
</script>

<style lang="scss">
.btn-org {
  &.vs-button--default {
    background: #ffa400 !important;
    box-shadow: none !important;
    border-radius: 6px !important;
  }
}
.close {
  background: none !important;
  box-shadow: none !important;
  border-radius: 6px !important;
  color: #ff3636 !important;
}
.updateQuestionCom {
  .el-form-item__content {
    width: 100%;
  }
  .avatar-uploader {
    width: 100%;
  }
}
</style>
