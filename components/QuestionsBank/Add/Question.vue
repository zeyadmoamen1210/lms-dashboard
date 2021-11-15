<template>
  <div class="AddQuestionCom">
    <el-form
      :model="addQuestion"
      ref="addQuestion"
      :class="{
        'add-question-form': true,
        'arabic-form': $i18n.locale == 'ar',
        'english-form': $i18n.locale == 'en'
      }"
    >
      <el-form-item
        v-if="toExam"
        :label="$i18n.locale == 'ar' ? 'درجة السؤال' : 'Question Degree'"
        prop="quesPoint"
        :rules="[
          { required: true, message: $i18n.locale == 'ar' ? 'درجة السؤال مطلوبة' : 'Question Degree Is Required' },
          { type: 'number', message: $i18n.locale == 'ar' ? 'الدرجة يجب ان تكون رقم' : 'Degree Must Be Number' }
        ]"
      >
        <el-input
          :placeholder="$i18n.locale == 'ar' ? 'درجة السؤال' : 'Question Degree'"
          v-model.number="addQuestion.quesPoint"
        >
        </el-input>
      </el-form-item>

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
          v-model="addQuestion.head"
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
      <template v-if="type == 'paragraph'">
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
            v-model="addQuestion.modelAnswer"
          >
          </el-input>
        </el-form-item>
      </template>

      <!-- If Type Is Choose -->
      <template v-if="type == 'choose'">
        <div class="row">
          <div class="col-md-6">
            <div class="d-flex">
              <el-form-item
                label=" "
                prop="modelAnswer"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-radio v-model="addQuestion.modelAnswer" :label="0">
                  {{ " " }}
                </el-radio>
              </el-form-item>
              <el-form-item
              style="flex: 1"
                :label="$t('subjects.Answer')"
                prop="choose[0]"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input

                  clearable
                  :placeholder="$t('subjects.FirstChoose')"
                  v-model="addQuestion.choose[0]"
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
                <el-radio v-model="addQuestion.modelAnswer" :label="1">
                  {{ " " }}
                </el-radio>
              </el-form-item>
              <el-form-item
              style="flex: 1"
                :label="$t('subjects.Answer')"
                prop="choose[1]"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  :placeholder="$t('subjects.Secondchoice')"
                  v-model="addQuestion.choose[1]"
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
                <el-radio v-model="addQuestion.modelAnswer" :label="2">
                  {{ " " }}
                </el-radio>
              </el-form-item>

              <el-form-item
                :label="$t('subjects.Answer')"
                style="flex: 1"
                prop="choose[2]"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  :placeholder="$t('subjects.Thirdchoice')"
                  v-model="addQuestion.choose[2]"
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
                <el-radio v-model="addQuestion.modelAnswer" :label="3">
                  {{ " " }}
                </el-radio>
              </el-form-item>

              <el-form-item
                style="flex: 1"
                :label="$t('subjects.Answer')"
                prop="choose[3]"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  :placeholder="$t('subjects.Fourthchoice')"
                  v-model="addQuestion.choose[3]"
                >
                </el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </template>

      <!-- If Type Is True Or False -->
      <template v-if="type == 'truefalse'">
        <div class="row">
          <div class="col-md-6 true-false">
            <div>
              <el-form-item
                :label="$t('subjects.True')"
                prop="modelAnswer"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-radio v-model="addQuestion.modelAnswer" :label="true">
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
                <el-radio v-model="addQuestion.modelAnswer" :label="false">
                  {{ $t("subjects.False") }}
                </el-radio>
              </el-form-item>
            </div>
          </div>
        </div>
      </template>

      <!-- If Type Is Complete -->
      <template v-if="type == 'complete'">
        <vs-button
          color="warn"
          class="mb-3 p-0"
          @click.prevent="addQuestion.complete.push('')"
        >
          {{ $t("subjects.Addanswer") }}
        </vs-button>
        <div class="row">
          <div
            class="col-md-6"
            v-for="(answer, index) in addQuestion.complete"
            :key="index"
          >
            <div class="d-flex">
              <el-form-item
                style="flex: 1"
                :prop="'complete[' + index + ']'"
                :rules="[{ required: true, message: $t('subjects.AnswerReq') }]"
              >
                <el-input
                  clearable
                  v-model="addQuestion.complete[index]"
                >
                </el-input>
              </el-form-item>

              <div v-if="index != 0">
                <vs-button
                  color="danger"
                  @click.prevent="addQuestion.complete.splice(index, 1)"
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
            type="danger"
            @click="cancelAdd"
          >
            {{ $t("Validation.close") }}</el-button
          >
          <el-button
            class="btn btn-org"
            type="warning"
            @click="validateAddQuestion('addQuestion')"
            >{{ $t("Validation.save") }}</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["type", "lesson", "toExam", "examId"],
  data: () => ({
    addQuestion: {
      choose: [],
      complete: [""]
    },
    fileList: [],
    categoryIcon: "",
    imageUrl: ""
  }),
  created() {
    console.log("created ", this.type);
  },
  methods: {
    validateAddQuestion(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addNewQuestion();
        } else {
          return false;
        }
      });
    },
    addNewQuestion() {
      const loading = this.$vs.loading();
      this.addQuestion.type = this.type;

      let formData = new FormData();
      formData.append("head", this.addQuestion.head);

      if (this.categoryIcon) {
        formData.append("image", this.categoryIcon);
      }

      if (this.addQuestion.type != "complete") {
        formData.append("modelAnswer", this.addQuestion.modelAnswer);
      }

      formData.append("type", this.addQuestion.type);

      switch (this.addQuestion.type) {
        case "choose":
          for (let i = 0; i < this.addQuestion.choose.length; i++) {
            formData.append(`choices[${i}]`, this.addQuestion.choose[i]);
          }

          break;
        case "complete":
          formData.append("numberOfInputs", this.addQuestion.complete.length);
          for (let i = 0; i < this.addQuestion.complete.length; i++) {
            formData.append(`modelAnswer[${i}]`, this.addQuestion.complete[i]);
          }

          break;
      }

      let qryParam = `lessons/${this.lesson}/questions`;

      this.$axios
        .post(qryParam, formData)
        .then(res => {
          (this.addQuestion = {
            choose: [],
            complete: [""]
          }),
            (this.fileList = []);
          (this.categoryIcon = ""),
            (this.imageUrl = ""),
            this.$emit("questionAddedSuccessfully");
        })
        .catch(err => {
          if (err.response.status == 403) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? "غير مسموح لك بإضافة السؤال في هذا الدرس لانه خاص بمدرس أخر"
                  : "Dont Allow To Add This Question To This Lesson Because it belongs to another teacher"
            });
          } else {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? `يوجد خطا ما`
                  : `There Are Something Wrong!`
            });
          }
        })
        .finally(() => loading.close());
    },

    addNewQuestion() {



      this.addQuestion.type = this.type;

      if(!this.addQuestion.type){

        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",
          text:
            this.$i18n.locale == "ar"
              ? "قم بإختيار نوع السؤال اولاً"
              : "Choose Question Type First"
        });


        return;
      }

      const loading = this.$vs.loading();

      let formData = new FormData();
      formData.append("head", this.addQuestion.head);

      if (this.categoryIcon) {
        formData.append("image", this.categoryIcon);
      }

      if (this.addQuestion.type != "complete") {
        formData.append("modelAnswer", this.addQuestion.modelAnswer);
      }

      formData.append("type", this.addQuestion.type);

      switch (this.addQuestion.type) {
        case "choose":
          for (let i = 0; i < this.addQuestion.choose.length; i++) {
            formData.append(`choices[${i}]`, this.addQuestion.choose[i]);
          }

          break;
        case "complete":
          formData.append("numberOfInputs", this.addQuestion.complete.length);
          for (let i = 0; i < this.addQuestion.complete.length; i++) {
            formData.append(`modelAnswer[${i}]`, this.addQuestion.complete[i]);
          }

          break;
      }
      let qryParam = `lecture/${this.lesson}/questions`;
      let theQuestionId;

      let addToLesson = this.$axios
        .post(qryParam, formData)
        .then(res => {
          // question = res.data;

          this.fileList = [];
          (this.categoryIcon = ""),
            (this.imageUrl = ""),
            (theQuestionId = res.data.id);
          if (!this.toExam) {
            this.$emit("questionAddedSuccessfully");
            this.addQuestion = {
              choose: [],
              complete: [""]
            };
            loading.close();
          }
        })
        .catch(err => {
          loading.close();
          if (err.response.status == 403) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? "غير مسموح لك بإضافة السؤال في هذا الدرس لانه خاص بمدرس أخر"
                  : "Dont Allow To Add This Question To This Lesson Because it belongs to another teacher"
            });
          } else {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? `يوجد خطا ما`
                  : `There Are Something Wrong!`
            });
          }
        });

      if (this.toExam) {
        Promise.all([addToLesson]).then(() => {
          this.$axios
            .patch(`/exams-add-questions/${this.examId}`, [
              {
                point: this.addQuestion.quesPoint,
                question: theQuestionId
              }
            ])
            .then(res => {
              this.$emit("questionAddedSuccessfully");
              this.addQuestion = {
                choose: [],
                complete: [""]
              };
            })
            .catch(() => {
              if (err.response.status == 403) {
                this.$vs.notification({
                  color: "#FA5B5A",
                  position: "top-center",

                  text:
                    this.$i18n.locale == "ar"
                      ? "غير مسموح لك بإضافة السؤال في هذا الدرس لانه خاص بمدرس أخر"
                      : "Dont Allow To Add This Question To This Lesson Because it belongs to another teacher"
                });
              } else {
                this.$vs.notification({
                  color: "#FA5B5A",
                  position: "top-center",

                  text:
                    this.$i18n.locale == "ar"
                      ? `يوجد خطا ما`
                      : `There Are Something Wrong!`
                });
              }
            })
            .finally(() => loading.close());
        });
      }
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
    }
  }
};
</script>

<style lang="scss">
.el-form.add-question-form {
  .el-upload.el-upload--picture-card {
    width: 100% !important;
  }
}
.el-form.arabic-form {
  .el-form-item__label {
    float: right !important;
    padding-right: 0 !important;
  }
}

.el-form {
  .el-form-item__label {
    width: 100%;
    color: #333 !important;
    font-weight: normal !important;
    font-size: 19px !important;
    margin-bottom: 1px !important;
  }
  .fullwidth {
    width: 100% !important;
  }
  .el-radio__inner {
    border-radius: 8px !important;
    width: 33px !important;
    height: 33px !important;
  }

  .true-false {
    .el-radio__label {
      font-size: 23px;
      padding-left: 10px;
      font-weight: 100;
    }
  }

  label[for="modelAnswer"] {
    visibility: hidden !important;
  }
}
.AddQuestionCom {
  .el-form-item__content {
    width: 100%;
  }
  .avatar-uploader {
    width: 100%;
  }
}
</style>
