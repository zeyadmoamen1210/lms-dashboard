<template>
  <div class="section-students">
    <div class="container-fluid">
      <div class="add-student-container">
        <!-- <h4 class="page-title">
          {{ $i18n.locale == "ar" ? "الطُلاب" : "Students" }}
        </h4> -->

        <div class="header mt-1" style="padding: 0 7px">

          <h5 style="color: var(--yellow)"> <span><i style="color: var(--yellow)" class="fas fa-book-reader"></i></span> {{ $i18n.locale == "ar" ? "الطُلاب" : "Students" }}</h5>
        </div>




        <div class="d-flex flex-wrap path" style="padding: 5px 15px 0">
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
          <h6> {{ $i18n.locale == 'ar' ? 'الطُلاب' : 'Students' }}</h6>
        </div>
      </div>


        <div class="row">
          <div class="col-md-12">
            <div class="all-students">
              <UpdateUserInformation
                @saveUpdateUser="saveUpdateUser"
                @closeUpdateUser="closeUpdateUser"
                v-if="updateStudentInformationModel"
                :user="currStudent"
                :photo="studentPhoto"
                :url="studentPhoto"
              />

              <section
                class="change-subject mb-3 pb-3 add-update-section"
                v-if="openChangeSubject"
              >
                <el-form
                  :model="changeSubject"
                  ref="changeSubject"
                  class="for-add-or-update"
                >
                  <h6 class="not-margin" v-if="currStudent">
                    <span style="color: var(--yellow)">
                      {{ $t("students.updateStudentInformation") }} /
                    </span>
                    {{ currStudent.username }}
                  </h6>
                  <div class="d-flex">
                    <div class="mr-1 ml-1 mb-1">
                      <div>
                        <el-form-item
                          prop="levelVal"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.VLevel'),
                              trigger: 'blur'
                            }
                          ]"
                        >
                          <el-select
                            class="arrowEng"
                            @change="changeSubject.sectionVal = '' , getSections(changeSubject.levelVal)"
                            clearable
                            v-model="changeSubject.levelVal"
                            :placeholder="$t('students.Levels')"
                            :class="[$i18n.locale === 'en' ? 'arrowEng' : '']"
                          >
                            <el-option
                              v-for="item in levels"
                              :key="item.id"
                              :label="
                                $i18n.locale == 'ar' ? item.nameAr : item.nameEn
                              "
                              :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="mr-1 ml-1 mb-1">
                      <div>
                        <el-form-item
                          prop="sectionVal"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.required'),
                              trigger: 'blur'
                            }
                          ]"
                        >
                          <el-select
                            :class="[$i18n.locale === 'ar' ? 'arrowAr' : '']"
                            clearable
                            v-model="changeSubject.sectionVal"
                            :placeholder="$t('students.Sections')"
                          >
                            <el-option
                              v-for="item in sections"
                              :key="item.id"
                              :label="
                                $i18n.locale == 'ar' ? item.nameAr : item.nameEn
                              "
                              :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>

                    <div style="flex:1;" class="flex-row-reverse">
                      <el-form-item style="margin-top: 7px">
                        <div class="d-flex flex-row-reverse">
                          <el-button
                            class="btn btn-org"
                            style="width: auto"
                            type="warning"
                            @click="updateStudentSubject('changeSubject')"
                            >{{ $t("Validation.save") }}</el-button
                          >
                          <el-button
                            class="btn btn-white"
                            style="width: auto"
                            type="info"
                            @click="openChangeSubject = false"
                            >{{ $t("Validation.close") }}</el-button
                          >
                        </div>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
              </section>

              <div class="filters mt-2">
                <h6 style="padding: 0 12px;"> {{$i18n.locale == 'ar' ? 'أبحث عن طُلاب' : 'Search About Students'}} </h6>
                <div class="d-flex flex-wrap">
                  <div class="search-filters d-flex flex-wrap" style="flex: 1">


                    <div class="mr-1 ml-1 mb-1">
                      <div>
                        <el-select
                          clearable
                          v-model="levelVal"
                          @change="getSections(levelVal)"
                          :placeholder="$t('students.Levels')"
                        >
                          <el-option
                            v-for="item in levels"
                            :key="item.id"
                            :label="
                              $i18n.locale == 'ar' ? item.nameAr : item.nameEn
                            "
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>



                    <div class="mr-1 ml-1 mb-1">
                      <div>
                        <el-select
                          clearable
                          v-model="sectionVal"
                          @change="getStudents()"
                          :placeholder="$t('students.Sections')"
                        >
                          <el-option
                            v-for="item in sections"
                            :key="item.id"
                            :label="
                              $i18n.locale == 'ar' ? item.nameAr : item.nameEn
                            "
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>



                    <div class="mr-1 ml-1 mb-1" style="padding-top: 1px">
                      <div class="d-flex flex-row-reverse" style="width: 186px">
                        <el-input
                          id="phone"
                          :placeholder="$t('Validation.Username')"
                          type="text"
                          v-model="usernameVal"
                          @keydown.native.enter="getStudents()"
                        ></el-input>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex flex-wrap flex-row-reverse">
                    <div class="mr-1 ml-1 mb-1">
                      <div class="d-flex flex-row-reverse">
                        <el-button
                          class="btn-org hight"
                          @click="$router.push(`/students/add`)"
                          style="font-size: 13px;padding: 13px;border: none;border-radius: 14px;"
                          color="var(--blue)"
                          > {{ $i18n.locale == 'ar' ? 'إضافة طالب' : 'Add Student' }}   </el-button
                        >
                      </div>
                    </div>

                    <!-- <div class="mr-1 ml-1 mb-1">
                      <el-upload
                        class="avatar-uploader"
                        action="#"
                        :show-file-list="true"
                        :auto-upload="false"
                        :on-change="handleAddExcel"
                        :limit="1"
                        list-type="text"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        ref="excelUploader"
                      >
                        <el-button class="excel-btn" color="var(--blue)">
                          {{ $t("subjects.AddExcel") }}</el-button
                        >
                        <el-button class="excel-btn" color="var(--blue)" @click="openExcel()">
                          {{ $t("subjects.downloadExcel") }}</el-button
                        >
                      </el-upload>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>

            <el-table
              ref="studentTable"
              :empty-text="
                $i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'
              "
              :data="allStudents"
              style="width: 100%"
              class="tabel"
            >
              <el-table-column :label="$t('Validation.Img')" width="80">
                <template slot-scope="scope">
                  <img
                    class="circle-photo"
                    v-if="scope.row.photo"
                    :src="scope.row.photo"
                    alt=""
                  />
                </template>
              </el-table-column>

              <el-table-column
                :label="$t('Validation.Username')"
                sortable
                prop="username"
                width="200"
              >
              </el-table-column>

              <el-table-column
                :label="$t('Validation.Email')"
                prop="email"
                width="220"
              >
              </el-table-column>

              <el-table-column
                :label="$t('Validation.Address')"
                width="220"
                prop="address"
              ></el-table-column>
              <el-table-column :label="$t('Validation.Phone')">
                <template slot-scope="scope" >
                  <h6 v-if="scope.row.phone" style="font-size: 13px">   {{ scope.row.phone.replace('+', ' ') }} </h6>
                  <h6 v-else class="text-danger" style="font-size: 13px"> {{ $i18n.locale == 'ar' ? 'لا يوجد' : 'Not Found' }} </h6>
                </template>

              </el-table-column>

              <el-table-column :label="$t('Validation.Actions')">
                <template slot-scope="scope">

                  <div class="d-flex justify-content-center">
                    <vs-tooltip>
                      <button
                        class=" btn-assign-subject nice-btn-padding"
                        @click="handleChangeSubject(scope.row)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          id="Layer_1"
                          enable-background="new 0 0 510 510"
                          height="512"
                          viewBox="0 0 510 510"
                          width="512"
                        >
                          <g>
                            <path
                              d="m507.803 352.279-64.4-64.4c34.265-45.764 25.708-111.837-21.206-146.965v-140.914h-345c-41.355 0-75 33.645-75 75v375c0 33.084 26.916 60 60 60h360v-30h-30v-60h30c0-3.642 0-98.966 0-110.901l64.394 64.394zm-95.459-74.246c-29.242 29.242-76.824 29.242-106.066 0-29.242-29.243-29.242-76.823 0-106.066 29.241-29.241 76.823-29.243 106.066 0 29.242 29.243 29.242 76.823 0 106.066zm-350.147 111.967c-10.925 0-21.168 2.949-30 8.072v-188.072h45v180zm15-210h-45v-30h45zm0-150v90h-45v-45c0-24.813 20.186-45 45-45zm285 450h-300c-39.809-1.653-39.778-58.362 0-60h300zm-255-90v-360h285v95.3c-104.277-33.392-184.567 94.438-107.131 173.947 28.524 28.525 70.119 37.595 107.131 25.453v65.3z"
                            />
                            <path d="m137.197 60h75v30h-75z" />
                            <path d="m137.197 120h75v30h-75z" />
                          </g>
                        </svg>
                      </button>

                      <template #tooltip>
                       {{
                          $i18n.locale == "ar"
                            ? "تغير الشُعبة للطالب"
                            : "Change Section Of Student"
                        }}
                      </template>
                    </vs-tooltip>

                    <vs-tooltip>
                      <button
                        class=" btn-disable nice-btn-padding"
                        @click="enabledOrDesabled(true, scope.row)"
                        v-if="!scope.row.enabled"
                      >
                         <svg
                          xmlns="http://www.w3.org/2000/svg"
                          id="bold"
                          height="512"
                          viewBox="0 0 24 24"
                          width="512"
                        >
                          <path
                            d="m11.75 10.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.5c-.965 0-1.75.785-1.75 1.75v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-1.25h1.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.75v-.75c0-.138.112-.25.25-.25z"
                          />
                          <path
                            d="m17.75 10.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.5c-.965 0-1.75.785-1.75 1.75v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-1.25h1.75c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.75v-.75c0-.138.112-.25.25-.25z"
                          />
                          <path
                            d="m6.25 9h-.5c-.965 0-1.75.785-1.75 1.75v2.5c0 .965.785 1.75 1.75 1.75h.5c.965 0 1.75-.785 1.75-1.75v-2.5c0-.965-.785-1.75-1.75-1.75zm.25 4.25c0 .138-.112.25-.25.25h-.5c-.138 0-.25-.112-.25-.25v-2.5c0-.138.112-.25.25-.25h.5c.138 0 .25.112.25.25z"
                          />
                          <path
                            d="m12 24c-6.617 0-12-5.383-12-12s5.383-12 12-12 12 5.383 12 12-5.383 12-12 12zm0-22c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10z"
                          />
                        </svg>
                      </button>
                      <button
                        class="btn-enable nice-btn-padding"
                        @click="enabledOrDesabled(false, scope.row)"
                        v-else
                      >
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          id="Capa_1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 24.303 24.303"
                          style="enable-background:new 0 0 24.303 24.303;"
                          xml:space="preserve"
                        >
                          <g>
                            <path
                              style="fill:#030104;"
                              d="M10.269,11.298V1.883C10.269,0.844,11.113,0,12.152,0s1.883,0.844,1.883,1.883v9.415   c0,1.039-0.844,1.883-1.883,1.883S10.269,12.337,10.269,11.298z M19.616,2.761c-0.61-0.483-1.5-0.377-1.983,0.234   c-0.483,0.612-0.378,1.5,0.234,1.984c2.24,1.767,3.524,4.413,3.524,7.261c0,5.094-4.145,9.239-9.238,9.239   c-5.094,0-9.239-4.145-9.239-9.239c0-2.847,1.283-5.492,3.521-7.258c0.612-0.483,0.717-1.371,0.234-1.984   c-0.483-0.612-1.37-0.716-1.984-0.234C1.764,5.069,0.089,8.523,0.089,12.24c0,6.652,5.412,12.063,12.063,12.063   s12.063-5.412,12.063-12.063C24.215,8.521,22.538,5.067,19.616,2.761z"
                            />
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

                      <template #tooltip>
                        <span v-if="scope.row.enabled">
                          {{
                            $i18n.locale == "ar"
                              ? " تعطيل هذا الحساب"
                              : "Disable This Account"
                          }}
                        </span>
                        <span v-else>
                          {{
                            $i18n.locale == "ar"
                              ? " تفعيل هذا الحساب"
                              : "Enable This Account"
                          }}
                        </span>
                      </template>
                    </vs-tooltip>

                    <vs-tooltip
                      v-if="$auth.loggedIn && $auth.user.role == 'admin'"
                    >
                      <button
                        class=" btn-edit-user nice-btn-padding"
                        @click="updateStudentInformation(scope.row)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="492pt"
                          viewBox="0 0 492.49284 492"
                          width="492pt"
                        >
                          <path
                            d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0"
                          />
                          <path
                            d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0"
                          />
                        </svg>
                      </button>

                      <template #tooltip>
                        {{
                          $i18n.locale == "ar"
                            ? "تعديل بيانات هذا الطالب"
                            : "Update Student Information"
                        }}
                      </template>
                    </vs-tooltip>
                  </div>


                  <!-- <div class="buttons-tooltips">
                    <vs-tooltip>
                      <vs-button flat @click="handleChangeSubject(scope.row)">
                        <img
                          style="width:25px"
                          src="@/assets/imgs/chapter.svg"
                          alt=""
                        />
                      </vs-button>
                      <template #tooltip>
                        {{
                          $i18n.locale == "ar"
                            ? "تغير الشُعبة للطالب"
                            : "Update Section To This Student"
                        }}
                      </template>
                    </vs-tooltip>

                    <vs-tooltip>
                      <vs-button flat>
                        <button
                          class="btn btn-success nice-btn-padding"
                          @click="enabledOrDesabled(true, scope.row)"
                          v-if="!scope.row.enabled"
                        >
                          <span> <i class="fas fa-toggle-off"></i></span>
                        </button>
                        <button
                          class="btn btn-danger nice-btn-padding"
                          @click="enabledOrDesabled(false, scope.row)"
                          v-else
                        >
                          <span> <i class="fas fa-toggle-on"></i></span>
                        </button>
                      </vs-button>
                      <template #tooltip>
                        {{
                          $i18n.locale == "ar"
                            ? "تفعيل / تعطيل هذا الطالب"
                            : "Enable / Disable This Student"
                        }}
                      </template>
                    </vs-tooltip>

                    <vs-tooltip
                      v-if="$auth.loggedIn && $auth.user.role == 'admin'"
                    >
                      <vs-button flat>
                        <button
                          class="btn btn-danger nice-btn-padding"
                          @click="updateStudentInformation(scope.row)"
                        >
                          <span>
                            <img
                              src="@/assets/imgs/Icon-feather-edit-3.svg"
                              alt=""
                            />
                          </span>
                        </button>
                      </vs-button>
                      <template #tooltip>
                        {{
                          $i18n.locale == "ar"
                            ? "تعديل بيانات هذا الطالب"
                            : "Update Student Information"
                        }}
                      </template>
                    </vs-tooltip>
                  </div> -->
                </template>
              </el-table-column>
            </el-table>

            <div class="center con-pagination mt-4 mb-4" v-if="totalPages > 1">
              <vs-pagination color="warning" progress v-model="page" :length="totalPages" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UpdateUserInformation from "@/components/User/Update.vue";

export default {
  middleware: ["auth"],
  components: { UpdateUserInformation },
  mounted() {
    this.getStudents();
    // this.getSystems();
    this.getLevels();
  },
  data() {
    return {
      currStudent: {},
      addStudent: {},
      openChangeSubject: false,
      allStudents: [],
      addNewStudentPopup: false,
      page: 1,
      usernameVal: "",
      emailVal: "",
      totalPages: 1,
      classVal: "",
      systems: [],
      systemVal: "",
      levels: [],
      classes: [],
      classVal: "",
      levelVal: "",
      sections: [],
      sectionVal: "",
      usernameVal: "",
      emailVal: "",
      phoneVal: "",
      phoneObj: {},
      changeSubject: {},
      photo: "",
      url: "",
      fileList: [],
      excelSheet: {},
      updateStudentInformationModel: false,
      currStudent: {},
      studentPhoto: "",
      studentUrl: "",
      isLoading: null
    };
  },
  watch: {

    page() {
      this.getStudents();
    }
  },
  methods: {
    async getSectionsAndStudents(){
      await this.getStudents();
      await this.getSections(this.levelVal);
    },
    openExcel() {
      window.open(
        "https://docs.google.com/uc?export=download&id=1DXPHOe4bWf78ou3U0x-ziYX7d4jBv4At"
      );
    },
    saveUpdateUser() {
      this.updateStudentInformationModel = false;
      this.getStudents();
    },

    closeUpdateUser() {
      this.updateStudentInformationModel = false;
    },

    updateStudentInformation(user) {
      this.updateStudentInformationModel = false;
      this.openChangeSubject = false;
      setTimeout(() => {
        this.updateStudentInformationModel = true;
      }, 0);
      this.currStudent = { ...user };
      this.studentUrl = user.photo;
      this.studentPhoto = user.photo;

      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    handleAddExcel(e) {
      if(!this.sectionVal){
        this.$vs.notification({
                color: "danger",
                position: "top-center",

                text: this.$i18n.locale == 'ar' ? `اختر شُعبة اولاَ` : 'Select Section First'
        });
        this.$refs.excelUploader.clearFiles();
        return;
      }
      if (
        e.raw &&
        (e.raw.name.endsWith("xlsx") ||
          e.raw.name.endsWith("xlsm") ||
          e.raw.name.endsWith("xlsb") ||
          e.raw.name.endsWith("xltx") ||
          e.raw.name.endsWith("xltm") ||
          e.raw.name.endsWith("xls") ||
          e.raw.name.endsWith("xlt") ||
          e.raw.name.endsWith("xla") ||
          e.raw.name.endsWith("xlw") ||
          e.raw.name.endsWith("xlsx"))
      ) {
        console.log("excel");

        const loading = this.$vs.loading();
        this.excelSheet = e.raw;
        let formData = new FormData();
        formData.append("sheet", this.excelSheet);
        formData.append("section", this.sectionVal);
        this.$axios
          .post(`/students-upload`, formData)
          .then(res => {
            if (this.$i18n.locale === "en") {
              this.$vs.notification({
                color: "success",
                position: "top-center",

                text: `Excel Sheet Uploaded Successfully`
              });
            } else {
              this.$vs.notification({
                color: "success",
                position: "top-center",

                text: `تم تحميل ورقة Excel بنجاح`
              });
            }

            this.$refs.excelUploader.clearFiles();

            this.isLoading = this.$vs.loading();
            setTimeout(() => {
              this.getStudents();
            }, 2000)
            // this.$message({
            //   message: "Excel Sheet Uploaded Successfully",
            //   type: "success",
            // });
          })
          .catch(err => {
            if (err.response.status === 400) {
              if (this.$i18n.locale === "en") {
                this.$vs.notification({
                  color: "#FA5B5A",
                  position: "top-center",

                  text: `This Excel Sheet InValid !`
                });
              } else {
                this.$vs.notification({
                  color: "#FA5B5A",
                  position: "top-center",

                  text: `ورقة Excel هذه غير صالحة!`
                });
              }
              // this.$message.error({
              //   message: "This Excel Sheet InValid !",
              // });
              return;
            }
            if (this.$i18n.locale === "en") {
              this.$vs.notification({
                color: "#FA5B5A",
                position: "top-center",

                text: `Something went wrong!`
              });
            } else {
              this.$vs.notification({
                color: "#FA5B5A",
                position: "top-center",

                text: `حدث خطأ ما !`
              });
            }
            // this.$message.error({
            //   message: "حدث خطأ ما !",
            // });
          })
          .finally(() => loading.close());
      } else {
        this.$refs.excelUploader.clearFiles();
        if (this.$i18n.locale === "en") {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text: `This File Not Allowed..Please Attach Excel!`
          });
        } else {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text: `هذا الملف غير مسموح به .. الرجاء إرفاق Excel!`
          });
        }
        // this.$message.error({
        //   message: "This File Not Allowed..Please Attach Excel!",
        // });
      }
    },

    handleRemove() {
      this.excelSheet = {};
    },

    enabledOrDesabled(e, user) {
      const loading = this.$vs.loading();

      this.$axios
        .patch(`/activate/${user.id}`, { enabled: e })
        .then(res => {
          if (this.$i18n.locale === "en") {
            this.$vs.notification({
              color: "#45D7B6",
              position: "top-center",

              text: e
                ? `User Activate Successfully`
                : `User Deactivate Successfully`
            });
          } else {
            this.$vs.notification({
              color: "#45D7B6",
              position: "top-center",

              text: e ? `تنشيط المستخدم بنجاح` : `تم تعطيل حساب هذا المستخدم بنجاح`
            });
          }

          this.getStudents();
        })
        .catch(err => {
          if (this.$i18n.locale === "en") {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text: `There Are Something Wrong`
            });
          } else {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text: `هناك شيء خاطئ`
            });
          }
          // this.$message.error({
          //   message: `There Are Something Wrong`,
          // });
        })
        .finally(() => loading.close());
    },

    changeStudentSubject() {
      this.openChangeSubject = false;
      const loading = this.$vs.loading();

      this.$axios
        .patch(`/students/${this.currStudent.id}/path`, {
          section: this.changeSubject.sectionVal
        })
        .then(res => {
          if (this.$i18n.locale === "en") {
            this.$vs.notification({
              color: "#45D7B6",
              position: "top-center",

              text: `Subject Changed Successfully!`
            });
          } else {
            this.$vs.notification({
              color: "#45D7B6",
              position: "top-center",

              text: `تم تغيير الماده بنجاح!`
            });
          }
          // this.$message({
          //   message: `Subject Changed Successfully!`,
          //   type: "success",
          // });
          this.getStudents();
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.$vs.notification({
              color: "#dc3545",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? "هذه الشُعبة ممتلئة"
                  : "This Section is Locked"
            });
          }
        })
        .finally(() => loading.close());
    },

    updateStudentSubject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeStudentSubject();
        }
      });
    },

    handleChangeSubject(stud) {
      this.currStudent = { ...stud };
      window.scrollTo({ top: 0, behavior: "smooth" });

      this.currStudent = { ...stud };
      console.log(this.currStudent);

      this.changeSubject = {
        levelVal: this.currStudent.level ? this.currStudent.level.id : "",
        sectionVal: this.currStudent.section ? this.currStudent.section.id : ""
      };

      // this.getClasses(this.changeSubject.levelVal);
      this.getSections(this.changeSubject.levelVal);
      this.updateStudentInformationModel = false;
      this.openChangeSubject = true;

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    addPhoto(e) {
      if (e.target.files.length > 0) {
        this.photo = e.target.files[0];
        this.url = URL.createObjectURL(this.photo);
      }
    },
    updatePhone(val) {
      this.phoneObj = val;
    },
    addNewStudent(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.phoneObj.formattedNumber && !this.phoneObj.isValid) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `Phone Number Not Valid !`
                  : `رقم الهاتف غير صالح !`
            });
          }
          // this.$message.error({
          //   message:
          // this.$i18n.locale == "ar"
          //   ? `رقم الهاتف غير صالح !`
          //   : "Phone Number Not Valid !",
          // });
          return;
        }

        if (!this.sectionVal) {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `يرجي تحديد الفصل أولاً !`
                : `Must Select Class First !`
          });

          return;
        }

        this.addStudentInBackend();
      });
    },
    addStudentInBackend() {
      const loading = this.$vs.loading();

      let formData = new FormData();
      formData.append("username", this.addStudent.username);
      formData.append("email", this.addStudent.email);
      if (this.phoneObj.formattedNumber) {
        formData.append("phone", this.phoneObj.formattedNumber);
      }
      formData.append("section", this.sectionVal);
      formData.append("password", this.addStudent.password);
      formData.append("address", this.addStudent.address);
      if (this.photo) {
        formData.append("photo", this.photo);
      }
      formData.append(
        "mustChangePassword",
        this.addStudent.mustChange ? true : false
      );

      this.$axios
        .post(`/students`, formData)
        .then(res => {
          this.addNewStudentPopup = false;
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة الطالب بنجاح!`
                : `Student Added Successfully!`
          });
          // this.$message({
          //   message: `Student Added Successfully!`,
          //   type: "success",
          // });
          this.addStudent = {};
          this.phoneObj = {};
          this.photo = this.url = "";
          this.getStudents();
        })
        .finally(() => loading.close())
        .catch(error => {
          if (error.response && error.response.status == 400) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? `البريد الإلكتروني أو الهاتف موجود بالفعل`
                  : `Email Or Phone Already Exist`
            });
            // this.$message.error({
            //   message: `Email Or Phone Already Exist`,
            // });
          } else {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "ar"
                  ? `هناك شيء خاطئ!`
                  : `There Are Something Wrong!`
            });
            // this.$message.error({
            //   message: `There Are Something Wrong!`,
            // });
          }
        });
    },
    getStudents() {
      if(this.isLoading){
        this.isLoading.close();
      }
      const loading = this.$vs.loading({
        target: this.$refs.studentTable
      });
      let qrySrting = "/students?";



      if (this.emailVal) {
        qrySrting += "email=" + this.emailVal + "&";
      }

      if (this.usernameVal) {
        qrySrting += "username=" + this.usernameVal + "&";
      }

      if (this.phoneVal) {
        qrySrting += "username=" + this.phoneVal + "&";
      }

      // if (this.levelVal) {
      //   qrySrting += "level=" + this.levelVal + "&";
      // }

      if (this.sectionVal) {
        qrySrting += "section=" + this.sectionVal + "&";
      }

      if (this.page > 1) {
        qrySrting += "page=" + this.page + "&";
      }

      qrySrting += "limit=12&";

      if (qrySrting.endsWith("&") || qrySrting.endsWith("?")) {
        qrySrting = qrySrting.split("");
        qrySrting.splice(qrySrting.length - 1, 1);
        qrySrting = qrySrting.join("");
      }

      console.log(qrySrting);

      this.$axios
        .get(qrySrting)
        .then(res => {
          this.allStudents = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => {
          loading.close();
          if(this.isLoading){
            this.isLoading.close()
          }
        });
    },

    getSystems() {
      this.$axios.get(`/systems?paginate=false`).then(res => {
        this.systems = res.data;
      });
    },
    getLevels() {
      // const loading = this.$vs.loading();
      this.$axios.get(`/levels?paginate=false`).then(res => {
        this.levels = res.data;
      });
    },
    getClasses(val) {
      // const loading = this.$vs.loading();

      if (!val) {
        this.changeSubject.classVal = this.changeSubject.sectionVal = "";
        this.classes = this.sections = [];
      }
      this.$axios.get(`/levels/${val}/classes?paginate=false`).then(res => {
        this.classes = res.data;
      });
    },
    getSections(val) {

        this.sections = [];
        this.sectionVal = '';
      if (!val) {
        this.changeSubject.sectionVal = "";
        this.getStudents();
      }

      this.$axios
        .get(`/sections?level=${val}&paginate=false`)
        .then(res => {
          this.sections = res.data;
          // this.getStudents();
        });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/students.scss";
.section-students{
  .search-filters{
      .el-select{
          width: 186px;
      }
  }
  .add-student-container{

padding: 15px;
    background: #FFF;
}
}

</style>
