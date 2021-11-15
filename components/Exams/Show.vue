<template>
  <div class="show-exam">
    <section
      v-if="
        examQuestions.length > 0 &&
          Object.keys(this.currQuestion).length > 0 &&
          openUpdateModel
      "
      class="mb-3 questions-content"
    >
      <UpdateQuestion
        @questionUpdatedSuccessfully="questionUpdated"
        :updateQuestion="{...currQuestion}"
        :type="currQuestion.type"
        @closeUpdateQuestionModel="closeUpdateQuestionModel"
      />
    </section>

    <div class="exam-inner">
      <div class="exam-header pt-1 d-flex flex-wrap justify-content-between">
        <div class="head-info mt-4">
          <div class="text-center">
            <h6
              class="d-inline-block text-center blueColor mb-0"
              style="font-size: 20px !important"
            >
              <template v-if="exam.availability">
                {{ $i18n.locale == 'ar' ? 'متاح' : 'Available' }}
              </template>
              <template v-else>
                {{ $i18n.locale == 'ar' ? 'غير متاح' : 'Not Available' }}
              </template>
            </h6>
            <el-switch
              class="d-inline-block"
              v-model="exam.availability"
              active-color="var(--yellow)"
              inactive-color="#C4C4C4"
              disabled
            >
            </el-switch>
          </div>
          <div >
            <h6
              v-if="exam.duration"
              class="text-center yellowColor mb-0"
              style="font-size:15px !important"
            >
              {{ $t("subjects.Examduration") }} :
              <span class="yellowColor"
                >{{ exam.duration }} {{ $t("subjects.Minute") }}</span
              >
            </h6>

            <h6
              v-else
              class="text-center yellowColor mb-0"
              style="font-size:15px !important"
            >
              <span class="yellowColor"
                >{{ $i18n.locale == 'ar' ? 'لا يوجد وقت للإمتحان' : 'Exam No includes timer' }} </span
              >
            </h6>

          </div>
        </div>

        <div class="title ">
          <h6 class="text-center blueColor fw-bold pt-5">{{ exam.title }}</h6>
        </div>

        <div class="head-info mb-3 mt-4">
          <div v-if="$auth.loggedIn">
            <slot name="update-delete"></slot>
          </div>

          <h6 class="text-center blueColor mb-0">
            {{ exam.points }} {{ $t("subjects.Degree") }}
          </h6>
          <h6
            class="text-center yellowColor mb-0 mt-2"
            style="font-size:15px !important"
          >
            {{ $t("subjects.Rate") }}
            <span class="yellowColor">{{ exam.passing_percentage }} %</span>
          </h6>
        </div>
      </div>

      <!-- <div
        v-if="$auth.loggedIn && $auth.user.role == 'teacher'"
        class="d-flex flex-row-reverse "
      >
        <p
          @click="openAddQuestionsToExam()"
          class="p exam-questions-btn pointer"
        >
          {{ $t("subjects.NewQuestion") }}
        </p>
      </div> -->

      <div v-if="examQuestions.length > 0">
        <ShowQuestions
          class="mt-3"
          @deleteQuestion="deleteQuestion"
          @openUpdateQuesModel="openUpdateQuesModel"
          @deleteQuestionFromExam="deleteQuestionFromExam"
          :allQuestionsCount="1"
          :allQuestions="examQuestions"
          :examQuestions="examQuestions"
          :toExam="true"
          @closeUpdateQuestionModel="closeUpdateQuestionModel"
        />
      </div>
      <div v-else>
        <NoData />
      </div>
    </div>
  </div>
</template>

<script>
import ShowQuestions from "@/components/QuestionsBank/ShowQuestions.vue";
import NoData from "@/components/NoData.vue";
export default {
  components: { ShowQuestions, NoData },
  props: ["exam", "examQuestions"],
  mounted() {
    console.log(this.exam);
  },
  data() {
    return {
      openUpdateModel: false,
      currQuestion: {}
    };
  },
  methods: {
    closeUpdateQuestionModel() {
      console.log("hi qq");
      this.openUpdateModel = false;
    },
    questionUpdated() {
      this.openUpdateModel = false;
      this.$emit("getExamQuestion");
    },
    getQuestions() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/exams/${this.exam.id}`)
        .then(res => {
          this.exam = { ...res.data };
          let arr = [];
          res.data.questions.map(element => {
            arr.push({ ...element.question, points: element.point });
          });

          this.examQuestions = arr;
        })
        .finally(() => loading.close());
    },
    openAddQuestionsToExam() {
      this.$emit("openAddQuestionsToExam", { ...this.exam });
    },
    deleteQuestion(question) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/questions/${question.id}`)
        .then(res => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف السؤال  بنجاح"
                : "Question Deleted Successfully"
          });

          this.$emit("getExamQuestion");
        })
        .catch(err => {
          if (err.response.status == 403) {
            this.$vs.notification({
              color: "danger",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? "غير مسموح لك بحذف السؤال  لانه خاص بمدرس اخر"
                  : "Dont Allow To Delete Question Becouse its belogns to another teacher"
            });
            return;
          }

          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? "حدث خطأ ما!"
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },

    deleteQuestionFromExam(question) {
      const loading = this.$vs.loading();
      this.$axios
        .patch(`/exams/${this.exam.id}/questions/${question.id}`)
        .then(res => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف السؤال من الامتحان بنجاح"
                : "Question Deleted From Exam Successfully"
          });

          this.$emit("getExamQuestion");
        })
        .catch(err => {
          if (err.response.status == 403) {
            this.$vs.notification({
              color: "danger",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? "غير مسموح لك بحذف السؤال من الامتحان لانه خاص بمدرس اخر"
                  : "Dont Allow To Delete Question From Exam Becouse its belogns to another teacher"
            });
            return;
          }

          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? "حدث خطأ ما!"
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },

    openUpdateQuesModel(question) {
      this.$emit("openUpdateModel", { ...question });
    }
  }
};
</script>

<style lang="scss">
.show-exam {
  background: #f7f7f747;
  .exam-inner {
    padding: 0 35px 35px;
    /* outline: 1px solid #000; */
    border: 2px dashed #888888;

    .exam-header {
      .title {
        h6 {
          font-size: 25px;
          color: var(--blue);
        }
      }
      .head-info {
        h6 {
          font-size: 21px;
        }
      }
    }
  }
  .yellowColor {
    color: var(--yellow);
  }
  .blueColor {
    color: var(--blue);
  }

  .update-delete-exam {
    margin-bottom: 15px;
    .btn {
      padding: 15px !important;
      // border: 1px solid #d8d4d4;
      border-radius: 3px;
      box-shadow: none !important;
      outline: none !important;
      padding-bottom: 0;
      svg,
      img {
        width: 21px;
        height: 21px;
      }

      .edit {
        svg {
          fill: var(--blue) !important;

          path {
            fill: var(--blue) !important;
          }
        }
      }
      .delete {
        svg {
          fill: var(--danger) !important;
          path {
            fill: var(--danger) !important;
          }
        }
      }
    }
  }
}
</style>
