<template>
  <div class="exams show">
    <div v-for="(question, index) in allQuestions" :key="question.id">
      <template v-if="question.type == 'choose'">
        <Choose
          @openUpdateEvent="openUpdateQuestionModel(question)"
          @afterUpdateOrDelete="getQuestions()"
          :question="question"
          :index="Number(allQuestionsCount) + index"
          :toExam="toExam"
        >
          <template slot="add-delete-question-from-exam">
            <div class="add-delete-from-exam">
              <el-button
                class="d-block delete-from-exam-btn"
                @click="deleteQuestionFromExam(question)"
                v-if="
                  examQuestions &&
                  examQuestions.findIndex((ele) => ele.id == question.id) > -1
                "
                type="text"
                >{{ $t("subjects.RemoveFromExam") }}</el-button
              >

              <div v-else>
                <el-input
                  type="number"
                  v-model.number="question.point"
                ></el-input>
                <el-button
                  class="d-block"
                  type="text"
                  @click="addQuestionToExam(question)"
                >
                  {{ $t("subjects.AddToExam") }}
                </el-button>
              </div>
            </div>
          </template>
          <template slot="updateDelete">
            <div style="display: flex">
             <div>
                <button
                v-if="openUpdateQuestionModel"
                @click="openUpdateQuestionModel(question)"
                class="btn"
              >
                <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
              </button>
              <button v-else @click="closeUpdateQuestionModel()" class="btn">
                <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
              </button>
             </div>

              <div>
                <el-popconfirm
                :confirm-button-text="$t('Validation.delete')"
                :cancel-button-text="$t('Validation.close')"
                @confirm="deleteQuestion(question)"
                icon="el-icon-info"
                icon-color="red"
                :title="$t('Validation.AreYouSure')"
              >
                <button slot="reference" class="btn">
                  <img src="@/assets/imgs/Icon-material-delete.svg" alt="" />
                </button>
              </el-popconfirm>
              </div>
            </div>
          </template>
        </Choose>
      </template>
      <template v-if="question.type == 'truefalse'">
        <TrueFalse
          @afterUpdateOrDelete="getQuestions()"
          :question="question"
          :index="Number(allQuestionsCount) + index"
          :toExam="toExam"
        >
          <template slot="add-delete-question-from-exam">
            <div class="add-delete-from-exam">
              <el-button
                class="d-block delete-from-exam-btn"
                @click="deleteQuestionFromExam(question)"
                v-if="
                  examQuestions &&
                  examQuestions.findIndex((ele) => ele.id == question.id) > -1
                "
                type="text"
                >{{ $t("subjects.RemoveFromExam") }}</el-button
              >

              <div v-else>
                <el-input
                  type="number"
                  v-model.number="question.point"
                ></el-input>
                <el-button
                  class="d-block"
                  type="text"
                  @click="addQuestionToExam(question)"
                >
                  {{ $t("subjects.AddToExam") }}
                </el-button>
              </div>
            </div>
          </template>

          <template slot="updateDelete">
            <div class="d-flex">
             <div>
                <button
              v-if="openUpdateQuestionModel"
              @click="openUpdateQuestionModel(question)"
              class="btn"
            >
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
            <button v-else @click="closeUpdateQuestionModel()" class="btn">
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
             </div>

            <div>
              <el-popconfirm
              :confirm-button-text="$t('Validation.delete')"
              :cancel-button-text="$t('Validation.close')"
              @confirm="deleteQuestion(question)"
              icon="el-icon-info"
              icon-color="red"
              :title="$t('Validation.AreYouSure')"
            >
              <button slot="reference" class="btn">
                <img src="@/assets/imgs/Icon-material-delete.svg" alt="" />
              </button>
            </el-popconfirm>
            </div>
            </div>
          </template>
        </TrueFalse>
      </template>
      <template v-if="question.type == 'complete'">
        <Complete
          :toExam="toExam"
          @afterUpdateOrDelete="getQuestions()"
          :question="question"
          :index="Number(allQuestionsCount) + index"
        >
          <template slot="add-delete-question-from-exam">
            <div class="add-delete-from-exam">
              <el-button
                class="d-block delete-from-exam-btn"
                @click="deleteQuestionFromExam(question)"
                v-if="
                  examQuestions &&
                  examQuestions.findIndex((ele) => ele.id == question.id) > -1
                "
                type="text"
                >{{ $t("subjects.RemoveFromExam") }}</el-button
              >

              <div v-else>
                <el-input
                  type="number"
                  v-model.number="question.point"
                ></el-input>
                <el-button
                  class="d-block"
                  type="text"
                  @click="addQuestionToExam(question)"
                >
                  {{ $t("subjects.AddToExam") }}
                </el-button>
              </div>
            </div>
          </template>

          <template slot="updateDelete">
            <div class="d-flex">
              <div>
                <button
              v-if="openUpdateQuestionModel"
              @click="openUpdateQuestionModel(question)"
              class="btn"
            >
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
            <button v-else @click="closeUpdateQuestionModel()" class="btn">
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
              </div>

            <div class="d-flex">
              <el-popconfirm
              :confirm-button-text="$t('Validation.delete')"
              :cancel-button-text="$t('Validation.close')"
              @confirm="deleteQuestion(question)"
              icon="el-icon-info"
              icon-color="red"
              :title="$t('Validation.AreYouSure')"
            >
              <button slot="reference" class="btn">
                <img src="@/assets/imgs/Icon-material-delete.svg" alt="" />
              </button>
            </el-popconfirm>
            </div>
            </div>
          </template>
        </Complete>
      </template>
      <template v-if="question.type == 'paragraph'">
        <Paragraph
          :toExam="toExam"
          @afterUpdateOrDelete="getQuestions()"
          :question="question"
          :index="Number(allQuestionsCount) + index"
        >
          <template slot="add-delete-question-from-exam">
            <div class="add-delete-from-exam">
              <el-button
                class="d-block delete-from-exam-btn"
                @click="deleteQuestionFromExam(question)"
                v-if="
                  examQuestions &&
                  examQuestions.findIndex((ele) => ele.id == question.id) > -1
                "
                type="text"
                >{{ $t("subjects.RemoveFromExam") }}</el-button
              >

              <div v-else>
                <el-input
                  type="number"
                  v-model.number="question.point"
                ></el-input>
                <el-button
                  class="d-block"
                  type="text"
                  @click="addQuestionToExam(question)"
                >
                  {{ $t("subjects.AddToExam") }}
                </el-button>
              </div>
            </div>
          </template>

          <template slot="updateDelete">
            <div class="d-flex">
              <div>
                <button
              v-if="openUpdateQuestionModel"
              @click="openUpdateQuestionModel(question)"
              class="btn"
            >
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
            <button v-else @click="closeUpdateQuestionModel()" class="btn">
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
              </div>

            <div class="d-flex">
              <el-popconfirm
              :confirm-button-text="$t('Validation.delete')"
              :cancel-button-text="$t('Validation.close')"
              @confirm="deleteQuestion(question)"
              icon="el-icon-info"
              icon-color="red"
              :title="$t('Validation.AreYouSure')"
            >
              <button slot="reference" class="btn">
                <img src="@/assets/imgs/Icon-material-delete.svg" alt="" />
              </button>
            </el-popconfirm>
            </div>
            </div>
          </template>
        </Paragraph>
      </template>








<template v-if="question.type == 'voice'">
        <Voice
          :toExam="toExam"
          @afterUpdateOrDelete="getQuestions()"
          :question="question"
          :index="Number(allQuestionsCount) + index"
        >
          <template slot="add-delete-question-from-exam">
            <div class="add-delete-from-exam">
              <el-button
                class="d-block delete-from-exam-btn"
                @click="deleteQuestionFromExam(question)"
                v-if="
                  examQuestions &&
                  examQuestions.findIndex((ele) => ele.id == question.id) > -1
                "
                type="text"
                >{{ $t("subjects.RemoveFromExam") }}</el-button
              >

              <div v-else>
                <el-input
                  type="number"
                  v-model.number="question.point"
                ></el-input>
                <el-button
                  class="d-block"
                  type="text"
                  @click="addQuestionToExam(question)"
                >
                  {{ $t("subjects.AddToExam") }}
                </el-button>
              </div>
            </div>
          </template>

          <template slot="updateDelete">
            <div class="d-flex">
              <div class="d-flex">
                <button
              v-if="openUpdateQuestionModel"
              @click="openUpdateQuestionModel(question)"
              class="btn"
            >
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
            <button v-else @click="closeUpdateQuestionModel()" class="btn">
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
              </div>

            <div>
              <el-popconfirm
              :confirm-button-text="$t('Validation.delete')"
              :cancel-button-text="$t('Validation.close')"
              @confirm="deleteQuestion(question)"
              icon="el-icon-info"
              icon-color="red"
              :title="$t('Validation.AreYouSure')"
            >
              <button slot="reference" class="btn">
                <img src="@/assets/imgs/Icon-material-delete.svg" alt="" />
              </button>
            </el-popconfirm>
            </div>
            </div>
          </template>
        </Voice>
      </template>




      <template v-if="question.type == 'group'">
        <Group
          :question="question"
          :index="Number(allQuestionsCount) + index"
          :toExam="toExam"
        >
          <template slot="add-delete-question-from-exam">
            <div class="add-delete-from-exam">
              <el-button
                class="d-block delete-from-exam-btn"
                @click="deleteQuestionFromExam(question)"
                v-if="
                  examQuestions &&
                  examQuestions.findIndex((ele) => ele.id == question.id) > -1
                "
                type="text"
                >{{ $t("subjects.RemoveFromExam") }}</el-button
              >

              <div v-else>
                <el-input
                  type="number"
                  v-model.number="question.point"
                ></el-input>
                <el-button
                  class="d-block"
                  type="text"
                  @click="addQuestionToExam(question)"
                >
                  {{ $t("subjects.AddToExam") }}
                </el-button>
              </div>
            </div>
          </template>

          <template slot="updateDelete">
            <div class="d-flex">
              <div>
                <button
              v-if="openUpdateQuestionModel"
              @click="openUpdateQuestionModel(question)"
              class="btn"
            >
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
            <button v-else @click="closeUpdateQuestionModel()" class="btn">
              <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
            </button>
              </div>

            <div>
              <el-popconfirm
              :confirm-button-text="$t('Validation.delete')"
              :cancel-button-text="$t('Validation.close')"
              @confirm="deleteQuestion(question)"
              icon="el-icon-info"
              icon-color="red"
              :title="$t('Validation.AreYouSure')"
            >
              <button slot="reference" class="btn">
                <img src="@/assets/imgs/Icon-material-delete.svg" alt="" />
              </button>
            </el-popconfirm>
            </div>
            </div>
          </template>
        </Group>
      </template>

      <!-- <template v-if="question.type == 'group'">

                            <Paragraph :question="question" :index="Number(allQuestionsCount)  + index" />
                    </template>


                    <template v-if="question.type == 'voice'">
                            <Paragraph :question="question" :index="Number(allQuestionsCount)  + index" />
                    </template> -->
    </div>
  </div>
</template>

<script>
import TrueFalse from "@/components/QuestionsBank/TrueFalse";
import Choose from "@/components/QuestionsBank/Choose";
import Paragraph from "@/components/QuestionsBank/Paragraph";
import Voice from "@/components/QuestionsBank/Voice";
import Complete from "@/components/QuestionsBank/Complete";
import Group from "@/components/QuestionsBank/Group";

export default {
  components: { TrueFalse, Choose, Paragraph, Complete, Group, Voice },
  props: ["allQuestions", "toExam", "allQuestionsCount", "examQuestions"],

  data() {
    return {};
  },
  methods: {
    openUpdateQuestionModel(question) {
      console.log("hhhh")
      this.$emit("openUpdateQuesModel", question);
    },
    closeUpdateQuestionModel() {
      this.$emit("closeUpdateQuestionModel", question);
    },
    deleteQuestion(question) {
      this.$emit("deleteQuestion", { ...question });
    },
    deleteQuestionFromExam(question) {
      this.$emit("deleteQuestionFromExam", { ...question });
    },
    addQuestionToExam(question) {
      this.$emit("addQuestionToExam", { ...question });
    },
  },
};
</script>

<style lang="scss">
.show {
  &.exams {
    .btn {
      width: 38px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0.5rem;
      border: 1px solid #d8d4d4;

    }
  }
}
.add-delete-from-exam {
  display: flex;
  flex-direction: row-reverse;

  > div {
    display: flex;
    flex-direction: column-reverse;
    margin-bottom: 15px;

    .el-button {
      color: var(--yellow);
      /* font-weight: bold; */
      text-decoration: underline;
      font-size: 15px;
    }

    .el-input {
      width: 109px;
    }
  }

  .delete-from-exam-btn {
    color: var(--danger);
    /* font-weight: bold; */
    text-decoration: underline;
    font-size: 15px;
  }
}
</style>
