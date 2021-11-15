<template>
  <div class="exam-solutions">
    <div class="container-fluid">
      <div class="mt-2 mb-0">
        <div class="d-flex justify-content-between">
          <div>
            <div class="header mt-1">
              <h5 style="color: var(--yellow)">
                <span
                  ><i
                    style="color: var(--yellow)"
                    class="fas fa-book-reader"
                  ></i
                ></span>
                {{
                  $i18n.locale == "ar" ? "تصحيح الإمتحانات" : "Correct Exams"
                }}
              </h5>
            </div>
          </div>
          <div v-if="currentSolutionToCorrect">
            <vs-button @click="backToAllSolutions" color="warn">
              {{ $i18n.locale == "ar" ? "جميع الإجابات" : "All Answers" }}
            </vs-button>
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap path" style="padding: 5px 0 18px;">
        <div>
          <nuxt-link to="/">
            {{ $i18n.locale == "ar" ? "الرئيسية" : "Home" }}
          </nuxt-link>
        </div>
        <div class="divider">
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
        <div>
          <h6>{{ $i18n.locale == "ar" ? "تصحيح الإمتحان" : "Correct Exams" }}</h6>
        </div>
      </div>

      <div class="correct-exam" v-if="!currentSolutionToCorrect">
        <el-table style="width: 100%" :data="examSolutions" id="">
          <el-table-column
            width="50"
            type="index"
            label="#"
            :index="indexMethod"
          >
          </el-table-column>

          <el-table-column prop="student.photo" label="الطالب">
            <template slot-scope="scope">
              <div class="d-flex student-info" style="gap:20px">
                <div>
                  <vs-avatar size="50" v-if="scope.row.student">
                    <img
                      style="width:100%;height:100%"
                      :src="scope.row.student.photo"
                      alt=""
                    />
                  </vs-avatar>
                </div>
                <div>
                  <h6 class="m-3" v-if="scope.row.student">
                    {{ scope.row.student.username }}
                  </h6>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="تاريخ حل الواجب">
            <template slot-scope="scope">
              <span>{{ $moment(scope.row.submittedAt).format("lll") }}</span>
            </template>
          </el-table-column>

          <el-table-column label="تصحيح">
            <template slot-scope="scope">
              <vs-button
                style="margin:10px auto"
                color="#168ECD"
                @click="getSolutions(scope.row)"
              >
                تصحيح الواجب
              </vs-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="correct-now" v-else>
        <div class="row">
          <div
            class="col-md-6 "
            v-for="question in currentSolutionToCorrect.questions"
            :key="question.id"
          >
            <section class="correct-card">
              <div class="question">
                <div class="question-head">
                  <h6>رأس السؤال:</h6>
                  <div
                    v-if="question.question && question.question.image"
                    class="answer-imgs d-flex flex-wrap mt-2"
                  >
                    <div>
                      <img
                        :src="question.question.image"
                        @click="openPhoto(question.question.image)"
                        alt=""
                      />
                    </div>
                  </div>
                  <h6>{{ question.question && question.question.head }}</h6>
                </div>
                <div class="question-answer">
                  <h6>إجابة الطالب:</h6>


                  <h6
                    class="mb-2"
                    v-if="
                      question.question && question.question.type != 'complete'
                    "
                  >
                    {{ question.answer }}
                  </h6>
                  <div v-else>
                    <div>
                      <ul class="model-answer-complete">
                        <li
                          v-for="(com, index) in question.answer"
                          :key="index"
                        >
                          {{ com }}
                        </li>
                      </ul>
                    </div>
                  </div>


                  <div
                    v-if="question && question.answerImage"
                    class="answer-imgs d-flex flex-wrap"
                  >
                    <div>
                      <img
                        :src="question.answerImage"
                        @click="openPhoto(question.answerImage)"
                        alt=""
                      />
                    </div>
                  </div>
                </div>

                <div class="model-answer">
                  <div class="d-flex justify-content-between mb-0">
                    <div>
                      <h6 class="the-right-answer">الإجابة النموذجية:</h6>
                    </div>
                    <!-- <div class="">
                    <span>
                      درجة السؤال:
                      <span class="degree">{{ question.point }}</span>
                    </span>
                  </div> -->
                  </div>
                  <h6
                    class="mb-2"
                    v-if="
                      question.question && question.question.type != 'complete'
                    "
                  >
                    {{ question.question.modelAnswer }}
                  </h6>
                  <div v-else>
                    <div>
                      <ul class="model-answer-complete">
                        <li
                          v-for="(com, index) in question.question.modelAnswer"
                          :key="index"
                        >
                          {{ com }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="model-answer-degree">
                  <span class="mb-2">درجتك لهذا السؤال :</span>
                  <el-input type="number" v-model="question.degree"></el-input>
                </div>
              </div>
            </section>
          </div>
        </div>

        <el-button
          class="mt-3 mb-3"
          @click="correctQuestions(currentSolutionToCorrect)"
        >
          تصحيح الواجب
        </el-button>
      </div>
      <!-- <div v-else class="no-questions-available" style="">
                <div class="no-questions-container">
                <div class="no-files" style="">
                    <img
                    src="@/assets/imgs/question-bank/Questions-cuate.svg"
                    alt=""
                    />
                </div>
                </div>
            </div> -->
    </div>
  </div>
</template>

<script>
export default {
  middleware: ["auth"],
  created() {
    this.getExamSolutions();
  },
  data() {
    return {
      examSolutions: [],
      page: 1,
      totalPages: 1,
      currentSolution: null,
      correctSolutionToStudent: false,
      currentSolutionToCorrect: null
    };
  },
  methods: {
    openPhoto(img) {
      window.open(img, "_blank").focus();
    },
    getSolutions(sol) {
      this.currentSolutionToCorrect = { ...sol };
    },
    indexMethod(index) {
      return index + 1;
    },
    getExamSolutions() {
      const loading = this.$vs.loading();

      this.$axios
        .get(`/exams/${this.$route.params.id}/solutions`)
        .then(res => {
          this.examSolutions = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },
    backToAllSolutions() {
      this.currentSolutionToCorrect = null;
    },
    correctQuestions(question) {
      if (
        question.questions.findIndex(
          ele =>
            !ele.degree ||
            (ele.degree && ele.degree.toString().trim().length == 0)
        ) >= 0
      ) {
        this.$vs.notification({
          progress: "auto",
          color: "danger",
          position: "top-center",
          title: "يجب ادخال درجات لجميع الاسئلة لهذا الطالب"
        });
        return;
      }

      if (question.questions.findIndex(ele => ele.degree < 0) >= 0) {
        this.$vs.notification({
          progress: "auto",
          color: "danger",
          position: "top-center",
          title: "هناك درجة اقل من الصفر !!"
        });
        return;
      }

      let arr = [];
      question.questions.map(ele => {
        arr.push({ question: ele.question.id, mark: Number(ele.degree) });
      });

      const loading = this.$vs.loading();
      this.$axios
        .patch(`/solutions/${question.id}/check`, [...arr])
        .then(res => {
          this.$message({
            message:
              this.$i18n.locale == "ar"
                ? "تم تصحيح الامتحان لهذا الطالب بنجاح"
                : "Exam Is Corrected Successfully For This Student",
            type: "success"
          });
          this.currentSolutionToCorrect = null;
          this.getExamSolutions();
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.$message.error({
              message:
                this.$i18n.locale == "ar"
                  ? "الدرجة المعطاة للطالب اكبر من درجة السؤال"
                  : "Degree For Question is Greater Than Points"
            });
          }
        })
        .finally(() => loading.close());
    }
  }
};
</script>

<style lang="scss">
.exam-solutions {
  margin-top: 15px;
  padding: 15px;
  background: #fff;
  .vs-avatar {
    height: 54px !important;
    width: 66px !important;
    border: 1px solid #ccc;
    img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
    }
  }
  .model-answer-complete {
    list-style-position: inside;
    list-style-type: circle;
  }
  .model-answer {
    .the-right-answer {
      margin-bottom: 15px;
      font-size: 13px;
      font-weight: bold;
    }
  }
  .model-answer-degree {
    span {
      display: block;
      font-size: 13px;
      font-weight: bold;
    }
  }
  .student {
    background: #fff;
    padding: 15px;
  }
  .correct-card {
    box-shadow: 0 4px 25px 0 #0000001a;
    padding: 15px;
    background: #fff;
    margin-bottom: 20px;
  }
  .single-solution {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    padding-top: 10px;
  }

  .question-head {
    color: var(--yellow);
    font-weight: bold;
  }
  .question-answer {
    color: var(--blue);
    font-weight: bold;
  }
  .modelanswer-complete {
    background: #f7f7f7;
    margin: 5px;
    padding: 5px;
  }

  .answer-imgs {
    img {
      max-width: 270px;
      max-height: 270px;
      cursor: pointer;
      margin: 10px 0;
      border: 1px solid #8e8e9329;
      padding: 3px;
    }
  }

  .no-questions-available {
    position: relative;

    .no-questions-container {
      position: absolute;
      top: 50%;
      left: 50%;
      height: 100%;
      transform: translate(-50%, -50%);

      .no-files {
        padding-top: 100px;

        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
