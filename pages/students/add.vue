<template>
  <div class="add-student-page">




    <div class="container-fluid mt-4 mb-3">
        <div class="add-students-container">



            <div class="d-flex flex-wrap path mb-4"  >
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
          <nuxt-link to="/students"> {{ $i18n.locale == 'ar' ? 'الطُلاب' : 'Students' }} </nuxt-link>
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
          <h6> {{ $i18n.locale == 'ar' ? 'إضافة طالب' : 'Add Student' }} </h6>
        </div>

      </div>




      <div class="row">
          <div class="header">
            <h5 style="color: var(--blue)">
              <span><i class="fas fa-book-reader"></i></span>
              {{ $t("students.addStudents") }}
            </h5>
          </div>
          <div class="row add-new-students">
            <!-- <div class="col-md-3 relative">
              <div>
                <div class="attach-photo">
                  <input type="file" @change="addPhoto" />
                  <el-avatar
                    size="large"
                    :src="require('@/assets/imgs/photo-camera.svg')"
                    v-if="!url"
                    class="img"
                    alt=""
                  ></el-avatar>
                  <el-avatar size="large" v-else :src="url" alt=""></el-avatar>
                </div>
              </div>

              <div class="footer">
                <img src="@/assets/imgs/footer.png" alt="" />
              </div>
            </div> -->
            <div class="col-md-12">
              <div>
                <el-form
                  :model="addStudent"
                  ref="addStudent"
                  class="add-student-form mt-3"
                >
                  <div class="row">
                    <div
                      class="col-md-6 mb-2"
                      v-if="
                        !$route.query.level ||
                        !$route.query.section
                      "
                    >
                      <div class="filters">
                        <el-select
                          clearable
                          v-model="levelVal"
                          :placeholder="$t('students.Levels')"
                        >
                          <el-option
                            v-for="item in levels"
                            :key="item.id"
                            :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>



                    <div
                      class="col-md-6 mb-2"
                      v-if="
                        !$route.query.level ||
                        !$route.query.section
                      "
                    >
                      <div class="filters">
                        <el-select
                          clearable
                          v-model="sectionVal"
                          :placeholder="$t('students.Sections')"
                        >
                          <el-option
                            v-for="item in sections"
                            :key="item.id"
                            :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>

                    <div class="col-md-6 mb-2">
                      <div>
                        <el-form-item
                          prop="username"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.required'),
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            :placeholder="$t('Validation.Username')"
                            v-model="addStudent.username"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="col-md-6 mb-2">
                      <div>
                        <el-form-item
                          class="disable"
                          prop="email"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.required'),
                              trigger: 'blur',
                            },
                            {
                              type: 'email',
                              message: $t('Validation.ValidEmail'),
                              trigger: ['blur', 'change'],
                            },
                          ]"
                        >
                          <el-input
                            :placeholder="$t('Validation.Email')"
                            v-model="addStudent.email"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="col-md-6 mb-2">
                      <div>
                        <el-form-item
                          class="disable"
                          prop="password"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.VPassword'),
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            :placeholder="$t('Validation.Password')"
                            type="password"
                            v-model="addStudent.password"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="col-md-6 mb-2">
                      <div>
                        <el-form-item
                          prop="address"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.VAddress'),
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            :placeholder="$t('Validation.Address')"
                            type="address"
                            v-model="addStudent.address"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="col-md-6 mb-2">
                      <div>
                        <el-form-item prop="phone">
                          <vue-phone-number-input
                            @update="updatePhone"
                            v-model="addStudent.phone"
                            default-country-code="KW"
                            :ignoredCountries="['IL']"
                          />
                        </el-form-item>
                      </div>
                    </div>

                    <!-- <div class="col-md-6">
                      <div>
                        <el-form-item class="must-change">
                          <label for="">
                            {{ $t("students.ChangePass") }}
                          </label>
                          <el-switch
                            v-model="addStudent.mustChange"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                          >
                          </el-switch>
                        </el-form-item>
                      </div>
                    </div> -->

                    <div
                      class="col-md-2"
                      :class="[$i18n.locale === 'ar' ? 'mr-auto' : 'ml-auto']"
                    >
                      <el-form-item class="mb-0">
                        <el-button
                          class="form-button"
                          type="warning"
                          @click="addNewStudent('addStudent')"
                        >
                          {{ $t("Validation.Add") }}
                        </el-button>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getLevels();
  },
  middleware:['auth'],
  data() {
    return {
      addStudent: {},
      phoneObj: {},
      photo: "",
      url: "",

      levels: [],
      classes: [],
      systems: [],
      sections: [],
      sectionVal: "",
      systemVal: "",
      levelVal: "",
      classVal: "",
    };
  },
  watch: {
    levelVal(val) {
      this.classVal = "";
      this.sectionVal = "";
      if (val != "") {
        this.getSections(val);
      }
    },
    // classVal(val) {
    //   this.sectionVal = "";
    //   if (val != "") {
    //     this.getSections(val);
    //   }
    // },
  },
  methods: {
    getSections(val) {
      this.$axios
        .get(
          `/sections?level=${val}&paginate=false`
        )
        .then((res) => {
          this.sections = res.data;
        });
    },
    getSystems() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/systems?paginate=false`)
        .then((res) => {
          this.systems = res.data;
        })
        .finally(() => loading.close());
    },
    getLevels() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/levels?paginate=false`)
        .then((res) => {
          this.levels = res.data;
        })
        .finally(() => loading.close());
    },
    getClasses(val) {
      this.$axios.get(`/levels/${val}/classes?paginate=false`).then((res) => {
        this.classes = res.data;
      });
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.phoneObj.formattedNumber && !this.phoneObj.isValid) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `Phone Number Not Valid !`
                  : `رقم الهاتف غير صالح !`,
            });
            // this.$message.error({
            //   message:
            //     this.$i18n.locale == "ar"
            //       ? `رقم الهاتف غير صالح !`
            //       : "Phone Number Not Valid !",
            // });
            return;
          }

          if (!this.sectionVal && !this.$route.query.section) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `Must Select Class First !`
                  : `يرجي تحديد الفصل أولاً !`,
            });
            // this.$message.error({
            //   message:
            //     this.$i18n.locale == "ar"
            //       ? `يرجي تحديد الفصل أولاً !`
            //       : "Must Select Class First !",
            // });
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
      if (this.phoneObj.formattedNumber) {
        formData.append("phone", this.phoneObj.formattedNumber);
      }
      formData.append("section", this.sectionVal || this.$route.query.section);
      formData.append("password", this.addStudent.password);
      formData.append("address", this.addStudent.address);
      // if (this.photo) {
      //   formData.append("photo", this.photo);
      // }
      formData.append(
        "mustChangePassword",
        this.addStudent.mustChange ? true : false
      );

      this.$axios
        .post(`/student`, formData)
        .then((res) => {
          this.addNewStudentPopup = false;
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة الطالب بنجاح!`
                : `Student Added Successfully!`,
          });

          this.addStudent = {};
          this.phoneObj = {};
          this.photo = this.url = "";
          if(this.$route.query.level_name && this.$route.query.section_name){
            this.$router.push(`/section/${this.$route.query.section ? this.$route.query.section : this.sectionVal}/students?level=${this.$route.query.level ? this.$route.query.level : this.levelVal}&section_name=${this.$route.query.section_name}&level_name=${this.$route.query.level_name}`);
          }else{
            this.$router.push(`/students`)
          }
        })
        .finally(() => loading.close())
        .catch((err) => {

          if(err.response.data.message.flag === 2){
            this.$vs.notification({
              color: "danger",
              position: "top-center",
              text: this.$i18n.locale == 'ar' ? `هذا الفصل ممتلئ غير مسموح بالإضافة` : 'The Capacity Of Class Is Full You Cant Add More',
            });
          }

          else if (err.response.data.message.flag === 1){
            this.$vs.notification({
              color: "danger",
              position: "top-center",
              text: this.$i18n.locale == 'ar' ? `البريد الإلكتروني أو رقم الموبايل موجود من قبل` : 'Email Or Phone Is Already Exist',
            });
          }

        });
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/students.scss";

.add-student-page{
  // margin-top: 20px;

  .add-students-container{

padding: 15px;
    background: #FFF;
        min-height: 90vh;
}
}

</style>
