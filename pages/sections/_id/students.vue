<template>
  <div class="students-subjects">
    <div class="container-fluid">
      <div class="mt-4 students-container">






        <!-- <div class="header mb-3">
          <h4 style="color: var(--headingColor);s"> {{ $i18n.locale == "ar" ? "الطُلاب" : "Students" }} </h4>
        </div> -->

        <div class="header mt-3">

          <h5 style="color: var(--yellow)"> <span><i style="color: var(--yellow)" class="fas fa-book-reader"></i></span> {{ $i18n.locale == "ar" ? "الطُلاب" : "Students" }}</h5>
        </div>



        <div class="d-flex flex-wrap path mb-3 mt-2">


        <div>
          <nuxt-link to="/teacher-subjects">
            {{ $i18n.locale == "ar" ? "المواد الدراسية" : "Subjects" }}
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
        <div>
          <h6>{{ $i18n.locale == "ar" ? "الطُلاب" : "Students" }}</h6>
        </div>
      </div>





        <div class="d-flex mt-3" style="width: 100%">

            <div class="mr-1 ml-1">
                <el-input v-model="usernameVal" :placeholder="$i18n.locale == 'ar' ? 'الأسم' : 'Name' "></el-input>
            </div>

            <div class="mr-1 ml-1">
                <el-input v-model="emailVal" :placeholder="$i18n.locale == 'ar' ? 'البريد الإلكتروني' : 'Email' "></el-input>
            </div>

            <div class="mr-1 ml-1 justify-content-end d-flex" style="flex: 1;gap:10px;">
                <vs-button flat style="margin: 0;" @click="openSendTodoToSection"> {{ $i18n.locale == 'ar' ? 'إسناد واجب للشُعبة' : 'Add Homework To Section' }} </vs-button>
                <el-button type="warning" @click="getStudents()"> {{$i18n.locale == 'ar' ? 'بحث' : 'Search' }} </el-button>
                <el-button type="danger" @click="clear()"> {{$i18n.locale == 'ar' ? 'إلغاء' : 'Clear' }} </el-button>
            </div>



        </div>


        <el-table
          ref="studentTable"
          :empty-text="
            $i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'
          "
          :data="allStudents"
          style="width: 100%"
          class="tabel mt-3"
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
            <template slot-scope="scope" v-if="scope.row.phone">
              {{ scope.row.phone.replace('+', ' ') }}
            </template>
            <h6 v-else>-</h6>
          </el-table-column>

          <el-table-column :label="$t('Validation.Actions')">
            <template slot-scope="scope">
                  <vs-button style="margin:auto" flat @click="$router.push(`/weekly-tasks?subject=${$route.query.subject}&student=${scope.row.id}&section=${$route.params.id}`)">

                  {{
                      $i18n.locale == "ar"
                        ? "إسناد المهام "
                        : "Add Homework"
                    }}

                  </vs-button>


            </template>
          </el-table-column>

        </el-table>

        <div class="center con-pagination mt-4 mb-4" v-if="totalPages > 1">
            <vs-pagination color="warning" progress v-model="page" :length="totalPages" />
        </div>


      </div>
    </div>





     <vs-dialog style="font-family: Cairo" v-model="sendTodoToSectionModel">
        <template #header>
          <h5 class="not-margin">
            {{ $i18n.locale == 'ar' ? 'إرسال واجب الي طُلاب هذه الشُعبة' : 'Send Task To Section Students' }}
          </h5>
        </template>


        <div class="con-form">
           <el-form :model="addTodoToSec" ref="addTodoToSec" class="for-add-or-update">
            <div >
              <div>
                <el-form-item
                  prop="name"
                  :rules="[
                    {
                      required: true,
                      message: $t('Validation.VContent'),
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    :rows="5"
                    type="textarea"
                    :placeholder="$t('Validation.content')"
                    v-model="addTodoToSec.name"
                  ></el-input>
                </el-form-item>
              </div>
            </div>

            <div>
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    class="btn btn-org"
                    @click="submitForm('addTodoToSec')"
                    type="warning"
                  >
                    {{ $t("Validation.save") }}
                  </el-button>
                </el-form-item>
              </div>
            </div>
        </el-form>
        </div>


      </vs-dialog>


  </div>
</template>

<script>
export default {
  middleware:['auth'],

    created(){
        this.getStudents();
    },

    data(){
        return{
            addTodoToSec: {},
            allStudents: [],
            page: 1,
            totalPages: 1,
            emailVal: "",
            usernameVal: "",
            sendTodoToSectionModel: false,
        }
    },


    watch: {
        page(val){
            this.getStudents();
        }
    },

    methods:{

      saveTodo() {
      const loading = this.$vs.loading();
      this.$axios
        .post(
          `/todo/subjects/${this.$route.query.subject}/sections/${this.$route.params.id}`,
          {
            notes: this.addTodoToSec.name
          }
        )
        .then(res => {
          this.$vs.notification({
            color: "success",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? "تم إضافة الواجب بنجاح"
                : "Task Added Successfully"
          });

          this.addTodoToSec.name = '';
          this.sendTodoToSectionModel = false;
        })
        .catch(err => {
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
    },


      submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveTodo();
        }
      });
    },
      openSendTodoToSection(){
        this.sendTodoToSectionModel = true;
      },
        clear(){
            this.emailVal = this.usernameVal = "";
            this.page = 1;
            this.getStudents()
        },
        getStudents() {
      const loading = this.$vs.loading({
        target: this.$refs.studentTable,

      });
      let qrySrting = "/students?";

      if (this.emailVal) {
        qrySrting += "email=" + this.emailVal + "&";
      }

      if (this.usernameVal) {
        qrySrting += "username=" + this.usernameVal + "&";
      }


      if (this.$route.params.id) {
        qrySrting +=
          "section=" + (this.$route.params.id) + "&";
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
        .then((res) => {
          this.allStudents = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },
    }
};
</script>

<style lang="scss">
.students-subjects{
  .students-container{

padding: 15px;
    background: #FFF;
}
}

</style>
