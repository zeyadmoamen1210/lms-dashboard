<template>
  <div class="login-page" :class="[$i18n.locale === 'en' ? 'BgEng' : '']">
    <div class="container-fluid">
      <div class="reset-password">
        <vs-avatar
          @click.native="changeLocale('ar')"
          v-if="$i18n.locale !== 'ar'"
        >
          English
        </vs-avatar>

        <vs-avatar
          @click.native="changeLocale('en')"
          v-else-if="$i18n.locale !== 'en'"
        >
          Arabic
        </vs-avatar>
        <div class="row">
          <div class="col-lg-8 col-md-7 col-sm-12 image">
            <img
              v-if="$i18n.locale === 'ar'"
              src="@/assets/imgs/login.png"
              class="img-fluid"
              alt=""
            />
            <img
              v-else-if="$i18n.locale === 'en'"
              src="@/assets/imgs/EngLogin.png"
              class="img-fluid"
              alt=""
            />
          </div>
          <div class="col-lg-3 col-md-5 col-sm-12 loginForm">
            <div class="reset-form" v-if="!codeSent">
              <div>
                <div class="login-form-container">
                  <div class="row">
                    <div class="col-md-12 sub-title p-0">
                      <h4>{{ $t("auth.Forget") }}</h4>
                      <p>{{ $t("auth.ForgetNote") }}</p>
                    </div>
                  </div>
                  <el-form
                    :model="resendForm"
                    ref="resendForm"
                    class="login-form"
                  >
                    <h6>{{ $t("auth.Email") }}</h6>
                    <el-form-item
                      prop="email"
                      :rules="[
                        {
                          required: true,
                          message: $t('auth.ValidateEmail'),
                          trigger: 'blur',
                        },
                        {
                          type: 'email',
                          message: $t('auth.ValidateEmail'),
                          trigger: ['blur', 'change'],
                        },
                      ]"
                    >
                      <el-input
                        class="mb-2"
                        :placeholder="$t('auth.Email')"
                        v-model="resendForm.email"
                      >
                        <i
                          slot="suffix"
                          v-if="$i18n.locale === 'ar'"
                          class="fas fa-envelope"
                        ></i>
                        <i
                          slot="prefix"
                          v-else-if="$i18n.locale === 'en'"
                          class="fas fa-envelope"
                        ></i
                      ></el-input>
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        class="first-btn"
                        @click="submitResendForm('resendForm')"
                        type="primary"
                      >
                        {{ $t("auth.Send") }}
                      </el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="form-groub login-form-container">
                <div class="col-md-12 sub-title p-0">
                  <h4>{{ $t("auth.Code") }}</h4>
                  <p>{{ $t("auth.CodeNote") }}</p>
                </div>
                <client-only placeholder="...تحميل ">
                  <CodeInput
                    :fields="count"
                    :loading="false"
                    class="input"
                    :class="[$i18n.locale === 'en' ? 'eng' : 'ar']"
                    v-on:complete="onComplete"
                  />
                </client-only>
              </div>

              <el-input
                class="mt-3"
                v-if="changePasswordIsReady"
                v-model="password"
                :type="type"
                :placeholder="$t('auth.PasswordPlaceholder')"
              >
                <i
                  class="mt-icon-3 mr-1 mb-3"
                  slot="suffix"
                  v-if="$i18n.locale === 'ar'"
                  :class="[showPassword ? 'fas fa-eye-slash' : 'fas fa-eye']"
                  @click="togglePassword"
                ></i>
                <i
                  class="mt-icon-3 ml-1 mb-3"
                  slot="prefix"
                  v-else-if="$i18n.locale === 'en'"
                  :class="[showPassword ? 'fas fa-eye-slash' : 'fas fa-eye']"
                  @click="togglePassword"
                ></i
              ></el-input>

              <el-button
                class="first-btn mt-3"
                :class="[$i18n.locale === 'en' ? 'engWidth' : '']"
                type="primary"
                v-if="!changePasswordIsReady"
                @click="checkIfCodeIsValid()"
              >
                {{ $t("auth.Verify") }}
              </el-button>
              <p
                v-if="!changePasswordIsReady"
                @click="resendEmail()"
                class="subNote mt-3"
                :class="[$i18n.locale === 'ar' ? 'float-left' : 'float-right']"
              >
                {{ $t("auth.subNote") }}
              </p>

              <el-button
                class="first-btn mt-3"
                :class="[$i18n.locale === 'en' ? 'engWidth' : '']"
                v-else
                type="primary"
                @click="saveChangedPassword()"
              >
                {{ $t("auth.SavePass") }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    CodeInput: () =>
      process.client
        ? import("vue-verification-code-input")
        : Promise.resolve({ render: () => h("div") }),
  },
  data() {
    return {
      resendForm: {},
      checked: false,
      type: "password",
      showPassword: false,
      codeSent: false,
      count: 5,
      code: "",
      changePasswordIsReady: false,
      password: "",
    };
  },
  methods: {
    async login() {
      const loading = this.$vs.loading();

      try {
        let response = await this.$auth.loginWith("local", {
          data: { email: this.resendForm.email, password: this.password },
        });
        loading.close();
        localStorage.setItem(
          "eduPulseDashboardUser",
          JSON.stringify(response.data.user)
        );
        this.$auth.setUser(response.data.user);

        this.$message({
          message: `Welcome Back ${response.data.user.username}`,
          type: "success",
        });

        if (response.data.user.role === "teacher") {
          this.$router.push(`/teacher-subjects`);
        } else {
          this.$router.push(`/`);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        loading.close();

        this.$message.error(`Invalid Email Or Password `);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },

    saveChangedPassword() {
      if (!this.password || this.password.toString().trim().length < 5) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "en"
              ? `Enter the password first`
              : `أدخل كلمة المرور أولاُ`,
        });
        // this.$message.error({
        //   message: "أدخل كلمة المرور أولاُ",
        // });
        return;
      }

      const loading = this.$vs.loading();
      this.$axios
        .post(`/reset-password`, {
          email: this.resendForm.email,
          code: this.code,
          password: this.password,
        })
        .then(() => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "en"
                ? `Password changed successfully`
                : `تم تغيير كلمة المرور بنجاح`,
          });
          // this.$message({
          //   message: "تم تغيير كلمة المرور بنجاح",
          //   type: "success",
          // });

          this.login();
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `The code is invaild`
                  : `الكود غير صحيح`,
            });
            // this.$message.error({
            //   message: " الكود غير صحيح",
            // });
          }
        })
        .finally(() => loading.close());
    },

    checkIfCodeIsValid() {
      if (!this.code || this.code.toString().trim().length < 5) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "en"
              ? `Enter the code first`
              : `أدخل الكود أولاُ`,
        });
        // this.$message.error({
        //   message: "أدخل الكود أولاُ",
        // });
        return;
      }

      const loading = this.$vs.loading();
      this.$axios
        .post(`/check-code`, { email: this.resendForm.email, code: this.code })
        .then(() => {
          this.changePasswordIsReady = true;
        })
        .catch((err) => {
          if (err.response.status === 401) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `The code is invaild`
                  : `الكود غير صحيح`,
            });
            // this.$message.error({
            //   message: " الكود غير صحيح",
            // });
          }
        })
        .finally(() => loading.close());
    },

    onComplete(code) {
      this.code = code;
    },

    submitResendForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.resendEmail();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    resendEmail() {
      const loading = this.$vs.loading();
      this.$axios
        .post(`/resend`, { ...this.resendForm })
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "en"
                ? `The code has been sent to the e-mail`
                : `تم إرسال الكود علي البريد الإلكتروني`,
          });
          // this.$message({
          //   message: " تم إرسال الكود علي البريد الإلكتروني ",
          //   type: "success",
          // });

          this.codeSent = true;
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.$vs.notification({
              color: "#FA5B5A",
              position: "top-center",

              text:
                this.$i18n.locale == "en"
                  ? `This email is not registered before`
                  : ` هذا البريد الإلكتروني غير مسجل من قبل`,
            });
            // this.$message.error({
            //   message: " هذا البريد الإلكتروني غير مسجل من قبل",
            // });
            return;
          }
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "en"
                ? `Something went wrong!`
                : ` حدث خطأ ما !`,
          });
          // this.$message.error({
          //   message: "حدث خطأ ما !",
          // });
        })
        .finally(() => loading.close());
    },
    changeLocale(locale) {
      this.$vs.loading();
      this.$i18n.setLocale(locale);
      console.log("hi");

      if (document.children) {
        if (this.$i18n.locale == "ar") {
          this.$moment.locale("ar");
          console.log("arabic ");
          var all = document.getElementsByTagName("*");
          var i;
          for (i = 0; i < all.length; i++) {
            console.log("child ", all[i]);
            all[i].style.direction = "rtl";
            all[i].style.textAlign = "right";
          }
        } else {
          this.$moment.locale("en");
          console.log("english ");
          var all = document.getElementsByTagName("*");
          var i;
          for (i = 0; i < all.length; i++) {
            console.log("child ", all[i]);
            all[i].style.direction = "ltr";
            all[i].style.textAlign = "left";
          }
        }
      }

      location.reload();
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
      if (this.showPassword == true) {
        this.type = "text";
      } else if (this.showPassword == false) {
        this.type = "password";
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/auth.scss";
</style>

