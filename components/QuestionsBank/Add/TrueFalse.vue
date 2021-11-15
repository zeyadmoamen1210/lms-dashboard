<template>
  <div class="add-true add-new-question">
    <div class="inner-head">
      <div class="d-flex justify-content-between">
        <div>
          <h6 class="mt-2">
            {{ $t("subjects.Questiontype") }}
            <span> {{ $t("subjects.T/F") }}</span>
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
      ref="truefalsequestion"
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

      <div class="row">
        <div class="col-md-6">
          <div class="d-flex">
            <el-form-item
              prop="modelAnswer"
              :rules="[
                { required: true, message: $t('subjects.questionHead') },
              ]"
            >
              <el-radio v-model="question.modelAnswer" :label="true">
                {{ " " }}
              </el-radio>
            </el-form-item>

            <h6 v-if="$i18n.locale == 'ar'" class="d-inline-block pt-2">
              إجابة صحيحة
            </h6>
            <h6 v-else class="d-inline-block pt-2">True</h6>
          </div>
        </div>

        <div class="col-md-6">
          <div class="d-flex">
            <el-form-item
              prop="modelAnswer"
              :rules="[
                { required: true, message: $t('subjects.questionHead') },
              ]"
            >
              <el-radio v-model="question.modelAnswer" :label="false">
                {{ " " }}
              </el-radio>
            </el-form-item>

            <h6 v-if="$i18n.locale == 'ar'" class="d-inline-block pt-2">
              إجابة خطأ
            </h6>
            <h6 v-else class="d-inline-block pt-2">False</h6>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ["question", "index", "toAddGroupQuestion", "toExam"],
  data() {
    return {};
  },
  methods: {
    removeQuestion() {
      this.$emit("removeQuestion", this.index);
    },
  },
};
</script>

<style lang="scss">
.add-new-question {
  .inner-head {
    padding: 18px 12px;
    background: #f7f7f7;
    border-bottom: 1px solid var(--yellow);
    margin-bottom: 16px;
    h6 {
      margin-bottom: 0;
      font-size: 19px;
      span {
        color: var(--yellow);
      }
    }
  }
}
</style>
