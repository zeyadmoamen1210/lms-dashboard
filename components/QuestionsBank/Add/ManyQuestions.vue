<template>
  <div class="add-many-question">
    <div
      class="questions-types"
      v-for="(question, index) in questions"
      :key="index"
    >
      <template v-if="question.type == 'choose'">
        <div class="question">
          <Choose
            :toAddGroupQuestion="
              toAddGroupQuestion ? toAddGroupQuestion : false
            "
            :toExam="toExam"
            :question="question"
            :index="index"
            @removeQuestion="removeQuestion"
          />
        </div>
      </template>

      <template v-if="question.type == 'truefalse'">
        <div class="question">
          <TrueFalse
            :toAddGroupQuestion="
              toAddGroupQuestion ? toAddGroupQuestion : false
            "
            :toExam="toExam"
            :question="question"
            :index="index"
            @removeQuestion="removeQuestion"
          />
        </div>
      </template>

      <template v-if="question.type == 'paragraph'">
        <div class="question">
          <Paragraph
            :toAddGroupQuestion="
              toAddGroupQuestion ? toAddGroupQuestion : false
            "
            :toExam="toExam"
            :question="question"
            :index="index"
            @removeQuestion="removeQuestion"
          />
        </div>
      </template>

      <template v-if="question.type == 'complete'">
        <div class="question">
          <Complete
            :toAddGroupQuestion="
              toAddGroupQuestion ? toAddGroupQuestion : false
            "
            :toExam="toExam"
            :question="question"
            :index="index"
            @removeQuestion="removeQuestion"
          />
        </div>
      </template>

      <!-- <template v-if="questionType == 'voice'">
          <AddChoose  />
        </template> -->
    </div>

    <vs-button
      v-if="questions.length > 0 && !toAddGroupQuestion"
      @click.prevent="saveQuestions()"
      class="mb-3 mt-2"
      :class="[$i18n.locale === 'ar' ? 'mr-auto' : 'ml-auto']"
      >{{ $t("subjects.AddQuestions") }}</vs-button
    >
    <vs-button
      v-if="questions.length > 0 && toAddGroupQuestion"
      @click.prevent="saveGroupQuestion()"
      class=" mb-3 mt-2"
      :class="[$i18n.locale === 'ar' ? 'mr-auto' : 'ml-auto']"
      >{{ $t("subjects.AddQuestion") }}</vs-button
    >

    <div class="add-question d-flex justify-content-between mb-3">
      <div>
        <label for="" class="type"> {{ $t("subjects.Typeofquestion") }} </label>
        <el-select
          v-model="questionType"
          filterable
          :placeholder="$t('subjects.Typeofquestion')"
          clearable
        >
          <el-option
            v-for="type in questionTypes"
            :key="type.val"
            :label="$i18n.locale == 'ar' ? type.nameAr : type.nameEn"
            :value="type.val"
          >
          </el-option>
        </el-select>
      </div>

      <div>
        <vs-button @click.prevent="addQuestion" color="warn" class="p-0">
          +
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import Choose from "@/components/QuestionsBank/Add/Choosee.vue";

import Paragraph from "@/components/QuestionsBank/Add/Paragraph.vue";
import TrueFalse from "@/components/QuestionsBank/Add/TrueFalse.vue";
import Complete from "@/components/QuestionsBank/Add/Complete.vue";
import Group from "../Group.vue";

export default {
  components: {
    Choose,
    Complete,
    Paragraph,
    TrueFalse,
    Group,
  },
  props: ["lesson", "toAddGroupQuestion", "examId", "toExam"],
  data() {
    return {
      questionTypes: [
        { nameAr: "صح و خطأ", nameEn: "True Or False", val: "truefalse" },
        { nameAr: "إختياري", nameEn: "Choose", val: "choose" },
        // { nameAr: "مقالي", nameEn: "Paragraph", val: "paragraph" },
        // { nameAr: "أكمل", nameEn: "Complete", val: "complete" },
      ],
      questionType: "",
      questions: [],
    };
  },
  methods: {
    removeQuestion(e) {
      this.questions.splice(e, 1);
    },

    validateAddManyQuestions() {
      let validate = true;

      this.questions.forEach((ele) => {
        if (!ele.head || !ele.type) {
          validate = false;
        }

        if (ele.type == "choose") {
          if (
            (ele.choices &&
              ele.choices.length > 0 &&
              !(ele.choices[0] && ele.choices[0].toString().trim() != "")) ||
            !(ele.choices[1] && ele.choices[1].toString().trim() != "") ||
            !(ele.choices[2] && ele.choices[2].toString().trim() != "") ||
            !(ele.choices[3] && ele.choices[3].toString().trim() != "") ||
            (!ele.modelAnswer && ele.modelAnswer != 0)
          ) {
            console.log("not choose");
            validate = false;
          }
        } else if (ele.type == "complete") {
          if (
            ele.modelAnswer.findIndex(
              (ele) => (ele && ele.toString().trim()) == ""
            ) > -1
          ) {
            console.log("not complete");
            validate = false;
          }
        } else if (ele.type == "truefalse") {
          if (ele.modelAnswer != true && ele.modelAnswer != false) {
            console.log("not true false");
            validate = false;
          }
        } else if (ele.type == "paragraph") {
          if (ele.modelAnswer && ele.modelAnswer.toString().trim() == "") {
            console.log("not paragraph");
            validate = false;
          }
        }

        if (this.toAddGroupQuestion) {
          if (
            ele.weight &&
            ele.weight.toString().trim() == "" &&
            Number(ele.weight) >= 0
          ) {
            validate = false;
          }
        }

        if (this.toExam) {
          if (
            ele.point &&
            ele.point.toString().trim() == "" &&
            Number(ele.point) >= 0
          ) {
            validate = false;
          }
        }

        console.log(ele);
      });

      return validate;
    },

    async saveGroupQuestion() {
      if (this.validateAddManyQuestions() == false) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "ar"
              ? "يجب ادخال جميع الاسئلة و تحديد الاجابات الصحيحة"
              : "All Questions Fields And Model Asnwer is Required ",
        });
        // this.$message.error({
        //   message:
        //     this.$i18n.locale == "ar"
        //       ? "يجب ادخال جميع الاسئلة و تحديد الاجابات الصحيحة"
        //       : "All Questions Fields And Model Asnwer is Required ",
        // });

        return;
      } else {
        await this.$emit("saveGroupQuestionSuccess", [...this.questions]);
        this.questions = [];
      }
    },

    saveQuestions() {
      console.log(this.validateAddManyQuestions());

      if (this.validateAddManyQuestions() == false) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "ar"
              ? "يجب ادخال جميع الاسئلة و تحديد الاجابات الصحيحة"
              : "All Questions Fields And Model Asnwer is Required ",
        });
        // this.$message.error({
        //   message:
        //     this.$i18n.locale == "ar"
        //       ? "يجب ادخال جميع الاسئلة و تحديد الاجابات الصحيحة"
        //       : "All Questions Fields And Model Asnwer is Required ",
        // });

        return;
      }

      console.log("this is lesson", this.lesson);

      if (!this.lesson) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "ar"
              ? "حدد الدرس الخاص بهذه الأسئلة"
              : "Determine Lesson For That Questions",
        });
        // this.$message.error({
        //   message:
        //     this.$i18n.locale == "ar"
        //       ? "حدد الدرس الخاص بهذه الأسئلة"
        //       : "Determine Lesson For That Questions",
        // });
        return;
      }

      let qryParam = "";
      if (this.toExam == true) {
        qryParam = `exams/${this.examId.id ? this.examId.id : this.examId}/lecture/${this.lesson}`;
      } else {
        qryParam = `/lecture/${this.lesson}/questions-many`;
      }

      const loading = this.$vs.loading();
      this.$axios
        .post(qryParam, [...this.questions])
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم إضافة الأسئلة بنجاح"
                : "Questions Added Successfully",
          });
          // this.$message({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم إضافة الأسئلة بنجاح"
          //       : "Questions Added Successfully",
          //   type: "success",
          // });
          this.questions = [];

          this.$emit("questionSavedSuccessfully");
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
        })
        .finally(() => loading.close());
    },

    addQuestion() {
      if (
        !this.questionType ||
        (this.questionType && this.questionType.toString().trim() == "")
      ) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "ar"
              ? "حدد نوع السؤال اولا"
              : "Determine Question Type First",
        });
        // this.$message.error({
        //   message:
        //     this.$i18n.locale == "ar"
        //       ? "حدد نوع السؤال اولا"
        //       : "Determine Question Type First",
        // });
        return;
      }

      if (this.questionType == "choose") {
        let chooseQuestion = {
          type: this.questionType,
          choices: ["", "", "", ""],
        };

        if (this.toAddGroupQuestion) {
          chooseQuestion.weight = " ";
        } else {
          chooseQuestion.point = " ";
        }

        this.questions.push(chooseQuestion);
      } else if (this.questionType == "complete") {
        let completeQuestion = {
          type: this.questionType,
          modelAnswer: [""],
        };

        if (this.toAddGroupQuestion) {
          completeQuestion.weight = " ";
        } else {
          completeQuestion.point = " ";
        }

        this.questions.push(completeQuestion);
      } else {
        let question = {
          type: this.questionType,
        };

        if (this.toAddGroupQuestion) {
          question.weight = " ";
        } else {
          question.point = " ";
        }

        this.questions.push(question);
      }

      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight, "smooth");
      }, 50);
    },
  },
};
</script>

<style lang="scss">
.add-many-question {
  .add-question {
    padding: 7px;
    background: #f9f9f9;

    border-radius: 10px;
  }

  .question {
    padding: 10px;
    box-shadow: 0 0 6px #dddddd;
    margin-bottom: 15px;
    border-radius: 5px;
  }

  .button-icon {
    width: 14px;
  }
}
.type {
  font-size: 14px;
  font-weight: 600;
}
.edit-delete-btn {
  border: none !important;
}
</style>
