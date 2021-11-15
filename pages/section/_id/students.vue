<template>
  <div class="section-students">
    <div class="container-fluid">
      <div class="add-student-container">
        <div class="row">
          <div class="col-md-12">
            <div class="all-students">
              <div class="header mt-1">
                <h5 style="color: var(--yellow)">
                  <span
                    ><i
                      style="color: var(--yellow)"
                      class="fas fa-book-reader"
                    ></i
                  ></span>
                  {{ $i18n.locale == "ar" ? "الطُلاب" : "Students" }}
                </h5>
              </div>

              <div class="d-flex flex-wrap path mb-3 mt-3">

                <div>
                  <nuxt-link to="/levels/list">
                    {{ $i18n.locale == "ar" ? "المراحل" : "Levels" }}
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
                <div v-if="$route.query.level_name">
                  <nuxt-link :to="`/levels/${$route.query.level}/sections?level_name=${$route.query.level_name}`" v-if="$i18n.locale == 'ar'">{{ $route.query.level_name }}</nuxt-link>
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


                <div v-if="$route.query.section_name">
                  <h6 v-if="$i18n.locale == 'ar'">{{ $route.query.section_name }}</h6>
                </div>
              </div>

              <UpdateUserInformation
                @saveUpdateUser="saveUpdateUser"
                @closeUpdateUser="closeUpdateUser"
                v-if="updateStudentInformationModel"
                :user="currStudent"
                :photo="studentPhoto"
                :url="studentPhoto"
              />

              <section
                class="change-subject mb-3 pb-3"
                v-if="openChangeSubject"
              >
                <el-form
                  :model="changeSubject"
                  ref="changeSubject"
                  class="for-add-or-update"
                >
                  <h6 class="not-margin" v-if="currStudent">
                    <span style="color: var(--yellow)">
                      {{ $t("students.ChangeSectionStudent") }} /
                    </span>
                    {{ currStudent.username }}
                  </h6>
                  <div class="d-flex">

                    <div class="mr-1 ml-1">
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
                            @change="getSectionsFromLevel(changeSubject.levelVal)"
                            clearable
                            v-model="changeSubject.levelVal"
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
                        </el-form-item>
                      </div>
                    </div>


                    <div class="mr-1 ml-1">
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
                            clearable
                            v-model="changeSubject.sectionVal"
                            :placeholder="$t('students.Sections')"
                          >
                            <el-option
                              v-for="item in [...changeSubjectSections]"
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
                <h6 style="padding: 0 12px;">
                  {{
                    $i18n.locale == "ar"
                      ? "أبحث عن طُلاب"
                      : "Search About Students"
                  }}
                </h6>
                <div class="d-flex flex-wrap">
                  <div class="search-filters d-flex flex-wrap" style="flex: 1">


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
                          @click="
                            $router.push(
                              `/students/add?level=${$route.query.level}&section=${sectionVal ? sectionVal : $route.params.id}&section_name=${$route.query.section_name}&level_name=${$route.query.level_name}`
                            )
                          "
                          style="font-size: 13px;padding: 13px;border: none;border-radius: 14px;"
                          color="var(--blue)"
                        >
                          {{
                            $i18n.locale == "ar" ? "إضافة طالب" : "Add Student"
                          }}
                        </el-button>
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
                        <el-button
                          class="excel-btn"
                          color="var(--blue)"
                          @click="openExcel()"
                        >
                          {{ $t("subjects.downloadExcel") }}</el-button
                        >
                      </el-upload>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>

            <el-table
              ref="studentsTable"
              :empty-text="
                $i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'
              "
              :data="allStudents"
              style="width: 100%"
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
                width="220"
                sortable
                prop="username"
              >
              </el-table-column>

              <el-table-column
                :label="$t('Validation.Email')"
                prop="email"
                width="250"
              >
              </el-table-column>

              <el-table-column
                :label="$t('Validation.Address')"
                prop="address"
                width="220"
              ></el-table-column>


              <el-table-column :label="$t('Validation.Level')">
                <template slot-scope="scope" v-if="scope.row.level">
                  {{ $i18n.locale == 'ar' ? scope.row.level.nameAr : scope.row.level.nameEn }}
                </template>
                <h6 v-else>-</h6>
              </el-table-column>

              <el-table-column :label="$t('Validation.Section')">
                <template slot-scope="scope" v-if="scope.row.section">
                  {{ $i18n.locale == 'ar' ? scope.row.section.nameAr : scope.row.section.nameEn }}
                </template>
                <h6 v-else>-</h6>
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
              <vs-pagination
                color="warning"
                progress
                v-model="page"
                :length="totalPages"
              />
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
  components: { UpdateUserInformation },
  middleware: ["auth"],
  mounted() {

    this.getStudents();
    this.getLevels();

    this.getSections();

    this.getSection();
  },
  data() {
    return {
      excelSheet: {},
      currClass: {},
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
      fileList: [],
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
      updateStudentInformationModel: false,
      studentPhoto: "",
      studentUrl: "",
      currLevel: {},
      currSection: {},
      isLoading: null,
      changeSubjectSections: []
    };
  },

  methods: {
    handleRemove() {
      this.excelSheet = {};
    },
    handleAddExcel(e) {
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
        formData.append("section", this.$route.params.id);
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
            }, 2000);
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

    openExcel() {
      window.open(
        "https://res.cloudinary.com/hamza2021/raw/upload/v1627995079/%D8%A7%D9%84%D8%B7%D9%84%D8%A7%D8%A8_fnjkdn.xlsx"
      );
    },

    getSection() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/section/${this.$route.params.id}`)
        .then(res => {
          this.currSection = res.data;
        })
        .finally(() => loading.close());
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

    changeStudentSubject() {
      this.openChangeSubject = false;
      const loading = this.$vs.loading();

      this.$axios
        .patch(`/students/${this.currStudent.id}/path`, {
          section: this.changeSubject.sectionVal
            ? this.changeSubject.sectionVal
            : this.$route.params.id
        })
        .then(res => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تم تغيير الشُعبة بنجاح!`
                : `Section Changed Successfully!`
          });
          // this.$message({
          //   message: `Subject Changed Successfully!`,
          //   type: "success",
          // });
          this.getStudents();
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
      window.scrollTo({ top: 0, behavior: "smooth" });

      this.currStudent = { ...stud };
      console.log(this.currStudent);

      this.changeSubject = {
        levelVal: this.currStudent.level ? this.currStudent.level.id : "",
        classVal: this.currStudent.class ? this.currStudent.class.id : "",
        sectionVal: this.currStudent.section ? this.currStudent.section.id : ""
      };

      // this.getSections(this.changeSubject.classVal);
      this.openChangeSubject = true;
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
          if (!this.phoneObj.isValid) {
            this.$message.error({
              message: `Please Enter A Valid Number !`
            });
            return;
          }

          this.addStudentInBackend();
        }
      });
    },
    addStudentInBackend() {
      const loading = this.$vs.loading();

      let formData = new FormData();
      formData.append("username", this.addStudent.username);
      formData.append("email", this.addStudent.email);
      formData.append("phone", this.phoneObj.formattedNumber);
      formData.append("section", this.$route.params.id);
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
                ? `تم أضافه المادة بنجاح!`
                : `Subject Added Successfully!`
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
            this.$message.error({
              message: `Email Or Phone Already Exist`
            });
          } else {
            this.$message.error({
              message: `There Are Something Wrong!`
            });
          }
        });
    },
    getStudents() {
      if (this.isLoading) {
        this.isLoading.close();
      }

      const loading = this.$vs.loading({
        target: this.$refs.studentsTable
      });

      let qrySrting = "/students?";

      if (this.systemVal) {
        qrySrting += "system=" + this.systemVal + "&";
      }

      if (this.emailVal) {
        qrySrting += "email=" + this.emailVal + "&";
      }

      if (this.usernameVal) {
        qrySrting += "username=" + this.usernameVal + "&";
      }

      if (this.phoneVal) {
        qrySrting += "username=" + this.phoneVal + "&";
      }


      if (this.sectionVal ) {
        qrySrting += "section=" + this.sectionVal + "&";
      }else if (!this.sectionVal){
        qrySrting += "section=" + this.$route.params.id + "&";
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
          if (this.isLoading) {
            this.isLoading.close();
          }
        });
    },

    getLevels() {
      this.$axios.get(`/levels?paginate=false`).then(res => {
        this.levels = res.data;
        this.currLevel = this.levels.find(
          ele => ele.id == this.$route.query.level
        );
      });
    },

    getSections() {
      this.$axios
        .get(`/sections?level=${this.$route.query.level}&paginate=false`)
        .then(res => {
          this.sections = res.data;
          this.changeSubjectSections = [...this.sections];
          this.getStudents();
        });
    },


    getSectionsFromLevel(level) {
      this.changeSubject.sectionVal = '';
      if(!level){
        this.changeSubjectSections = []
      }
      this.$axios
        .get(`/sections?level=${level}&paginate=false`)
        .then(res => {
          this.changeSubjectSections = res.data;

        });
    }


  }
};
</script>

<style lang="scss">
.section-students {
  padding: 15px;
  .add-student-container {
    // background: #fff;
    // box-shadow: 0 1px 13px -3px #0000000f;
    // border: 1px solid #f3f3f3;
    .add-new-students {
      padding: 26px 12px 3px;
      background: #464545;
      background: #f9f9f9;
      div {
        &:first-of-type {
          h5 {
            color: var(--blue);
          }
        }
      }
      .attach-photo {
        width: 84px;
        height: 84px;
        overflow: hidden;
        position: relative;
        margin: auto;
        padding: 11px;
        border-radius: 50%;
        border: 5px #ddd;
        border-style: double;
        background: #fff;
        margin-top: 15px;
        input[type="file"] {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }
        img {
          width: 100%;
        }
      }
    }
    .all-students {
      padding: 10px;
    }
  }

  .el-table__row {
    .el-button.el-button--primary.is-circle {
      padding: 0 !important;
      margin: 0 !important;
    }
  }

  .edit-user {
    .vs-button__content {
      padding: 3px !important;
    }
  }
}
</style>

<style lang="scss">
@import "@/assets/styles/students.scss";
.add-student-container {
  padding: 15px;
  background: #fff;
}
</style>
