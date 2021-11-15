<template>
  <div class="home-page">

      <div class="container-fluid">

        <div class="mt-3 mb-0 stats-header">
          <h5 class=""> {{$i18n.locale == 'ar' ? 'الإحصائيات' : 'Statistics'}} </h5>
        </div>


        <div class="statistics">

          <div class="row">
            <div class="col-md-3">

              <div class="stats">
                <h5> {{ $i18n.locale == 'ar' ? 'المستخدمين' : 'Users' }} </h5>
                <div class="d-flex">
                  <h6> {{statistics.users}} </h6>
                  <h6> <img src="@/assets/imgs/stats/user.svg" alt=""> </h6>
                </div>
              </div>

            </div>




            <div class="col-md-3">

              <div class="stats">
                <h5> {{ $i18n.locale == 'ar' ? 'الامتحانات' : 'Exams' }} </h5>
                <div class="d-flex">
                  <h6> {{statistics.exams}} </h6>
                  <h6> <img src="@/assets/imgs/stats/test.svg" alt=""> </h6>
                </div>
              </div>

            </div>





            <div class="col-md-3">

              <div class="stats">
                <h5> {{ $i18n.locale == 'ar' ? 'المحاضرات' : 'Lectures' }} </h5>
                <div class="d-flex">
                  <h6> {{statistics.lectures}} </h6>
                  <h6> <img src="@/assets/imgs/stats/teach.svg" alt=""> </h6>
                </div>
              </div>

            </div>




<!--
            <div class="col-md-3">

              <div class="stats">
                <h5> {{ $i18n.locale == 'ar' ? 'اللايف' : 'Lives' }} </h5>
                <div class="d-flex">
                  <h6> {{statistics.lives}} </h6>
                  <h6> <img src="@/assets/imgs/stats/on-air.svg" alt=""> </h6>
                </div>
              </div>

            </div> -->




            <!-- <div class="col-md-3">

              <div class="stats">
                <h5> {{$i18n.locale == 'ar' ? 'التعليقات و الردود' : 'Comments / Replies'}} </h5>
                <div class="d-flex">
                  <h6> {{statistics.posts}} </h6>
                  <h6> <img src="@/assets/imgs/stats/comment.svg" alt=""> </h6>
                </div>
              </div>

            </div> -->




            <!-- <div class="col-md-3">

              <div class="stats">
                <h5> {{$i18n.locale == 'ar' ? 'العروض التقديمية' : 'Presentation'}} </h5>
                <div class="d-flex">
                  <h6> {{statistics.presentations}} </h6>
                  <h6> <img src="@/assets/imgs/stats/line-graph.svg" alt=""> </h6>
                </div>
              </div>

            </div> -->




            <div class="col-md-3">

              <div class="stats">
                <h5> {{$i18n.locale == 'ar' ? 'الأسئلة' : 'َQuestions'}} </h5>
                <div class="d-flex">
                  <h6> {{statistics.questions}} </h6>
                  <h6> <img src="@/assets/imgs/stats/faq.svg" alt=""> </h6>
                </div>
              </div>

            </div>




            <div class="col-md-3">

              <div class="stats">
                <h5> {{ $i18n.locale == 'ar' ? 'المواد الدراسية' : 'Subjects' }} </h5>
                <div class="d-flex">
                  <h6> {{statistics.subjects}} </h6>
                  <h6> <img src="@/assets/imgs/stats/books.svg" alt=""> </h6>
                </div>
              </div>

            </div>
          </div>

        </div>




        <div class="last-10-student">
          <h5> {{ $i18n.locale == 'ar' ? 'اخر 10 طُلاب' : 'Last 10 Students' }} </h5>

          <div>
            <el-table ref="studentTable" :empty-text="$i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'" :data="students" style="width: 100%" class="tabel">
              <el-table-column :label="$t('Validation.Img')" >
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

              <el-table-column
                :label="$t('Validation.Email')"
                prop="email"
              >
              </el-table-column>

              <el-table-column
                :label="$t('Validation.Address')"
                prop="address"
              ></el-table-column>
              <el-table-column :label="$t('Validation.Phone')">
                <template slot-scope="scope">
                   <h6 style="font-size: 12px" v-if="scope.row.phone"> {{ scope.row.phone.replace('+', ' ') }} </h6>
                   <h6 v-else  style="font-size: 12px" class="text-danger"> لا يوجد </h6>
                </template>

              </el-table-column>


            </el-table>
          </div>
        </div>







        <div class="last-10-student">
          <h5> {{ $i18n.locale == 'ar' ? 'اخر 10 دكاترة' : 'Last 10 Doctores' }}  </h5>

          <div>
            <el-table ref="studentTable" :empty-text="$i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'" :data="teachers" style="width: 100%" class="tabel">
              <el-table-column :label="$t('Validation.Img')" >
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

              <el-table-column
                :label="$t('Validation.Email')"
                prop="email"

              >
              </el-table-column>

              <el-table-column
                :label="$t('Validation.Address')"

                prop="address"
              ></el-table-column>
              <el-table-column :label="$t('Validation.Phone')">
                <template slot-scope="scope">
                   <h6 style="font-size: 12px" v-if="scope.row.phone"> {{ scope.row.phone.replace('+', ' ') }} </h6>
                   <h6 v-else  style="font-size: 12px" class="text-danger"> لا يوجد </h6>
                </template>

              </el-table-column>


            </el-table>
          </div>
        </div>



        <!-- <div class="last-10-parents">
          <h5>  {{ $i18n.locale == 'ar' ? 'اخر 10 ولي الامر' : 'Last 10 Parents' }}  </h5>
          <el-table
        :empty-text="$i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'"
          class="table-teachers"
          :data="parents"
          @expand-change="expandRow"
        >
          <el-table-column type="expand" class="expanded">
            <template slot-scope="scope">
              <div class="outer-frame">
                <section v-if="scope.row.parentStudents.length > 0">
                  <el-table
                  :empty-text="$i18n.locale == 'ar' ? 'لا توجد بيانات' : 'No Data Available'"
                    class="table-teachers"
                    :data="scope.row.parentStudents"
                  >
                    <el-table-column :label="$t('Validation.Img')"
                      >>
                      <template slot-scope="scope">
                        <img
                          class="circle-photo"
                          v-if="scope.row.photo"
                          :src="scope.row.photo"
                          alt=""
                        />
                      </template>
                    </el-table-column>

                    <el-table-column :label="$t('Validation.Student')">
                      <template slot-scope="scope">
                        <h6>{{ scope.row.username }}</h6>
                      </template>
                    </el-table-column>

                    <el-table-column
                      :label="$t('Validation.Educationalsystem')"
                    >
                      <template slot-scope="scope">
                        <template v-if="scope.row.system">
                          <h6 v-if="$i18n.locale == 'ar'">
                            {{ scope.row.system.nameAr }}
                          </h6>
                          <h6 v-else>{{ scope.row.system.nameEn }}</h6>
                        </template>
                      </template>
                    </el-table-column>

                    <el-table-column :label="$t('Validation.Educationallevel')">
                      <template slot-scope="scope">
                        <template v-if="scope.row.level">
                          <h6 v-if="$i18n.locale == 'ar'">
                            {{ scope.row.level.nameAr }}
                          </h6>
                          <h6 v-else>{{ scope.row.level.nameEn }}</h6>
                        </template>
                      </template>
                    </el-table-column>

                    <el-table-column :label="$t('Validation.Classroom')">
                      <template slot-scope="scope">
                        <template v-if="scope.row.section">
                          <h6 v-if="$i18n.locale == 'ar'">
                            {{ scope.row.section.nameAr }}
                          </h6>
                          <h6 v-else>{{ scope.row.section.nameEn }}</h6>
                        </template>
                      </template>
                    </el-table-column>

                  </el-table>
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
            <template slot-scope="scope" v-if="scope.row.phone">
               {{ scope.row.phone.replace('+', ' ') }}
            </template>
            <h6 v-else>-</h6>
          </el-table-column>
        </el-table>
        </div> -->





      </div>
  </div>
</template>

<script>
export default {
  middleware:['auth', 'admin'],
  mounted(){
    this.getStatistics();
    this.getLastTenTeacher();
    this.getLastTenStudent();

  },
  data(){
    return {
      statistics: {},
      students: [],
      parents: [],
      teachers: [],
      parentStudents:[]
    }
  },
  methods:{
    expandRow(e, expandedRows) {
      if (e.parentStudents.length > 0) {
        return;
      }

      const loading = this.$vs.loading();
      this.$axios
        .get(`/parents-students?parent=${e.id}`)
        .then((res) => {
          e.parentStudents = res.data;
        })
        .finally(() => loading.close());
    },
    getStatistics(){
      const loading = this.$vs.loading();
      this.$axios.get(`/statistics`).then(res => {
        this.statistics = res.data;
      }).finally(() => loading.close())
    },

    getLastTenStudent(){
      const loading = this.$vs.loading();
      this.$axios.get(`/students?sort=-id&limit=10`).then(res => {
        this.students = res.data.docs;
      }).finally(() => loading.close())
    },

    getLastTenParent(){
      const loading = this.$vs.loading();
      this.$axios.get(`/parents?sort=-id&limit=10`).then(res => {
         res.data.docs.map((ele) => (ele.parentStudents = []));
        this.parents = res.data.docs;
      }).finally(() => loading.close())
    },


    getLastTenTeacher(){
      const loading = this.$vs.loading();
      this.$axios.get(`/doctors?sort=-id&limit=10`).then(res => {
        this.teachers = res.data.docs;
      }).finally(() => loading.close())
    }

  }
}
</script>

<style lang="scss">
.statistics{
  .stats{
    margin-bottom: 25px;
        padding: 15px;
        background: var(--bs-blue);
        color: #FFF;
        border-radius: 10px;
      h6{
        padding-top: 2px;
        font-size: 38px;
        font-weight: bold;
        color: #FFF !important;
      }
      >div{
        h6{
          &:first-of-type{
            flex: 1;
          }
          img{
            width: 50px;
          }
        }


      }


  }

  .col-md-3{
    &:nth-of-type(2){
      .stats{
        background:#f19066 ;
      }
     }
    &:nth-of-type(3){
      .stats{
        background:#eb4d4b ;
      }
     }
    &:nth-of-type(4){
      .stats{
        background: #e056fd;
      }
     }
    &:nth-of-type(5){
      .stats{
        background: #22a6b3;
      }
     }
    &:nth-of-type(6){
      .stats{
        background: #6ab04c;
      }
     }
    &:nth-of-type(7){
      .stats{
        background: #c44569;
      }
     }
    &:last-of-type{
      .stats{
        background: #574b90;
      }
     }
  }


}

.last-10-parents, .last-10-student, .last-10-teacher, .stats-header{
  >h5{
    padding: 13px;
    font-size: 25px;
    color: #ffa400;
  }
}
.last-10-parents{
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
        margin: 0 11px;
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
}
</style>
