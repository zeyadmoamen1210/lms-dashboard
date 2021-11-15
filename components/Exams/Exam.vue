<template>
  <div class="exam">
    <div>
      <img src="@/assets/imgs/question-bank/exam.svg" alt="" />
    </div>
    <h5 class="mt-1">{{ exam.title }}</h5>
    <h5 v-if="$i18n.locale == 'ar'">{{ $moment(exam.createdAt).format("YYYY:MM:DD") }}</h5>
    <h5 v-else>{{ $moment(exam.createdAt).format("DD:MM:YYYY") }}</h5>

    <div class="update-delete-exa">
      <slot name="update-delete"></slot>
    </div>

    <div>
      <h6 class="text-success" v-if="exam.availability"> {{ $i18n.locale == 'ar' ? 'متاح للطُلاب' : 'Available For Student' }} </h6>
      <h6 class="text-danger" v-else> {{ $i18n.locale == 'ar' ? 'غير متاح للطُلاب' : 'Not Available For Student' }} </h6>
    </div>

    <div class="d-flex">
      <button @click="openExamQuestions" class="btn-show exam-question">
        {{ $t("subjects.Showexam") }}
      </button>

      <button v-if="$auth.loggedIn" @click="$router.push(`/exams/${exam.id}/solutions`)" class="btn-show exam-question">
        {{ $t("subjects.ExamSolution") }}
      </button>

    </div>


  </div>
</template>

<script>
export default {
  props: ["exam"],
  data: () => ({}),

  methods: {
    openExamQuestions() {
      this.$emit("openExamQuestion", this.exam);
    },
  },
};
</script>

<style lang="scss">
.exam {

  .update-delete-exam{
    svg{
      width: 25px;height:25px;
    }
    .edit{
      svg{
        path{
          fill: var(--blue);
        }
      }
    }
    .delete{
      svg{
        path{
          fill: var(--danger);
        }
      }
    }
  }


        border-radius: 7px;
    /* box-shadow: 0 0 3px 0 #dddddd; */
    padding: 15px;
    margin-bottom: 15px;
    text-align: center;
    box-shadow: 0 4px 25px 0 00000014;
    transition: all .5s ease;
    background: #FFF;
    box-shadow: 0 0 3px 0px #00000026;

    &:hover{
      transform: translateY(-10px);
    }
  h5 {
    font-size: 16px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn-show {
    font-size: 16px !important;
    margin: 1rem 0 0 !important;

    border: none;
    background-color: #fffbef;
    border-radius: 5px;
    width: 100%;
    margin-top: 5px;
    font-size: 15px !important;
    padding: 6px;

  }
  .update-delete-exam {
    // border: 1px solid #ddd;
    border-radius: 5px;

    .border-right {
      border-right: 1px solid #ddd;
    }
    .border-left {
      border-left: 1px solid #ddd;
    }
  }

  button {
    box-shadow: none;
    outline: none;

  }

  .btn:not(:disabled):not(.disabled) {
    box-shadow: none;
    outline: none;
  }
  .btn {
    display: flex;
    // width: 77px;
    // height: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    width: 100%;
  }

  .edit {
    color: var(--blue) !important;
  }
  .delete {
    color: var(--yellow);
  }
  .exam-question {
    color: var(--yellow);
    border: none;
    background-color: #fffbef;
    border-radius: 5px;
    width: 100%;
    margin-top: 5px;
    font-size: 13px !important;
  }
}
</style>
