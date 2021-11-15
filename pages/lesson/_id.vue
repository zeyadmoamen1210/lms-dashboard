<template>
  <div class="lesson-page">
    <div class="container-fluid">
      <div class="lesson-page-inner">
         <div>


        <div class="header mt-1">

          <h5 style="color: var(--yellow)"> <span><i style="color: var(--yellow)" class="fas fa-book-reader"></i></span> {{ $i18n.locale == 'ar' ? lesson.nameAr : lesson.nameEn }}</h5>
        </div>

      </div>

      <div class="d-flex flex-wrap path mb-3 mt-2">
        <template v-if="$auth.loggedIn && $auth.user.role == 'admin'">
          <div>
            <nuxt-link to="/levels/list">
              {{ $i18n.locale == "ar" ? "المراحل" : "Levels" }}
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
          <div v-if="currLevel">
            <nuxt-link :to="`/levels/${currLevel.id}`">
              {{ $i18n.locale == "ar" ? currLevel.nameAr : currLevel.nameEn }}
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
          <div v-if="currClass">
            <nuxt-link
              :to="`/classes/${currClass.id}?level=${$route.query.level}`"
            >
              {{ $i18n.locale == "ar" ? currClass.nameAr : currClass.nameEn }}
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
          <div v-if="currSection">
            <nuxt-link
              :to="
                `/section/${currSection.id}?level=${$route.query.level}&class=${$route.query.class}`
              "
            >
              {{
                $i18n.locale == "ar" ? currSection.nameAr : currSection.nameEn
              }}
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
        </template>

        <div v-if="lesson.unit && lesson.unit.subject">
          <nuxt-link
            :to="
              `/subject/${lesson.unit.subject.id}?level=${$route.query.level}&class=${$route.query.class}&section=${$route.query.section}`
            "
          >
            {{
              $i18n.locale == "ar"
                ? lesson.unit.subject.nameAr
                : lesson.unit.subject.nameEn
            }}
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

        <div v-if="lesson.unit && lesson.unit.subject">
          <nuxt-link
            :to="
              `/unit/${lesson.unit.id}?level=${$route.query.level}&class=${$route.query.class}&section=${$route.query.section}&subject=${lesson.unit.subject.id}`
            "
          >
            {{ $i18n.locale == "ar" ? lesson.unit.nameAr : lesson.unit.nameEn }}
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

        <div v-if="lesson">
          <h6 v-if="$i18n.locale == 'ar'">{{ lesson.nameAr }}</h6>
          <h6 v-else>{{ lesson.nameEn }}</h6>
        </div>
      </div>




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




      <div class="row">
        <div class="col-md-6">
          <div class="edu-tabs">
            <button
              :class="{ btn: true, active: active == 1 }"
              @click="active = 1, addFilePopup = false, addExamModel = false, updateFilePopup = false"
            >
              {{ $t("lesson.Videos") }}
            </button>
            <button
              :class="{ btn: true, active: active == 5 }"
              @click="active = 5"
            >
              {{ $t("lesson.Pdf") }}
            </button>

            <button
              :class="{ btn: true, active: active == 2 }"
              @click="active = 2"
            >
              {{ $t("lesson.Exams") }}
            </button>

            <!-- <button
              :class="{ btn: true, active: active == 6 }"
              v-if="$auth.loggedIn && $auth.user.role == 'teacher'"
              @click="active = 6"
            >
              {{ $t('sidebar.presentations') }}
            </button> -->

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
                  }${
                    $route.query.subject
                      ? '&subject=' + $route.query.subject
                      : ''
                  }${$route.query.unit ? '&unit=' + $route.query.unit : ''}${
                    $route.params.id ? '&lesson=' + $route.params.id : ''
                  }`
                )
              "
            >
              {{ $t("subjects.QuestionBank") }}
            </button>
          </div>
        </div>

        <div class="col-md-6">
          <div class="d-flex flex-row-reverse">
            <el-button
              @click="handleAddVideo"
              v-if="active == 1 && $auth.loggedIn && $auth.user.role === 'teacher'"
              type="warning"
              >{{ $t("lesson.AddVideo") }}</el-button
            >

            <el-button
              @click="handleAddFile"
              v-if="active == 5 && $auth.loggedIn && $auth.user.role === 'teacher'"
              type="warning"
              >{{ $t("lesson.AddPdf") }}</el-button
            >

            <el-button
              @click="addExamModel = true"
              v-else-if="active == 2 && $auth.loggedIn && $auth.user.role === 'teacher'"
              type="warning"
              >{{ $t("lesson.AddExam") }}</el-button
            >
          </div>
        </div>
      </div>

      <section v-if="addFilePopup" class="add-update-section">
        <h6 class="mb-3"> {{$i18n.locale == 'ar' ? 'إضافة ملف ' : 'Add File'}} </h6>
        <el-form :model="addNewFile" ref="addNewFile" class="for-add-or-update">
          <div class="inputs-grid row">
            <div class="col-md-4">
              <el-form-item
                prop="title"
                :rules="[
                  {
                    required: true,
                    message: $t('lesson.FileTitle'),
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  suffix-icon="el-icon-edit"
                  :placeholder="$t('Validation.FileTitle')"
                  v-model="addNewFile.title"
                ></el-input>
              </el-form-item>
            </div>

            <div class="col-md-4">
              <el-form-item prop="pdf">
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :limit="1"
                  action="#"
                  :show-file-list="true"
                  :auto-upload="false"
                  :on-change="handleAddImage"
                  :on-remove="removeAddImage"
                >
                  <div class="d-flex">
                    <div class="mr-2 ml-2">
                      <el-button class="attach-img">
                        <img
                          src="@/assets/imgs/document.svg"
                          style="width: 25px"
                          alt=""
                        />
                      </el-button>
                      {{ $t("lesson.AttachFile") }}
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </div>

            <div class="col-md-4">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    type="warning"
                    @click="submitAddFileForm('addNewFile')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button type="info" @click="addFilePopup = false">{{
                    $t("Validation.close")
                  }}</el-button>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <!-- Start Of Update Video -->

      <section v-if="updateFilePopup" class="add-update-section">
        <h6 class="mb-3"> {{$i18n.locale == 'ar' ? 'تعديل ملف ' : 'Update File'}} </h6>
        <el-form :model="updateFile" ref="updateFile" class="for-add-or-update">
          <div class="inputs-grid row">
            <div class="col-md-4">
              <el-form-item
                prop="title"
                :rules="[
                  {
                    required: true,
                    message: $t('lesson.FileTitle'),
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  suffix-icon="el-icon-edit"
                  :placeholder="$t('Validation.FileTitle')"
                  v-model="updateFile.title"
                ></el-input>
              </el-form-item>
            </div>

            <div class="col-md-4">
              <el-form-item prop="pdf">
                <el-upload
                  ref="uploadUpdateFile"
                  class="upload-demo"
                  :limit="1"
                  action="#"
                  :show-file-list="true"
                  :auto-upload="false"
                  :file-list="updateFileList"
                  :on-change="handleUpdateImage"
                  :on-remove="removeUpdateImage"
                >
                  <div class="d-flex">
                    <div class="mr-2 ml-2">
                      <el-button class="attach-img">
                        <img
                          src="@/assets/imgs/document.svg"
                          style="width: 25px"
                          alt=""
                        />
                      </el-button>
                      {{ $t("lesson.AttachFile") }}
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </div>

            <div class="col-md-4">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    type="warning"
                    @click="submitUpdateFileForm('updateFile')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button type="info" @click="updateFilePopup = false">{{
                    $t("Validation.close")
                  }}</el-button>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <!-- End Of Update Video -->



      <section v-if="active == 1" class="lessons-tab">
        <!-- Start OF Update Video  -->

        <section v-if="addVideoPopup" class="add-update-section mb-3">
          <h6 class="mb-4" style="padding: 0 6px"> {{$i18n.locale == 'ar' ? 'إضافة فيديو' : 'Add Video'}} </h6>
        <el-form
          :model="addNewVideo"
          ref="addNewFile"
          class="for-add-or-update"
        >
          <div class="inputs-grid row">
            <div class="col-md-1 mt-2 text-center miuus-margin">
              <h6 class="d-inline-block">
                {{ $i18n.locale == "ar" ? "لينك / فيديو" : "Link / Video" }}
              </h6>
              <el-switch
                class="d-inline-block"
                v-model="isLink"
                active-color="var(--yellow)"
                inactive-color="var(--blue)"
              >
              </el-switch>
            </div>

            <div class="col-md-3">
              <el-form-item
                prop="title"
                :rules="[
                  {
                    required: true,
                    message: $t('lesson.FileTitle'),
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  :placeholder="$t('Validation.FileTitle')"
                  v-model="addNewVideo.title"
                ></el-input>
              </el-form-item>
            </div>

            <div class="col-md-3" v-if="isLink">
              <el-form-item
                prop="link"
                :rules="[
                  {
                    required: true,
                    message: $t('Validation.required'),
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  :placeholder="$t('lesson.link')"
                  v-model="addNewVideo.link"
                ></el-input>
              </el-form-item>
            </div>

            <div class="col-md-3" v-else>
              <el-form-item prop="video">
                <el-upload
                  ref="uploadVideo"
                  class="upload-demo"
                  :limit="1"
                  action="#"
                  :show-file-list="true"
                  :auto-upload="false"
                  :on-change="handleAddSrcVideo"
                  :on-remove="removeAddVideo"
                >
                  <div class="d-flex">
                    <div class="mr-2 ml-2">
                      <el-button class="attach-img">
                        <img
                          src="@/assets/imgs/document.svg"
                          style="width: 25px"
                          alt=""
                        />
                      </el-button>
                      {{ $t("lesson.AttachVideo") }}
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </div>

            <div class="col-md-3 ">
              <el-form-item prop="videoPhoto">
                <el-upload
                  ref="addVideoPhoto"
                  class="upload-demo"
                  :limit="1"
                  action="#"
                  :show-file-list="true"
                  :auto-upload="false"
                  :on-change="handleAddVideoPhoto"
                  :on-remove="removeVideoPhoto"
                >
                  <div class="d-flex">
                    <div class="mr-2 ml-2">
                      <el-button class="attach-img">
                        <img
                          src="@/assets/imgs/document.svg"
                          style="width: 25px"
                          alt=""
                        />
                      </el-button>
                      {{ $t("lesson.AttachVideoPhoto") }}
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </div>

            <div class="col-md-2">
              <div class="d-flex flex-row-reverse">
                <el-form-item>
                  <el-button
                    type="warning"
                    @click="submitAddVideoForm('addNewFile')"
                    >{{ $t("Validation.save") }}</el-button
                  >
                  <el-button type="info" @click="addVideoPopup = false">{{
                    $t("Validation.close")
                  }}</el-button>
                </el-form-item>
              </div>
            </div>

            <div class="col-md-12">
              <h6 style="color: #707070;font-size: 15px;margin-bottom: 10px;margin-top: 20px;"> {{ $i18n.locale == 'ar' ? 'تقسيم الفديو إلي فترات زمنية' : 'Divide The Video To Timestamp' }} </h6>
              <div class="row d-flex mt-1">
                <div class="col-md-2">
                  <div class="mt-4">
                    <el-button
                      class="mb-3"
                      @click="addNewVideo.content.push({ title: '', timing: '' })"
                      >+</el-button
                    >
                    <h6 class="d-inline-block mr-1 ml-1">
                      {{
                        $i18n.locale == "ar" ? "إضافة وقت زمني" : "Add Time Stamp"
                      }}
                    </h6>
                  </div>
                </div>
                <div class="col-md-10">
                  <div
                    class="d-flex mb-4"
                    v-for="(timestamp, index) in addNewVideo.content"
                    :key="index"
                  >
                    <div class="mr-1 ml-1" style="flex: 1">
                      <div>
                        <h6> {{ $i18n.locale == 'ar' ? 'عنوان الموضوع' : 'Title Of Topic' }} </h6>
                        <el-form-item
                          :prop="`content[${index}].title`"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.required'),
                              trigger: 'blur'
                            }
                          ]"
                        >
                          <el-input
                            :placeholder="$t('lesson.title')"
                            v-model="addNewVideo.content[index].title"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="mr-1 ml-1" style="flex: 1">
                      <div>
                         <h6> {{ $i18n.locale == 'ar' ? 'الوقت في الفديو' : 'Time On Video' }} </h6>
                        <el-form-item
                          :prop="`content[${index}].timing`"
                          :rules="[
                            {
                              required: true,
                              message: $t('Validation.required'),
                              trigger: 'blur'
                            }
                          ]"
                        >
                          <el-time-picker
                            arrow-control
                            :picker-options="{
                              format: 'HH:mm'
                            }"
                            value-format="HH:mm"
                            :placeholder="$t('lesson.timing')"
                            v-model="addNewVideo.content[index].timing"
                          >
                          </el-time-picker>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="mt-4" style="margin-top:10px">
                      <el-button v-if="addNewVideo.content.length > 1" @click="addNewVideo.content.splice(index, 1)"
                      >-</el-button
                    >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </section>

      <!-- End Of Update Video -->

        <section v-if="updateVideoPopup" class="add-update-section mb-3">
          <h6 class="mb-4" style="padding: 0 6px"> {{$i18n.locale == 'ar' ? 'تعديل فيديو' : 'Update Video'}} </h6>
          <el-form
            :model="updateVideo"
            ref="updateVideo"
            class="for-add-or-update"
          >
            <div class="inputs-grid row">
              <div class="col-md-1 text-center">
                <h6 class="d-inline-block">
                  {{ $i18n.locale == "ar" ? "لينك / فيديو" : "Link / Video" }}
                </h6>
                <el-switch
                  style="padding-top: 18px"
                  v-model="isLink"
                  active-color="var(--yellow)"
                  inactive-color="var(--blue)"
                >
                </el-switch>
              </div>

              <div class="col-md-3">
                <el-form-item
                  prop="title"
                  :rules="[
                    {
                      required: true,
                      message: $t('lesson.FileTitle'),
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    :placeholder="$t('Validation.FileTitle')"
                    v-model="updateVideo.title"
                  ></el-input>
                </el-form-item>
              </div>

              <div class="col-md-3" v-if="isLink">
                <el-form-item
                  prop="link"
                  :rules="[
                    {
                      required: true,
                      message: $t('Validation.required'),
                      trigger: 'blur'
                    }
                  ]"
                >
                  <el-input
                    :placeholder="$t('lesson.link')"
                    v-model="updateVideo.link"
                  ></el-input>
                </el-form-item>
              </div>

              <div class="col-md-3" v-else>
                <el-form-item prop="video">
                  <el-upload
                    ref="uploadUpdate"
                    class="upload-demo"
                    :limit="1"
                    action="#"
                    :show-file-list="true"
                    :auto-upload="false"
                    :on-change="handleUpdateSrcVideo"
                    :on-remove="removeUpdateVideo"
                  >
                    <div class="d-flex">
                      <div class="mr-2 ml-2">
                        <el-button class="attach-img">
                          <img
                            src="@/assets/imgs/document.svg"
                            style="width: 25px"
                            alt=""
                          />
                        </el-button>
                        {{ $t("lesson.AttachVideo") }}
                      </div>
                    </div>
                  </el-upload>
                </el-form-item>
              </div>

              <div class="col-md-3">
                <el-form-item prop="videoPhoto">
                  <el-upload
                    ref="updateVideoPhoto"
                    class="upload-demo"
                    :limit="1"
                    action="#"
                    :show-file-list="true"
                    :auto-upload="false"
                    :on-change="handleUpdateVideoPhoto"
                    :on-remove="removeVideoPhoto"
                  >
                    <div class="d-flex">
                      <div class="mr-2 ml-2">
                        <el-button class="attach-img">
                          <img
                            src="@/assets/imgs/document.svg"
                            style="width: 25px"
                            alt=""
                          />
                        </el-button>
                        {{ $t("lesson.AttachVideoPhoto") }}
                      </div>
                    </div>
                  </el-upload>
                </el-form-item>
              </div>

              <div class="col-md-2">
                <div class="d-flex flex-row-reverse">
                  <el-form-item>
                    <el-button
                      type="warning"
                      @click="submitUpdateVideoForm('updateVideo')"
                      >{{ $t("Validation.save") }}</el-button
                    >
                    <el-button type="info" @click="updateVideoPopup = false">{{
                      $t("Validation.close")
                    }}</el-button>
                  </el-form-item>
                </div>
              </div>

              <div class="col-md-6">
                <div class="row d-flex mt-4">
                  <div class="col-md-4">
                    <h6 class="d-inline-block">
                      {{
                        $i18n.locale == "ar"
                          ? "إضافة وقت زمني"
                          : "Add Time Stamp"
                      }}
                    </h6>
                    <el-button
                      class="mb-3"
                      @click="
                        updateVideo.content.push({ title: '', timing: '' })
                      "
                      >+</el-button
                    >
                  </div>
                  <div class="col-md-8">
                    <div
                      class="d-flex mb-4"
                      v-for="(timestamp, index) in updateVideo.content"
                      :key="index"
                    >
                      <div class="mr-1 ml-1" style="flex: 1">
                        <div>
                          <el-form-item
                            :prop="`content[${index}].title`"
                            :rules="[
                              {
                                required: true,
                                message: $t('Validation.required'),
                                trigger: 'blur'
                              }
                            ]"
                          >
                            <el-input
                              suffix-icon="el-icon-edit"
                              :placeholder="$t('lesson.title')"
                              v-model="updateVideo.content[index].title"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </div>

                      <div class="mr-1 ml-1" style="flex: 1">
                        <div>
                          <el-form-item
                            :prop="`content[${index}].timing`"
                            :rules="[
                              {
                                required: true,
                                message: $t('Validation.required'),
                                trigger: 'blur'
                              }
                            ]"
                          >
                            <el-time-picker
                              arrow-control
                              suffix-icon="el-icon-edit"
                              :picker-options="{
                                format: 'HH:mm'
                              }"
                              value-format="HH:mm"
                              :placeholder="$t('lesson.timing')"
                              v-model="updateVideo.content[index].timing"
                            >
                            </el-time-picker>
                          </el-form-item>
                        </div>
                      </div>

                      <el-button @click="updateVideo.content.splice(index, 1)"
                        >-</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </section>

        <div class="row" v-if="videosMaterial.length > 0">
          <div
            class="col-md-6"
            v-for="(video, index) in videosMaterial"
            :key="video.id"
          >
            <div class="videoCard">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ video.title }}</h4>
                </div>

                <div>
                  <button class="btn-edit" @click="handleUpdateVideo(video)">
                    <i class="el-icon-edit"></i>
                  </button>

                  <el-popconfirm
                    :confirm-button-text="$t('Validation.delete')"
                    :cancel-button-text="$t('Validation.close')"
                    @confirm="deleteMaterial(video)"
                    icon="el-icon-info"
                    icon-color="red"
                    :title="$t('Validation.AreYouSure')"
                  >
                    <button class="btn-delete" slot="reference">
                      <i class="el-icon-delete-solid"></i>
                    </button>
                  </el-popconfirm>

                  <button class="btn-edit" @click="collapseVideo(index, video)">
                    <img
                      style="width: 17px;margin-top: -3px;"
                      src="@/assets/imgs/message.svg"
                      alt=""
                    />
                  </button>
                </div>
              </div>

              <div>
                <iframe
                  v-if="!video.link.startsWith('https://res.cloudinary.com/')"
                  :src="video.link"
                  frameborder="0"
                ></iframe>
                <video width="300" height="200" controls v-else>
                  <source :src="video.link" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <el-collapse
                @change="collapseVideo(index, video)"
                :ref="`video_comment_${video.id}`"
              >
                <el-collapse-item
                  name="1"
                  :title="$i18n.locale == 'ar' ? 'التعليقات' : 'Comments'"
                >
                  <section
                    class="videoComments"
                    v-if="videoCollapsed >= 0 && videoCollapsed !== null"
                  >
                    <div
                      v-for="comment in videoComments"
                      :key="comment.id"
                      class="comment d-flex"
                    >
                      <div v-if="comment.author">
                        <img class="photo" :src="comment.author.photo" alt="" />
                      </div>

                      <div>
                        <h6>{{ comment.author.username }}</h6>
                        <p>{{ comment.content }}</p>
                        <span>
                          {{ $moment(comment.createdAt).fromNow() }}
                        </span>

                        <el-collapse
                          :ref="`replyCollapse${comment.id}`"
                          @change="getReplies(comment)"
                        >
                          <el-collapse-item
                            name="1"
                            :title="$i18n.locale == 'ar' ? 'الردور' : 'Replies'"
                          >
                            <div
                              v-for="reply in commentReplies"
                              :key="reply.id"
                              class="comment d-flex"
                            >
                              <div v-if="reply.author">
                                <img
                                  class="photo"
                                  :src="reply.author.photo"
                                  alt=""
                                />
                              </div>

                              <div>
                                <h6>{{ reply.author.username }}</h6>
                                <p>{{ reply.content }}</p>
                                <span>
                                  {{ $moment(reply.createdAt).fromNow() }}
                                </span>
                              </div>

                              <div v-if="$auth.loggedIn && $auth.user && ($auth.user.id == reply.author.id)">
                                <el-popconfirm
                                  :confirm-button-text="$t('Validation.delete')"
                                  :cancel-button-text="$t('Validation.close')"
                                  @confirm="deleteReply(reply, comment)"
                                  icon="el-icon-info"
                                  icon-color="red"
                                  :title="$t('Validation.AreYouSure')"
                                >
                                  <button
                                    slot="reference"
                                    style="box-shadow: none;"
                                    class="btn"
                                  >
                                    <img
                                      style=" width: 15px;height: auto;border: none;border-radius: 0;"
                                      src="@/assets/imgs/Icon-material-delete.svg"
                                      alt=""
                                    />
                                  </button>
                                </el-popconfirm>
                              </div>
                            </div>

                            <div>
                              <el-input
                                type="text"
                                @keydown.enter.native="postReply(comment)"
                                v-model="repleyValue"
                                name=""
                                id=""
                                placeholder="اضف تعليقك"
                              ></el-input>
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>

                      <div>
                        <div v-if="$auth.loggedIn && $auth.user && ($auth.user.id == comment.author.id)">
                          <el-popconfirm
                            :confirm-button-text="$t('Validation.delete')"
                            :cancel-button-text="$t('Validation.close')"
                            @confirm="deleteComment(comment, video)"
                            icon="el-icon-info"
                            icon-color="red"
                            :title="$t('Validation.AreYouSure')"
                          >
                            <button
                              slot="reference"
                              style="box-shadow: none;"
                              class="btn"
                            >
                              <img
                                style=" width: 15px;height: auto;border: none;border-radius: 0;"
                                src="@/assets/imgs/Icon-material-delete.svg"
                                alt=""
                              />
                            </button>
                          </el-popconfirm>
                        </div>
                      </div>
                    </div>

                    <div>
                      <el-input
                        type="text"
                        v-model="commentValue"
                        @keydown.enter.native="postComment(video)"
                        name=""
                        id=""
                        placeholder="اضف تعليقك"
                      ></el-input>
                    </div>
                  </section>
                </el-collapse-item>
              </el-collapse>
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
            objectType="lesson"
            :objectId="$route.params.id"
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
          <div class="row" style="flex-wrap: wrap" v-if="!showQuestionsOfExam">
            <div class="col-md-3" v-for="exam in subjectExams" :key="exam.id">
              <div>
                <Exam :exam="exam" @openExamQuestion="openExamQuestion">
                  <div slot="update-delete">
                    <div class="d-flex update-delete-exam text-center justify-content-center">
                      <div>

                        <button
                        @click="openUpdateExamModel({ ...exam })"
                        :class="{
                          btn: true,
                          'border-right': $i18n.locale == 'en',
                          'border-left': $i18n.locale == 'ar',
                          edit: true
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
                        <!-- {{ $t("subjects.update") }} -->
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
                        <button slot="reference" class="btn delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                          <!-- {{ $t("subjects.delete") }} -->
                        </button>
                      </el-popconfirm>
                      </div>
                    </div>
                  </div>
                </Exam>
              </div>
            </div>
          </div>

          <div v-else>
            <p @click="closeExamQuestion('subject')" class="exam-questions-btn">
              {{ $t("subjects.BackToExams") }}
            </p>

            <div class="exam">
              <ShowExam
                :toExam="true"
                :exam="currSubjectExam"
                @openAddQuestionsToExam="openAddQuestionsToSelectedExam"
                @openUpdateModel="openUpdateQuestionModel"
                :examQuestions="examQuestions"
                @getExamQuestion="getExamQuestions"
              >
                <div slot="update-delete">
                  <div slot="update-delete">
                    <div class="d-flex update-delete-exam text-center justify-content-center">
                     <div>
                        <button
                        @click="openUpdateExamModel({ ...currSubjectExam })"
                        :class="{
                          btn: true,

                          'border-right': $i18n.locale == 'en',
                          'border-left': $i18n.locale == 'ar',
                          edit: true
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
                        <!-- {{ $t("subjects.update") }} -->
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
                        <button slot="reference" class="btn delete">
                                                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z"/><path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/></g></svg>

                          <!-- {{ $t("subjects.delete") }} -->
                        </button>
                      </el-popconfirm>
                      </div>
                    </div>
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
            <!-- @questionSavedSuccessfully="onAddManyQuestions" -->

            <AddManyQuestion
              :toExam="true"
              :lesson="$route.params.id"
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

      <section v-else-if="active == 5" class="lessons-tab">
        <div class="row" v-if="filesMaterials.length > 0">
          <div class="col-md-2" v-for="file in filesMaterials" :key="file.id">
            <div class="pdf-card">
              <img @click="openLessonFile(file)" src="@/assets/imgs/icons8-brief-96.png" style="cursor:pointer;width:98px" alt="">

              <h5>{{ file.title }}</h5>

              <div>
                <button class="btn-edit" @click="handleUpdteFile(file)">
                  <i class="el-icon-edit"></i>
                </button>

                <el-popconfirm
                  :confirm-button-text="$t('Validation.delete')"
                  :cancel-button-text="$t('Validation.close')"
                  @confirm="deleteMaterial(file)"
                  icon="el-icon-info"
                  icon-color="red"
                  :title="$t('Validation.AreYouSure')"
                >
                  <button class="btn-delete" slot="reference">
                    <i class="el-icon-delete-solid"></i>
                  </button>
                </el-popconfirm>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <NoData width="350px" />
        </div>
      </section>

      <section v-if="active == 6">
        <div class="d-flex justify-content-end">
          <el-button @click="openAddPresentation" type="warning"
            >إضافة</el-button
          >
        </div>

        <template v-if="addPresentationModel">
          <AddPresentation
            class="mb-4"
            @closeAddPresentation="closeAddPresentation"
            @presentationAdded="presentationAdded"
            objectType="lesson"
            :objectId="$route.params.id"
          />
        </template>

        <template v-if="updatePresentationModel">
          <UpdatePresentation
            class="mb-4"
            :presentation="currPresentation"
            @closeUpdatePresentation="closeUpdatePresentation"
            @presentationUpdated="presentationUpdated"
          />
        </template>

        <div v-if="presentations.length > 0">
          <div class="d-flex" style="flex:1;flex-wrap:wrap">
            <div
              class="mr-1 ml-1"
              v-for="presentation in presentations"
              :key="presentation.id"
            >
              <div
                class="presentation-card"
                @click="$router.push(`/presentation/${presentation.id}`)"
              >
                <img
                  class="card-icon"
                  src="@/assets/imgs/Presentation-rafiki.svg"
                />
                <h6>{{ presentation.name }}</h6>
                <div class="presentation-btns">
                  <button
                    class="xd-edit-btn"
                    @click="openUpdatePresentationModel(presentation)"
                  >
                    <img src="@/assets/imgs/Icon-feather-edit-3.svg" alt="" />
                  </button>
                  <button class="xd-delete-btn">
                    <el-popconfirm
                      :confirm-button-text="$t('Validation.delete')"
                      :cancel-button-text="$t('Validation.close')"
                      icon="el-icon-info"
                      @confirm="deletePresentation(presentation)"
                      icon-color="red"
                      :title="$t('Validation.AreYouSure')"
                    >
                      <button slot="reference" class="btn">
                        <img
                          src="@/assets/imgs/Icon-material-delete.svg"
                          alt=""
                        />
                      </button>
                    </el-popconfirm>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3" v-if="presentationsTotalPages > 1">
            <vs-pagination
              color="warning"
              :length="presentationsTotalPages"
              v-model="presentationsPage"
            ></vs-pagination>
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
import AddPresentation from "@/components/Presentation/Add.vue";
import UpdatePresentation from "@/components/Presentation/Update.vue";
import NoData from "~/components/NoData.vue";

export default {
  components: {
    NoData,
    UpdatePresentation,
    UpdateQuestion,
    AddNewExam,
    Exam,
    UpdateExam,
    ShowExam,
    ManyQuestions,
    AddManyQuestion,
    ShowQuestions,
    AddPresentation
  },
  middleware: ["auth"],

  created() {
    // this.getUnit();
    this.getMaterials();
    this.getSubjectExams();
    this.getQuestions();
    this.getPresentations();
    this.active = 1;

    this.getLevel();
    this.getClass();
    this.getSection();
    this.getLesson();
  },
  data() {
    return {
      openUpdateModel: false,
      currLevel: {},
      currSection: {},
      currClass: {},
      repleyValue: "",
      commentValue: "",
      activeReplies: ["1"],
      lesson: {},
      active: "",
      addNewFile: {},
      updateFile: {},
      updateVideo: {
        content: [
          {
            title: "",
            timing: ""
          }
        ]
      },
      addNewVideo: {
        content: [
          {
            title: "",
            timing: ""
          }
        ]
      },
      addFilePopup: false,
      addVideoPopup: false,
      updateVideoPopup: false,
      updateFilePopup: false,

      pdf: "",
      url: "",
      video: "",
      isLink: true,
      material: [],
      videosMaterial: [],
      filesMaterials: [],

      theDefference: 0,
      showQuestionsOfExam: false,
      addExamModel: false,
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
      presentations: [],
      presentationsPage: 1,
      presentationsTotalPages: 1,

      addPresentationModel: false,
      updatePresentationModel: false,
      currPresentation: {},
      videoCollapsed: null,
      videoComments: [],
      commentsPage: 1,
      commentsTotalPages: 1,
      commentReplies: [],
      activeVideoComments: ["1"]
    };
  },

  watch: {
    page(newVal, oldVal) {
      this.getQuestions();
      this.openUpdateModel = false;
      if (newVal > oldVal) {
        let theDefference = Number(newVal) - Number(oldVal);
        this.allQuestionsCount += theDefference * 10;
      } else if (newVal < oldVal) {
        let theDefference = Number(oldVal) - Number(newVal);
        this.allQuestionsCount -= theDefference * 10;
      } else {
        this.allQuestionsCount = 1;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    presentationsPage(val) {
      this.getPresentations(val);
    },
    active(val) {
      if (val == 1) {
        this.videosMaterial = this.material.filter(ele => ele.type == "video");
        this.handleYoutubeAndVimeo();
      } else if (val == 2) {
        this.filesMaterials = this.material.filter(ele => ele.type == "pdf");
      }
    }
  },

  methods: {
    getClass() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/classes/${this.$route.query.class}`)
        .then(res => {
          this.currClass = res.data;
        })
        .finally(() => loading.close());
    },

    getLevel() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/levels/${this.$route.query.level}`)
        .then(res => {
          this.currLevel = res.data;
        })
        .finally(() => loading.close());
    },

    getSection() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/sections/${this.$route.query.section}`)
        .then(res => {
          this.currSection = res.data;
        })
        .finally(() => loading.close());
    },

    postReply(comment) {
      const loading = this.$vs.loading();
      this.$axios
        .post(`/comments/${comment.id}/replies`, { content: this.repleyValue })
        .then(res => {
          this.$vs.notification({
            color: "warn",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `تم إضافة الرد علي التعليق`
                : "Reply Added Successfully"
          });
          this.getReplies(comment);
        })
        .finally(() => loading.close());
    },

    postComment(video) {
      const loading = this.$vs.loading();
      this.$axios
        .post(`/material/${video.id}/comments`, { content: this.commentValue })
        .then(res => {
          this.$vs.notification({
            color: "warn",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `تم إضافة التعليق`
                : "Comment Added Successfully"
          });
          this.getVideoComments(video);
        })
        .finally(() => loading.close());
    },

    deleteReply(reply, comment) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/posts/${reply.id}`)
        .then(res => {
          this.$vs.notification({
            color: "warn",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `تم حذف الرد`
                : "Reply Deleted Successfully"
          });
          this.getReplies(comment);
        })
        .finally(() => loading.close());
    },

    deleteComment(comment, video) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/posts/${comment.id}`)
        .then(res => {
          this.$vs.notification({
            color: "warn",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `تم حذف التعليق`
                : "Comments Deleted Successfully"
          });
          this.getVideoComments(video);
        })
        .finally(() => loading.close());
    },

    getReplies(comment) {
      this.repleyValue = "";

      this.commentReplies = [];

      this.videoComments.map(ele => {
        if (ele.id !== comment.id) {
          this.$refs["replyCollapse" + ele.id][0].activeNames = [];
        }
      });

      const loading = this.$vs.loading({
        background: "#FFF",
        opacity: 1
      });

      let x = this.$axios
        .get(`posts/${comment.id}/replies?paginate=false`)
        .then(res => {
          this.commentReplies = res.data;
          console.log(comment);
        })
        .finally(() => loading.close());
    },

    collapseVideo(index, video) {
      this.repleyValue = "";

      this.commentReplies = [];

      console.log(video);

      if (this.videoCollapsed == index) {
        this.videoCollapsed = null;
      } else {
        this.videoCollapsed = index;
        this.getVideoComments(video);
      }
    },

    getVideoComments(video) {
      this.commentValue = "";
      this.videoComments = [];

      console.log(this.$refs[`video_comment_${video.id}`]);

      this.videosMaterial.map(ele => {
        this.$refs[`video_comment_${ele.id}`][0].activeNames = [];
      });

      this.$refs[`video_comment_${video.id}`][0].activeNames = ["1"];

      const loading = this.$vs.loading({
        background: "#FFF",
        opacity: 1
      });

      this.$axios
        .get(`/material/${video.id}/comments`)
        .then(res => {
          this.videoComments = res.data.docs;
          this.commentsPage = res.data.page;
          this.commentsTotalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },

    openUpdatePresentationModel(presentation) {
      this.updatePresentationModel = true;
      this.addPresentationModel = false;
      this.currPresentation = { ...presentation };
    },

    deletePresentation(presentation) {
      const loading = this.$vs.loading();
      this.$axios
        .delete(`/presentations/${presentation.id}`)
        .then(res => {
          this.$vs.notification({
            color: "warn",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `تم الحذف بنجاح`
                : "Presentation Deleted Successfully"
          });
          this.getPresentations();
        })
        .catch(err => {
          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },

    presentationAdded() {
      this.closeAddPresentation();
      this.getPresentations();
    },

    openAddPresentation() {
      this.addPresentationModel = true;
    },

    closeAddPresentation() {
      this.addPresentationModel = false;
    },

    closeUpdatePresentation() {
      this.updatePresentationModel = false;
    },

    presentationUpdated() {
      this.closeUpdatePresentation();
      this.getPresentations();
    },

    getPresentations(val = 1) {
      let loading = this.$vs.loading();
      this.$axios
        .get(
          `/presentations?objectType=lesson&object=${this.$route.params.id}&page=${val}&limit=14`
        )
        .then(res => {
          this.presentations = res.data.docs;
          this.presentationsPage = res.data.page;
          this.presentationsTotalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },

    openLessonFile(file) {
      window.open(file.link, "_blank");
    },
    handleUpdateImage(e) {
      if (e.raw && e.raw.type.endsWith("pdf")) {
        this.url = URL.createObjectURL(e.raw);
        this.pdf = e.raw;
        this.updateFile.pdf = this.pdf;
      } else {
        this.$refs.uploadUpdateFile.clearFiles();
        this.$message.error({
          message: "This File Not Allowed..Please Attach PDF!"
        });
      }
    },

    removeUpdateImage(e) {
      delete this.updateFile.pdf;
      delete this.updateFile.link;
      delete this.updateFile.videoPhoto;
    },

    handleUpdateVideo(video) {
      this.updateVideo = { ...video };
      this.updateFileList = [{ name: video.link }];
      this.addVideoPopup = this.addFilePopup = this.updateFilePopup = false;
      this.updateVideoPopup = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    handleUpdteFile(file) {
      this.updateFile = { ...file };
      this.updateFileList = [{ name: file.link }];
      this.addVideoPopup = this.addFilePopup = this.updateVideoPopup = false;
      this.updateFilePopup = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    handleYoutubeAndVimeo() {
      this.material.map(ele => {
        if (ele.link.includes("youtube.com")) {
          ele.link = ele.link.replace("watch?v=", "embed/");
          if (ele.link.includes("&")) {
            let index = ele.link.indexOf("&");
            ele.link = ele.link.substring(0, index);
          }
        } else if (
          ele.link.includes("vimeo.com") &&
          !ele.link.includes("player")
        ) {
          ele.link = ele.link.replace("vimeo.com/", "player.vimeo.com/video/");
        }

        console.log(ele.link);
      });
    },
    deleteMaterial(material) {
      const loading = this.$vs.loading();

      this.$axios
        .delete(`/material/${material.id}`)
        .then(res => {
          this.$message({
            message: "Material Deleted Successfully",
            type: "success"
          });
          this.getMaterials();
        }).catch(err => {
          if(err.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالحذف من هذا الدرس لانه خاص بمدرس أخر"
                    : "Dont Allow To delete From This Lesson Becouse its assigned to teacher",
              });
              return;
          }
          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },

    getMaterials() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/lessons/${this.$route.params.id}/material?paginate=false`)
        .then(res => {
          this.material = res.data;
          this.videosMaterial = this.material.filter(
            ele => ele.type == "video"
          );

          this.videosMaterial.map(ele => (ele.collapse = false));

          this.filesMaterials = this.material.filter(ele => ele.type == "pdf");
          this.handleYoutubeAndVimeo();
        })

        .finally(() => loading.close());
    },
    submitAddVideoForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isLink && !this.addNewVideo.video) {
            this.$message.error({
              message: "Please Attach Video It's Required"
            });
            return;
          }

          if (!this.addNewVideo.videoPhoto) {
            this.$message.error({
              message: "Please Attach Video Cover It's Required"
            });
            return;
          }

          console.log("valid");
          this.addVideo();
        }
      });
    },
    submitUpdateVideoForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isLink && !this.updateVideo.video) {
            this.$message.error({
              message: "Please Attach Video It's Required"
            });
            return;
          }

          if (!this.updateVideo.videoPhoto) {
            this.$message.error({
              message: "Please Attach Video Cover It's Required"
            });
            return;
          }

          console.log("valid");
          this.updateVideoInBackend();
        }
      });
    },
    submitAddFileForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.addNewFile.pdf) {
            this.$message.error({
              message: "Please Attach File It's Required"
            });
            return;
          }

          console.log("valid");
          this.addFile();
        }
      });
    },

    submitUpdateFileForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.updateFile.link && !this.updateFile.pdf) {
            this.$message.error({
              message: "Please Attach File It's Required"
            });
            return;
          }

          console.log("valid");
          this.updateFileInBackend();
        }
      });
    },

    addVideo() {
      const loading = this.$vs.loading();

      let material;

      material = new FormData();
      material.append("title", this.addNewVideo.title);
      if (this.isLink) {
        material.append("link", this.addNewVideo.link);
      } else {
        material.append("video", this.addNewVideo.video);
      }
      material.append("videoPhoto", this.addNewVideo.videoPhoto);
      if(this.addNewVideo.content){
        for (let i = 0; i < this.addNewVideo.content.length; i++) {
        material.append(
          `content[${i}][title]`,
          this.addNewVideo.content[i].title
        );
        material.append(
          `content[${i}][timing]`,
          this.addNewVideo.content[i].timing
        );
      }
      }

      material.append("type", "video");

      this.$axios
        .post(`/lessons/${this.$route.params.id}/material`, material)
        .then(res => {
          this.$message({
            message: "Video Added Successfully",
            type: "success"
          });
          this.addVideoPopup = false;
          this.addNewVideo = {};
          this.addNewVideo.content = [
            {
              title: "",
              timing: ""
            }
          ]
          this.getMaterials();
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.$message({
              message:
                this.$i18n.locale == "ar"
                  ? "الطابع الزمني مطلوب"
                  : "Timestamp Is Required"
            });

            return;
          }

          if(error.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالإضافة في هذا الدرس لانه خاص بمدرس أخر"
                    : "Dont Allow To delete From This Lesson Becouse its assigned to teacher",
              });
              return;
          }


          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });


        })
        .finally(() => loading.close());
    },

    updateVideoInBackend() {
      const loading = this.$vs.loading();

      let material;

      material = new FormData();
      material.append("title", this.updateVideo.title);
      if (this.isLink) {
        material.append("link", this.updateVideo.link);
      } else {
        material.append("video", this.updateVideo.video);
      }
      material.append("videoPhoto", this.updateVideo.videoPhoto);
      for (let i = 0; i < this.updateVideo.content.length; i++) {
        material.append(
          `content[${i}][title]`,
          this.updateVideo.content[i].title
        );
        material.append(
          `content[${i}][timing]`,
          this.updateVideo.content[i].timing
        );
      }
      material.append("type", "video");

      this.$axios
        .patch(`/material/${this.updateVideo.id}`, material)
        .then(res => {
          this.$message({
            message:
              this.$i18n.locale == "ar"
                ? "تم تعديل الفديو بنجاح"
                : "Video Updated Successfully",
            type: "success"
          });
          this.updateVideoPopup = false;
          this.updateVideo = {};
          this.getMaterials();
        })
        .catch(error => {
          if (error.response.status === 400) {
            this.$message({
              message:
                this.$i18n.locale == "ar"
                  ? "الطابع الزمني مطلوب"
                  : "Timestamp Is Required"
            });
            return;
          }

          if(error.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالتعديل في هذا الدرس لانه خاص بمدرس أخر"
                    : "Dont Allow To Update From This Lesson Becouse its assigned to teacher",
              });
              return;
          }


          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });


        })
        .finally(() => loading.close());
    },

    addFile() {
      const loading = this.$vs.loading();

      let formData = new FormData();
      formData.append("title", this.addNewFile.title);
      formData.append("pdf", this.addNewFile.pdf);
      formData.append("type", "pdf");

      this.$axios
        .post(`/lessons/${this.$route.params.id}/material`, formData)
        .then(res => {
          this.$message({
            message:
              this.$i18n.locale == "ar"
                ? "تم إضافة الملف بنجاح"
                : "File Added Successfully",
            type: "success"
          });
          this.addFilePopup = false;
          this.addNewFile = {};
          this.getMaterials();
        }).catch(err =>{
          if(err.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالإضافة في هذا الدرس لانه خاص بمدرس أخر"
                    : "Dont Allow To Add In Lesson Becouse its assigned to teacher",
              });
              return;
          }

          this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "حدث خطأ ما !"
                    : "There Are Something wrong",
          });


        })
        .finally(() => loading.close());
    },

    updateFileInBackend() {
      const loading = this.$vs.loading();

      let formData = new FormData();
      formData.append("title", this.updateFile.title);
      if (this.updateFile.pdf) {
        formData.append("pdf", this.updateFile.pdf);
      } else {
        formData.append("link", this.updateFile.link);
      }

      this.$axios
        .patch(`/material/${this.updateFile.id}`, formData)
        .then(res => {
          this.$message({
            message:
              this.$i18n.locale == "ar"
                ? "تم تعديل الملف بنجاح"
                : "File Updated Successfully",
            type: "success"
          });
          this.updateFilePopup = false;
          this.updateFile = {};
          this.getMaterials();
        }).catch(err => {
          if(err.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالتعديل في هذا الدرس لانه خاص بمدرس أخر"
                    : "Dont Allow To Update From This Lesson Becouse its assigned to teacher",
              });
              return;
          }


          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },

    handleAddImage(e) {
      // if (e.raw && e.raw.type.endsWith("pdf")) {
      this.url = URL.createObjectURL(e.raw);
      this.pdf = e.raw;
      this.addNewFile.pdf = this.pdf;
      // } else {
      //   this.$refs.upload.clearFiles();
      //   this.$message.error({
      //     message: "This File Not Allowed..Please Attach PDF!",
      //   });
      // }
    },

    handleAddVideoPhoto(e) {
      if (
        e.raw &&
        (e.raw.type.endsWith("png") ||
          e.raw.type.endsWith("jpg") ||
          e.raw.type.endsWith("PNG") ||
          e.raw.type.endsWith("JPG") ||
          e.raw.type.endsWith("jpeg") ||
          e.raw.type.endsWith("JPEG"))
      ) {
        this.url = URL.createObjectURL(e.raw);
        this.pdf = e.raw;
        this.addNewVideo.videoPhoto = this.pdf;
      } else {
        this.$refs.addVideoPhoto.clearFiles();
        this.$message.error({
          message:
            this.$i18n.locale == "ar"
              ? "هذا الملف غير مدعوم ادخل jpg أو png أو jpeg"
              : "This File Not Allowed..Please Attach jpg or png jpeg!"
        });
      }
    },

    handleUpdateVideoPhoto(e) {
      if (
        e.raw &&
        (e.raw.type.endsWith("png") ||
          e.raw.type.endsWith("jpg") ||
          e.raw.type.endsWith("PNG") ||
          e.raw.type.endsWith("JPG") ||
          e.raw.type.endsWith("jpeg") ||
          e.raw.type.endsWith("JPEG"))
      ) {
        this.url = URL.createObjectURL(e.raw);
        this.pdf = e.raw;
        this.addNewVideo.videoPhoto = this.pdf;
      } else {
        this.$refs.updateVideoPhoto.clearFiles();
        this.$message.error({
          message:
            this.$i18n.locale == "ar"
              ? "هذا الملف غير مدعوم ادخل jpg أو png أو jpeg"
              : "This File Not Allowed..Please Attach jpg or png jpeg!"
        });
      }
    },

    handleUpdateSrcVideo(e) {
      if (
        e.raw &&
        (e.raw.type.endsWith("mp4") ||
          e.raw.type.endsWith("MP4") ||
          e.raw.type.endsWith("webm") ||
          e.raw.type.endsWith("WEBM"))
      ) {
        this.url = URL.createObjectURL(e.raw);
        this.video = e.raw;
        this.updateVideo.video = this.video;
      } else {
        this.$refs.uploadUpdate.clearFiles();
        this.$message.error({
          message:
            this.$i18n.locale == "ar"
              ? "هذا الملف غير مدعوم ادخل mp4 أو webm "
              : "This File Not Allowed..Please Attach mp4 or webm!"
        });
      }
    },
    removeAddImage(e) {
      delete this.addNewFile.pdf;
    },

    handleAddSrcVideo(e) {
      if (
        e.raw &&
        (e.raw.type.endsWith("mp4") ||
          e.raw.type.endsWith("MP4") ||
          e.raw.type.endsWith("webm") ||
          e.raw.type.endsWith("WEBM"))
      ) {
        console.log("success");
        this.video = e.raw;
        this.addNewVideo.video = this.video;
      } else {
        console.log("failed");
        this.$refs.uploadVideo.clearFiles();
        this.$message.error({
          message:
            this.$i18n.locale == "ar"
              ? "هذا الملف غير مدعوم ادخل mp4 أو webm "
              : "This File Not Allowed..Please Attach mp4 or webm!"
        });
      }
    },
    removeUpdateVideo(e) {
      delete this.updateVideo.video;
      delete this.updateVideo.link;
    },
    removeAddVideo(e) {
      delete this.addNewVideo.video;
    },

    removeVideoPhoto() {
      delete this.updateVideo.videoPhoto;
      delete this.addNewVideo.videoPhoto;
    },

    handleAddFile() {
      this.addVideoPopup = this.updateVideoPopup = this.updateFilePopup = false;
      this.addFilePopup = !this.addFilePopup;
    },
    handleAddVideo() {
      this.addFilePopup = this.updateVideoPopup = this.updateFilePopup = false;
      this.addVideoPopup = !this.addVideoPopup;
    },
    getLesson() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/lessons/${this.$route.params.id}`)
        .then(res => {
          this.lesson = res.data;
        })
        .finally(() => loading.close());
    },

    getQuestions() {
      const loading = this.$vs.loading();

      let endPointQuery = `/subjects/${this.$route.query.subject}/questions?`;

      if (this.$route.query.unit) {
        endPointQuery += `unit=${this.$route.query.unit}&`;
      }

      //   if (this.filterType) {
      //     endPointQuery += `type=${this.filterType}&`;
      //   }

      if (this.$route.params.id) {
        endPointQuery += `object=${this.$route.params.id}&`;
      }

      if (this.page) {
        endPointQuery += `page=${this.page}&`;
      }

      this.$axios
        .get(endPointQuery)
        .then(res => {
          this.allQuestions = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
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

    addQuestionToExam(question) {
      if (!question.point) {
        this.$vs.notification({
          color: "#FA5B5A",
          position: "top-center",

          text:
            this.$i18n.locale == "ar"
              ? "حدد درجة السؤال اولا"
              : "Determine Degree Of Questions"
        });

        return;
      }

      const loading = this.$vs.loading();

      this.$axios
        .patch(`/exams-add-questions/${this.currExamToAssignQuestions.id}`, [
          { question: question.id, point: question.point }
        ])
        .then(res => {
          question.point = "";
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم إضافة السؤال الي الامتحان بنجاح"
                : "Question Added To Exam Successfully"
          });

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
        .then(res => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف السؤال  بنجاح"
                : "Question Deleted Successfully"
          });
          this.getQuestions();
        })
        .finally(() => loading.close());
    },
    deleteQuestionFromExam(question) {
      let qryParam = `/exams/${this.currExamToAssignQuestions.id}/questions/${question.id}`;

      this.$axios
        .patch(qryParam)
        .then(res => {
          this.$vs.notification({
            color: "#45D7B6",
            position: "top-center",

            text:
              this.$i18n.locale == "ar"
                ? "تم حذف السؤال من الامتحان بنجاح"
                : "Question Deleted From Exam Successfully"
          });

          this.getExamQuestions();
        })
        .finally(() => loading.close());
    },

    openAddQuestionsToSelectedExam(e) {
      this.openAddQuestionsToExamModel = true;
      console.log(e);
      this.currExamToAssignQuestions = { ...e };
      this.active = 3;
      this.lessonTab = 1;

      this.getExamQuestions();
    },

    questionsAddedToExam() {
      this.lessonTab = 1;
      this.getExamQuestions();
      this.getQuestions();
    },

    openUpdateQuesModel(question) {
      console.log("hi")
      this.openUpdateQuestionModel(question);
    },

    getExamQuestions() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/exams/${this.currExamToAssignQuestions.id}`)
        .then(res => {
          this.currExamToAssignQuestions = this.currUnitExam = this.currLessonExam = this.currSubjectExam =
            res.data;
          let arr = [];
          res.data.questions.map(element => {
            arr.push({
              ...element.question,
              points: element.point,
              childrenQuestions: element.childrenQuestions
            });
          });

          console.log(arr);

          this.examQuestions = arr;
        })
        .finally(() => loading.close());
    },

    closeExamQuestion(type) {
      this.addFilePopup = this.updateFilePopup = false;
      this.addExamModel = false;
      this.addVideoPopup = false;
      this.updateVideoPopup = false;

      this.subjectUpdateModel = this.openUpdateModel = false;

      this.showQuestionsOfExam = false;

      this.currSubjectExam = this.currExamToAssignQuestions = {};
    },

    openExamQuestion(e) {

      this.$router.push(`/exam-details/${e.id}?subject=${this.$route.query.subject}&unit=${this.$route.query.unit}&lesson=${this.$route.params.id}&unit_name=${ this.$i18n.locale == 'ar' ? (this.lesson.unit && this.lesson.unit.nameAr): (this.lesson.unit && this.lesson.unit.nameEn)}&subject_name=${this.lesson.unit && this.$i18n.locale == 'ar' ? (this.lesson.unit.subject && this.lesson.unit.subject.nameAr) : (this.lesson.unit.subject && this.lesson.unit.subject.nameAr) }&lesson_name=${this.$i18n.locale == 'ar' ? this.lesson.nameAr : this.lesson.nameEn}&section=${this.$route.query.section}&class=${this.$route.query.class}&level=${this.$route.query.level}`)

      // this.showQuestionsOfExam = true;

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
        .then(res => {
          this.currExamToAssignQuestions = this.currSubjectExam = res.data;
          let arr = [];
          res.data.questions.map(element => {
            arr.push({
              ...element.question,
              points: element.point,
              childrenQuestions: element.childrenQuestions
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
      this["subjectUpdateModel"] = true;

      if (exam.duration) {
        exam.isDuration = true;
      } else {
        exam.isDuration = false;
      }

      console.log(exam);

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
        .then(res => {
          this.$message({
            message:
              this.$i18n.locale == "ar"
                ? "تم حذف الامتحان بنجاح"
                : "Exam Deleted Successfully",
            type: "success"
          });

          this.getSubjectExams();
          this.showQuestionsOfExam = false;
        }).catch(err =>{
          if(err.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالحذف في هذا الدرس لانه خاص بمدرس أخر"
                    : "Dont Allow To Delete From This Lesson Becouse its assigned to teacher",
              });
              return;
          }


          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },

    getSubjectExams() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/lessons/${this.$route.params.id}/exams?paginate=false`)
        .then(res => {
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
        .then(res => {
          this.$message({
            message: `units deleted Successfully !`,
            type: "success"
          });

          this.getUnits();
        }).catch(err => {
          if(err.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالحذف لانه خاص بمدرس أخر"
                    : "Dont Allow To Delete Becouse its assigned to teacher",
              });
              return;
          }


          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },
    submitAddForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("valid");
          this.addUnit();
        }
      });
    },
    submitUpdateForm(formName) {
      this.$refs[formName].validate(valid => {
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
          nameEn: this.addNewUnit.nameEn
        })
        .then(res => {
          this.$message({
            message: `units added Successfully !`,
            type: "success"
          });
          this.addUnitPopup = false;
          this.addNewUnit = {};
          this.getUnits();
        }).catch(err => {
          if(err.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالإضافة لانه خاص بمدرس أخر"
                    : "Dont Allow To Add Becouse its assigned to teacher",
              });
              return;
          }


          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },
    updateTheUnit() {
      const loading = this.$vs.loading();
      this.$axios
        .patch(`/units/${this.updateUnit.id}`, {
          nameAr: this.updateUnit.nameAr,
          nameEn: this.updateUnit.nameEn
        })
        .then(res => {
          this.$message({
            message: `units Updated Successfully !`,
            type: "success"
          });
          this.updateUnitPopup = false;
          this.updateUnit = {};
          this.getUnits();
        }).catch(err =>{
          if(err.response.status == 403){
             this.$vs.notification({
                color: "danger",
                position: "top-center",

                text:
                  this.$i18n.locale == "ar"
                    ? "غير مسموح لك بالتعديل لانه خاص بمدرس أخر"
                    : "Dont Allow To Update Becouse its assigned to teacher",
              });
              return;
          }


          this.$vs.notification({
            color: "danger",
            position: "top-center",
            text:
              this.$i18n.locale == "ar"
                ? `حدث خطأ ما`
                : "There Are Something Wrong"
          });
        })
        .finally(() => loading.close());
    },
    getUnits() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/subjects/${this.$route.params.id}/units`)
        .then(res => {
          this.units = res.data.docs;
          this.page = res.data.page;
          this.totalPages = res.data.totalPages;
        })
        .finally(() => loading.close());
    },
    getSubejct() {
      const loading = this.$vs.loading();
      this.$axios
        .get(`/subjects/${this.$route.params.id}`)
        .then(res => {
          this.subject = res.data;
          this.getSubjectExams();
        })
        .finally(() => loading.close());
    }
  }
};
</script>

<style lang="scss">
%btn {
  background: none;
  border: 1px solid #d6d5d2;
  padding: 0px 14px;
  border-radius: 3px;
}

.lesson-page {
  margin-top: 16px;
  .lesson-page-inner{
    padding: 15px;
    background: #FFF;
  }

  .exams .btn {
    // width: 38px;
    // height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 !important;
    border: none !important;
    width: 100% !important;
  }
  .lesson-path {
    display: flex;
    padding-top: 15px;
    color: var(--blue);
    margin-bottom: 7px;
    flex-wrap: wrap;
  }

  .lessons-tab {
    margin-top: 15px;
  }

  .videoCard {
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-bottom: 25px;
    background: #fff;
    iframe,
    video {
      width: 100%;
      height: 350px;
    }

    .videoComments {
      .comment {
        margin-bottom: 10px;
        border-bottom: 1px solid #dddddd80;
        padding-bottom: 10px;

        img {
          width: 60px;
          border-radius: 50%;
          height: 60px;
          padding: 1px;
          border: 1px solid #d4d3df;
        }

        div {
          &:nth-of-type(2) {
            flex: 1 1 0%;
            padding: 0 10px;

            span {
              color: #717171;
              font-size: 12px;
            }

            p {
              margin-bottom: 0;
            }
            h6 {
              margin-bottom: 0;
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  .pdf-card {
    padding: 10px;
    //   border: 1px solid #ddd;
    text-align: center;
    box-shadow: 0 4px 25px 0 #0000001a;
    background: #FFF;

    h5 {
      margin-top: 10px;
      color: var(--blue);
    }
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

.el-form {
  .el-form-item__label {
    width: 100%;
    color: #333 !important;
    font-weight: normal !important;
    font-size: 19px !important;
    margin-bottom: 1px !important;
  }
  .fullwidth {
    width: 100% !important;
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

.miuus-margin {
  margin-top: -10px;
}

.presentation-card {
  text-align: center;
  text-align: center;
  padding: 10px;
  background: #fff;
  margin-bottom: 15px;
  box-shadow: 0 4px 25px 0 #00000014;
  transition: all 0.5s ease;
  width: 200px;
  cursor: pointer;
  > h6 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    transform: translateY(-10px);
  }
  .card-icon {
    width: 150px;
  }

  .presentation-btns {
    display: flex;
    > button {
      flex: 1;
    }
    .xd-delete-btn {
      @extend %btn;
    }
    .xd-edit-btn {
      @extend %btn;
    }
    .xd-delete-btn {
      position: relative;
      @extend %btn;
      .btn.el-popover__reference {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        padding: 0 !important;
      }
    }
  }
}
@import "../../assets/styles/bank-questions.scss";
</style>
