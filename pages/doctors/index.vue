<template>
  <div class="section-teachers">
    <div class="container-fluid">
      <div class="add-teacher-container">


        <div class="header mt-3">

          <h5 style="color: var(--yellow)"> <span><i style="color: var(--yellow)" class="fas fa-book-reader"></i></span> {{ $i18n.locale == "ar" ? "الدكاترة" : "Doctors" }}</h5>
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
          <h6> {{ $i18n.locale == 'ar' ? 'الدكاترة' : 'Doctors' }}</h6>
        </div>
      </div>



        <div class="row">
          <div class="col-md-12">
            <div class="all-teachers">
              <UpdateUserInformation
                @saveUpdateUser="saveUpdateUser"
                @closeUpdateUser="closeUpdateUser"
                v-if="updateTeacherInformationModel"
                :user="currTeacher"
                :photo="teacherPhoto"
                :url="teacherUrl"
              />

              <section
                class="change-subject mt-4 mb-4 add-update-section"
                v-if="openChangeSubject"
              >

                <el-form
                  :model="changeSubject"
                  ref="changeSubject"
                  class="for-add-or-update"
                >
                  <h6>
                    <span style="color: var(--yellow)">
                      {{ $t("teachers.teacher") }} /
                    </span>
                    {{ currTeacher.username }}
                  </h6>

                  <div class="d-flex">
                    <div
                      class="ml-1 mr-1 p-0"
                      :class="[$i18n.locale === 'ar' ? 'mr-1' : 'ml-1']"
                    >
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
                            @change="getSubjectsAndSections(changeSubject.levelVal)"
                            clearable
                            v-model="changeSubject.levelVal"
                            :placeholder="$t('levels.Levels')"
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



                    <div
                      class="ml-1 mr-1 p-0"
                      :class="[$i18n.locale === 'ar' ? 'mr-1' : 'ml-1']"
                    >
                      <div>
                        <el-form-item
                          prop="sectionVal"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.VSection'),
                              trigger: 'blur'
                            }
                          ]"
                        >
                          <el-select
                            clearable
                            v-model="changeSubject.sectionVal"
                            :placeholder="$t('levels.Sections')"
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


                    <div
                      style="flex: 1; display:flex"
                      class="ml-1 mr-1 p-0"
                      :class="[$i18n.locale === 'ar' ? 'mr-1' : 'ml-1']"
                    >
                      <div style="flex: 1">
                        <el-form-item
                          prop="subjectVal"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.VSubject'),
                              trigger: 'blur'
                            }
                          ]"
                        >
                          <el-select
                            style="width: 100%"
                            v-model="changeSubject.subjectVal"
                            multiple
                            class="multi"
                            collapse-tags
                            :placeholder="$t('classes.Subjects')"
                          >
                            <el-option
                              v-for="item in subjects"
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

                    <div class="ml-1 mr-1 justify-content-end" style="flex: 1">
                      <div class="d-flex flex-row-reverse">
                        <el-form-item>
                          <el-button
                            class="btn btn-org"
                            type="warning"
                            @click="updateTeacherSubject('changeSubject')"
                          >
                            {{ $t("subjects.AssignToTeacher") }}
                          </el-button>
                        </el-form-item>

                        <el-form-item>
                          <el-button
                            class="btn btn-white"
                            @click="openChangeSubject = false"
                            >{{ $t("Validation.close") }}</el-button
                          >
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </el-form>
              </section>

              <div class="filters mt-2 mb-2">
                <!-- <div>
                  <label for="email">Email</label>
                  <el-input
                    id="email"
                    placeholder="Email"
                    type="email"
                    v-model="emailVal"
                    @keydown.native.enter="getStudents()"
                  ></el-input>
                </div>

                <div>
                  <label for="username">User Name</label>
                  <el-input
                    id="username"
                    placeholder="User Name"
                    type="text"
                    v-model="usernameVal"
                    @keydown.native.enter="getStudents()"
                  ></el-input>
                </div> -->

                <h6 style="padding: 0 8px"> {{$i18n.locale == 'ar' ? 'بحث عن دكاترة' : 'Seach About Doctors'}} </h6>

                <div class="search-in-teachers">
                  <div class="row">
                    <div class="col-md-10">
                      <div class="d-flex flex-wrap">

                  <div class="mr-1 ml-1 pt-1">
                    <div style="width: 186px">
                      <el-input
                        id="phone"
                        :placeholder="$t('subjects.SearchByName')"
                        type="text"
                        v-model="usernameVal"
                        @keydown.native.enter="getTeachers()"
                      ></el-input>
                    </div>
                  </div>
                      </div>
                    </div>


                    <div class="col-md-2">
                      <div class="d-flex flex-row-reverse">
                        <div class="mr-1 ml-1">
                    <div class="d-flex flex-row-reverse">
                      <el-button
                          class="btn-org hight"
                          @click="$router.push(`/doctors/add`)"
                          style="font-size: 13px;padding: 13px;border: none;border-radius: 14px;"
                          color="var(--blue)"
                          > {{ $i18n.locale == 'ar' ? 'إضافة دكتور' : 'Add Doctor' }}   </el-button
                        >
                    </div>
                  </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            <el-table
              ref="teachersTable"
              :empty-text="
                $i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'
              "
              class="table-teachers"
              :data="allTeachers"
            >


            <el-table-column type="expand" class="expanded">
                <template slot-scope="props">
                  <div class="outer-frame">

                      <section v-if="props.row.sections.length > 0">
                        <h6 class="mb-0"> {{ $i18n.locale == 'ar' ? 'الشُعب الدراسية' : 'Educational Sections' }} </h6>
                        <div
                        class="inner-frame"
                        v-for="(sec, index) in props.row.sections"
                        :key="index"
                      >
                        <h6 v-if="$i18n.locale == 'ar'">
                          {{ sec.nameAr }}
                        </h6>
                        <h6 v-else>{{ sec.nameEn }}</h6>
                      </div>
                      </section>




                      <section v-if="props.row.subjects.length > 0">
                        <h6 class="mb-0"> {{ $i18n.locale == 'ar' ? 'المواد الدراسية' : 'Educational Subjects' }} </h6>
                        <div
                        class="inner-frame"
                        v-for="(subject, index) in props.row.subjects"
                        :key="index"
                      >
                        <h6 v-if="$i18n.locale == 'ar'">
                          {{ subject.nameAr }}
                        </h6>
                        <h6 v-else>{{ subject.nameEn }}</h6>
                      </div>
                      </section>
                  </div>
                </template>
              </el-table-column>

              <el-table-column :label="$t('Validation.Img')">
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
              >
              </el-table-column>

              <el-table-column :label="$t('Validation.Email')" prop="email">
              </el-table-column>

              <el-table-column :label="$t('Validation.dateofjoin')">
                <template slot-scope="scope">
                  {{ $moment(scope.row.createdAt).fromNow() }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('Validation.Phone')">
                <template slot-scope="scope" >
                   <h6 v-if="scope.row.phone">{{ scope.row.phone.replace('+', ' ') }}</h6>
                <h6 v-else class="text-danger"> {{ $i18n.locale == 'ar' ? 'لا يوجد' : 'Not found' }} </h6>
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
                            ? "إسناد مواد للمدرس"
                            : "Assign Subject To This Teacher"
                        }}
                      </template>
                    </vs-tooltip>

                    <!-- <vs-tooltip>
                      <button
                        class="btn-disable nice-btn-padding"
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
                        class=" btn-enable nice-btn-padding"
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
                              ? " تعطيل هذا المدرس"
                              : "Disable This Teacher"
                          }}
                        </span>
                        <span v-else>
                          {{
                            $i18n.locale == "ar"
                              ? " تفعيل هذا المدرس"
                              : "Enable This Teacher"
                          }}
                        </span>
                      </template>
                    </vs-tooltip> -->

                    <vs-tooltip
                      v-if="$auth.loggedIn && $auth.user.role == 'admin'"
                    >
                      <button
                        class=" btn-edit-user nice-btn-padding"
                        @click="updateTeacherInformation(scope.row)"
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
                            ? "تعديل بيانات هذا المدرس"
                            : "Update Student Information"
                        }}
                      </template>
                    </vs-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <div class="center con-pagination mt-4" v-if="totalPages > 1">
              <vs-pagination color="warning" progress v-model="page" :length="totalPages" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarHeader from "@/components/StarHeader";
import NoData from "@/components/NoData";
import UpdateUserInformation from "@/components/User/Update.vue";

export default {
  middleware: ["auth"],
  components: {
    StarHeader,
    NoData,
    UpdateUserInformation
  },
  mounted() {
    this.getTeachers();
    this.getLevels();
  },
  data() {
    return {
      activate: "",

      showAssignedPopup: false,
      subjectVal: "",
      subjects: [],
      currTeacher: {},
      addTeacher: {},
      openChangeSubject: false,
      allTeachers: [],
      addNewTeacherPopup: false,
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
      changeSubject: {
        sectionVal: '',
        subjectVal: '',
      },
      photo: "",
      url: "",
      updateTeacherInformationModel: false
    };
  },
  watch: {

    page() {
      this.getTeachers();
    }
  },
  methods: {
    saveUpdateUser() {
      this.updateTeacherInformationModel = false;
      this.getTeachers();
    },

    closeUpdateUser() {
      this.updateTeacherInformationModel = false;
    },

    updateTeacherInformation(user) {
      this.updateTeacherInformationModel = false;
      this.openChangeSubject = false;
      setTimeout(() => {
        this.updateTeacherInformationModel = true;
      }, 0);
      this.currTeacher = { ...user };
      this.teacherUrl = user.photo;
      this.teacherPhoto = user.photo;

      console.log(this.teacherUrl, this.teacherPhoto);

      window.scrollTo({ top: 0, behavior: "smooth" });
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
          this.getTeachers();
        })
        .catch(err => {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "en"
                ? `There Are Something Wrong!`
                : `هناك شيء خاطئ!`
          });
        })
        .finally(() => loading.close());
    },

    showAssignedToTeacher(teacher) {
      this.showAssignedPopup = true;
      this.currTeacher = { ...teacher };
    },
    handleAddTeacher() {
      this.addNewTeacherPopup = true;
      this.photo = "";
      this.url = "";
    },
    handleImage(e) {
      if (e.raw) {
        this.url = URL.createObjectURL(e.raw);
        this.photo = e.raw;
        console.log(e.raw);
      }
    },
    removeImage(e) {
      this.photo = "";
    },
    handleChangeSubject(teacher) {
      this.currTeacher = { ...teacher };
      this.updateTeacherInformationModel = false;
      this.openChangeSubject = true;
    },
    changeTeacherSubject() {
      this.openChangeSubject = false;
      const loading = this.$vs.loading();

      this.$axios
        .patch(`/doctors/${this.currTeacher.id}/assign-subject-many`, {
          subjects: this.changeSubject.subjectVal,
          section: this.changeSubject.sectionVal
        })
        .then(res => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تم تعيين الماده للمعلم بنجاح!`
                : `Subject Assigned To Teacher Successfully!`
          });

          this.changeSubject = {
            subjectVal: '',
            sectionVal: ''
          };
          this.getTeachers();
        })
        .finally(() => loading.close());
    },
    updatePhone(val) {
      this.phoneObj = val;
    },

    updateTeacherSubject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changeTeacherSubject();
        }
      });
    },

    addNewTeacher(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.phoneObj.isValid) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `Phone Number Not Valid !`
                  : `رقم الهاتف غير صالح !`
            });
            return;
          }
          this.addTeacherInBackend();
        }
      });
    },
    addTeacherInBackend() {
      const loading = this.$vs.loading();

      let formData = new FormData();
      formData.append("username", this.addTeacher.username);
      formData.append("email", this.addTeacher.email);
      formData.append("phone", this.phoneObj.formattedNumber);
      formData.append("password", this.addTeacher.password);
      if (this.photo) {
        formData.append("photo", this.photo);
      }

      this.$axios
        .post(`/teachers`, formData)
        .then(res => {
          this.addNewTeacherPopup = false;
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة المعلم بنجاح!`
                : `Teacher Added Successfully!`
          });
          this.phoneObj = {};
          this.addTeacher = {};
          this.getTeachers();
        })
        .catch(error => {
          console.log(error);
          if (error.response && error.response.status == 400) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `Email Or Phone Already Exist`
                  : `البريد الإلكتروني أو الهاتف موجود بالفعل`
            });
          } else {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `There Are Something Wrong!`
                  : `هناك شيء خاطئ!`
            });
          }
        })
        .finally(() => loading.close());
    },
    getTeachers() {
      const loading = this.$vs.loading({
        target: this.$refs.teachersTable
      });
      let qrySrting = "/doctors?";

      // if(this.systemVal != ''){
      //     qrySrting += 'system=' + this.systemVal + '&' ;
      // }

      if (this.emailVal) {
        qrySrting += "email=" + this.emailVal + "&";
      }

      if (this.usernameVal) {
        qrySrting += "username=" + this.usernameVal + "&";
      }

      if (this.phoneVal) {
        qrySrting += "phone=" + this.phoneVal + "&";
      }

      // if(this.levelVal != ''){
      //     qrySrting += 'level=' + this.levelVal + '&';
      // }

      if (this.classVal) {
        qrySrting += "classes=" + this.classVal + "&";
      }

      if (this.sectionVal) {
        qrySrting += "sections=" + this.sectionVal + "&";
      }

      if (this.subjectVal) {
        qrySrting += "subjects=" + this.subjectVal + "&";
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

      this.isLoading = true;
      this.$axios
        .get(qrySrting)
        .then(res => {
          this.allTeachers = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },

    getLevels() {
      this.isLoading = true;
      this.$axios
        .get(`/levels?paginate=false`)
        .then(res => {
          this.levels = res.data;
        })
        .finally(() => (this.isLoading = false));
    },
    getClasses(val) {
      this.isLoading = true;
      this.$axios
        .get(`/levels/${val}/classes?paginate=false`)
        .then(res => {
          this.classes = res.data;
        })
        .finally(() => (this.isLoading = false));
    },
    getSections(val) {
      this.sectionVal = '';
      this.sections = []
      this.isLoading = true;
      this.$axios
        .get(
          `/sections?level=${val}&paginate=false`
        )
        .then(res => {
          this.sections = res.data;
        })
        .finally(() => (this.isLoading = false));
    },
    getSubjectsAndSections(val) {
      this.changeSubject.sectionVal = this.changeSubject.subjectVal = '';
      if(!val){
        this.sections = this.subjects = [];
      }
      this.isLoading = true;
      this.$axios
        .get(`/levels/${val}/subjects?paginate=false`)
        .then(res => {
          this.subjects = res.data;
        })
        .finally(() => (this.isLoading = false));

      this.getSections(val);

    }
  }
};
</script>

<style lang="scss">
.el-select.multi .el-input__inner {
  direction: auto;
}
.section-teachers {
  padding: 15px;
}


.search-in-teachers{
  .el-select{
      width: 186px;
  }
}


.add-teacher-container{

padding: 15px;
    background: #FFF;
}


.table-teachers {
  width: 100%;

  .outer-frame {
    margin: 15px 5px;
    border: 1px solid;
    border: 1px solid #7c77c76e;
    position: relative;
    &::after {
      position: absolute;
      content: " ";
      top: -17px;
      left: 50%;
      border-width: 8px;
      border-style: solid;
      border-color: transparent transparent #7c77c7 transparent;
    }

    &::before {
      position: absolute;
      content: " ";
      top: -16px;
      left: 50%;
      border-width: 8px;
      border-style: solid;
      border-color: transparent transparent white transparent;
      z-index: 2;
    }

    section {
      display: flex;
      margin: 10px;
      flex-wrap: wrap;
      .inner-frame {
        padding: 5px 20px;
        border: 1px solid rgba(124, 119, 199, 0.25882);
        border-radius: 10px;
        margin: 0 6px;
        text-align: start !important;
        h6 {
          margin-bottom: 3px;
          padding-bottom: 2px;
          &:not(:last-of-type) {
            border-bottom: 1px solid #7c77c742;
          }
        }
      }
    }
  }

  .vs-button__content {
    padding: 7px 13px !important;
  }
}
.btn-org {
  background-color: #ffa400;
  color: #ffffff;
  font-size: 18px;
  padding: 10px 15px;

  &:hover {
    box-shadow: none !important;
  }
}
.btn-success {
  color: #45d7b6 !important;
  background-color: transparent !important;
  border: none !important;
  font-size: 16px !important;
  box-shadow: none !important;
}

.btn-danger {
  color: #fa5b5a !important;
  background-color: transparent !important;
  border: none !important;
  font-size: 16px !important;
  box-shadow: none !important;
}
.edit {
  font-size: 16px !important;
}
.inner-frame {
  h6 {
    font-size: 14px;
    color: #534dba;
  }
}
</style>
