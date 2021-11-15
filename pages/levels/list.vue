<template>
  <div class="levels-lists">
    <div class="container-fluid">
      <div class="levels-page">
        <div class="header">
        <div>
          <h5>
            <span><i class="fas fa-book-reader"></i></span>
            {{ $t("levels.Levels") }}
          </h5>
        </div>
        <div v-if="$auth.loggedIn && $auth.user.role == 'admin'">
          <vs-button @click="addNewLevel" color="#FFA400">
            <span v-if="$i18n.locale === 'ar'"><i class="fas fa-plus"></i></span
            >{{ $t("levels.AddLevel") }}
            <span v-if="$i18n.locale === 'en'"><i class="fas fa-plus"></i></span
          ></vs-button>
        </div>
      </div>



      <div class="d-flex flex-wrap path mb-3 mt-2">
        <div>
          <nuxt-link to="/"> {{ $i18n.locale == 'ar' ? 'الرئيسية' : 'Home' }} </nuxt-link>
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
          <h6> {{ $i18n.locale == 'ar' ? 'المراحل' : 'Levels' }}</h6>
        </div>
      </div>



      <section :title="$t('levels.UpdateLevel')" v-if="showEditModel" class="add-update-section">
        <h6 class="mb-3"> {{$i18n.locale == 'ar' ? 'تعديل المرحلة الدراسية' : 'Edit New Level'}} </h6>
        <el-form
          :model="currLevelToEdit"
          ref="currLevelToEdit"
          class="for-add-or-update pt-0"
        >
          <div class="row">
            <div class="col-md-8">
              <div class="inputs-grid row">

                <div class="col-md-4">
                  <el-form-item
                    prop="nameAr"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.nameAr'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      :placeholder="$t('Validation.nameAr')"
                      v-model="currLevelToEdit.nameAr"
                    ></el-input>
                  </el-form-item>
                </div>


                <div class="col-md-4">
                  <el-form-item
                    prop="nameEn"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.nameEn'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      :placeholder="$t('Validation.nameEn')"
                      v-model="currLevelToEdit.nameEn"
                    ></el-input>
                  </el-form-item>
                </div>


              </div>
            </div>

            <div class="col-md-4">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    type="warning"
                    class="btn btn-org"
                    @click="submitUpdateForm('currLevelToEdit')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button
                    type="info"
                    class="btn btn-white"
                    @click="showEditModel = false"
                    >{{ $t("Validation.close") }}</el-button
                  >
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <section v-if="addLevelPopup" class="add-update-section">
        <h6 class="mb-3"> {{$i18n.locale == 'ar' ? 'إضافة المرحلة الدراسية' : 'Add New Level'}} </h6>
        <div class="create-level">
          <el-form
            :model="createLevels"
            ref="createLevels"
            class="for-add-or-update pt-0"
          >
            <div class="row">
              <div class="col-md-8">
                <div class="inputs-grid row">

                  <div class="col-md-4">
                    <el-form-item
                      prop="nameAr"
                      :rules="[
                        {
                          required: true,
                          message: $t('Validation.nameAr'),
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input
                        :placeholder="$t('Validation.nameAr')"
                        v-model="createLevels.nameAr"
                      ></el-input>
                    </el-form-item>
                  </div>


                  <div class="col-md-4">
                    <el-form-item
                      prop="nameEn"
                      :rules="[
                        {
                          required: true,
                          message: $t('Validation.nameEn'),
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input
                        :placeholder="$t('Validation.nameEn')"
                        v-model="createLevels.nameEn"
                      ></el-input>
                    </el-form-item>
                  </div>


                </div>
              </div>

              <div class="col-md-4">
                <div class="d-flex flex-row-reverse">
                  <el-form-item>
                    <el-button
                      type="warning"
                      class="btn btn-org"
                      @click="submitForm('createLevels')"
                      >{{ $t("Validation.save") }}</el-button
                    >
                    <el-button
                      type="info"
                      class="btn btn-white"
                      @click="addLevelPopup = false"
                      >{{ $t("Validation.close") }}</el-button
                    >
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </section>

      <div class="table-container">
        <el-table :empty-text="$i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'" :data="allLevels" style="width: 100%">
          <el-table-column prop="id" sortable :label="$t('Validation.Id')">
          </el-table-column>

          <el-table-column
            :label="$t('Validation.nameAr')"
            sortable
            prop="nameAr"
            v-if="$i18n.locale == 'ar'"
          >
          </el-table-column>

          <el-table-column
            v-else
            :label="$t('Validation.nameEn')"
            sortable
            prop="nameEn"
          >
          </el-table-column>

          <el-table-column
            :label="$t('Validation.createdAt')"
            sortable
            prop="createdAt"
          >
          </el-table-column>


          <el-table-column :label="$t('classes.Subjects')">
            <template slot-scope="scope">
              <el-button
                class="goTo"
                @click="
                  $router.push(
                    `/levels/${scope.row.id}/subjects?${$i18n.locale == 'ar' ? 'level_name='+ scope.row.nameAr : 'level_name=' + scope.row.nameEn}`
                  )
                "
                type="next-level"
              >
                <span v-if="$i18n.locale === 'ar'"
                  ><i class="fas fa-arrow-left"></i
                ></span>

                {{ $t("classes.ShowSubjects") }}
                <span v-if="$i18n.locale === 'en'"
                  ><i class="fas fa-arrow-right"></i
                ></span>
              </el-button>
            </template>
          </el-table-column>

          <!-- <el-table-column :label="$t('levels.Levels')">
            <template slot-scope="scope">
              <el-button
                class="goTo"
                @click.native="showClasses(scope.row)"
                type="next-level"
              >
                <span v-if="$i18n.locale === 'ar'"
                  ><i class="fas fa-arrow-left"></i
                ></span>

                {{ $t("levels.ShowClasses") }}
                <span v-if="$i18n.locale === 'en'"
                  ><i class="fas fa-arrow-right"></i
                ></span>
              </el-button>
            </template>
          </el-table-column> -->


          <el-table-column :label="$t('levels.Classes')">
            <template slot-scope="scope">
              <el-button
                class="goTo"
                @click="getClassSections(scope.row)"
                type="next-level"
              >
                <span v-if="$i18n.locale === 'ar'"
                  ><i class="fas fa-arrow-left"></i
                ></span>

                {{ $t("levels.ShowSections") }}
                <span v-if="$i18n.locale === 'en'"
                  ><i class="fas fa-arrow-right"></i
                ></span>
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('Validation.Actions')"
            v-if="$auth.loggedIn && $auth.user.role == 'admin'"
          >
            <template slot-scope="scope">
              <span class="edit" @click="openEditForm(scope.$index, scope.row)">
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
                </span>

              <el-popconfirm
                :confirm-button-text="$t('Validation.delete')"
                @confirm="confirmDelete(scope.$index, scope.row)"
                :cancel-button-text="$t('Validation.close')"
                icon-color="red"
                :title="$t('Validation.AreYouSure')"
              >
                <span class="delete" slot="reference"
                  ><svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>
                </span>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          v-if="totalPages > 1"
          background
          layout="prev, pager, next"
          @current-change="currentChange"
          :total="totalPages"
        >
        </el-pagination>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ["auth", 'admin'],
  data() {
    return {
      addLevelPopup: false,
      allLevels: [],
      page: 1,
      totalPages: 1,

      showEditModel: false,
      currLevelToEdit: {},
      createLevels: {
        nameAr: "",
        nameEn: "",
      },
    };
  },
  methods: {
    getClassSections(grade) {
      this.$router.push(`/levels/${grade.id}/sections?${this.$i18n.locale == 'ar' ? 'level_name='+ grade.nameAr : 'level_name=' + grade.nameEn}`);
    },
    addNewLevel() {
      this.showEditModel = false;
      this.addLevelPopup = !this.addLevelPopup;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createNewLevel();
          this.addLevelPopup = false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    createNewLevel() {
      const loading = this.$vs.loading();

      this.$axios
        .post(`/levels`, this.createLevels)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة النظام بنجاح!`
                : `System Added Successfully!`,
          });

          this.createLevels = {};

          // this.$message({
          //   message: `System Added Successfully!`,
          //   type: "success",
          // });
          this.getLevels();
        })
        .catch((error) => {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `يوجد خطا ما`
                : `There Are Something Wrong!`,
          });
        })
        .finally(() => loading.close());
    },

    showClasses(ele) {
      this.$router.push(`/levels/${ele.id}`);
    },
    updateLevel() {
      this.showEditModel = false;
      const loading = this.$vs.loading();
      this.$axios
        .patch(`/levels/${this.currLevelToEdit.id}`, {
          nameAr: this.currLevelToEdit.nameAr,
          nameEn: this.currLevelToEdit.nameEn,
        })
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تم تحديث المستوى بنجاح!`
                : `Level Updated Successfully!`,
          });

          // this.$message({
          //   message: `Level Updated Successfully!`,
          //   type: "success",
          // });
          this.getLevels(this.page);
        })
        .catch((err) => {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `يوجد خطا ما`
                : `There Are Something Wrong!`,
          });

          // this.$message.error({
          //   message: `There Are Something Wrong!`,
          // });
        })
        .finally(() => loading.close());
    },
    submitUpdateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.updateLevel();
        }
      });
    },
    openEditForm(index, ele) {
      this.currLevelToEdit = { ...ele };
      this.addLevelPopup = false;
      this.showEditModel = !this.showEditModel;
    },
    confirmDelete(index, ele) {
      const loading = this.$vs.loading();
      console.log(ele);
      this.$axios
        .delete(`/levels/${ele.id}`)
        .then((res) => {
          this.$vs.notification({
            color: "success",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تم حذف المستوى بنجاح!`
                : `Level Deleted Successfully!`,
          });
          // this.$message({
          //   message: `Level Deleted Successfully!`,
          //   type: "success",
          // });
          this.getLevels(this.page);
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$vs.notification({
            color: "danger",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `لا يمكن حذف هذا المستوي لوجود صفوف بداخله`
                : `Dont Allow To Delete This Level Becouse Its Contains A Classes`,
          });
            return;
          }
          this.$vs.notification({
            color: "danger",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `يوجد خطا ما`
                : `There Are Something Wrong!`,
          });
          // this.$message.error({
          //   message: `There Are Something Wrong!`,
          // });
        })
        .finally(() => loading.close());
    },
    currentChange(e) {
      console.log(e);
      this.page = e;
      this.getLevels(e);
    },
    getLevels(page) {
      const loading = this.$vs.loading();

      this.$axios
        .get(`/levels?page=${page}`)
        .then((res) => {
          res.data.docs.forEach((ele) => {
            ele.createdAt = this.$moment(ele.createdAt).fromNow();
            ele.updatedAt = this.$moment(ele.updatedAt).fromNow();
          });
          this.allLevels = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },
  },
  mounted() {
    this.getLevels(1);
  },
};
</script>

<style lang="scss">
  .levels-lists{
    .levels-page{
      padding: 15px;
    background: #FFF;
    }
  }
</style>
