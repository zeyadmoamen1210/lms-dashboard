<template>
  <div class="add-teacher-page">
    <div class="container-fluid">
      <div class="add-teachers-container">




        <div class="d-flex flex-wrap path" style="padding: 15px 0 0;" >
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
          <nuxt-link to="/teachers"> {{ $i18n.locale == 'ar' ? 'المُدرسين' : 'Students' }} </nuxt-link>
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
          <h6> {{ $i18n.locale == 'ar' ? 'إضافة مدرس' : 'Add Teacher' }} </h6>
        </div>

      </div>



        <div class="add-new-teachers">
          <div>
            <h3>
              <img
                style="width: 20px"
                src="@/assets/imgs/reading-book.svg"
                alt=""
              />
              {{ $t("teachers.addTeachers") }}
            </h3>
          </div>

          <el-form
            :model="addTeacher"
            ref="addTeacher"
            class="add-teacher-form mt-3"
          >
            <div class="row">
              <!-- <div class="col-md-3">
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

                <div class="footer">
                  <img src="@/assets/imgs/footer.png" alt="" />
                </div>
              </div> -->

              <div class="col-md-12 mt-5">
                <div>
                  <div class="row">
                    <div class="col-md-6">
                      <div>
                        <el-form-item
                          prop="username"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.Username'),
                              trigger: 'blur',
                            },
                          ]"
                        >
                          <el-input
                            :placeholder="$t('Validation.Username')"
                            v-model="addTeacher.username"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div>
                        <el-form-item
                          prop="email"
                          :rules="[

                            {
                              type: 'email',
                              message: $t('Validation.VEmail'),
                              trigger: ['blur', 'change'],
                            },
                          ]"
                        >
                          <el-input
                            :placeholder="$t('Validation.Email')"
                            v-model="addTeacher.email"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div>
                        <el-form-item
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
                            v-model="addTeacher.password"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div>
                        <el-form-item prop="phone">
                          <vue-phone-number-input
                            @update="updatePhone"
                            v-model="addTeacher.phone"
                            default-country-code="KW"
                            :ignoredCountries="['IL']"
                          />
                        </el-form-item>
                      </div>
                    </div>

                    <div
                      class="col-md-2"
                      :class="[$i18n.locale === 'ar' ? 'mr-auto' : 'ml-auto']"
                    >
                      <div>
                        <el-form-item class="mb-0">
                          <el-button
                            class="el-button form-button el-button--warning"
                            type="warning"
                            @click="addNewTeacher('addTeacher')"
                            >{{ $t("Validation.save") }}</el-button
                          >
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware:['auth'],
  data() {
    return {
      addTeacher: {},
      photo: "",
      url: "",
      phoneObj: {},
    };
  },
  methods: {
    updatePhone(val) {
      this.phoneObj = val;
    },
    addPhoto(e) {
      if (e.target.files.length > 0) {
        this.photo = e.target.files[0];
        this.url = URL.createObjectURL(this.photo);
      }
    },
    addNewTeacher(formName) {
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
      if (this.phoneObj.formattedNumber && this.phoneObj.isValid) {
        formData.append("phone", this.phoneObj.formattedNumber);
      }
      formData.append("password", this.addTeacher.password);
      if (this.photo) {
        formData.append("photo", this.photo);
      }

      this.$axios
        .post(`/doctor`, formData)
        .then((res) => {
          this.addNewTeacherPopup = false;
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة المعلم بنجاح!`
                : `Teacher Added Successfully!`,
          });
          this.phoneObj = {};
          this.addTeacher = {};
          this.$router.push(`/doctors`);
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status == 400) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `Email Or Phone Already Exist`
                  : `البريد الإلكتروني أو الهاتف موجود بالفعل`,
            });
          } else {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `There Are Something Wrong!`
                  : `هناك شيء خاطئ!`,
            });
          }
        })
        .finally(() => loading.close());
    },
  },
};
</script>

<style lang="scss">
.add-teacher-page {
  margin-top: 20px;

  .add-teachers-container{

padding: 15px;
    background: #FFF;
}


  .add-new-teachers {
    padding: 26px 12px 3px;

    min-height: 100vh;
    div {
      &:first-of-type {
        h3 {
          color: var(--blue);
        }
      }
    }
  }
  .all-teachers {
    padding: 10px;
  }
}
.text {
  color: #343434;
  font-size: 14px;
}

.relative {
  position: relative;
  height: 70vh;
}

.footer {
  position: absolute;
  bottom: 10px;
  right: 280px;
  left: 280px;
}

div {
  &:first-of-type {
    h5 {
      color: var(--blue);
    }
  }
}

.el-avatar--large {
  width: 100%;
  height: 100%;

  cursor: pointer;
  display: flex;
  border: 1px solid #707070;
  align-items: center;
  justify-content: center;

  background-color: #ffffff;

  img {
    width: 100%;
    height: 100%;
  }

  &.img {
    padding: 20px;

    img {
    }
  }
}

.attach-photo {
      width: 140px;
    height: 140px;
    overflow: hidden;
    position: relative;
    padding: 5px;
    border-radius: 50%;
    border: 1px solid #707070;
    background: #fff;
    margin-top: 20px;
    margin: 45px auto;

  input[type="file"] {
    cursor: pointer;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  img {
    width: 100%;

    border-radius: 50%;
  }
}
.bg-white {
  background-color: #ffffff;
  width: 100%;
  min-height: 93vh;
  box-shadow: 0 0 3px #dddddd;
  margin: 20px 5px 20px 10px;
  border-radius: 6px;
  padding: 30px;

  .header {
    margin-bottom: 1rem;

    h5 {
      font-size: 23px !important;
      font-weight: normal !important;
      font-family: "Cairo", sans-serif !important;
      color: #ffa400;





      span {
        font-size: 20px;
        // margin: 0 16px;
      }
    }
  }
}
.btn-org {
  padding-left: 30px;
  padding-right: 30px;
}
</style>
