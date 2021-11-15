<template>
  <div class="classes-lists">
    <div class="container-fluid">
      <div class="classes-page">


        <div class="header">
        <div>
          <h5>
            <span><i class="fas fa-book-reader"></i></span>
            {{ $t("levels.Classes") }}
          </h5>
        </div>
        <div v-if="$auth.loggedIn && $auth.user.role == 'admin'">
          <vs-button @click="openAddForm" color="#FFA400">
            {{ $t("levels.AddClass") }}
          </vs-button>
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
          <nuxt-link to="/levels/list"> {{ $i18n.locale == 'ar' ? 'المراحل' : 'Levels' }} </nuxt-link>
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
        <div v-if="allLevels.length > 0 && currLevel">
          <h6 v-if="$i18n.locale == 'ar'"> {{currLevel.nameAr}} </h6>
          <h6 v-else> {{currLevel.nameEn}} </h6>
        </div>
      </div>





      <section v-if="showEditModel" class="mt-3 mb-3 add-update-section">
        <el-form
          :model="currClassToEdit"
          ref="currClassToEdit"
          class="for-add-or-update"
        >
        <h6 class="mb-3"> {{$i18n.locale == 'ar' ? 'تعديل الصف الدراسي' : 'Edit Class'}} </h6>
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
                      v-model="currClassToEdit.nameAr"
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
                      v-model="currClassToEdit.nameEn"
                    ></el-input>
                  </el-form-item>
                </div>


              </div>
            </div>

            <div class="col-md-4">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    class="btn btn-org"
                    type="warning"
                    @click="submitUpdateForm('currClassToEdit')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button
                    class="btn btn-white"
                    type="info"
                    @click="showEditModel = false"
                    >{{ $t("Validation.close") }}</el-button
                  >
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <section v-if="showAddModel" class="mt-3 mb-3 add-update-section">
        <h6 class="mb-3"> {{$i18n.locale == 'ar' ? 'إضافة صف دراسي' : 'Add New Class'}} </h6>
        <el-form
          :model="currClassToAdd"
          ref="currClassToAdd"
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
                      v-model="currClassToAdd.nameAr"
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
                      v-model="currClassToAdd.nameEn"
                    ></el-input>
                  </el-form-item>
                </div>


              </div>
            </div>

            <div class="col-md-4">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    class="btn btn-org"
                    type="warning"
                    @click="submitAddForm('currClassToAdd')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button
                    class="btn btn-white"
                    type="info"
                    @click="showAddModel = false"
                    >{{ $t("Validation.close") }}</el-button
                  >
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>




      <h6 > {{$i18n.locale == 'ar' ? 'أبحث عن الصفوف الدارسية' : 'Search About Levels'}} </h6>
      <div class="row">
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-4">
              <div>
                <el-select
                style="width: 100%"
              clearable
              v-model="selectedLevel"
              :placeholder="$t('levels.Levels')"
              @change="getClasses(1)"
            >
              <el-option
                v-for="item in allLevels"
                :key="item.id"
                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                :value="item.id"
              >
              </el-option>
            </el-select>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div class="table-container">
        <el-table :empty-text="$i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'" :data="allClasses" style="width: 100%">
          <el-table-column prop="id" sortable :label="$t('Validation.Id')">
          </el-table-column>

          <el-table-column
            prop="nameAr"
            sortable
            :label="$t('Validation.nameAr')"
            v-if="$i18n.locale == 'ar'"
          >
          </el-table-column>

          <el-table-column
          v-else
            prop="nameEn"
            sortable
            :label="$t('Validation.nameEn')"
          >
          </el-table-column>
          <el-table-column
            prop="createdAt"
            sortable
            :label="$t('Validation.createdAt')"
          >
          </el-table-column>

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
            :label="$t('classes.Actions')"
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

  mounted() {
    this.getClasses(1);
    this.getLevels();
  },
  data() {
    return {
      currClassToAdd: {},
      showAddModel: false,
      allClasses: [],
      page: 1,
      totalPages: 1,
      isLoading: false,

      showEditModel: false,
      currClassToEdit: {},
      allLevels: [],
      selectedLevel: "",
      currLevel: {}
    };
  },
  methods: {
    getLevels() {
      const loading = this.$vs.loading();

      this.$axios
        .get(`/levels?paginate=false`)
        .then((res) => {
          this.allLevels = res.data;
          this.currLevel = this.allLevels.find((ele) => ele.id == this.$route.params.id);
        })
        .finally(() => loading.close());
    },
    getClasses(page) {
      const loading = this.$vs.loading();
      if (this.selectedLevel) {
      }
      this.$axios
        .get(
          `/levels/${
            this.selectedLevel ? this.selectedLevel : this.$route.params.id
          }/classes?page=${page}`
        )
        .then((res) => {
          res.data.docs.forEach((ele) => {
            ele.createdAt = this.$moment(ele.createdAt).fromNow();
            ele.updatedAt = this.$moment(ele.updatedAt).fromNow();
          });
          this.allClasses = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },

    addClass() {
      this.showAddModel = false;
      const loading = this.$vs.loading();

      this.$axios
        .post(`/levels/${this.selectedLevel ? this.selectedLevel : this.$route.params.id}/classes`, {
          ...this.currClassToAdd,
        })
        .then((res) => {
          this.currClassToAdd = {};
          this.getClasses(this.page);
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة الدرجة بنجاح!`
                : `Grade Added Successfully !`,
          });
          // this.$message({
          //   message: `Grade Added Successfully !`,
          //   type: "success",
          // });
        })
        .finally(() => loading.close());
    },

    updateClass() {
      this.showEditModel = false;
      const loading = this.$vs.loading();
      this.$axios
        .patch(`/classes/${this.currClassToEdit.id}`, {
          nameAr: this.currClassToEdit.nameAr,
          nameEn: this.currClassToEdit.nameEn,
        })
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت تعديل الدرجة بنجاح!`
                : `Grade Updated Successfully !`,
          });
          // this.$message({
          //   message: `Grade Updated Successfully!`,
          //   type: "success",
          // });
          this.getClasses(this.page);
        })
        .catch((err) => {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "en"
                ? `There Are Something Wrong !`
                : `هناك شيء خاطئ!`,
          });
          // this.$message.error({
          //   message: `There Are Something Wrong!`
          // });
        })
        .finally(() => loading.close());
    },
    submitUpdateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.updateClass();
        }
      });
    },

    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.addClass();
        }
      });
    },

    openEditForm(index, ele) {
      this.currClassToEdit = { ...ele };
      this.showAddModel = false;
      this.showEditModel = !this.showEditModel;
    },
    openAddForm() {
      this.showEditModel = false;
      this.showAddModel = !this.showAddModel;
    },
    confirmDelete(index, ele) {
      const loading = this.$vs.loading();
      console.log(ele);
      this.$axios
        .delete(`/classes/${ele.id}`)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت مسح الدرجة بنجاح!`
                : `Grade Deleted Successfully !`,
          });
          // this.$message({
          //   message: `Grade Deleted Successfully!`,
          //   type: "success",
          // });
          this.getClasses(this.page);
        })
        .catch((err) => {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "en"
                ? `There Are Something Wrong !`
                : `هناك شيء خاطئ!`,
          });
          // this.$message.error({
          //   message: `There Are Something Wrong !`
          // });
        })
        .finally(() => loading.close());
    },
    currentChange(e) {
      console.log(e);
      this.page = e;
      this.getClasses(e);
    },
    getClassSections(grade) {
      this.$router.push(`/classes/${grade.id}?level=${this.$route.params.id}`);
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/list.scss";
.classes-lists{
  .classes-page{
    padding: 15px;
    background: #FFF;
  }
}

</style>
