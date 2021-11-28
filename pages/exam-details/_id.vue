<template>
  <div class="exam-details-page">
    <div class="d-flex flex-wrap path" style="padding: 15px 0 18px;">


      <div v-if="$route.query.subject_name">
        <nuxt-link
        :to="
          `/lectures?level=${$route.query.level}&level_name=${$route.query.level_name}&subject=${$route.query.subject}&subject_name=${$route.query.subject_name}`
        ">
          {{ $route.query.subject_name }}
        </nuxt-link>
      </div>

      <div v-if="$route.query.subject_name && $route.query.lecture_name" class="divider">
        <h6>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="10"
            viewBox="0 0 7 10"
            fill="none"
          >
            <path d="M6 9.5L1.5 5L6 0.5" stroke="#B0BABF" />
          </svg>
        </h6>
      </div>







      <div v-if="$route.query.lecture_name">
        <nuxt-link
        :to="
          `/lectures/${$route.query.lecture}/material?level=${$route.query.level}&subject=${$route.query.subject}&level_name=${$route.query.level_name}&subject_name=${$route.query.subject_name}`
        ">
          {{ $route.query.lecture_name }}
        </nuxt-link>
      </div>

      <div  v-if="$route.query.exam_name" class="divider">
        <h6>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="10"
            viewBox="0 0 7 10"
            fill="none"
          >
            <path d="M6 9.5L1.5 5L6 0.5" stroke="#B0BABF" />
          </svg>
        </h6>
      </div>


      <div v-if="$route.query.exam_name">
        <h6> {{ $route.query.exam_name }} </h6>
      </div>
    </div>

    <section
      class="mb-3"
      v-if="
        questions.length > 0 &&
          Object.keys(this.currQuestion).length > 0 &&
          openUpdateModel
      "
    >
      <UpdateQuestion
        @questionUpdatedSuccessfully="questionUpdated"
        :updateQuestion="currQuestion"
        :type="currQuestion.type"
        @closeUpdateQuestionModel="closeUpdateQuestionModel"
      />
    </section>

    <div v-if="updateExamModel">
      <UpdateExam
        @examUpdatedSuccessfully="afterExamUpdated()"
        objectType="subject"
        :exam="currExam"
        @ifModelClosed="closeUpdateExam()"
      />
    </div>

    <section class="section-exam-tabs">
      <div class="edu-tabs">
        <button
          :class="{ btn: true, active: active == 1 }"
          @click="activeTabClicked(1)"
        >
          {{ $t("exams.ExamQuestions") }}
        </button>
        <button
          :class="{ btn: true, active: active == 2 }"
          @click="activeTabClicked(2)"
        >
          {{ $t("exams.QuestionsBank") }}
        </button>

        <button
          :class="{ btn: true, active: active == 3 }"
          @click="activeTabClicked(3)"
        >
          {{ $t("exams.AddNewQuestions") }}
        </button>

        <button
          :class="{ btn: true, active: active == 4 }"
          @click="activeTabClicked(4)"
        >
          {{ $t("exams.AddQuestionWithImage") }}
        </button>
      </div>
    </section>

    <section class="tab-1" v-if="active == 1">
      <div>
        <!-- <p
          @click="closeExamQuestion('subject')"
          class="exam-questions-btn pointer"
        >
          {{ $t("subjects.BackToExams") }}
        </p> -->

        <div>
          <ShowExam
            :toExam="true"
            :exam="currExam"
            @openAddQuestionsToExam="openAddQuestionsToSelectedExam"
            @openUpdateModel="openUpdateQuestionModel"
            :examQuestions="examQuestions"
            @getExamQuestion="getExamQuestions"
          >
            <div slot="update-delete">
              <div
                class="d-flex update-delete-exam text-center justify-content-center"
              >
                <div>
                  <button
                    @click="openUpdateExamModel({ ...currExam })"
                    :class="{
                      btn: true,

                      'border-right': $i18n.locale == 'en',
                      'border-left': $i18n.locale == 'ar',
                      edit: true
                    }"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      id="Capa_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 386.615 386.615"
                      style="enable-background:new 0 0 386.615 386.615;"
                      xml:space="preserve"
                    >
                      <g>
                        <g>
                          <g>
                            <path
                              d="M36.573,309.292h2.09l100.833-21.943c1.964-0.327,3.784-1.237,5.224-2.612L315.56,113.896     c12.48-12.453,19.443-29.391,19.331-47.02c0.023-17.766-6.917-34.833-19.331-47.543C303.108,6.853,286.17-0.11,268.54,0.003     c-17.742-0.157-34.76,7.028-47.02,19.853L51.201,190.696c-1.502,1.209-2.597,2.85-3.135,4.702L26.124,296.231     c-0.599,3.62,0.565,7.308,3.135,9.927C31.188,308.126,33.817,309.253,36.573,309.292z M268.54,20.901     c25.103-0.002,45.454,20.347,45.456,45.45c0,0.175-0.001,0.35-0.003,0.525c0.171,11.959-4.547,23.47-13.061,31.869     l-64.261-64.784C245.137,25.548,256.604,20.848,268.54,20.901z M222.042,49.113l64.261,64.261L137.405,261.749l-64.261-63.739     L222.042,49.113z M64.785,218.909l51.722,51.722L50.156,285.26L64.785,218.909z"
                            />
                            <path
                              d="M368.328,365.717H18.287c-5.771,0-10.449,4.678-10.449,10.449s4.678,10.449,10.449,10.449h350.041     c5.771,0,10.449-4.678,10.449-10.449S374.099,365.717,368.328,365.717z"
                            />
                          </g>
                        </g>
                      </g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                      <g></g>
                    </svg>
                  </button>
                </div>

                <!-- <div>
                  <el-popconfirm
                    :confirm-button-text="$t('Validation.delete')"
                    :cancel-button-text="$t('Validation.close')"
                    icon="el-icon-info"
                    class=""
                    @confirm="deleteExam(currExam)"
                    icon-color="red"
                    :title="$t('Validation.AreYouSure')"
                  >
                    <button slot="reference" class="btn delete">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Layer_1"
                        enable-background="new 0 0 512 512"
                        height="512"
                        viewBox="0 0 512 512"
                        width="512"
                      >
                        <g>
                          <path
                            d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"
                          />
                          <path
                            d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"
                          />
                          <path
                            d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"
                          />
                          <path
                            d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"
                          />
                        </g>
                      </svg>
                    </button>
                  </el-popconfirm>
                </div> -->
              </div>
            </div>
          </ShowExam>
        </div>
      </div>
    </section>
    <section class="tab-2" v-if="active == 2">
      <div>
        <ShowQuestions
          @addQuestionToExam="addQuestionToExam"
          @openUpdateQuesModel="openUpdateQuestionModel"
          @deleteQuestion="deleteQuestion"
          @deleteQuestionFromExam="deleteQuestionFromExam"
          :toExam="true"
          :allQuestions="questions"
          :examQuestions="examQuestions"
          :allQuestionsCount="allQuestionsCount"
        />

        <div v-if="totalPages > 1" class="mt-2">
          <!-- <vs-pagination :length="totalPages" v-model="page"></vs-pagination> -->
          <el-pagination
            class="text-center"
            background
            :current-page.sync="page"
            layout="prev, pager, next"
            :total="totalPages * 10"
          >
          </el-pagination>
        </div>
      </div>
    </section>

    <section class="tab-2" v-if="active == 3">
      <div class="d-flex mb-3">
        <div
          class="mr-1 ml-1 mb-1"
          v-if="
            $route.query.subject && !$route.query.lecture
          "
        >
          <div>
            <el-select
              clearable
              v-model="unitToAddQuestion"
              @change="getLessons()"
              :placeholder="$t('subjects.Unit')"
            >
              <el-option
                v-for="item in units"
                :key="item.id"
                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div
          class="mr-1 ml-1 mb-1"
          v-if="$route.query.subject && !$route.query.lecture"
        >
          <div>
            <el-select
              clearable
              v-model="lessonToAddQuestion"
              :placeholder="$t('subjects.Lessons')"
            >
              <el-option
                v-for="item in lessons"
                :key="item.id"
                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

      <AddManyQuestion
        @questionSavedSuccessfully="questionSavedSuccessfully"
        :toExam="true"
        :examId="$route.params.id"
        :toAddGroupQuestion="false"
        :lesson="lessonToAddQuestion"
      />
    </section>

    <section class="tab-4" v-if="active == 4">
      <div class="d-flex mb-3" style="gap: 10px">
        <div
          v-if="
            $route.query.subject && !$route.query.lecture
          "
        >
          <div>
            <el-select
              clearable
              v-model="unitToAddQuestion"
              @change="getLessons()"
              :placeholder="$t('subjects.Unit')"
            >
              <el-option
                v-for="item in units"
                :key="item.id"
                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div v-if="$route.query.subject && !$route.query.lecture">
          <div>
            <el-select
              clearable
              v-model="lessonToAddQuestion"
              :placeholder="$t('subjects.Lessons')"
            >
              <el-option
                v-for="item in lessons"
                :key="item.id"
                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div>
          <el-select
            v-model="questionType"
            filterable
            clearable
            :placeholder="$i18n.locale == 'ar' ? 'نوع السؤال ' : 'Question Type'"
          >
            <el-option
              v-for="item in questionTypes"
              :key="item.val"
              :value="item.val"
              :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
            >
              {{ $i18n.locale == 'ar' ? item.nameAr : item.nameEn }}
            </el-option>
          </el-select>
        </div>
      </div>

      <AddQuestion
        @questionAddedSuccessfully="saveGroupQuestionSuccess"
        :toExam="true"
        :examId="$route.params.id"
        :type="questionType"
        :lesson="lessonToAddQuestion"
      />
    </section>
  </div>
</template>

<script>
import ShowExam from "@/components/Exams/Show.vue";
import UpdateExam from "@/components/Exams/Update.vue";

import AddManyQuestion from "@/components/QuestionsBank/Add/ManyQuestions.vue";
import AddQuestion from "@/components/QuestionsBank/Add/Question.vue";

import ShowQuestions from "@/components/QuestionsBank/ShowQuestions.vue";
import UpdateQuestion from "@/components/QuestionsBank/Update/UpdateQuestion.vue";

export default {
  components: {
    ShowExam,
    UpdateExam,
    AddManyQuestion,
    AddQuestion,
    ShowQuestions,
    UpdateQuestion
  },
  mounted() {
    this.getExamQuestions();
    this.getQuestions();
    if (this.$route.query.lecture) {
      this.lessonToAddQuestion = this.$route.query.lecture;
    }
    if (!this.$route.query.lecture) {
      this.getLectures();
    }
    // if (this.$route.query.subject) {
    //   this.unitToAddQuestion = this.$route.query.subject;
    //   this.getLectures();
    // }
  },
  watch: {
    page(newVal, oldVal) {
      this.getQuestions();
      this.openUpdateModel = false;
      if (newVal > oldVal) {
        let theDefference = Number(newVal) - Number(oldVal);
        this.allQuestionsCount += theDefference * 10;
      } else {
        let theDefference = Number(oldVal) - Number(newVal);
        this.allQuestionsCount -= theDefference * 10;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  data() {
    return {
      questionType: "",
      unitToAddQuestion: "",
      lessonToAddQuestion: "",
      allQuestionsCount: 1,
      questions: [],
      active: 1,
      subjectUpdateModel: false,
      currExam: {},
      addExamModel: false,
      examQuestions: [],
      openUpdateModel: false,
      currQuestion: {},
      updateExamModel: false,
      page: 1,
      totalPages: 1,
      units: [],
      lessons: [],
      questionTypes: [
        { nameAr: "صح و خطأ", nameEn: "True Or False", val: "truefalse" },
        { nameAr: "إختياري", nameEn: "Choose", val: "choose" },
        // { nameAr: "مقالي", nameEn: "Paragraph", val: "paragraph" },
        // { nameAr: "أكمل", nameEn: "Complete", val: "complete" }
      ]
    };
  },
  methods: {
    questionUpdated() {
      this.openUpdateModel = false;
      this.getExamQuestions();
      this.getQuestions();
    },
    getLectures() {
      this.$axios
        .get(`/subject/${this.unitToAddQuestion}/lecture?paginate=false`)
        .then(res => {
          this.lessons = res.data;
        });
    },
    saveGroupQuestionSuccess() {
      this.getExamQuestions();
      this.active = 1;
      this.$vs.notification({
        progress: "auto",
        color: "success",
        position: "top-center",
        title: this.$i18n.locale == 'ar' ? "تم إضافة السؤال إلي الإمتحان بنجاح" : 'Question Added Successfully To Exam'
      });
    },

    closeUpdateQuestionModel() {
      console.log("hi");
      this.openUpdateModel = false;
    },
    deleteQuestion(question) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/questions/${question.id}`)
        .then(res => {
          this.$vs.notification({
            progress: "auto",
            color: "success",
            position: "top-center",
            title: this.$i18n.locale == 'ar' ? "تم حذف السؤال بنجاح" : 'Question Deleted Successfully'
          });
          this.getExamQuestions();
          this.getQuestions();
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
        .patch(`/exams/${this.$route.params.id}/questions/${question.id}`)
        .then(res => {
          this.$vs.notification({
            progress: "auto",
            color: "success",
            position: "top-center",
            title: this.$i18n.locale == 'ar' ? "تم حذف السؤال من الامتحان بنجاح" : 'Question Deleted Successfully From Exam'
          });

          this.getExamQuestions();
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

    questionSavedSuccessfully() {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhi");
      this.getQuestions();
      this.active = 1;
      this.getExamQuestions();
    },
    addQuestionToExam(question) {
      if (!question.point) {
        this.$vs.notification({
          color: "danger",
          position: "top-center",

          text: this.$i18n.locale == 'ar' ? "حدد درجة السؤال اولا" : 'Enter Question Degree First'
        });
        return;
      }

      const loading = this.$vs.loading();

      this.$axios
        .patch(`/exams-add-questions/${this.$route.params.id}`, [
          { question: question.id, point: question.point }
        ])
        .then(res => {
          question.point = "";
          this.$vs.notification({
            color: "success",
            position: "top-center",

            text: this.$i18n.locale == 'ar' ? "تم إضافة السؤال الي الامتحان بنجاح" : 'Question Added Successfully To Exam'
          });

          this.getExamQuestions();
        })
        .finally(() => loading.close());
    },
    getQuestions() {
      const loading = this.$vs.loading();

      let endPointQuery = `/subjects/${this.$route.query.subject}/questions?`;

      if (this.$route.query.unit) {
        endPointQuery += `unit=${this.$route.query.unit}&`;
      }

      if (this.$route.query.lecture) {
        endPointQuery += `object=${this.$route.query.lecture}&`;
      }

      if (this.page) {
        endPointQuery += `page=${this.page}&`;
      }

      this.$axios
        .get(endPointQuery)
        .then(res => {
          this.questions = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },
    activeTabClicked(tab) {
      this.active = tab;
    },
    closeUpdateExam() {
      this.updateExamModel = false;
    },
    afterExamUpdated() {
      this.updateExamModel = false;
      this.getExamQuestions();
    },
    openUpdateQuesModel(question) {
      this.openUpdateQuestionModel(question);
    },
    openUpdateQuestionModel(question) {
      this.openUpdateModel = true;
      this.currQuestion = { ...question };
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    openAddQuestionsToSelectedExam(e) {
      this.openAddQuestionsToExamModel = true;
      this.currExam = { ...e };
      this.active = 3;
      this.lessonTab = 1;

      this.getExamQuestions();
    },

    getExamQuestions() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/exams/${this.$route.params.id}`)
        .then(res => {
          this.currExam = res.data;
          let arr = [];
          res.data.questions.map(element => {
            arr.push({
              ...element.question,
              points: element.point,
              childrenQuestions: element.childrenQuestions
            });
          });

          console.log(arr);

          this.examQuestions = arr;
        })
        .finally(() => loading.close());
    },

    closeExamQuestion(type) {
      this.addExamModel = this.updateExamModel = false;

      this.currExam = {};
    },
    openUpdateExamModel(exam) {
      this.addExamModel = false;
      this["updateExamModel"] = true;
      if (exam.duration) {
        exam.isDuration = true;
      } else {
        exam.isDuration = false;
      }

      this.currExam = { ...exam };

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    deleteExam(exam) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/exams/${this.$route.params.id}`)
        .then(res => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف الامتحان بنجاح"
                : "Exam Deleted Successfully"
          });

          // this.$message({

          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم حذف الامتحان بنجاح"
          //       : "Exam Deleted Successfully",
          //   type: "success",
          // });
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
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/styles/bank-questions.scss";
.exam-details-page {
  padding: 15px;
  background: #fff;
  margin-top: 20px;
}
</style>
