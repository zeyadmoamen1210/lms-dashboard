<template>
  <div class="exams-page">
    <div class="container-fluid">
      <div class="exams">

        <div class="header mt-1">

          <h5 style="color: var(--yellow)"> <span><i style="color: var(--yellow)" class="fas fa-book-reader"></i></span> {{ $i18n.locale == 'ar' ? 'الامتحانات' : 'Exams' }}</h5>
        </div>

        <div class="d-flex flex-wrap path" style="padding: 5px 0 18px;" >
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
          <h6> {{ $i18n.locale == 'ar' ? 'الامتحانات' : 'Exams' }}</h6>
        </div>
      </div>

        <section
          v-if="
            (allQuestions.length > 0 || examQuestions.length > 0) &&
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

        <div class="edu-tabs">
          <button
            :class="{ btn: true, active: active == 1 }"
            @click="active = 1"
          >
            {{ $t("subjects.Exams") }}
          </button>
          <button
            v-if="
              openAddQuestionsToExamModel &&
              Object.keys(currExamToAssignQuestions).length > 0
            "
            :class="{ btn: true, active: active == 2 }"
            @click="active = 2"
          >
            {{ $t("subjects.Questions") }}
          </button>
        </div>




        <section class="exams-tab" v-if="active == 1">
          <div class="edu-tabs">
            <button
              :class="{ btn: true, active: examsActive == 1 }"
              @click="examsActive = 1"
            >
              {{ $t("subjects.Subject") }}
            </button>

            <button
              :class="{ btn: true, active: examsActive == 3 }"
              @click="examsActive = 3"
            >
              {{ $t("subjects.Lessons") }}
            </button>
          </div>

          <!-- Start Of Exams Tab  -->

          <!-- subjects -->
          <section v-if="examsActive == 1">
            <div class="subject-filter">
              <div class="row">
                <div class="col-md-9">
                  <div class="d-flex flex-wrap">

                    <div class="mr-1 ml-1 mb-1">
                      <div>
                        <el-select
                          clearable
                          v-model="selectedLevel"
                          @change="selectedLevelChanged"
                          :placeholder="$t('subjects.Levels')"
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



                    <div class="mr-1 ml-1 mb-1">
                      <div>
                        <el-select
                          clearable
                          @change="selectedSectionChanged()"
                          v-model="selectedSection"
                          :placeholder="$t('classes.Sections')"
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

                    <div class="mr-1 ml-1 mb-1">
                      <div>
                        <el-select
                          clearable
                          @change="selectedSubjectChanged()"
                          v-model="selectedSubject"
                          :placeholder="$t('classes.Subjects')"
                        >
                          <template v-if="allSubjects.length > 0">
                            <el-option
                              v-for="item in allSubjects"
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
                </div>
                <div class="col-md-3" v-if="$auth.loggedIn">
                  <div class="d-flex flex-row-reverse">
                    <el-button
                      @click="openAddExamToSubjectModel"
                      type="warning"
                      style="border-radius: 6px"
                      >{{ $t("subjects.AddExam") }}</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Add New Exam To Subject -->
            <div v-if="addSubjectExamModel">
              <AddNewExam
                @examAddedSuccessfully="afterExamAdded('addSubjectExamModel')"
                objectType="subject"
                :objectId="selectedSubject"
                :addNewExam="addSubjectExam"
                @ifModelClosed="closeAddExam('addSubjectExamModel')"
              />
            </div>

            <!-- Update Exam To Subject -->
            <div v-if="subjectUpdateModel && selectedSubject">
              <UpdateExam
                @examUpdatedSuccessfully="
                  afterExamUpdated('subject', 'subjectUpdateModel')
                "
                objectType="subject"
                :exam="currSubjectExam"
                @ifModelClosed="closeUpdateExam('subjectUpdateModel')"
              />
            </div>

            <div class="exams">
              <div v-if="!subjectShowQuestionsOfExam">
                <div class="row" v-if="subjectExams.length > 0">
                  <div
                    class="col-md-3"
                    v-for="exam in subjectExams"
                    :key="exam.id"
                  >
                    <div>
                      <Exam
                        :exam="exam"
                        @openExamQuestion="openExamQuestion('subject', $event)"
                      >
                        <div slot="update-delete">
                          <div class="d-flex update-delete-exam text-center justify-content-center">
                            <button
                              @click="
                                openUpdateExamModel('subject', { ...exam })
                              "
                              :class="{
                                btn: true,

                                'border-right': $i18n.locale == 'en',
                                'border-left': $i18n.locale == 'ar',
                                edit: true,
                              }"
                              style="
                               flex: 1;
                                font-size: 12px !important;
                              "
                            >
                              <!-- {{ $i18n.locale == 'ar' ? 'تعديل' : 'Update' }} -->
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

                            <el-popconfirm
                              :confirm-button-text="$t('Validation.delete')"
                              :cancel-button-text="$t('Validation.close')"
                              icon="el-icon-info"
                              class=""
                              style="
                                flex: 1;
                                font-size: 12px !important;
                              "
                              @confirm="deleteExam('subject', exam)"
                              icon-color="red"
                              :title="$t('Validation.AreYouSure')"
                            >
                              <button slot="reference" class="btn-dels delete">
                                <!-- {{ $i18n.locale == 'ar' ? 'حذف' : 'Delete' }} -->
                                                          <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                              </button>
                            </el-popconfirm>
                          </div>
                        </div>
                      </Exam>
                    </div>
                  </div>
                </div>

                <div v-else>
                  <NoData width="350px" />
                </div>
              </div>

              <div v-else>
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
                    @openAddQuestionsToExam="
                      openAddQuestionsToSelectedExam('subject', $event)
                    "
                    @openUpdateModel="openUpdateQuesModel"
                    :examQuestions="examQuestions"
                    @getExamQuestion="getExamQuestions"
                  >
                    <div slot="update-delete">
                      <div class="d-flex update-delete-exam text-center justify-content-center">
                        <div>
                          <button
                          @click="
                            openUpdateExamModel('subject', {
                              ...currSubjectExam,
                            })
                          "
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
                          @confirm="deleteExam('subject', currSubjectExam)"
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
              </div>
            </div>
          </section>
          <!-- units -->
          <section v-if="examsActive == 2">
            <div class="unit-filter">
              <div class="row">
                <div class="col-md-9">
                  <div class="d-flex flex-wrap">

                  </div>
                </div>
                <div class="col-md-3" v-if="$auth.loggedIn && $auth.user.role == 'teacher'">
                  <div class="d-flex flex-row-reverse">
                    <el-button @click="openAddExamToUnitModel" type="warning"
                      >إضافة امتحان</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Add New Exam To Unit -->
            <div v-if="addUnitExamModel">
              <AddNewExam
                @examAddedSuccessfully="afterExamAdded('addUnitExamModel')"
                objectType="unit"
                :objectId="selectedUnit"
                :addNewExam="addUnitExam"
                @ifModelClosed="closeAddExam('addUnitExamModel')"
              />
            </div>

            <!-- Update Exam To Unit -->
            <div v-if="unitUpdateModel">
              <UpdateExam
                @examUpdatedSuccessfully="
                  afterExamUpdated('unit', 'unitUpdateModel')
                "
                objectType="unit"
                :exam="currUnitExam"
                @ifModelClosed="closeUpdateExam('unitUpdateModel')"
              />
            </div>

            <div class="exams" v-if="unitsExams.length > 0 ">
              <div class="row" v-if="!unitShowQuestionsOfExam">
                <div class="col-md-3" v-for="exam in unitsExams" :key="exam.id">
                  <div>
                    <Exam
                      :exam="exam"
                      @openExamQuestion="openExamQuestion('unit', $event)"
                    >
                      <div slot="update-delete">
                        <div class="d-flex update-delete-exam text-center justify-content-center">
                          <button
                            @click="openUpdateExamModel('unit', { ...exam })"
                            :class="{
                              btn: true,
                              'border-right': $i18n.locale == 'en',
                              'border-left': $i18n.locale == 'ar',
                              edit: true,
                            }"
                            style="flex: 1;"
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

                          <el-popconfirm
                            :confirm-button-text="$t('Validation.delete')"
                            :cancel-button-text="$t('Validation.close')"
                            icon="el-icon-info"
                            @confirm="deleteExam('unit', exam)"
                            icon-color="red"
                            class=""
                            style="flex: 1;"
                            :title="$t('Validation.AreYouSure')"
                          >
                            <button slot="reference" class="btn delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                              <!-- {{ $i18n.locale == 'ar' ? 'حذف' : 'Delete' }} -->
                            </button>
                          </el-popconfirm>
                        </div>
                      </div>
                    </Exam>
                  </div>
                </div>
              </div>

              <div v-else>
                <button
                  @click="closeExamQuestion('unit')"
                  class="btn exam-questions-btn"
                >
                  الرجوع إلي الامتحانات
                </button>

                <div>
                  <ShowExam
                    :toExam="true"
                    :exam="currUnitExam"
                    @openAddQuestionsToExam="
                      openAddQuestionsToSelectedExam('unit', $event)
                    "
                    @openUpdateModel="openUpdateQuesModel"
                    :examQuestions="examQuestions"
                    @getExamQuestion="getExamQuestions"
                  >
                    <div slot="update-delete">
                      <div class="d-flex update-delete-exam text-center justify-content-center">
                        <button
                          @click="
                            openUpdateExamModel('unit', { ...currUnitExam })
                          "
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

                        <el-popconfirm
                          :confirm-button-text="$t('Validation.delete')"
                          :cancel-button-text="$t('Validation.close')"
                          icon="el-icon-info"
                          class=""
                          @confirm="deleteExam('unit', currUnitExam)"
                          icon-color="red"
                          :title="$t('Validation.AreYouSure')"
                        >
                          <button slot="reference" class="btn delete">
                                                      <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                          </button>
                        </el-popconfirm>
                      </div>
                    </div>
                  </ShowExam>
                </div>
              </div>
            </div>
            <div v-else>
              <NoData width="350px" />
            </div>
          </section>
          <!-- lessons -->
          <section v-if="examsActive == 3">
            <div class="lesson-filter">
              <div class="row">
                <div class="col-md-9">
                  <div class="d-flex flex-wrap">


                    <div class="mr-1 ml-1 mb-1">
                      <div>
                        <el-select
                          clearable
                          v-model="selectedLesson"
                          @change="selectedLessonChanged()"
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
                </div>
                <div v-if="$auth.loggedIn && $auth.user.role == 'teacher'" class="col-md-3">
                  <div class="d-flex flex-row-reverse">
                    <el-button @click="openAddExamToLessonModel" type="warning"
                      >إضافة امتحان</el-button
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Add New Exam To Lesson -->
            <div v-if="addLessonExamModel">
              <AddNewExam
                @examAddedSuccessfully="afterExamAdded('addLessonExamModel')"
                objectType="lesson"
                :objectId="selectedLesson"
                :addNewExam="addLessonExam"
                @ifModelClosed="closeAddExam('addLessonExamModel')"
              />
            </div>

            <!-- Update Exam To Lesson -->
            <div v-if="lessonUpdateModel">
              <UpdateExam
                @examUpdatedSuccessfully="
                  afterExamUpdated('lesson', 'lessonUpdateModel')
                "
                objectType="lesson"
                :exam="currLessonExam"
                @ifModelClosed="closeUpdateExam('lessonUpdateModel')"
              />
            </div>

            <div v-if="lessonsExams.length > 0" class="exams">
              <div class="row" v-if="!lessonShowQuestionsOfExam">
                <div
                  class="col-md-3"
                  v-for="exam in lessonsExams"
                  :key="exam.id"
                >
                  <div>
                    <Exam
                      :exam="exam"
                      @openExamQuestion="openExamQuestion('lesson', $event)"
                    >
                      <div slot="update-delete">
                        <div class="d-flex update-delete-exam text-center justify-content-center">
                          <button
                            @click="openUpdateExamModel('lesson', { ...exam })"
                            :class="{
                              btn: true,
                              'border-right': $i18n.locale == 'en',
                              'border-left': $i18n.locale == 'ar',
                              edit: true,
                            }"
                            style="flex: 1;"
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
                            <!-- {{ $i18n.locale == 'ar' ? 'تعديل' : 'Update' }} -->
                          </button>

                          <el-popconfirm
                          style="flex: 1;"
                            class=""
                            @confirm="deleteExam('lesson', exam)"
                            :confirm-button-text="$t('Validation.delete')"
                            :cancel-button-text="$t('Validation.close')"
                            icon="el-icon-info"
                            icon-color="red"
                            :title="$t('Validation.AreYouSure')"
                          >
                            <button slot="reference" class="btn delete">
                                                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                              <!-- {{ $i18n.locale == 'ar' ? 'حذف' : 'Delete' }} -->
                            </button>
                          </el-popconfirm>
                        </div>
                      </div>
                    </Exam>
                  </div>
                </div>
              </div>

              <div v-else>
                <button
                  @click="closeExamQuestion('lesson')"
                  class="btn exam-questions-btn"
                >
                  الرجوع إلي الامتحانات
                </button>

                <div>
                  <ShowExam
                    :toExam="true"
                    :exam="currLessonExam"
                    @openAddQuestionsToExam="
                      openAddQuestionsToSelectedExam('lesson', $event)
                    "
                    @openUpdateModel="openUpdateQuesModel"
                    :examQuestions="examQuestions"
                    @getExamQuestion="getExamQuestions"
                  >
                    <div slot="update-delete">
                      <div class="d-flex update-delete-exam text-center justify-content-center">
                        <button
                          @click="
                            openUpdateExamModel('lesson', { ...currLessonExam })
                          "
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

                        <el-popconfirm
                          :confirm-button-text="$t('Validation.delete')"
                          :cancel-button-text="$t('Validation.close')"
                          icon="el-icon-info"
                          class=""
                          @confirm="deleteExam('lesson', currLessonExam)"
                          icon-color="red"
                          :title="$t('Validation.AreYouSure')"
                        >
                          <button slot="reference" class="btn delete">
                                                      <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                          </button>
                        </el-popconfirm>
                      </div>
                    </div>
                  </ShowExam>
                </div>
              </div>
            </div>
            <div v-else>
              <NoData width="350px" />
            </div>
          </section>

          <!-- End Of Exams Tab  -->
        </section>

        <section v-else-if="(active = 2)">
          <div class="edu-tabs">
            <button
              :class="{ btn: true, active: lessonTab == 1 }"
              @click="lessonTab = 1"
            >
              الاسئلة
            </button>
            <button
              :class="{ btn: true, active: lessonTab == 2 }"
              @click="lessonTab = 2"
            >
              بنك الاسئلة
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
              إضافة اكثر من سؤال
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
              <div
                class="questions"
                v-if="selectedSubject && examQuestions.length > 0"
              >
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
            <div
              class="questions"
              v-if="selectedSubject && allQuestions.length > 0"
            >
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
            <div v-if="selectedSubject">
              <div class="d-flex mb-3">
                <div class="mr-1 ml-1 mb-1">
                  <div>
                    <el-select
                      clearable
                      v-model="unitToAddNewQuestion"
                      :placeholder="$t('subjects.Unit')"
                    >
                      <el-option
                        v-for="item in allUnites"
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

          <section v-if="lessonTab == 5">
            <!-- <div v-if="selectedSubject">

                  <AddGroupQuestion
                    :toExam="true"
                    :type="questionType"
                    :lesson="lessonToAddNewQuestion"
                    :examId="currExamToAssignQuestions"
                    @saveGroupQuestionSuccess="onAddGroupQuestion"
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
                </div> -->
          </section>
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

import ShowQuestions from "~/components/QuestionsBank/ShowQuestions.vue";

import UpdateQuestion from "~/components/QuestionsBank/Update/UpdateQuestion.vue";

import AddSingleQuestion from "~/components/QuestionsBank/Add/Question.vue";
import AddManyQuestion from "~/components/QuestionsBank/Add/ManyQuestions.vue";
import AddGroupQuestion from "~/components/QuestionsBank/Add/Group.vue";

import NoData from '@/components/NoData.vue'

export default {
  components: {
    NoData,
    AddNewExam,
    ShowQuestions,
    Exam,
    UpdateExam,
    ShowExam,

    UpdateQuestion,
    AddGroupQuestion,
    AddManyQuestion,
    AddSingleQuestion,
  },
  middleware:['auth'],
  data: () => ({
    active: 1,
    examsActive: 1,
    openUpdateExam: false,
    lessonTab: 1,

    addLessonExamModel: false,
    addUnitExamModel: false,
    addSubjectExamModel: false,

    addSubjectExam: {},
    addUnitExam: {},
    addLessonExam: {},
    allQuestions: [],
    page: 1,
    allQuestionsCount: 1,
    totalPages: 1,
    questionType: "",

    allSystems: [],
    allLevels: [],
    allClasses: [],
    allSections: [],
    allSubjects: [],
    allUnites: [],
    allLessons: [],
    subjectExams: [],
    unitsExams: [],
    lessonsExams: [],
    examQuestions: [],
    questionTypes: [
      { nameAr: "صح و خطأ", nameEn: "True Or False", val: "truefalse" },
      { nameAr: "إختياري", nameEn: "Choose", val: "choose" },
      // { nameAr: "مقالي", nameEn: "Paragraph", val: "paragraph" },
      // { nameAr: "أكمل", nameEn: "Complete", val: "complete" },
    ],

    lessonToAddNewQuestion: "",
    unitToAddNewQuestion: "",

    selectedUnit: "",
    selectedSubject: "",
    selectedSystem: "",
    selectedLevel: "",
    selectedClass: "",
    selectedSection: "",
    selectedLesson: "",
    theDefference: 0,

    currLessonExam: {},
    currUnitExam: {},
    currSubjectExam: {},

    subjectUpdateModel: false,
    unitUpdateModel: false,
    lessonUpdateModel: false,

    subjectShowQuestionsOfExam: false,
    unitShowQuestionsOfExam: false,
    lessonShowQuestionsOfExam: false,

    currExamToAssignQuestions: {},
    openAddQuestionsToExamModel: false,

    openUpdateModel: false,
    openUpdateModel: false,
    currQuestion: {},
  }),
  watch: {
    examsActive(val) {
      if (val == 1 && this.subjectExams.length == 0) {
        this.getSubjectExams();
      } else if (val == 2 && this.unitsExams.length == 0) {
        this.getUnitExams();
      } else if (val == 3 && this.lessonsExams.length == 0) {
        this.getLessonExams();
      }
    },

    unitToAddNewQuestion(val) {
      this.lessonToAddNewQuestion = "";
      this.getLessonsToAddNewQuestion(val);
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
  mounted() {
    this.getLevels();
  },
  methods: {
    // Start Of Watcher On Select Box
    selectedSystemChanged() {
      this.selectedLevel =
        this.selectedClass =
        this.selectedSection =
        this.selectedSubject =
        this.selectedUnit =
        this.selectedLesson =
          "";
      this.allLevels =
        this.allClasses =
        this.allSections =
        this.allSubjects =
        this.allUnites =
        this.allLessons =
          [];
      if (this.selectedSystem != "") {
        this.getLevels();
      }
    },
    selectedLevelChanged() {
      this.selectedClass =
        this.selectedSection =
        this.selectedSubject =
        this.selectedUnit =
        this.selectedLesson =
          "";
      this.allClasses =
        this.allSections =
        this.allSubjects =
        this.allUnites =
        this.allLessons =
          [];
      this.getSections();
      this.getSubjects();
    },

    selectedSectionChanged() {


    },
    selectedSubjectChanged() {
      this.selectedUnit = this.selectedLesson = "";
      this.allUnites = this.allLessons = [];
      if (this.selectedSubject != "") {
        this.getLessons();
        this.getSubjectExams();
      } else {
        this.subjectExams = [];
        this.subjectUpdateModel =
          this.unitUpdateModel =
          this.lessonUpdateModel =
            false;
        this.addSubjectExamModel =
          this.addUnitExamModel =
          this.addLessonExamModel =
            false;
      }
    },
    selectedUnitChanged() {
      this.selectedLesson = "";
      this.allLessons = [];
      if (this.selectedUnit != "") {
        this.getLessons();
        this.getUnitExams();
      } else {
        this.unitsExams = [];
        this.subjectUpdateModel =
          this.unitUpdateModel =
          this.lessonUpdateModel =
            false;
        this.addSubjectExamModel =
          this.addUnitExamModel =
          this.addLessonExamModel =
            false;
      }
    },

    selectedLessonChanged() {
      if (this.selectedLesson != "") {
        this.getLessonExams();
      } else {
        this.lessonsExams = [];
        this.subjectUpdateModel =
          this.unitUpdateModel =
          this.lessonUpdateModel =
            false;
        this.addSubjectExamModel =
          this.addUnitExamModel =
          this.addLessonExamModel =
            false;
      }
    },

    // End Of Watcher On Select Box

    addQuestionToExam(question) {
      if (!question.point) {
        this.$message.error({
          message:
            this.$i18n.locale == "ar"
              ? "حدد درجة السؤال اولا"
              : "Determine Degree Of Questions",
        });
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
    openUpdateQuesModel(question) {
      this.openUpdateQuestionModel(question);
    },

    questionsAddedToExam() {
      this.lessonTab = 1;
      this.getExamQuestions();
    },
    getExamQuestions() {
      this.addUnitExamModel =
        this.addLessonExamModel =
        this.addSubjectExamModel =
          false;
      this.lessonUpdateModel =
        this.unitUpdateModel =
        this.subjectUpdateModel =
          false;

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
    closeUpdateQuestionModel() {
      console.log("hi");
      this.openUpdateModel = false;
    },
    questionUpdated() {
      this.openUpdateModel = false;
      this.getQuestions();
    },

    openUpdateQuestionModel(question) {
      this.openUpdateModel = true;
      this.currQuestion = { ...question };
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    closeExamQuestion(type) {
      this.addUnitExamModel =
        this.addLessonExamModel =
        this.addSubjectExamModel =
          false;
      this.lessonUpdateModel =
        this.unitUpdateModel =
        this.subjectUpdateModel =
          false;

      this[type + "ShowQuestionsOfExam"] = false;

      this.currSubjectExam = {};
      this.currUnitExam = {};
      this.currLessonExam = {};
    },

    openAddQuestionsToSelectedExam(type, e) {
      this.openAddQuestionsToExamModel = true;
      this.currExamToAssignQuestions = { ...e };
      this.active = 2;
      if (type == "subject") {
        this.getQuestions();
      } else if (type == "unit") {
        this.getQuestions();
      } else if (type == "lesson") {
        this.getQuestions();
      }

      this.getExamQuestions();
    },

    getQuestions() {
      const loading = this.$vs.loading();

      let endPointQuery = `/subjects/${this.selectedSubject}/questions?`;

      if (this.selectedUnit) {
        endPointQuery += `unit=${this.selectedUnit}&`;
      }

      //   if (this.filterType) {
      //     endPointQuery += `type=${this.filterType}&`;
      //   }

      if (this.selectedLesson) {
        endPointQuery += `object=${this.selectedLesson}&`;
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

    openExamQuestion(type, e) {
      // this[type + "ShowQuestionsOfExam"] = true;

      this.$router.push(`/exam-details/${e.id}?subject=${this.selectedSubject}&section=${this.selectedSection}&level=${this.selectedLevel}&lecture=${this.selectedLesson}`)

      this.currExamToAssignQuestions = { ...e };

      if (type == "subject") {
        this.currSubjectExam = { ...e };
        this.getExamQuestions();
      } else if (type == "unit") {
        this.currUnitExam = { ...e };
        this.getExamQuestions();
      } else if (type == "lesson") {
        this.currLessonExam = { ...e };

        this.getExamQuestions();
      }

      console.log(this[type + "ShowQuestionsOfExam"]);
    },

    openUpdateExamModel(type, exam) {
      this.addLessonExamModel =
        this.addSubjectExamModel =
        this.addUnitExamModel =
          false;
      this[type + "UpdateModel"] = true;

      if (exam.duration) {
        exam.isDuration = true;
      } else {
        exam.isDuration = false;
      }

      if (type == "subject") {
        this.currSubjectExam = { ...exam };
      } else if (type == "unit") {
        this.currUnitExam = { ...exam };
      } else if (type == "lesson") {
        this.currLessonExam = { ...exam };
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    deleteExam(type, exam) {
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

          if (type == "subject") {
            this.getSubjectExams();
            this.subjectShowQuestionsOfExam = false;
          } else if (type == "lesson") {
            this.getLessonExams();
            this.lessonShowQuestionsOfExam = false;
          } else if (type == "unit") {
            this.getUnitExams();
            this.unitShowQuestionsOfExam = false;
          }
        })
        .finally(() => loading.close());
    },
    getSubjectExams() {
      if (!this.selectedSubject) {
        return;
      }
      const loading = this.$vs.loading();
      this.$axios
        .get(`/subject/${this.selectedSubject}/exams?paginate=false`)
        .then((res) => {
          this.subjectExams = res.data;
        })
        .finally(() => loading.close());
    },
    getLessonExams() {
      if (!this.selectedLesson) {
        return;
      }
      const loading = this.$vs.loading();
      this.$axios
        .get(`/lecture/${this.selectedLesson}/exams?paginate=false`)
        .then((res) => {
          this.lessonsExams = res.data;
        })
        .finally(() => loading.close());
    },
    getUnitExams() {
      if (!this.selectedUnit) {
        return;
      }
      const loading = this.$vs.loading();
      this.$axios
        .get(`/units/${this.selectedUnit}/exams?paginate=false`)
        .then((res) => {
          this.unitsExams = res.data;
        })
        .finally(() => loading.close());
    },

    closeAddExam(e) {
      this[e] = false;
    },
    closeUpdateExam(e) {
      this[e] = false;
    },
    afterExamAdded(e) {
      this.addExam = {};
      this[e] = false;
      if (e.includes("Lesson")) {
        this.getLessonExams();
      } else if (e.includes("Unit")) {
        this.getUnitExams();
      } else {
        this.getSubjectExams();
      }
    },
    afterExamUpdated(type, e) {
      this[e] = false;
      if (type == "subject") {
        this.getSubjectExams();
      } else if (type == "lesson") {
        this.getLessonExams();
      } else if (type == "unit") {
        this.getUnitExams();
      }
    },
    openAddExamToSubjectModel() {
      this.subjectUpdateModel = false;
      if (!this.selectedSubject) {
        this.$message.error({
          message:
            this.$i18n.locale == "ar"
              ? "حدد المادة اولا"
              : "determine Exam First",
        });
        return;
      }
      this.addSubjectExamModel = !this.addSubjectExamModel;
    },

    openAddExamToUnitModel() {
      this.unitUpdateModel = false;

      if (!this.selectedUnit) {
        this.$message.error({
          message:
            this.$i18n.locale == "ar"
              ? "حدد الوحدة اولا"
              : "determine Exam First",
        });
        return;
      }
      this.addUnitExamModel = !this.addUnitExamModel;
    },

    openAddExamToLessonModel() {
      this.lessonUpdateModel = false;

      if (!this.selectedLesson) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "ar"
              ? "حدد الدرس اولا"
              : "determine Exam First",
        });
        // this.$message.error({
        //   message:
        //     this.$i18n.locale == "ar"
        //       ? "حدد الدرس اولا"
        //       : "determine Exam First",
        // });
        return;
      }
      this.addLessonExamModel = !this.addLessonExamModel;
    },

    getSystems() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/systems?paginate=false`)
        .then((res) => {
          this.allSystems = res.data;
        })
        .finally(() => loading.close());
    },
    getLevels() {
      this.$axios.get(`/levels?paginate=false`).then((res) => {
        this.allLevels = res.data;
      });
    },
    getClasses() {
      if (!this.selectedLevel) {
        return;
      }
      this.$axios
        .get(`/levels/${this.selectedLevel}/classes?paginate=false`)
        .then((res) => {
          this.allClasses = res.data;
        });
    },
    getSections() {
      if (this.selectedLevel) {
        this.$axios
          .get(`/sections?level=${this.selectedLevel}&paginate=false`)
          .then((res) => {
            this.allSections = res.data;
          });
      }
    },
    getSubjects() {
      // if (!this.selectedLevel) {
      //   return;
      // }
      this.$axios
        .get(`/levels/${this.selectedLevel}/subjects?paginate=false`)
        .then((res) => {
          this.allSubjects = res.data;
        });
    },
    getUnites() {
      if (!this.selectedSubject) {
        return;
      }
      this.$axios
        .get(`/subject/${this.selectedSubject}/lecture?paginate=false`)
        .then((res) => {
          this.allUnites = res.data;
        });
    },
    getLessons() {
      if (!this.selectedSubject) {
        return;
      }
      this.$axios
        .get(`/subject/${this.selectedSubject}/lecture?paginate=false`)
        .then((res) => {
          this.allLessons = res.data;
        });
    },
    getLessonsToAddNewQuestion() {
      if (!this.unitToAddNewQuestion) {
        return;
      }
      this.$axios
        .get(`/units/${this.unitToAddNewQuestion}/lessons?paginate=false`)
        .then((res) => {
          this.allLessons = res.data;
        });
    },
  },
};
</script>

<style lang="scss">
.exams-page {



  margin-top: 20px;
  .exams {
    padding: 15px;
    background: #FFF;
    .exams-tab {
      padding: 15px;
      // background-color: #fff;
    }
  }


}

.btn.exam-questions-btn {
    margin-bottom: 6px;
    padding-bottom: 15px;
    text-decoration: underline;
    color: var(--blue);
    font-size: 19px;
    font-weight: bold;
  }


.edu-tabs .active {
  border-bottom: 2px solid #ffa400 !important;
  border-radius: 0 !important;
}
.exams .btn {
  border: none;
  font-size: 16px !important;

}
.edu-tabs {
  display: flex;
  margin-bottom: 1rem;
}
.btn-dels {
  width: 80px !important;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
  border: none !important;
  background: transparent !important;
}
@import "../../assets/styles/bank-questions.scss";
</style>
