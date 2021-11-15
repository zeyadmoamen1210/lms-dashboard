<template>
  <div class="section-page">
    <div class="container-fluid">
      <div class="section-page-inner">


        <div class="row">
        <div >
          <div class="header">
            <div>
              <h5>
                <span><i class="fas fa-book-reader"></i></span>

                <template v-if="$i18n.locale == 'ar'">
                  {{ section.nameAr }} - (المواد الدراسية)
                </template>
                <template v-else> {{ section.nameEn }} - (Subjects) </template>
              </h5>
            </div>
            <div v-if="$auth.loggedIn && $auth.user.role == 'admin'">
              <vs-button @click="addNewSub" color="#FFA400">
                {{ $t("subjects.AddSubject") }}
              </vs-button>
            </div>
          </div>













          <div class="d-flex flex-wrap path mb-4 mt-3">

        <div>
          <nuxt-link to="/levels/list"> {{ $i18n.locale == 'ar' ? 'المراحل' : 'Levels' }} </nuxt-link>
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
        <div v-if="currLevel">
           <nuxt-link :to="`/levels/${currLevel.id}`"> {{ $i18n.locale == 'ar' ? currLevel.nameAr : currLevel.nameEn}} </nuxt-link>
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
        <div v-if="currClass">

          <nuxt-link :to="`/classes/${currClass.id}?level=${$route.query.level}`"> {{ $i18n.locale == 'ar' ? currClass.nameAr : currClass.nameEn}} </nuxt-link>
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
        <div v-if="section">
          <h6 v-if="$i18n.locale == 'ar'"> {{section.nameAr}} </h6>
          <h6 v-else> {{section.nameEn}} </h6>
        </div>
      </div>











          <div class="d-flex mb-3">

            <div class="mr-1 ml-1">
              <div>
                <el-select
                  clearable
                  v-model="selectedLevel"
                  :placeholder="$t('subjects.Levels')"
                  @change="getClasses()"
                >
                  <el-option
                    v-for="item in allLevels"
                    :key="item.id"
                    :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>

            <div class="mr-1 ml-1">
              <div>
                <el-select
                  clearable
                  v-model="selectedClass"
                  :placeholder="$t('subjects.Section')"
                  @change="getSections()"
                >
                  <el-option
                    v-for="item in allClasses"
                    :key="item.id"
                    :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>

            <div class="mr-1 ml-1">
              <div>
                <el-select
                  clearable
                  v-model="selectedSection"
                  :placeholder="$t('classes.Sections')"
                  @change="getSectionSubjects()"
                >
                  <template v-if="allSections.length > 0">
                    <el-option
                      v-for="item in allSections"
                      :key="item.id"
                      :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                      :value="item.id"
                    >
                    </el-option>
                  </template>
                </el-select>
              </div>
            </div>
          </div>

          <section  v-if="updateSubjectPopup" class="mb-3 add-edit-subject add-update-section" >
            <el-form
              :model="updateSubject"
              ref="updateSubject"
              class="for-add-or-update"
            >
              <div class="inputs-grid row">


                <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'الإسم باللغة العربية' : 'Subject Arabic Name' }} </h6>
                  <el-form-item
                    prop="nameAr"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.nameAr'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      :placeholder="$t('Validation.nameAr')"
                      v-model="updateSubject.nameAr"
                    ></el-input>
                  </el-form-item>
                </div>


                <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'الإسم باللغة الإنجليزية' : 'Subject English Name' }} </h6>
                  <el-form-item
                    prop="nameEn"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.nameEn'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      :placeholder="$t('Validation.nameEn')"
                      v-model="updateSubject.nameEn"
                    ></el-input>
                  </el-form-item>
                </div>



                <!-- <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'مُدرس المادة' : 'Teacher Of Subject' }} </h6>
              <el-form-item
                prop="nameAr"
                :rules="[
                  {
                    required: true,
                    message: $t('Validation.required'),
                    trigger: 'blur'
                  }
                ]"
              >
                <el-autocomplete
                  style="width: 100%"
                  suffix-icon="el-icon-edit"
                  v-model="updateSubject.teacher.username"
                  :fetch-suggestions="querySearchAsync"
                  :placeholder="$t('sections.AssignToTeacher')"
                  @select="handleSelectUpdate"
                  :trigger-on-focus="false"
                >
                  <template slot-scope="{ item }">
                    <div class="username">{{ item.username }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </div> -->

                <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'وصف للمادة' : 'Subject Description' }} </h6>
                  <el-form-item
                    prop="description"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.description'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      :placeholder="$t('Validation.description')"
                      v-model="updateSubject.description"
                    ></el-input>
                  </el-form-item>
                </div>

                <div class="col-md-1">
                  <h6> {{ $i18n.locale == 'ar' ? 'متاح / غير متاح' : 'Available / Not Available' }} </h6>
                  <button
                    class="btn eye"
                    @click.prevent="toggleVisibilty()"
                    v-if="updateSubject.visibility"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="btn eye"
                    v-else
                    @click.prevent="toggleVisibilty()"
                  >
                    <i class="fas fa-eye-slash"></i>
                  </button>
                </div>

                <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'صورة للمادة' : 'Subject Photo' }} </h6>
                  <el-form-item prop="photo">
                    <el-upload
                      class="upload-demo"
                      :limit="1"
                      action="#"
                      :show-file-list="true"
                      :auto-upload="false"
                      :on-change="handleImage"
                      :on-remove="removeImage"
                    >
                      <div class="d-flex">
                        <div>
                          <vs-avatar v-if="url" size="40" class="d-none">
                            <img :src="url" alt="" />
                          </vs-avatar>
                        </div>
                        <div class="mr-2 ml-2">
                          <el-button class="attach-img">
                            <i class="fas fa-images"></i>
                          </el-button>
                        </div>
                      </div>
                    </el-upload>
                  </el-form-item>
                </div>

                <div class="col-md-3">
                  <div class="d-flex flex-row-reverse pt-3">
                    <el-form-item>
                      <el-button
                        class="btn btn-org"
                        type="warning"
                        @click="submitUpdateForm('updateSubject')"
                        >{{ $t("Validation.save") }}</el-button
                      >
                      <el-button
                        class="btn btn-white"
                        type="info"
                        @click="updateSubjectPopup = false"
                        >{{ $t("Validation.close") }}</el-button
                      >
                    </el-form-item>
                  </div>
                </div>
              </div>
            </el-form>
          </section>

          <section v-if="addSubjectPopup" class="mb-3 add-edit-subject add-update-section add-update-section">
            <el-form
              :model="addNewSubject"
              ref="addNewSubject"
              class="for-add-or-update"
            >
              <div class="inputs-grid row">

                <div class="col-md-2">
                   <h6> {{ $i18n.locale == 'ar' ? 'الإسم باللغة العربية' : 'Subject Arabic Name' }} </h6>
                  <el-form-item
                    prop="nameAr"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.nameAr'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      :placeholder="$t('Validation.nameAr')"
                      v-model="addNewSubject.nameAr"
                    ></el-input>
                  </el-form-item>
                </div>


                <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'الإسم باللغة الإنجليزية' : 'Subject English Name' }} </h6>
                  <el-form-item
                    prop="nameEn"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.nameEn'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      :placeholder="$t('Validation.nameEn')"
                      v-model="addNewSubject.nameEn"
                    ></el-input>
                  </el-form-item>
                </div>



                <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'وصف للمادة' : 'Subject Description' }} </h6>
                  <el-form-item
                    prop="description"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.description'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      :placeholder="$t('Validation.description')"
                      v-model="addNewSubject.description"
                    ></el-input>
                  </el-form-item>
                </div>

                <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'مُدرس المادة' : 'Subject Teacher' }} </h6>
                  <el-form-item
                    prop="teacher.username"
                    :rules="[
                      {
                        required: true,
                        message: $t('Validation.required'),
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-autocomplete
                      v-model="addNewSubject.teacher.username"
                      :fetch-suggestions="querySearchAsync"
                      :placeholder="$t('sections.AssignToTeacher')"
                      @select="handleSelectAdd"
                      :trigger-on-focus="false"
                    >
                      <template slot-scope="{ item }">
                        <div class="username">{{ item.username }}</div>
                      </template>
                    </el-autocomplete>
                  </el-form-item>
                </div>

                <div class="col-md-1">
                  <h6> {{ $i18n.locale == 'ar' ? 'متاح / غير متاح' : 'Available / Not Available' }} </h6>
                  <button
                    class="btn eye"
                    @click.prevent="toggleVisibilty()"
                    v-if="addNewSubject.visibility"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    class="btn eye"
                    v-else
                    @click.prevent="toggleVisibilty()"
                  >
                    <i class="fas fa-eye-slash"></i>
                  </button>
                </div>

                <div class="col-md-2">
                  <h6> {{ $i18n.locale == 'ar' ? 'صورة للمادة' : 'Subject Photo' }} </h6>
                  <el-form-item prop="photo">
                    <el-upload
                      class="upload-demo"
                      :limit="1"
                      action="#"
                      :show-file-list="true"
                      :auto-upload="false"
                      :on-change="handleImage"
                      :on-remove="removeImage"
                    >
                      <el-button class="attach-img">
                        <i class="fas fa-images"></i>
                      </el-button>
                    </el-upload>
                  </el-form-item>
                </div>

                <div class="col-md-1">
                  <div class="d-flex flex-row-reverse pt-3">
                    <el-form-item>
                      <el-button
                        class="btn btn-org"
                        type="warning"
                        @click="submitAddForm('addNewSubject')"
                        >{{ $t("Validation.save") }}</el-button
                      >
                      <el-button
                        class="btn btn-white"
                        type="info"
                        @click="addSubjectPopup = false"
                        >{{ $t("Validation.close") }}</el-button
                      >
                    </el-form-item>
                  </div>
                </div>
              </div>
            </el-form>
          </section>

          <div class="section-details">
            <div class="row">
              <div class="col-md-12">
                <div class="subjects">
                  <NoData v-if="allSubjects.length == 0" width="350px" />
                  <div class="row" v-else>
                    <div
                      class="col-md-3"
                      v-for="subject in allSubjects"
                      :key="subject.id"
                    >
                      <div
                        @click="
                          $router.push(
                            `/subject/${subject.id}?level=${$route.query.level}&class=${$route.query.class}&section=${$route.params.id}`
                          )
                        "
                        class="subject-card "
                      >
                        <div class="icon">

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
                        <div class="content">
                          <div>
                            <h5 v-if="$i18n.locale == 'ar'">
                              {{ subject.nameAr }}
                            </h5>
                            <h5 v-else>{{ subject.nameEn }}</h5>
                            <span v-if="subject.teacher">
                              أ/ {{ subject.teacher && subject.teacher.username }}
                            </span>
                          </div>

                          <div
                            class="text-center"
                            v-if="$auth.loggedIn && $auth.user.role == 'admin'"
                          >
                            <!-- <img v-if="subject.visibility"  src="@/assets/imgs/view.svg" style="width:30px;padding:0" alt="">
                              <img v-else src="@/assets/imgs/restriction.svg" style="width:30px;padding:0" alt="">  -->

                            <div
                            class="d-flex justify-content-center mb-0 "
                              v-if="subject.visibility"
                            >
                                <h6 style="margin-bottom: 0;color: var(--bs-success);">{{$t('subjects.available')}}</h6>
                            </div>
                            <div
                              v-else
                              class="d-flex justify-content-center mb-0"
                            >
                              <h6 style="margin-bottom: 0;color: var(--bs-danger);"> {{$t('subjects.notAvailable')}} </h6>
                            </div>
                          </div>




                          <div
                            class="text-center"
                            v-if="$auth.loggedIn && $auth.user.role == 'admin'"
                          >
                            <div
                            v-if="!subject.teacher"
                            class="d-flex justify-content-center mb-0"
                            >
                                <el-button type="text" @click.stop="openAddTeacherToSubject({...subject})"> {{ $i18n.locale == 'ar' ? "إضافة مُدرس " : "Add Teacher" }} </el-button>
                            </div>

                            <div
                            v-else
                            class="d-flex justify-content-center mb-0"
                            >
                                <el-button type="text" @click.stop="openAddTeacherToSubject({...subject})"> {{ $i18n.locale == 'ar' ? "تعديل مُدرس " : "Update Teacher" }} </el-button>
                            </div>

                          </div>



                          <div
                            style="text-align: center"
                            v-if="$auth.loggedIn && $auth.user.role == 'admin'"
                          >
                            <button
                              class="btn-edit"
                              @click.stop="handleUpdate({...subject})"
                            >
                              <i class="el-icon-edit"></i>
                            </button>
                            <el-popconfirm
                              :confirm-button-text="$t('Validation.delete')"
                              :cancel-button-text="$t('Validation.close')"
                              @confirm="confirmDelete({...subject})"
                              icon="el-icon-info"
                              icon-color="red"
                              :title="$t('Validation.AreYouSure')"
                            >
                              <button
                                @click.stop=""
                                class="btn-delete"
                                slot="reference"
                              >
                                <i class="el-icon-delete-solid"></i>
                              </button>
                            </el-popconfirm>
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


      </div>
    </div>

    <vs-dialog v-model="openAddTeacherToSubjectModel">
      <template #header>
        <h5 class="not-margin">
          {{ $i18n.locale == 'ar' ? "إضافة مُدرس للمادة" : "Add Teacher To The Subject" }}
        </h5>
      </template>

      <div>
        <el-form :model="addTeacherToSubject" ref="addTeacherToSubject" class="demo-ruleForm">
          <el-form-item
                v-if="addTeacherToSubject.teacher"
                prop="teacher.username"
                :rules="[
                  {
                    required: true,
                    message: $t('Validation.required'),
                    trigger: 'blur'
                  }
                ]"
              >

                <el-autocomplete
                  style="width: 100%"
                  suffix-icon="el-icon-edit"
                  v-model="addTeacherToSubject.teacher.username"
                  :fetch-suggestions="querySearchAsync"
                  :placeholder="$t('sections.AssignToTeacher')"
                  @select="handleSelectUpdate"
                  :trigger-on-focus="false"
                >
                  <template slot-scope="{ item }">
                    <div class="username">{{ item.username }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitUpdateTeacherSubjectForm('addTeacherToSubject')"> {{ $t("Validation.save") }} </el-button>
          </el-form-item>
        </el-form>
      </div>

    </vs-dialog>
  </div>
</template>

<script>
import StartHeader from "@/components/StarHeader";
import NoData from "@/components/NoData";
export default {
  middleware: ["auth", 'admin'],
  components: {
    StartHeader,
    NoData,
  },
  mounted() {
    this.getSection();
    this.getSectionSubjects();
    this.getAllTeachers();
    this.getLevels();

  },

  data() {
    return {
      state: "",
      addSubjectPopup: false,
      isLoading: true,
      addTeacherToSubject: {
        teacher:{}
      },
      section: {},
      addNewSubject: {
        visibility: true,
        teacher: {},
      },
      mainProps: {
        blank: true,
        blankColor: "#FFF3EA",
        width: 55,
        height: 55,
        class: "m1",
      },
      photo: "",
      url: "",
      allSubjects: [],
      page: 1,
      totalPages: 1,
      updateSubjectPopup: false,
      updateSubject: {
        visibility: true,
        teacher: {},
      },
      toggleLockedPopup: false,
      currSection: {},
      allTeachers: [],
      currTeacher: {},
      timeout: null,
      allLevels: [],
      allClasses: [],
      allSections: [],
      selectedLevel: "",
      selectedClass: "",
      selectedSection: "",
      allSystems: [],
      selectedSystem: "",
      currLevel: {},
      currClass: {},
      openAddTeacherToSubjectModel: false,
      currSubject: {}
    };
  },
  watch: {
    selectedSystem(val) {
      this.selectedSection = this.selectedLevel = this.selectedClass = "";
      this.allSections = this.allClasses = [];
      this.getSectionSubjects()
    },
    selectedLevel(va) {
      this.selectedClass = this.selectedSection = "";
      this.allClasses = this.allSections = [];
      this.getSectionSubjects();
    },
    selectedClass(va) {
      this.selectedSection = "";
      this.allSections = [];
      this.getSectionSubjects();
    },
  },
  methods: {
    submitUpdateTeacherSubjectForm(formName){
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.updateSubjectTeacher()
        }
      })
    },
    updateSubjectTeacher(){
      const loading = this.$vs.loading();
      this.$axios.patch(`/teachers/${this.addTeacherToSubject.teacher.id}/assign-many`, {subjects: [this.currSubject.id] }).then(res => {
        this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `تم إضافة المدرس بالمادة بنجاح `
                : `Teacher Assigned To Subject Successfully`,
        });

        this.addTeacherToSubject = {
          teacher:{}
        };
        this.openAddTeacherToSubjectModel = false;
        this.getSectionSubjects();
      }).catch(err => {
        this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما `
                : `There Are Something Wrong!`,
        });
      })
      .finally(() => loading.close());
    },
    openAddTeacherToSubject(subject){
      console.log(subject)
      if(!subject.teahcer){
        subject.teacher = {}
      }
      this.currSubject = this.addTeacherToSubject = {...subject};
      this.openAddTeacherToSubjectModel = true;
    },

    toggleVisibilty() {
      this.addNewSubject.visibility = !this.addNewSubject.visibility;
      this.updateSubject.visibility = !this.updateSubject.visibility;
    },


    getLevels() {
      const loading = this.$vs.loading();

      this.$axios
        .get(`/levels?paginate=false`)
        .then((res) => {
          this.allLevels = res.data;
          this.currLevel = this.allLevels.find(ele => ele.id == this.$route.query.level);
        })
        .finally(() => loading.close());
    },
    getClasses(page) {
      if (!this.selectedLevel) {
        this.selectedClass = this.selectedSection = "";
        this.allClasses = this.allSections = [];
        return;
      }
      const loading = this.$vs.loading();

      this.$axios
        .get(`/levels/${this.selectedLevel}/classes?paginate=false`)
        .then((res) => {
          this.allClasses = res.data;
        })
        .finally(() => loading.close());
    },
    getSections() {
      if (this.selectedClass) {
        const loading = this.$vs.loading();

        this.$axios
          .get(
            `/classes/${this.selectedClass}/sections?paginate=false${
              this.selectedSystem > 0 ? "&system=" + this.selectedSystem : ""
            }`
          )
          .then((res) => {
            this.allSections = res.data;
          })
          .finally(() => loading.close());
      } else {
        this.selectedSection = "";
        this.allSections = [];
      }
    },

    addNewSub() {
      this.updateSubjectPopup = false;
      this.addSubjectPopup = !this.addSubjectPopup;
    },
    handleSelectAdd(item) {
      this.addNewSubject.teacher = item;
    },
    handleSelectUpdate(item) {
      this.addTeacherToSubject.teacher = item;
    },

    querySearchAsync(queryString, cb) {
      var links = this.allTeachers;
      var results = queryString
        ? links.filter(
            (link) =>
              link.username.toLowerCase().indexOf(queryString.toLowerCase()) ===
              0
          )
        : links;
      console.log(results);

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000);
    },

    getAllTeachers() {
      this.$axios.get("/teachers?paginate=false").then((res) => {
        this.allTeachers = res.data;
        this.page = res.data.page;
      });
    },
    // changeSectionStatus(){
    //     this.toggleLockedPopup = false;
    //     let loading = this.$vs.loading();
    //     let lockedOrNot = !this.currSection.locked ? true : false;
    //     this.$axios.patch(`/sections/${this.currSection.id}`, {isLocked: lockedOrNot}).then(res => {
    //         this.$notify({
    //             title: 'تم بنجاح!',
    //             message: `لقد تم تغيير حالة القسم بنجاح`,
    //             type: 'success'
    //         });
    //         this.getSection();
    //     }).finally(() => loading.close())
    // },
    makeItAvailable(section) {
      this.currSection = { ...section };
      this.toggleLockedPopup = true;
    },

    handleUpdate(subject) {
      this.addSubjectPopup = false;
      this.updateSubjectPopup = !this.updateSubjectPopup;
      console.log(subject);
      this.updateSubject = { ...subject };
      this.photo = subject.photo;
      this.url = subject.photo;
    },
    confirmDelete(sub) {
      this.updateSubjectPopup = false;
      const loading = this.$vs.loading();
      this.$axios
        .delete(`subjects/${sub.id}`)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت مسح الماده بنجاح!`
                : `Subject Deleted Successfully!`,
          });

          this.getSectionSubjects();
        })
        .catch((err) => {
          if (err.response.status == 403 && err.response.data && err.response.data.flag == 7001) {
            this.$message.error({
              message: this.$i18n.locale == 'ar' ? 'لا يمكن حذف هذه المادة لانها خاصة بمدرس' : 'You Cant Delete Subject Assigned To Teacher',
            });
            return;
          }

          if (err.response.status == 403 && err.response.data && err.response.data.flag == 7000) {
            this.$message.error({
              message: this.$i18n.locale == 'ar' ? 'لا يمكن حذف هذه المادة لانها تحتوي علي منهج' : 'You Cant Delete Subject Contains A Materials',
            });
            return;
          }

        })
        .finally(() => loading.close());
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
    addNewSubjectInBackend() {
      let formData = new FormData();
      formData.append("nameAr", this.addNewSubject.nameAr);
      formData.append("nameEn", this.addNewSubject.nameEn);
      formData.append("visibility", this.addNewSubject.visibility);
      formData.append("description", this.addNewSubject.description);
      if (this.photo) {
        formData.append("photo", this.photo);
      }

      if (!this.addNewSubject.teacher.id) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "ar"
              ? `هذا المعلم غير موجود`
              : `This Teacher not Exist`,
        });

        return;
      }

      const loading = this.$vs.loading();
      this.$axios
        .post(
          `/sections/${
            this.selectedSection ? this.selectedSection : this.$route.params.id
          }/teachers/${this.addNewSubject.teacher.id}/subjects`,
          formData
        )
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة الماده بنجاح!`
                : `Subject Added Successfully!`,
          });

          this.addSubjectPopup = false;
          this.addNewSubject = {};
          this.getSectionSubjects();
        })
        .catch((err) => {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `يوجد خطا ما`
                : `There Are Something Wrong!`,
          });
        })
        .finally(() => loading.close());
    },

    updateSubjectInBackend() {
      this.updateSubjectPopup = false;
      const loading = this.$vs.loading();
      let formData = new FormData();
      formData.append("nameAr", this.updateSubject.nameAr);
      formData.append("nameEn", this.updateSubject.nameEn);
      formData.append("description", this.updateSubject.description);
      formData.append("visibility", this.updateSubject.visibility);

      formData.append("teacher", this.updateSubject.teacher.id);
      if (this.photo) {
        formData.append("photo", this.photo);
      }
      this.$axios
        .patch(`/subjects/${this.updateSubject.id}`, formData)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت تحديث الماده بنجاح!`
                : `Subject Updated Successfully!`,
          });

          this.updateSubjectPopup = false;
          this.getSectionSubjects();
        })
        .catch((err) => {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `يوجد خطا ما`
                : `There Are Something Wrong!`,
          });
        })
        .finally(() => loading.close());
    },
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.addNewSubjectInBackend();
        }
      });
    },

    submitUpdateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.updateSubjectInBackend();
        }
      });
    },

    getSectionSubjects() {
      const loading = this.$vs.loading();
      this.$axios
        .get(
          `/sections/${
            this.selectedSection ? this.selectedSection : this.$route.params.id
          }/subjects`
        )
        .then((res) => {
          this.allSubjects = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },
    getSection() {
      const loading = this.$vs.loading();
      this.$axios
        .get(
          `/sections/${
            this.selectedSection ? this.selectedSection : this.$route.params.id
          }`
        )
        .then((res) => {
          this.section = { ...res.data };
        })
        .finally(() => loading.close());
    },
  },
};
</script>

<style lang="scss">
.section-page {


  .section-page-inner{

padding: 15px;
    background: #FFF;
  }

  .add-edit-subject{
    h6{
      font-size: 12px;
      color: var(--yellow);
    }
  }
  .section-details {
    background: #fff;
    border: 1px solid #f7f7f7;
    border-radius: 7px;
    position: relative;

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
      .icon {
        max-width: 115px;
      padding-top: 13px;
      text-align: center;
      margin: auto;
        img{
          width: 100%
        }
      }
      h5 {
            text-align: center;
            margin-bottom: 0;
            margin: 0 15px;
            font-weight: bold;
            margin: 5px 0;
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

    .capacity {
      h6 {
      }
    }
    .title {
      font-size: 12px;
      color: #2c4484;
      margin-left: 5px;
      margin-right: 5px;
    }
    .status {
      display: inline-block;
      h6 {
        color: #fff;
        padding: 5px;
        // border-radius: 5px;
        font-size: 12px;
      }
      .locked {
        background: var(--danger);
      }
      .available {
        background: var(--success);
      }
    }
  }
  .subjects {
    padding: 0 8px;
    min-height: 500px;

    .subject {
      background: #fff;
      padding: 18px 5px;
      margin-bottom: 10px;
      border: 1px solid #2c44842b;
      position: relative;

      .operations {
        position: absolute;
        top: 0;
        right: 5px;
        display: flex;
        div {
          margin: 0 3px;
          width: 13px;
          img {
            width: 100%;
            cursor: pointer;
          }
        }
      }

      .content {
        margin: 0 10px;
        h6 {
          margin-bottom: 5px;
        }
        span {
          font-size: 11px;
          color: #6d6d6d;
          display: block;
        }
      }
    }
  }
}


.btn {
  font-size: 12px !important;
  font-family: "Cairo", sans-serif !important;
  font-weight: 600 !important;
  padding: 8px 15px !important;

  &.btn-white {
    border: none !important;
  }
}
.attach-img {
  border: none !important;
  background: none !important;
  i{
    color: #333;
  }
  // &:hover {
  //   background-color: #ffa400;
  //   color: #ffffff;
  // }
}
.eye {
  border: none !important;
  box-shadow: none !important;
  // &:hover {
  //   background-color: #ffa400;
  //   color: #ffffff;
  // }
}
// .el-upload-list__item-name {
//   display: none;
// }
.el-form-item {
  .el-input__inner {
    border-radius: 6px !important;
    border: 1px solid #b2b2b2 !important;

    &::placeholder {
      font-size: 12px;
      font-weight: normal !important;
      padding: 10px 0;
    }
  }
}

.el-autocomplete-suggestion{
  z-index: 9999999999999999 !important;
  font-family: 'Cairo' !important;
}
.vs-dialog{
  font-family: 'Cairo' !important;

}
</style>
