<template>
  <div class="container-fluid">
    <div class="teacher-subjects">
      <div class="section-details">


        <div class="header mt-1">

          <h5 style="color: var(--yellow)"> <span><i style="color: var(--yellow)" class="fas fa-book-reader"></i></span> {{ $t("sidebar.Subjects") }}</h5>
        </div>


        <div class="row">
          <div class="col-md-12">
            <div class="subjects">
              <NoData v-if="allSubjects.length == 0" width="150px" />
              <div class="row" v-else>
                <div
                  class="col-md-3"
                  v-for="subject in allSubjects"
                  :key="subject.id"
                  @click="
                    $router.push(
                      `/lectures?level=${subject.level.id}&level_name=${$i18n.locale == 'ar' ? subject.level.nameAr : subject.level.nameEn}&subject=${subject.id}&subject_name=${$i18n.locale == 'ar' ? subject.nameAr : subject.nameEn}`
                    )
                  "
                >
                  <div class="subject-card d-flex justify-content-center">

                        <div class="content">

                          <div class="text-center">
                            <img
                            class="img"
                            v-if="subject.photo"
                            :src="subject.photo"
                            :class="[$i18n.locale === 'ar' ? 'left' : 'right']"
                            alt=""
                          />
                          <img
                            class="img"
                            :class="[$i18n.locale === 'ar' ? 'left' : 'right']"
                            src="@/assets/imgs/Bibliophile-bro.svg"
                            v-else
                            alt=""
                          />
                          </div>
                          <div>
                            <h3 v-if="$i18n.locale == 'ar'">
                              {{ subject.nameAr }}
                            </h3>
                            <h3 v-else>{{ subject.nameEn }}</h3>

                          </div>

                          <div
                            class="text-center"

                          >
                            <!-- <img v-if="subject.visibility"  src="@/assets/imgs/view.svg" style="width:30px;padding:0" alt="">
                              <img v-else src="@/assets/imgs/restriction.svg" style="width:30px;padding:0" alt="">  -->

                            <div
                            class="d-flex justify-content-center mb-3"
                              v-if="subject.visibility"
                            >
                                <!-- <img src="@/assets/imgs/shield-success.svg" style="width: 25px" alt=""> -->
                                <h6 class="text-success pt-3">{{$t('subjects.available')}}</h6>
                            </div>
                            <div
                              v-else
                              class="d-flex justify-content-center mb-3"
                            >
                              <!-- <img src="@/assets/imgs/shield-red.svg" style="width: 25px" alt=""> -->
                              <h6 class="text-danger pt-3"> {{$t('subjects.notAvailable')}} </h6>
                            </div>
                          </div>

                          <div
                            style="text-align: center"

                          >
                            <button
                              class="btn-edit"
                              @click.stop="handleUpdate(subject)"
                              v-if="$auth.loggedIn && $auth.user.role == 'admin'"
                            >
                              <i class="el-icon-edit"></i>
                            </button>
                            <el-popconfirm
                              :confirm-button-text="$t('Validation.delete')"
                              :cancel-button-text="$t('Validation.close')"
                              @confirm="confirmDelete(subject)"
                              icon="el-icon-info"
                              icon-color="red"
                              :title="$t('Validation.AreYouSure')"
                              v-if="$auth.loggedIn && $auth.user.role == 'admin'"
                            >
                              <button
                                @click.stop=""
                                class="btn-delete"
                                slot="reference"
                              >
                                <i class="el-icon-delete-solid"></i>
                              </button>
                            </el-popconfirm>

                            <vs-button
                            style="margin: auto"
                              flat
                              warning
                              @click.stop="$router.push(`/levels/${subject.level.id}/students?subject=${subject.id}`)"
                            >
                              {{ $i18n.locale == 'ar' ? 'الطُلاب' : 'Students' }}
                            </vs-button>


                          </div>
                        </div>
                  </div>
                </div>
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
  middleware:['auth'],
  created() {
    this.getTeacherSubjects();
     console.log("this is auth ", this.$auth.user)
  },
  data() {
    return {
      allSubjects: [],
      page: 1,
      totalPages: 1,
    };
  },
  methods: {
    getTeacherSubjects() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/teacher-subjects`)
        .then((res) => {
          this.allSubjects = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },
  },
};
</script>

<style lang="scss">
.header {
  h4 {
    color: var(--headingColor);
  }
}
.teacher-subjects {


    padding: 15px;
    background: #FFF;
    margin-top: 20px;

  .subject-path {
    display: flex;
    h4 {
      color: var(--yellow);
    }
  }

  .subject-card {
      min-height: 115px;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
    box-shadow: 0 4px 25px 0 #0000001a;
    transition: all .5s ease;
    cursor: pointer;
        background: #FFF;
    &:hover{
      transform: translateY(-10px);
    }

    img {
      width: 100%;
      width: 140px;
      padding-top: 13px;
    }
    h3 {
      text-align: center;
      padding-top: 19px;
      margin-bottom: 0;
      margin: 0 15px;
    }
    .content {
      div {
        &:first-of-type {
          span {
            display: inline-block;
            text-align: center;
            width: 100%;
            margin: 0 7px 0;
          }
        }
      }
    }

    .stats {
      background: #f7f7f7;
      margin: 11px 15px;
      text-align: center;
      border-bottom: 1px solid #dbdfea;
      border-radius: 11px;
      color: #fff;
      padding: 30px;
      display: flex;
      justify-content: space-around;
      h6 {
        padding-top: 15px;
        font-size: 15px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
         color: #FFF !important;
      }
      .num {
        font-size: 26px;
        padding-top: 9px;
      }
    }

    &:first-of-type {
      .stats {
        background: #f0932b;
      }
    }
    &:nth-of-type(2) {
      .stats {
        background: #eb4d4b;
      }
    }
    &:nth-of-type(3) {
      .stats {
        background: #be2edd;
      }
    }
    &:nth-of-type(4) {
      .stats {
        background: #6ab04c;
      }
    }
  }
}

.no-files{
    text-align: center;
}
</style>
