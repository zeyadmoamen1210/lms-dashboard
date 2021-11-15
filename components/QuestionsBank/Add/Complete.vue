<template>
  <div class="add-true add-new-question">
    <div class="inner-head">
      <div class="d-flex justify-content-between">
        <div>
          <h6 class="mt-2">
            {{ $t("subjects.Questiontype") }}
            <span>{{ $t("subjects.Complete") }}</span>
          </h6>
        </div>
        <div class="d-flex">
          <el-input
            type="number"
            v-if="toAddGroupQuestion"
            :placeholder="$t('subjects.Degree')"
            v-model="question.weight"
          ></el-input>
          <el-input
            type="number"
            v-else-if="toExam"
            :placeholder="$t('subjects.Degree')"
            v-model="question.point"
          ></el-input>
          <button class="edit-delete-btn" @click="removeQuestion">
            <img
              class="image-icon"
              src="@/assets/imgs/Icon-material-delete.svg"
              alt=""
            />
          </button>
        </div>
      </div>
    </div>

    <el-form
      :model="question"
      ref="questionComplete"
      :class="{
        'add-question-form': true,
        'arabic-form': $i18n.locale == 'ar',
        'english-form': $i18n.locale == 'en',
      }"
    >
      <div class="head">
        <el-form-item
          :label="$t('subjects.questionHead')"
          prop="head"
          :rules="[{ required: true, message: $t('subjects.questionHead') }]"
        >
          <el-input
            :placeholder="$t('subjects.questionHead')"
            v-model="question.head"
          ></el-input>
        </el-form-item>
      </div>

      <vs-button
        class="mb-3"
        @click.prevent="question.modelAnswer.push(' ')"
      >
        +
      </vs-button>
      <div class="row">
        <div
          class="col-md-6"
          v-for="(ans, index) in question.modelAnswer"
          :key="index"
        >
          <div class="d-flex">
            <div class="d-flex " style="flex: 1">
              <el-form-item
                class="fullwidth"
                 style="width:100%"
                :prop="`modelAnswer[${index}]`"
                :rules="[
                  {
                    required: true,
                    message: $t('subjects.AnswerReq'),
                    trigger: 'blur,change',
                  },
                ]"
              >
                <el-input
                  clearable
                  style="width:100%"
                  :placeholder="$t('subjects.Answer')"
                  v-model="question.modelAnswer[index]"
                >
                </el-input>
              </el-form-item>
            </div>

            <div v-if="index != 0">
              <button
                class="mr-2 ml-2 close"
                @click.prevent="question.modelAnswer.splice(index, 1)"
              >
                <i class="el-icon-circle-close"></i>
              </button>
            </div>
            <div v-else>
              <vs-button style="visibility: hidden"
                ><i class="el-icon-circle-close"></i
              ></vs-button>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["question", "index", "toAddGroupQuestion", "toExam"],
  methods: {
    removeQuestion() {
      this.$emit("removeQuestion", this.index);
    },
  },
  watch: {
    "question.modelAnswer"(val) {
      console.log(val);
      this.question.numberOfInputs = val.length;
    },
  },
};
</script>

<style lang="scss">
button.edit-delete-btn {
  padding: 5px 13px;
  background: #fff;
  border: 1px solid #aaaaaa;
  border-radius: 8px;
  .image-icon {
    width: 25px;
    padding: 5px;
  }
}

.close {
  color: #ff3636 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding-top: 5px;
}
.btn-org {
  background: #ffa400;
  color: #ffffff;
  font-size: 18px;
  border-radius: 6px;
}
</style>
