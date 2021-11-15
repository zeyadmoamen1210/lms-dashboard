<template>
  <div class="grades">
    <div class="container-fluid">
      <div class="grades-page">
        <div class="header">
        <div>
          <h5>
            <span><i class="fas fa-book-reader"></i></span>
            {{ $route.query.level_name }}
          </h5>
        </div>
        <div v-if="$auth.loggedIn && $auth.user.role == 'admin'">
          <vs-button color="#FFA400" @click="openAddNewClass">{{
            $t("classes.AddSection")
          }}</vs-button>
        </div>
      </div>






      <div class="d-flex flex-wrap path mb-3 mt-3">
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


        <div v-if="currClass">
          <h6 v-if="$i18n.locale == 'ar'"> {{currClass.nameAr}} </h6>
          <h6 v-else> {{currClass.nameEn}} </h6>
        </div>
      </div>











      <section v-if="addClassPopOver" class="mt-3 mb-3 add-update-section">
        <h6 class="mb-3"> {{$i18n.locale == 'ar' ? 'إضافة شغُبة دراسية' : 'Add New Section'}} </h6>
        <el-form :model="addSection" ref="addSection" class="for-add-or-update pt-0" style="margin-top: 5px">
          <div class="row">

             <div class="col-md-2">
              <div>
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
                    v-model="addSection.nameAr"
                  ></el-input>
                </el-form-item>
              </div>
            </div>


            <div class="col-md-2">
              <div>
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
                    v-model="addSection.nameEn"
                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div class="col-md-4">
              <div>
                <el-form-item
                  prop="capacity"
                  :rules="[
                    {
                      required: true,
                      message: $t('classes.Capacity'),
                      trigger: 'blur',
                    },
                    { type: 'number', message: $t('Validation.number') },
                  ]"
                >
                  <el-input
                    :placeholder="$t('classes.Capacity')"
                    v-model.number="addSection.capacity"
                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div :class="{'col-md-4': !this.filterSystem,'col-md-6': this.filterSystem}">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    class="btn btn-org"
                    @click="submitForm('addSection')"
                    type="warning"
                  >
                    {{ $t("Validation.save") }}
                  </el-button>
                  <el-button
                    class="btn btn-white"
                    @click="addClassPopOver = false"
                    type="info"
                  >
                    {{ $t("Validation.close") }}
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <section v-if="updateSectionPop" class="mt-3 mb-3 add-update-section">
        <h6 class="mb-3"> {{$i18n.locale == 'ar' ? 'تعديل فصل دراسي' : 'Edit Educational Section'}} </h6>
        <div class="con-form">
          <el-form
          style="margin-top: 5px"
            :model="updateSection"
            ref="updateSection"
            class="for-add-or-update pt-0"
          >
            <div class="row">

              <div class="col-md-2">
                <div>
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
                      v-model="updateSection.nameAr"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>


              <div class="col-md-2">
                <div>
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
                      v-model="updateSection.nameEn"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>



              <div class="col-md-2">
                <div>
                  <el-form-item
                    prop="capacity"
                    :rules="[
                      {
                        required: true,
                        message: $t('classes.Capacity'),
                        trigger: 'blur',
                      },
                      { type: 'number', message: $t('Validation.number') },
                    ]"
                  >
                    <el-input
                      type="number"
                      :placeholder="$t('classes.Capacity')"
                      v-model.number="updateSection.capacity"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>



              <div class="col-md-6">
                <div class="d-flex flex-row-reverse">
                  <el-form-item>
                    <el-button
                      type="warning"
                      class="btn btn-org"
                      @click="submitUpdateForm('updateSection')"
                      >{{ $t("Validation.save") }}</el-button
                    >
                    <el-button
                      type="info"
                      class="btn btn-white"
                      @click="updateSectionPop = false"
                      >{{ $t("Validation.close") }}</el-button
                    >
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </section>




      <h6 class="search-section-label"> {{$i18n.locale == 'ar' ? 'ابحث عن الشُعب الدارسية' : 'Search About Sections'}} </h6>
      <div class="row">



        <div class="col-md-2">
          <el-select
            clearable
            style="width: 100%"
            v-model="selectedLevel"
            :placeholder="$t('classes.Levels')"
            @change="getLevelSections()"
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



      <div class="table-container mt-4">
        <el-table :empty-text="$i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'" :data="sections" style="width: 100%">
          <el-table-column
            prop="capacity"
            sortable
            :label="$t('classes.Capacity')"
          >
          </el-table-column>

          <el-table-column v-if="$i18n.locale == 'ar'" prop="nameAr" :label="$t('Validation.nameAr')">
          </el-table-column>
          <el-table-column v-else prop="nameEn" :label="$t('Validation.nameEn')">
          </el-table-column>


          <!-- <el-table-column v-if="$i18n.locale == 'ar'" prop="system.nameAr" :label="$t('classes.System')">
          </el-table-column>

          <el-table-column v-else prop="system.nameEn" :label="$t('classes.System')">
          </el-table-column> -->

          <!-- <el-table-column prop="nameEn" label="الإسم بالإنجليزية">
          </el-table-column> -->

          <el-table-column
            prop="current_capacity"
            :label="$t('classes.NumberOfStud')"
          >
          </el-table-column>




          <el-table-column  :label="$t('Validation.createdAt')" sortable>
            <template slot-scope="scope">
              <h6> {{ $moment(scope.row.createdAt).fromNow() }} </h6>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('classes.Students')"
            v-if="$auth.loggedIn && $auth.user.role == 'admin'"
          >
            <template slot-scope="scope">
              <el-button
                class="goTo"
                @click="
                  $router.push(
                    `/section/${scope.row.id}/students?level=${$route.params.id}&section_name=${$i18n.locale == 'ar' ? scope.row.nameAr : scope.row.nameEn }&level_name=${$route.query.level_name}`
                  )
                "
                type="next-level"
              >
                <span v-if="$i18n.locale === 'ar'"
                  ><i class="fas fa-arrow-left"></i
                ></span>

                {{ $t("classes.ShowStudents") }}
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
              <span class="edit" @click="hanleUpdateSection(scope.row)">
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
                @confirm="confirmDeleteSubject(scope.row)"
                :cancel-button-text="$t('Validation.close')"
                icon="el-icon-info"
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
      </div>

      <!-- <div class="col-md-3" v-for="sec in sections" :key="sec.id">
                <div class="grade">
                    <div class="d-flex">
                        <h6 class="mr-2 ml-2 title"> section / </h6>
                        <h6> {{sec.nameEn}} </h6>
                    </div>

                    <el-divider></el-divider>
                    <div>

                        <div class="d-flex">
                            <h6 class="mr-2 ml-2 title"> capacity / </h6>
                            <span>{{sec.capacity}}</span>
                        </div>

                        <el-divider></el-divider>

                        <div class="d-flex">
                            <h6 class="mr-2 ml-2 title"> reserved / </h6>
                            <span>{{sec.students.length}}</span>
                        </div>
                    </div>

                    <el-divider></el-divider>

                    <div class="mt-3 mr-2 ml-2 ">

                        <el-button @click="hanleUpdateSection(sec)" slot="reference" type="primary" icon="el-icon-edit" circle>  </el-button>
                        <el-button @click="$router.push(`/section/${sec.id}`)" type="success" icon="el-icon-more" circle></el-button>

                        <el-popconfirm
                            confirm-button-text='OK'
                            @confirm="confirmDeleteSubject(sec)"
                            cancel-button-text='No, Thanks'
                            icon="el-icon-info"
                            v-model="deleteSubjectPop"
                            icon-color="red"
                            title="Are you sure to delete this?"
                            >
                            <el-button type="danger" icon="el-icon-delete" slot="reference" circle></el-button>
                            </el-popconfirm>

                    </div>
                </div>
            </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import StarHeader from "@/components/StarHeader";
export default {
  middleware: ["auth", 'admin'],
  components: {
    StarHeader,
  },
  data() {
    return {
      isLoading: true,
      sections: [],
      secName: "",
      filterSystem: "",
      systemsOpt: {},
      addClassPopOver: false,
      addSection: {},
      deleteSubjectPop: false,
      updateSection: {},
      updateSectionPop: false,
      allLevels: [],
      allClasses: [],
      selectedClass: "",
      selectedLevel: "",
      currLevel: {},
      currClass: {}
    };
  },

  mounted() {
    this.getLevelSections();
    this.getLevels();
    this.getLevel();
  },
  methods: {
    getLevel(){
      const loading = this.$vs.loading();
      this.$axios
        .get(`/levels/${this.$route.params.id}`)
        .then((res) => {
          this.currClass = res.data;
        })
        .finally(() => loading.close());
    },
    getLevels() {
      const loading = this.$vs.loading();

      this.$axios
        .get(`/levels?paginate=false`)
        .then((res) => {
          this.allLevels = res.data;
           this.currLevel = this.allLevels.find((ele) => ele.id == this.$route.query.level);
        })
        .finally(() => loading.close());
    },
    getClasses() {
      if (!this.selectedLevel) {
        return;
      }
      const loading = this.$vs.loading();

      this.$axios
        .get(`/levels/${this.selectedLevel}/classes?paginate=false`)
        .then((res) => {
          this.allClasses = res.data;
        })
        .finally(() => loading.close());
    },

    openAddNewClass() {
      this.updateSectionPop = false;
      this.addClassPopOver = !this.addClassPopOver;
    },
    hanleUpdateSection(sec) {
      this.addClassPopOver = false;
      this.updateSectionPop = true;
      this.updateSection = { ...sec };
      this.updateSection.system = (sec.system && sec.system.id)
    },
    submitUpdateForm(updateSection) {
      console.log(updateSection);
      console.log(this.$refs[updateSection]);

      this.$refs[updateSection].validate((valid) => {
        if (valid) {
          this.updateSecInBackend();
          this.updateSectionPop = false;
        } else {
        }
      });
    },
    updateSecInBackend() {
      const loading = this.$vs.loading();
      this.$axios
        .patch(`/section/${this.updateSection.id}`, this.updateSection)
        .then((res) => {
          this.getLevelSections();
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تم تحديث القسم بنجاح!`
                : `Section Updated Successfully!`,
          });
        })
        .finally(() => loading.close());
    },
    confirmDeleteSubject(sec) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/section/${sec.id}`)
        .then((res) => {
          this.deleteSubjectPop = !this.deleteSubjectPop;
          this.getLevelSections();
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تم حذف القسم بنجاح!`
                : `Section Deleted Successfully!`,
          });
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text: err.response.data.message,
            });

            return;
          }
        })
        .finally(() => loading.close());
    },
    submitForm(addSection) {
      this.$refs[addSection].validate((valid) => {
        if (valid) {
          this.createNewSection();
        }
      });
    },
    createNewSection() {
      const loading = this.$vs.loading();
      this.$axios
        .post(
          `/level/${this.selectedLevel ? this.selectedLevel : this.$route.params.id}/sections`,
          this.addSection
        )
        .then((res) => {
          this.addClassPopOver = !this.addClassPopOver;
          this.addSection = {};
          this.getLevelSections();
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة القسم بنجاح!`
                : `Section Added Successfully!`,
          });
        })
        .finally(() => loading.close());
    },

    getLevelSections() {
      const loading = this.$vs.loading();

      this.$axios
        .get(
          `/sections?level=${this.selectedLevel ? this.selectedLevel : this.$route.params.id}`
        )
        .then((res) => {
          this.sections = res.data.docs;
          // if(this.sections.length > 0){
          //   this.secName =
          //   this.$i18n.locale == "ar"
          //     ? this.sections[0].class.nameAr
          //     : this.sections[0].class.nameEn;
          // }
        })
        .finally(() => loading.close());
    },
  },
};
</script>

<style lang="scss">
.grades {
  padding-top: 20px;

  .grades-page{
    padding: 15px;
    background: #FFF;
  }


  .search-section-label{
    font-size: 14px;
    color: #4a4a4a;
  }
  .grade {
    padding: 10px;
    background: #fff;
    border: 1px solid #e8e7e7;
    border-radius: 10px;
    margin-top: 10px;

    h6 {
      margin-bottom: 7px !important;
      margin-top: 0;
    }

    .el-divider {
      margin: 2px;
    }

    h6.title {
      font-size: 12px;
      margin-bottom: 0 !important;
      margin-top: 4px;
      color: #2c4484;
    }

    .el-button.is-circle {
      width: 31px;
      padding: 0;
      height: 28px;
      font-size: 12px;
    }
    h6 {
      margin-bottom: 0;
    }
  }
}

.add-section-pop {
  label {
    margin-bottom: 0;
  }
  .el-select {
    display: block !important;
  }
}

.el-popover.el-popper {
  max-width: 350px !important;
}


</style>
