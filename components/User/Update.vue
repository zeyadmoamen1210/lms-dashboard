<template>
  <div class="update-user-component">
    <section class="change-subject add-update-section mb-3 pb-3">
      <el-form :model="user" ref="updateUser" class="for-add-or-update">
        <h6 class="not-margin">
          <span style="color: var(--yellow)">
            {{ $t("students.updateStudentInformation") }} /
          </span>
          {{ user.username }}
        </h6>

        <div class="d-flex" >
          <!-- <div class="mr-1 ml-1 ">
            <div class="attach-photo">
              <input type="file" @change="addPhoto" />
              <el-avatar
                size="large"
                :src="require('@/assets/imgs/photo-camera.svg')"
                v-if="!userUrl"
                class="img"
                alt=""
              ></el-avatar>
              <el-avatar size="large" v-else :src="userUrl" alt=""></el-avatar>
            </div>
          </div> -->

          <div class="d-flex" style="width:100%;gap:15px">
            <div class="pt-3" style="flex: 1">
              <div>
                <el-form-item
                  prop="username"
                  :rules="[
                    {
                      required: true,
                      message: $t('Validation.required'),
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    :placeholder="$t('Parents.name')"
                    v-model="user.username"
                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div class="pt-3" style="flex: 1">
              <div>
                <el-form-item
                  prop="email"
                  :rules="[
                    {
                      required: true,
                      message: $t('Validation.required'),
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    :placeholder="$t('Parents.email')"
                    v-model="user.email"
                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div class="pt-3" style="flex: 1">
              <div>
                <el-form-item prop="address">
                  <el-input
                    :placeholder="$t('Parents.address')"
                    v-model="user.address"
                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div class="pt-3" style="flex: 1">
              <div>
                <!-- <h6> {{$t('Parents.phone')}} </h6> -->
                <el-form-item prop="phone">
                  <vue-phone-number-input
                    @update="updatePhone"
                    v-model="user.phone"
                    default-country-code="EG"
                    :translations="
                      $i18n.locale == 'ar'
                        ? {
                            countrySelectorLabel: 'إختر الدولة',
                            countrySelectorError: 'خطأ',
                            phoneNumberLabel: 'ادخل رقم الهاتف',
                            example: 'مثال :'
                          }
                        : {
                            countrySelectorLabel: 'Choose Country',
                            countrySelectorError: 'Error',
                            phoneNumberLabel: 'Enter Phone Number',
                            example: 'Exemple :'
                          }
                    "
                  />
                </el-form-item>
              </div>
            </div>

            <div class="pt-3" style="flex: 1">
              <div>
                <el-form-item prop="password">
                  <el-input
                    :placeholder="$t('Parents.password')"
                    type="password"
                    v-model="user.password"
                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div
              v-if="type && type == 'parent'"
              class="pt-3"
              style="width: 100%"
            >
              <div class="students-select">
                <el-form-item
                  prop="students"
                  :rules="[
                    {
                      required: true,
                      message: $t('Validation.students'),
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-select
                    v-model="user.students"
                    multiple
                    filterable
                    remote
                    :placeholder="$t('Validation.SearchForStudent')"
                    value-key="id"
                  >
                    <el-option
                      :class="{ right: $i18n.locale == 'ar' }"
                      v-for="(item, index) in allStudents"
                      :key="index"
                      :label="item.username"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <div style="flex:1;    padding-top: 15px;" class="flex-row-reverse">
          <el-form-item style="margin-top: 7px">
            <div class="d-flex flex-row-reverse">
              <el-button
                class="btn btn-org"
                style="width: auto"
                type="warning"
                @click="saveUpdateUser"
                >{{ $t("Validation.save") }}</el-button
              >
              <el-button
                class="btn btn-white"
                style="width: auto"
                @click="closeUpdateUser"
                type="info"
                >{{ $t("Validation.close") }}</el-button
              >
            </div>
          </el-form-item>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  props: ["user", "url", "photo", "type"],
  data() {
    return {
      userPhoto: "",
      userUrl: "",
      phoneObj: {},
      allStudents: []
    };
  },
  async created() {
    this.userPhoto = this.userUrl = this.photo;
    if (this.type && this.type == "parent") {
      if (this.user.parentStudents == 0) {
        const loading = this.$vs.loading();
        await this.$axios
          .get(`/parents-students?parent=${this.user.id}`)
          .then(res => {
            this.user.parentStudents = res.data;
          })
          .finally(() => loading.close());
      }

      this.getAllStudents();
    }
    console.log("created");
  },
  methods: {
    getAllStudents() {
      let loading = this.$vs.loading();
      this.$axios
        .get(`/students?paginate=false`)
        .then(res => {
          this.allStudents = res.data;
          if (this.user && this.user.students && this.user.parentStudents) {
            this.user.parentStudents.map(student => {
              this.user.students.push(student.id);
            });
          }
        })
        .finally(() => loading.close());
    },
    updatePhone(val) {
      this.phoneObj = val;
    },
    closeUpdateUser() {
      this.$emit("closeUpdateUser");
    },
    saveUpdateUser() {
      let formData = new FormData();
      formData.append("username", this.user.username);

      formData.append("email", this.user.email);
      formData.append("address", this.user.address);
      if (this.user.password) {
        formData.append("password", this.user.password);
      }

      if (this.photo) {
        formData.append("photo", this.userPhoto);
      }
      if (this.phoneObj.formattedNumber) {
        formData.append("phone", this.phoneObj.formattedNumber);
      }

      let loading = this.$vs.loading();

      this.$axios
        .patch(`/users/${this.user.id}`, formData)
        .then(res => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? "تم تعديل المستخدم بنجاح"
                : "User Updated Successfully"
          });
          this.$emit("saveUpdateUser");
        })
        .catch(error => {
          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? "حدث خطأ ما"
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());

        if(this.type == 'parent'){
          let loading = this.$vs.loading();
          this.$axios.patch(`/parents/${this.user.id}/students`, {
            students: [...this.user.students]
          }).finally(() => loading.close());
        }
    },
    addPhoto(e) {
      if (e.target.files.length > 0) {
        this.userPhoto = e.target.files[0];
        this.userUrl = URL.createObjectURL(this.userPhoto);
      }
    }
  }
};
</script>

<style lang="scss">
.update-user-component {
  h6 {
    font-size: 13px;
    color: var(--yellow);
  }
  .not-margin {
    color: #333;
    margin-bottom: 5px;
    margin-top: 15px;
  }

  .students-select {
    width: 100%;
    .el-select {
      width: 100%;
    }

    .el-select.right .el-tag__close.el-icon-close {
      right: 5px !important;
    }

    .el-select__tags {
      margin-right: 8px;
    }
  }

  .attach-photo {
    width: 84px;
    height: 84px;
    overflow: hidden;
    position: relative;
    margin: auto;
    border-radius: 50%;
    border: 5px #ddd;
    border-style: double;
    background: #fff;

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

    .el-avatar--large {
      width: 100%;
      height: 100%;
      line-height: 40px;
    }
  }
}
</style>
