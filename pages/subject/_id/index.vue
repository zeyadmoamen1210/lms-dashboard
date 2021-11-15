<template>
  <div class="subject-page">
    <div class="container-fluid">
      <div class="subject-page-inner">



      <div class="header mt-1">

          <h5 style="color: var(--yellow)"> <span><i style="color: var(--yellow)" class="fas fa-book-reader"></i></span> {{ $i18n.locale == 'ar' ? subject.nameAr : subject.nameEn }}</h5>
        </div>









      <div class="d-flex flex-wrap path mb-4" style="margin-top: 20px" >

        <template v-if="$auth.loggedIn && $auth.user.role === 'teacher'">
          <div>
            <nuxt-link to="/teacher-subjects"> {{ $i18n.locale == 'ar' ? 'المواد الدراسية' : 'subjects' }} </nuxt-link>
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
            <h6 v-if="$i18n.locale == 'ar'">{{ subject.nameAr }}</h6>
            <h6 v-else>{{ subject.nameEn }}</h6>
          </div>
        </template>

        <!-- <div>
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
        </div> -->
        <template  v-if="$auth.loggedIn && $auth.user.role === 'admin'">

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
        <div v-if="currSection">
          <nuxt-link :to="`/section/${currSection.id}?level=${$route.query.level}&class=${$route.query.class}`"> {{ $i18n.locale == 'ar' ? currSection.nameAr : currSection.nameEn}} </nuxt-link>
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
        <div v-if="subject">
          <h6 v-if="$i18n.locale == 'ar'"> {{subject.nameAr}} </h6>
          <h6 v-else> {{subject.nameEn}} </h6>
        </div>


        </template>
      </div>





      <div class="row">
        <div class="col-md-6">
          <div class="edu-tabs">
            <button

              :class="{ btn: true, active: active == 1 }"
              @click="activeTabClicked(1)"
            >
              {{ $t("subjects.Units") }}
            </button>
            <button
              :class="{ btn: true, active: active == 2 }"
              @click="activeTabClicked(2)"
            >
              {{ $t("subjects.Exams") }}
            </button>

            <button
              :class="{ btn: true, active: active == 4 }"
              @click="activeTabClicked(4)"
            >
              {{ $t("subjects.Live") }}
            </button>

            <button
              v-if="examQuestions.length > 0"
              :class="{ btn: true, active: active == 3 }"
              @click="activeTabClicked(3)"
            >
              {{ $t("subjects.Questions") }}
            </button>



            <button
              class="btn"
              @click="
                $router.push(
                  `/bank-questions?${
                    $route.query.level ? 'level=' + $route.query.level : ''
                  }${$route.query.class ? '&class=' + $route.query.class : ''}${
                    $route.query.section
                      ? '&section=' + $route.query.section
                      : ''
                  }${$route.params.id ? '&subject=' + $route.params.id : ''}`
                )
              "
            >
              {{ $t("subjects.QuestionBank") }}
            </button>





          </div>
        </div>

        <div class="col-md-6">
          <div class="d-flex flex-row-reverse">
            <el-button v-if="$auth.loggedIn && $auth.user.role == 'teacher' && active == 1" type="warning" @click="handleAddUnit">
              {{ $t("subjects.AddUnit") }}</el-button
            >

            <el-button
              v-else-if="$auth.loggedIn && $auth.user.role == 'teacher' && active == 2"
              @click="openAddExamModel()"
              type="warning"
            >
              {{ $t("subjects.AddExam") }}</el-button
            >

            <el-button
              v-else-if="$auth.loggedIn && $auth.user.role == 'teacher' && active == 4"
              @click="openAddLiveModel()"
              type="warning"
            >
              {{ $t("subjects.AddLive") }}</el-button
            >
          </div>
        </div>
      </div>

      <section v-if="liveAddModel" class="mb-3 add-update-section ">
        <h6 class="mb-1"> {{ $i18n.locale == 'ar' ? 'إضافة لايف' : 'Add Live' }} </h6>
        <el-form :model="addLive" ref="addLive" class="for-add-or-update">
          <div class="inputs-grid row">
            <div class="col-md-3">
              <el-form-item
                prop="name"
                :rules="[
                  {
                    required: true,
                    message: $t('Validation.Title'),
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  :placeholder="$t('Validation.Title')"
                  v-model="addLive.name"
                ></el-input>
              </el-form-item>
            </div>

            <div class="col-md-3">
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
                  v-model="addLive.description"
                ></el-input>
              </el-form-item>
            </div>

            <div class="col-md-6">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    class="btn btn-org"
                    type="warning"
                    @click="submitAddLiveForm('addLive')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button
                    class="btn btn-white"
                    type="info"
                    @click="liveAddModel = false"
                    >{{ $t("Validation.close") }}</el-button
                  >
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <section v-if="liveUpdateModel" class="mb-3 add-update-section">
        <h6 class="mb-1"> {{ $i18n.locale == 'ar' ? 'تعديل اللايف' : 'Update Live' }} </h6>
        <el-form :model="updateLive" ref="updateLive" class="for-add-or-update">
          <div class="inputs-grid row">
            <div class="col-md-3">
              <el-form-item
                prop="name"
                :rules="[
                  {
                    required: true,
                    message: $t('Validation.title'),
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  :placeholder="$t('Validation.title')"
                  v-model="updateLive.name"
                ></el-input>
              </el-form-item>
            </div>

            <div class="col-md-3">
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
                  v-model="updateLive.description"
                ></el-input>
              </el-form-item>
            </div>

            <div class="col-md-6">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    class="btn btn-org"
                    type="warning"
                    @click="submitUpdateLiveForm('updateLive')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button
                    class="btn btn-white"
                    type="info"
                    @click="liveUpdateModel = false"
                    >{{ $t("Validation.close") }}</el-button
                  >
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <section
        v-if="
          examQuestions.length > 0 &&
          Object.keys(this.currQuestion).length > 0 &&
          openUpdateModel
        "
        class="mb-3 questions-content"
      >
        <UpdateQuestion
          @questionUpdatedSuccessfully="questionUpdated"
          :updateQuestion="currQuestion"
          :type="currQuestion.type"
          @closeUpdateQuestionModel="closeUpdateQuestionModel"
        />
      </section>

      <section v-if="addUnitPopup" class="add-update-section">
        <h6 class="mb-1"> {{ $i18n.locale == 'ar' ? 'إضافة وحدة' : 'Add Unit' }} </h6>
        <el-form :model="addNewUnit" ref="addNewUnit" class="for-add-or-update">
          <div class="inputs-grid row">

            <div class="col-md-4">
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
                  v-model="addNewUnit.nameAr"
                ></el-input>
              </el-form-item>
            </div>


            <div class="col-md-4">
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
                  v-model="addNewUnit.nameEn"
                ></el-input>
              </el-form-item>
            </div>



            <div class="col-md-4">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    class="btn btn-org"
                    type="warning"
                    @click="submitAddForm('addNewUnit')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button
                    class="btn btn-white"
                    type="info"
                    @click="addUnitPopup = false"
                    >{{ $t("Validation.close") }}</el-button
                  >
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <section v-if="updateUnitPopup" class="add-update-section">
         <h6 class="mb-1"> {{ $i18n.locale == 'ar' ? 'تعديل وحدة' : 'Update Unit' }} </h6>
        <el-form :model="updateUnit" ref="updateUnit" class="for-add-or-update">
          <div class="inputs-grid row">

            <div class="col-md-4">
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
                  v-model="updateUnit.nameAr"
                ></el-input>
              </el-form-item>
            </div>


            <div class="col-md-4">
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
                  v-model="updateUnit.nameEn"
                ></el-input>
              </el-form-item>
            </div>



            <div class="col-md-4">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    class="btn btn-org"
                    type="warning"
                    @click="submitUpdateForm('updateUnit')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button
                    class="btn btn-white"
                    type="info"
                    @click="updateUnitPopup = false"
                    >{{ $t("Validation.close") }}</el-button
                  >
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <section v-if="active == 1" class="units-tab">
        <div class="row" v-if="units.length > 0">
          <div class="col-md-4" v-for="unit in units" :key="unit.id">
            <div class="unit-card">
              <div class="row">
                <div class="col-md-7 p-0">
                  <div>
                    <h6 v-if="$i18n.locale == 'ar'">{{ unit.nameAr }}</h6>
                    <h6 v-else>{{ unit.nameEn }}</h6>
                  </div>
                </div>

                <div class="col-md-5 p-0">
                  <div class="unit-actions">
                    <el-button
                      class="btn btn-Lightorg"
                      @click="
                        $router.push(
                          `/unit/${unit.id}?${
                            $route.query.level
                              ? 'level=' + $route.query.level
                              : ''
                          }${
                            $route.query.class
                              ? '&class=' + $route.query.class
                              : ''
                          }${
                            $route.query.section
                              ? '&section=' + $route.query.section
                              : ''
                          }${
                            $route.params.id
                              ? '&subject=' + $route.params.id
                              : ''
                          }`
                        )
                      "
                    >
                      {{ $t("subjects.ShowContent") }}
                    </el-button>

                    <div class="d-flex justify-content-center">
                      <button
                        class="btn-edit"
                        style="
                          width: 40px;
                          height: 40px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        "
                        :class="[$i18n.locale === 'ar' ? 'ml-2 mr-1' : 'mr-2']"
                        @click="handleUpdatUnit(unit)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <el-popconfirm
                        :confirm-button-text="$t('Validation.delete')"
                        :cancel-button-text="$t('Validation.close')"
                        @confirm="deleteUnit(unit)"
                        icon="el-icon-info"
                        icon-color="red"
                        :title="$t('Validation.AreYouSure')"
                      >
                        <button
                          class="btn-delete"
                          slot="reference"
                          style="
                            width: 40px;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          "
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </el-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
                  <NoData width="350px" />
                </div>
      </section>

      <section v-else-if="active == 2">
        <!-- Add New Exam To Subject -->
        <div v-if="addExamModel">
          <AddNewExam
            @examAddedSuccessfully="afterExamAdded()"
            objectType="subject"
            :objectId="subject.id"
            :addNewExam="addSubjectExam"
            @ifModelClosed="closeAddExam()"
          />
        </div>

        <!-- Update Exam To Subject -->
        <div v-if="subjectUpdateModel">
          <UpdateExam
            @examUpdatedSuccessfully="afterExamUpdated()"
            objectType="subject"
            :exam="currSubjectExam"
            @ifModelClosed="closeUpdateExam()"
          />
        </div>

        <div class="exams" v-if="subjectExams.length > 0">
          <div class="row" style="flex-wrap: wrap">

            <div class="col-md-3" v-for="exam in subjectExams" :key="exam.id">
              <div>
                <Exam :exam="exam" @openExamQuestion="openExamQuestion">
                  <div slot="update-delete">
                    <div class="d-flex update-delete-exam text-center justify-content-center">
                      <div>
                        <button
                        style="color: #534dba; flex: 1"
                        @click="openUpdateExamModel({ ...exam })"
                        :class="{
                          btn: true,

                          edit: true,
                        }"
                      >
                        <!-- {{ $t("subjects.update") }} -->
                        <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 386.615 386.615"
                  style="enable-background:new 0 0 386.615 386.615;"
                  xml:space="preserve"
                >
                  <g>
                    <g>
                      <g>
                        <path
                          d="M36.573,309.292h2.09l100.833-21.943c1.964-0.327,3.784-1.237,5.224-2.612L315.56,113.896     c12.48-12.453,19.443-29.391,19.331-47.02c0.023-17.766-6.917-34.833-19.331-47.543C303.108,6.853,286.17-0.11,268.54,0.003     c-17.742-0.157-34.76,7.028-47.02,19.853L51.201,190.696c-1.502,1.209-2.597,2.85-3.135,4.702L26.124,296.231     c-0.599,3.62,0.565,7.308,3.135,9.927C31.188,308.126,33.817,309.253,36.573,309.292z M268.54,20.901     c25.103-0.002,45.454,20.347,45.456,45.45c0,0.175-0.001,0.35-0.003,0.525c0.171,11.959-4.547,23.47-13.061,31.869     l-64.261-64.784C245.137,25.548,256.604,20.848,268.54,20.901z M222.042,49.113l64.261,64.261L137.405,261.749l-64.261-63.739     L222.042,49.113z M64.785,218.909l51.722,51.722L50.156,285.26L64.785,218.909z"
                        />
                        <path
                          d="M368.328,365.717H18.287c-5.771,0-10.449,4.678-10.449,10.449s4.678,10.449,10.449,10.449h350.041     c5.771,0,10.449-4.678,10.449-10.449S374.099,365.717,368.328,365.717z"
                        />
                      </g>
                    </g>
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
                      </div>

                      <div>
                        <el-popconfirm
                        :confirm-button-text="$t('Validation.delete')"
                        :cancel-button-text="$t('Validation.close')"
                        icon="el-icon-info"
                        class=""
                        @confirm="deleteExam(exam)"
                        icon-color="red"
                        :title="$t('Validation.AreYouSure')"
                      >
                        <button
                          slot="reference"
                          class="btn delete"
                          style="color: #ff5e5e"
                        >
                                                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="24" viewBox="0 0 512 512" width="36"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                        </button>
                      </el-popconfirm>
                      </div>
                    </div>
                  </div>
                </Exam>
              </div>
            </div>
          </div>

          <!-- <div v-else>
            <p
              @click="closeExamQuestion('subject')"
              class="exam-questions-btn pointer"
            >
              {{ $t("subjects.BackToExams") }}
            </p>

            <div>
              <ShowExam
                :toExam="true"
                :exam="currSubjectExam"
                @openAddQuestionsToExam="openAddQuestionsToSelectedExam"
                @openUpdateModel="openUpdateQuestionModel"
                :examQuestions="examQuestions"
                @getExamQuestion="getExamQuestions"
              >
                <div slot="update-delete">
                  <div class="d-flex update-delete-exam text-center justify-content-center">
                    <div>
                      <button
                      @click="openUpdateExamModel({ ...currSubjectExam })"
                      :class="{
                        btn: true,

                        'border-right': $i18n.locale == 'en',
                        'border-left': $i18n.locale == 'ar',
                        edit: true,
                      }"
                    >
                      <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 386.615 386.615"
                  style="enable-background:new 0 0 386.615 386.615;"
                  xml:space="preserve"
                >
                  <g>
                    <g>
                      <g>
                        <path
                          d="M36.573,309.292h2.09l100.833-21.943c1.964-0.327,3.784-1.237,5.224-2.612L315.56,113.896     c12.48-12.453,19.443-29.391,19.331-47.02c0.023-17.766-6.917-34.833-19.331-47.543C303.108,6.853,286.17-0.11,268.54,0.003     c-17.742-0.157-34.76,7.028-47.02,19.853L51.201,190.696c-1.502,1.209-2.597,2.85-3.135,4.702L26.124,296.231     c-0.599,3.62,0.565,7.308,3.135,9.927C31.188,308.126,33.817,309.253,36.573,309.292z M268.54,20.901     c25.103-0.002,45.454,20.347,45.456,45.45c0,0.175-0.001,0.35-0.003,0.525c0.171,11.959-4.547,23.47-13.061,31.869     l-64.261-64.784C245.137,25.548,256.604,20.848,268.54,20.901z M222.042,49.113l64.261,64.261L137.405,261.749l-64.261-63.739     L222.042,49.113z M64.785,218.909l51.722,51.722L50.156,285.26L64.785,218.909z"
                        />
                        <path
                          d="M368.328,365.717H18.287c-5.771,0-10.449,4.678-10.449,10.449s4.678,10.449,10.449,10.449h350.041     c5.771,0,10.449-4.678,10.449-10.449S374.099,365.717,368.328,365.717z"
                        />
                      </g>
                    </g>
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
                    </div>

                    <div>
                      <el-popconfirm
                      :confirm-button-text="$t('Validation.delete')"
                      :cancel-button-text="$t('Validation.close')"
                      icon="el-icon-info"
                      class=""
                      @confirm="deleteExam(currSubjectExam)"
                      icon-color="red"
                      :title="$t('Validation.AreYouSure')"
                    >
                      <button slot="reference" class="btn delete">
                                                  <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                      </button>
                    </el-popconfirm>
                    </div>
                  </div>
                </div>
              </ShowExam>
            </div>
          </div> -->
        </div>
        <div v-else>
                  <NoData width="350px" />
            </div>
      </section>

      <section
        v-else-if="
          active == 3 && Object.keys(currExamToAssignQuestions).length > 0
        "
      >
        <div class="edu-tabs">
          <button
            :class="{ btn: true, active: lessonTab == 1 }"
            @click="lessonTab = 1"
          >
            {{ $t("subjects.que") }}
          </button>
          <button
            :class="{ btn: true, active: lessonTab == 2 }"
            @click="lessonTab = 2"
          >
            {{ $t("subjects.QuestionBank") }}
          </button>
          <!-- <button
              :class="{ btn: true, active: lessonTab == 3 }"
              @click="lessonTab = 3"
            >
              إضافة سؤال بصورة
            </button> -->
          <button
            :class="{ btn: true, active: lessonTab == 4 }"
            @click="lessonTab = 4"
          >
            {{ $t("subjects.Addmorethanonequestion") }}
          </button>
          <!-- <button
              :class="{ btn: true, active: lessonTab == 5 }"
              @click="lessonTab = 5"
            >
              إضافة سؤال جروب
            </button> -->
        </div>

        <section v-if="lessonTab == 1">
          <div class="questions">
            <div class="questions" v-if="subject && examQuestions.length > 0">
              <ShowQuestions
                :examQuestions="examQuestions"
                @deleteQuestionFromExam="deleteQuestionFromExam"
                @deleteQuestion="deleteQuestion"
                :allQuestionsCount="1"
                @openUpdateQuesModel="openUpdateQuesModel"
                :allQuestions="examQuestions"
                :page="page"
                :totalPages="totalPages"
                @closeUpdateQuestionModel="closeUpdateQuestionModel"
                :toExam="true"
              />
            </div>

            <div v-else class="no-questions-available" style="">
              <div class="no-questions-container">
                <div class="no-files" style="">
                  <img
                    style=""
                    src="@/assets/imgs/question-bank/Personal-files-bro.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="lessonTab == 2">
          <div class="d-flex mb-3">
            <div class="mr-1 ml-1 mb-1">
              <div>
                <el-select
                  clearable
                  v-model="unitToAddNewQuestion"
                  :placeholder="$t('subjects.Unit')"
                >
                  <el-option
                    v-for="item in units"
                    :key="item.id"
                    :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>

            <div class="mr-1 ml-1 mb-1">
              <div>
                <el-select
                  clearable
                  v-model="lessonToAddNewQuestion"
                  :placeholder="$t('subjects.Lessons')"
                >
                  <el-option
                    v-for="item in allLessons"
                    :key="item.id"
                    :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>

          <div class="questions" v-if="subject && allQuestions.length > 0">
            <ShowQuestions
              :toExam="true"
              @addQuestionToExam="addQuestionToExam"
              :examQuestions="examQuestions"
              @deleteQuestion="deleteQuestion"
              @deleteQuestionFromExam="deleteQuestionFromExam"
              :allQuestionsCount="allQuestionsCount"
              @openUpdateQuesModel="openUpdateQuesModel"
              :allQuestions="allQuestions"
              :page="page"
              :totalPages="totalPages"
              @closeUpdateQuestionModel="closeUpdateQuestionModel"
            />

            <div class="row mb-4">
              <div class="col-md-8"></div>
              <div class="col-md-4">
                <div class="center con-pagination" v-if="totalPages > 1">
                  <vs-pagination
                    progress
                    v-model="page"
                    color="warning"
                    :length="totalPages"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-questions-available" style="">
            <div class="no-questions-container">
              <div class="no-files" style="">
                <img
                  style=""
                  src="@/assets/imgs/question-bank/Personal-files-bro.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <!-- <section v-if="lessonTab == 3">
              <div v-if="selectedSubject">


                   <div class="d-flex mb-3">



                            <div class="mr-1 ml-1 mb-1">
                            <div>
                                <el-select
                                clearable
                                v-model="questionType"
                                :placeholder="$t('subjects.questionTypes')"
                                >
                                <el-option
                                    v-for="item in questionTypes"
                                    :key="item.val"
                                    :label="item.nameEn"
                                    :value="item.val"
                                >
                                </el-option>
                                </el-select>
                            </div>
                            </div>
                   </div>


                  <AddSingleQuestion
                    :type="questionType"
                    :toExam="true"
                    :lesson="lessonToAddNewQuestion"
                    :examId="currExamToAssignQuestions"
                    @addIsCaceled="activeTab = 0"
                    @questionAddedSuccessfully="onAddQuestion"
                  />
                </div>

                <div v-else class="no-questions-available" style="">
                  <div class="no-questions-container">
                    <div class="no-files" style="">
                      <img
                        src="@/assets/imgs/question-bank/Questions-cuate.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>

          </section> -->

        <section v-if="lessonTab == 4">
          <div v-if="subject">
            <div class="d-flex mb-3">
              <div class="mr-1 ml-1 mb-1">
                <div>
                  <el-select
                    clearable
                    v-model="unitToAddNewQuestion"
                    :placeholder="$t('subjects.Unit')"
                  >
                    <el-option
                      v-for="item in units"
                      :key="item.id"
                      :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>

              <div class="mr-1 ml-1 mb-1">
                <div>
                  <el-select
                    clearable
                    v-model="lessonToAddNewQuestion"
                    :placeholder="$t('subjects.Lessons')"
                  >
                    <el-option
                      v-for="item in allLessons"
                      :key="item.id"
                      :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>

            <!-- @questionSavedSuccessfully="onAddManyQuestions" -->

            <AddManyQuestion
              :toExam="true"
              :lesson="lessonToAddNewQuestion"
              :examId="currExamToAssignQuestions"
              @questionSavedSuccessfully="questionsAddedToExam"
            />
          </div>
          <div v-else class="no-questions-available" style="">
            <div class="no-questions-container">
              <div class="no-files" style="">
                <img
                  src="@/assets/imgs/question-bank/Questions-cuate.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      </section>

      <section v-else-if="active == 4">
        <div v-if="subjectLives.length > 0">
          <div class="row" style="flex-wrap: wrap">
            <div class="col-md-3" v-for="live in subjectLives" :key="live.id">
              <div class="live-card">
                <img src="@/assets/imgs/live.png" style="width: 100px" />
                <h5>{{ live.name }}</h5>
                <p
                  style="margin-bottom: 5px;"
                >
                  {{ live.description }}
                </p>

                <!-- Live Now -->
                <div
                  @click="joinMeeting(live)"
                  class="d-flex justify-content-center mt-0 mb-3 live-now"
                  v-if="live.hasStarted && !live.hasFinished"
                >
                  <div class="circle pulse orange mt-1"></div>
                  <span class="d-block mr-2 ml-2 text-success">
                    {{ $t("subjects.LiveNow") }}
                  </span>
                </div>
                <span style="margin-bottom: 5px"> {{ $moment(live.createdAt).fromNow() }} </span>

                <div>
                  <div class="mb-2 update-delete-exam text-center justify-content-center">
                    <button
                      v-if="!live.hasStarted"
                      @click="startLive({ ...live })"
                      :class="{
                        btn: true,

                        'border-right': $i18n.locale == 'en',
                        'border-left': $i18n.locale == 'ar',
                        edit: true,
                      }"
                    >
                      <p class="d-flex justify-content-center" style="margin: 0;padding-bottom:0">
                         <img
                          class="mx-1"
                          src="@/assets/imgs/podcast.png"
                          style="width: 15px;object-fit:contain"
                          alt=""
                        />
                        {{ $t("subjects.start") }}

                      </p>
                    </button>

                  </div>


                  <div class="d-flex justify-content-center">
                    <button
                      style="padding:0"
                      @click="openUpdateLiveModel({ ...live })"
                      :class="{
                        btn: true,

                        'border-right': $i18n.locale == 'en',
                        'border-left': $i18n.locale == 'ar',
                        edit: true,
                      }"
                    >
                        <!-- {{ $t("subjects.update") }} -->
                        <img
                          class="mx-1"
                          src="@/assets/imgs/Icon-feather-edit-3.svg"
                          alt=""
                        />
                    </button>
                    <div>
                      <el-popconfirm
                      :confirm-button-text="$t('Validation.delete')"
                      :cancel-button-text="$t('Validation.close')"
                      @confirm="deleteLive({ ...live })"
                      icon-color="red"
                      class=""
                      :title="$t('Validation.AreYouSure')"
                    >
                      <button slot="reference" class="btn delete pl-0">
                          <!-- {{ $t("subjects.delete") }} -->
                          <img
                            class="mx-1"
                            src="@/assets/imgs/Icon-material-delete.svg"
                            alt=""
                          />
                      </button>
                    </el-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="center" v-if="liveTotalPages > 1">
            <vs-pagination v-model="livePage" :length="liveTotalPages" />
          </div>
        </div>

        <div v-else>
                  <NoData width="350px" />
            </div>
      </section>




      </div>

    </div>
  </div>
</template>

<script>
import AddNewExam from "@/components/Exams/Add.vue";
import Exam from "@/components/Exams/Exam";
import UpdateExam from "@/components/Exams/Update";
import ShowExam from "@/components/Exams/Show";
import ManyQuestions from "@/components/QuestionsBank/Add/ManyQuestions.vue";
import AddManyQuestion from "~/components/QuestionsBank/Add/ManyQuestions.vue";
import ShowQuestions from "~/components/QuestionsBank/ShowQuestions.vue";
import UpdateQuestion from "~/components/QuestionsBank/Update/UpdateQuestion.vue";
import NoData from "~/components/NoData.vue";

export default {
  components: {
    NoData,
    AddNewExam,
    UpdateQuestion,
    Exam,
    UpdateExam,
    ShowExam,
    ManyQuestions,
    AddManyQuestion,
    ShowQuestions,
  },
  created() {
    this.getUnits();
    this.getSubejct();
    this.getQuestions();
    this.getSubjectsLive();
    this.getLevel();
    this.getClass();
    this.getSection();

  },
  middleware:['auth'],
  watch: {
    livePage(val) {
      this.getSubjectsLive(val);
    },

    unitToAddNewQuestion(val) {
      this.lessonToAddNewQuestion = "";
      if (val != "") {
        this.getLessons(val);
      }
    },
    lessonToAddNewQuestion(val) {
      if (val != "") {
        this.getQuestions();
      }
    },
    page(newVal, oldVal) {
      this.getQuestions();
      this.openUpdateModel = false;
      if (newVal > oldVal) {
        let theDefference = Number(newVal) - Number(oldVal);
        this.allQuestionsCount += theDefference * 10;
      } else if (newVal < oldVal){
        let theDefference = Number(oldVal) - Number(newVal);
        this.allQuestionsCount -= theDefference * 10;
      }else{
        this.allQuestionsCount = 1;
      }



      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  data() {
    return {
      theDefference: 0,
      showQuestionsOfExam: false,
      addExamModel: false,
      subjectLives: [],
      livePage: 1,
      openUpdateModel:false,
      liveTotalPages: 1,
      addSubjectExam: {},
      subjectUpdateModel: false,
      currSubjectExam: {},
      unitToAddNewQuestion: "",
      subjectExams: [],
      lessonToAddNewQuestion: "",
      examQuestions: [],
      lessonTab: 0,
      currQuestion: {},
      allQuestions: [],
      allQuestionsCount: 1,

      addNewUnit: {},
      addUnitPopup: false,
      updateUnitPopup: false,
      currExamToAssignQuestions: {},

      units: [],
      updateUnit: {},
      page: 1,
      totalPages: 1,
      subject: {},
      active: 1,
      allLessons: [],
      allUnites: [],
      liveUpdateModel: false,
      updateLive: {},
      addLive: {},
      liveAddModel: false,
      currClass: {},
      currLevel: {},
      currSection: {},


    };
  },
  methods: {

    getClass(){
      const loading = this.$vs.loading();
      this.$axios
        .get(`/classes/${this.$route.query.class}`)
        .then((res) => {
          this.currClass = res.data;
        })
        .finally(() => loading.close());
    },

    getLevel(){
      const loading = this.$vs.loading();
      this.$axios
        .get(`/levels/${this.$route.query.level}`)
        .then((res) => {
          this.currLevel = res.data;
        })
        .finally(() => loading.close());
    },

    getSection(){
      const loading = this.$vs.loading();
      this.$axios
        .get(`/sections/${this.$route.query.section}`)
        .then((res) => {
          this.currSection = res.data;
        })
        .finally(() => loading.close());
    },

    joinMeeting(live) {
      let loading = this.$vs.loading();
      this.$axios
        .patch(`/live/${live.id}/join`)
        .then((res) => {
          window.open(res.data.url, "_blank").focus();
        })
        .catch((error) => {
          this.getSubjectsLive();
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم إنتهاء هذا اللايف"
                : "This Live Has Finished Now",
          });
          // this.$message.error({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم إنتهاء هذا اللايف"
          //       : "This Live Has Finished Now",
          //   type: "success",
          // });
        })
        .finally(() => loading.close());
    },

    startLive(live) {
      let loading = this.$vs.loading();
      this.$axios
        .patch(`/live/${live.id}/start`)
        .then((res) => {
          window.open(res.data.url, "_blank").focus();
          this.liveAddModel = false;
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم بدء اللايف بنجاح"
                : "Live Started Now Succesfully",
          });
          this.$message({
            message:
              this.$i18n.locale == "ar"
                ? "تم بدء اللايف بنجاح"
                : "Live Started Now Succesfully",
            type: "success",
          });

          this.getSubjectsLive();
        })
        .finally(() => loading.close());
    },

    openAddLiveModel() {
      this.openUpdateModel =
        this.addUnitPopup =
        this.updateUnitPopup =
        this.openAddQuestionsToExamModel =
        this.liveUpdateModel =
          false;
      this.subjectUpdateModel = false;
      this.addExamModel = false;
      this.liveAddModel = true;
    },

    openAddExamModel() {
      this.openUpdateModel =
        this.addUnitPopup =
        this.updateUnitPopup =
        this.openAddQuestionsToExamModel =
        this.liveUpdateModel =
          false;

      this.subjectUpdateModel = false;
      this.liveAddModel = false;
      this.addExamModel = true;
    },

    submitUpdateLiveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveUpdateLive();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    submitAddLiveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveAddLive();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    saveAddLive() {
      let loading = this.$vs.loading();
      this.$axios
        .post(`/subjects/${this.$route.params.id}/live`, { ...this.addLive })
        .then((res) => {
          this.liveAddModel = false;
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم إضافة اللايف بنجاح"
                : "Live Added Succesfully",
          });
          // this.$message({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم إضافة اللايف بنجاح"
          //       : "Live Added Succesfully",
          //   type: "success",
          // });

          this.getSubjectsLive();
        })
        .finally(() => loading.close());
    },

    saveUpdateLive() {
      let loading = this.$vs.loading();
      this.$axios
        .patch(`/live/${this.updateLive.id}`, { ...this.updateLive })
        .then((res) => {
          this.liveUpdateModel = false;
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم تعديل اللايف بنجاح"
                : "Live Updated Succesfully",
          });
          // this.$message({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم تعديل اللايف بنجاح"
          //       : "Live Updated Succesfully",
          //   type: "success",
          // });

          this.getSubjectsLive();
        })
        .finally(() => loading.close());
    },

    deleteLive(live) {
      let loading = this.$vs.loading();
      this.$axios
        .delete(`/live/${live.id}`)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف اللايف بنجاح"
                : "Live Deleted Succesfully",
          });
          // this.$message({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم حذف اللايف بنجاح"
          //       : "Live Deleted Succesfully",
          //   type: "success",
          // });

          this.getSubjectsLive();
        })
        .catch((err) => {
          this.$vs.notification({
            color: "#FA5B5A",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "حدث خطأ ما"
                : "There Are Something Wrong",
          });
          // this.$message.error({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "حدث خطأ ما"
          //       : "There Are Something Wrong",
          // });
        })
        .finally(() => loading.close());
    },

    activeTabClicked(val) {
      this.openUpdateModel =
        this.addUnitPopup =
        this.updateUnitPopup =
        this.openAddQuestionsToExamModel =
        this.liveUpdateModel =
          false;
      this.subjectUpdateModel = false;
      this.addExamModel = false;
      this.liveAddModel = false;
      this.active = val;
    },

    openUpdateLiveModel(live) {
      this.openUpdateModel =
        this.addUnitPopup =
        this.updateUnitPopup =
        this.openAddQuestionsToExamModel =
          false;
      this.updateLive = { ...live };
      this.liveUpdateModel = true;
    },

    getSubjectsLive(val = 1) {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/subjects/${this.$route.params.id}/live?page=${val}&limit=12`)
        .then((res) => {
          this.subjectLives = res.data.docs;
          this.livePage = res.data.page;
          this.liveTotalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },

    getQuestions() {
      const loading = this.$vs.loading();

      let endPointQuery = `/subjects/${this.$route.params.id}/questions?`;

      if (this.unitToAddNewQuestion) {
        endPointQuery += `unit=${this.unitToAddNewQuestion}&`;
      }

      //   if (this.filterType) {
      //     endPointQuery += `type=${this.filterType}&`;
      //   }

      if (this.lessonToAddNewQuestion) {
        endPointQuery += `object=${this.lessonToAddNewQuestion}&`;
      }

      if (this.page) {
        endPointQuery += `page=${this.page}&`;
      }

      this.$axios
        .get(endPointQuery)
        .then((res) => {
          this.allQuestions = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },

    closeUpdateQuestionModel() {
      console.log("hi dd", this.openUpdateModel);
      this.openUpdateModel = false;

    },
    questionUpdated() {
      this.openUpdateModel = false;
      this.getQuestions();
    },

    addQuestionToExam(question) {
      if (!question.point) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "ar"
              ? "حدد درجة السؤال اولا"
              : "Determine Degree Of Questions",
        });
        // this.$message.error({
        //   message:
        //     this.$i18n.locale == "ar"
        //       ? "حدد درجة السؤال اولا"
        //       : "Determine Degree Of Questions",
        // });
        return;
      }

      const loading = this.$vs.loading();

      this.$axios
        .patch(`/exams-add-questions/${this.currExamToAssignQuestions.id}`, [
          { question: question.id, point: question.point },
        ])
        .then((res) => {
          question.point = "";
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم إضافة السؤال الي الامتحان بنجاح"
                : "Question Added To Exam Successfully",
          });
          // this.$message({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم إضافة السؤال الي الامتحان بنجاح"
          //       : "Question Added To Exam Successfully",
          //   type: "success",
          // });
          this.currExamToAssignQuestions = res.data;
          this.getExamQuestions();
        })
        .finally(() => loading.close());
    },

    deleteQuestion(question) {
      const loading = this.$vs.loading();

      let qryParam = `/questions/${question.id}`;

      this.$axios
        .delete(qryParam)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف السؤال بنجاح"
                : "Question Deleted Successfully",
          });
          // this.$message({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم حذف السؤال بنجاح"
          //       : "Question Deleted Successfully",
          //   type: "success",
          // });
          this.getQuestions();
        })
        .finally(() => loading.close());
    },
    deleteQuestionFromExam(question) {
      let qryParam = `/exams/${this.currExamToAssignQuestions.id}/questions/${question.id}`;

      this.$axios
        .patch(qryParam)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف السؤال من الامتحان بنجاح"
                : "Question Deleted From Exam Successfully",
          });
          // this.$message({
          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم حذف السؤال من الامتحان بنجاح"
          //       : "Question Deleted From Exam Successfully",
          //   type: "success",
          // });
          this.getExamQuestions();
        })
        .finally(() => loading.close());
    },

    openAddQuestionsToSelectedExam(e) {
      this.openAddQuestionsToExamModel = true;
      this.currExamToAssignQuestions = { ...e };
      this.active = 3;
      this.lessonTab = 1;

      this.getExamQuestions();
    },

    getLessons(id) {
      this.$axios.get(`/units/${id}/lessons?paginate=false`).then((res) => {
        this.allLessons = res.data;
      });
    },

    questionsAddedToExam() {
      this.lessonTab = 1;
      this.getExamQuestions();
    },

    openUpdateQuesModel(question) {
      this.openUpdateQuestionModel(question);
    },

    getExamQuestions() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/exams/${this.currExamToAssignQuestions.id}`)
        .then((res) => {
          this.currExamToAssignQuestions =
            this.currUnitExam =
            this.currLessonExam =
            this.currSubjectExam =
              res.data;
          let arr = [];
          res.data.questions.map((element) => {
            arr.push({
              ...element.question,
              points: element.point,
              childrenQuestions: element.childrenQuestions,
            });
          });

          console.log(arr);

          this.examQuestions = arr;
        })
        .finally(() => loading.close());
    },

    closeExamQuestion(type) {
      this.addExamModel = this.subjectUpdateModel = false;

      this.addUnitPopup = this.openUpdateModel = false;

      this.subjectUpdateModel =
        this.openUpdateModel =
        this.openUpdateModel =
          false;

      this.showQuestionsOfExam = false;

      this.currSubjectExam = this.currExamToAssignQuestions = {};
    },

    openExamQuestion(e) {
      // this.showQuestionsOfExam = true;

      this.$router.push(`/exam-details/${e.id}?subject=${this.$route.params.id}&subject_name=${this.$i18n.locale == 'ar' ? this.subject.nameAr : this.subject.nameEn}&subject=${this.subject.id}&section=${this.$route.query.section}&class=${this.$route.query.class}&level=${this.$route.query.level}`)

      // this.currExamToAssignQuestions = { ...e };

      // this.currSubjectExam = { ...e };
      // this.getExamQuestions();
    },

    afterExamUpdated() {
      this.subjectUpdateModel = false;

      this.getSubjectExams();
    },

    getExamQuestions() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/exams/${this.currExamToAssignQuestions.id}`)
        .then((res) => {
          this.currExamToAssignQuestions = this.currSubjectExam = res.data;
          let arr = [];
          res.data.questions.map((element) => {
            arr.push({
              ...element.question,
              points: element.point,
              childrenQuestions: element.childrenQuestions,
            });
          });

          console.log(arr);

          this.examQuestions = arr;
        })
        .finally(() => loading.close());
    },

    afterExamAdded() {
      this.addExamModel = false;
      this.addSubjectExam = {};
      this.getSubjectExams();
    },

    openUpdateQuestionModel(question) {
      this.openUpdateModel = true;
      this.currQuestion = { ...question };
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    closeAddExam() {
      this.addExamModel = false;
    },

    openUpdateExamModel(exam) {
      this.addExamModel = false;
      this["subjectUpdateModel"] = true;

      if (exam.duration) {
        exam.isDuration = true;
      } else {
        exam.isDuration = false;
      }

      this.currSubjectExam = { ...exam };

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    closeUpdateExam() {
      this.subjectUpdateModel = false;
    },
    deleteExam(exam) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/exams/${exam.id}`)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف الامتحان بنجاح"
                : "Exam Deleted Successfully",
          });
          // this.$message({

          //   message:
          //     this.$i18n.locale == "ar"
          //       ? "تم حذف الامتحان بنجاح"
          //       : "Exam Deleted Successfully",
          //   type: "success",
          // });

          this.getSubjectExams();
          this.showQuestionsOfExam = false;
        })
        .finally(() => loading.close());
    },

    getSubjectExams() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/subjects/${this.subject.id}/exams?paginate=false`)
        .then((res) => {
          this.subjectExams = res.data;
        })
        .finally(() => loading.close());
    },

    handleAddUnit() {
      this.updateUnitPopup = false;
      this.addUnitPopup = !this.addUnitPopup;
    },
    handleUpdatUnit(unit) {
      this.updateUnit = { ...unit };
      this.addUnitPopup = false;
      this.updateUnitPopup = !this.updateUnitPopup;
    },
    deleteUnit(unit) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/units/${unit.id}`)
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تم مسح الوحده بنجاح!`
                : `units deleted Successfully !`,
          });
          // this.$message({
          //   message: `units deleted Successfully !`,
          //   type: "success",
          // });

          this.getUnits();
        })
        .finally(() => loading.close());
    },
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.addUnit();
        }
      });
    },
    submitUpdateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("valid");
          this.updateTheUnit();
        }
      });
    },
    addUnit() {
      const loading = this.$vs.loading();
      this.$axios
        .post(`subjects/${this.$route.params.id}/units`, {
          nameAr: this.addNewUnit.nameAr,
          nameEn: this.addNewUnit.nameEn,
        })
        .then((res) => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? `تمت إضافة الوحده بنجاح!`
                : `units added Successfully !`,
          });
          // this.$message({
          //   message: `units added Successfully !`,
          //   type: "success",
          // });
          this.addUnitPopup = false;
          this.addNewUnit = {};
          this.getUnits();
        })
        .finally(() => loading.close());
    },
    updateTheUnit() {
      const loading = this.$vs.loading();
      this.$axios
        .patch(`/units/${this.updateUnit.id}`, {
          nameAr: this.updateUnit.nameAr,
          nameEn: this.updateUnit.nameEn,
        })
        .then((res) => {
          this.$message({
            message: `units Updated Successfully !`,
            type: "success",
          });
          this.updateUnitPopup = false;
          this.updateUnit = {};
          this.getUnits();
        })
        .finally(() => loading.close());
    },
    getUnits() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/subjects/${this.$route.params.id}/units?paginate=false`)
        .then((res) => {
          this.units = res.data;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },
    getSubejct() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/subjects/${this.$route.params.id}`)
        .then((res) => {
          this.subject = res.data;
          this.getSubjectExams();
        })
        .finally(() => loading.close());
    },
  },
};
</script>

<style lang="scss">
.subject-page {
  margin-top: 16px;
  .subject-page-inner{
    padding: 15px;
    background: #FFF;
  }
  .subject-path {
    display: flex;
    padding-top: 30px;
    color: var(--blue);
    flex-wrap: wrap;
  }

  .el-button.el-button--warning {
    padding: 8px 9px !important;
  }

  .btn {
    outline: none !important;
    box-shadow: none !important;
  }

  .btn.active {
    border-bottom: 2px solid #ffa400 !important;
    border-radius: 0 !important;
  }

  .units-tab {
    margin-top: 20px;

    .unit-card {
      box-shadow: 0 0 3px 0px #00000026;
      padding: 30px;
      margin-bottom: 20px;
      /* border: 1px solid rgba(112,112,112,0.21176); */
      border-radius: 5px;
      box-shadow: 0 4px 25px 0 #0000000d;
      transition: all .5s ease;
      cursor: pointer;
      background: #fff;

      &:hover{
        transform: translateY(-10px);
      }

      h6 {
        text-align: center;
        padding-top: 18px;

        text-overflow: ellipsis;
      }

      .unit-actions {
        text-align: center;
        .el-button {
          padding: 7px 12px;
          margin-bottom: 8px;
          span {
            color: var(--yellow);
          }
        }
      }
    }
  }
}

.exams-page {
  .exams {
    padding-top: 30px;
    .exams-tab {
      padding: 15px;
      // background-color: #fff;
    }
  }

  .btn.exam-questions-btn {
    margin-bottom: 6px;
    padding-bottom: 0;
    text-decoration: underline;
    color: var(--blue);
    font-size: 19px;
    font-weight: bold;
  }
}

.el-form.add-question-form {
  .el-upload.el-upload--picture-card {
    width: 100% !important;
  }
}
.el-form.arabic-form {
  .el-form-item__label {
    float: right !important;
    padding-right: 0 !important;
  }
}

.add-new-question{
  .el-icon-circle-close{
    font-size: 27px;
  }
}

.el-form {
  .el-form-item__label {
    width: 100%;
    color: #333 !important;
    font-weight: normal !important;
    font-size: 19px !important;
    margin-bottom: 1px !important;
  }
  .fullwidth {
    width: 93% !important;
  }
  .el-radio__inner {
    border-radius: 8px !important;
    width: 33px !important;
    height: 33px !important;
  }

  .true-false {
    .el-radio__label {
      font-size: 23px;
      padding-left: 10px;
      font-weight: 100;
    }
  }

  label[for="modelAnswer"] {
    visibility: hidden !important;
  }
}

.live-card {
  border-radius: 7px;
  box-shadow: 0 0 3px 0 #dddddd;

  margin-bottom: 15px;
  text-align: center;
  background: #fff;
  position: relative;
  padding-top: 33px;


  h5 {
    font-size: 18px;
  }

  .circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    box-shadow: 0px 0px 1px 1px #0000001a;
    background: var(--success);
  }

  // .live-now {
  //   position: absolute;
  //   bottom: 27%;
  //   left: 50%;
  //   transform: translate(-50%, 0);
  // }

  .pulse {
    animation: pulse-animation 2s infinite;
  }

  @keyframes pulse-animation {
    0% {
      box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
    }
  }
}
.live-iframe {
  padding: 15px;
  iframe {
    width: 100%;
    min-height: 1000px;
  }
}
.btn-Lightorg {
  background-color: #fffbef !important;
  font-family: 600 !important;
  color: #534dba !important;
  border: 1px solid #ffa400 !important;
}
.delete {
  margin: 0 -5px;
}

.update-delete-exam {
  .exams {
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 10px 0;
      border: none !important;
      width: 100% !important;
    }
  }
}
@import "../../../assets/styles/bank-questions.scss";


</style>
