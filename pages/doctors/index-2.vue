<template>
  <div class="teachers-page">
      <div class="container-fluid">
          <div class="star-container mt-3">
          <StarHeader title="Teachers"></StarHeader>
          </div>
          <div class="teachers">
              <div class="row">
              <div class="col-md-3">
                  <div class="filters">

                      <vs-button @click="handleAddTeacher()"> New Teacher </vs-button>

                      <div>
                          <label for="email">Email</label>
                           <el-input
                            id="email"
                            placeholder="Email"
                            type="email"
                            v-model="emailVal"
                            @keydown.native.enter="getTeachers()"
                            ></el-input>
                      </div>

                      <div>
                          <label for="username">User Name</label>
                           <el-input
                           id="username"
                            placeholder="User Name"
                            type="text"
                            v-model="usernameVal"
                            @keydown.native.enter="getTeachers()"
                            ></el-input>
                      </div>


                      <div>
                          <label for="phone">Phone</label>
                           <el-input
                           id="phone"
                            placeholder="Phone"
                            type="text"
                            v-model="phoneVal"
                            @keydown.native.enter="getTeachers()"
                            ></el-input>
                      </div>

                      <!-- <div>
                            <label>Systems</label>
                            <el-select clearable v-model="systemVal" placeholder="Systems">
                                <el-option
                                v-for="item in systems"
                                :key="item.id"
                                :label="item.nameEn"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div> -->

                        <div>
                            <label>Levels</label>
                            <el-select clearable v-model="levelVal" placeholder="Levels">
                                <el-option
                                v-for="item in levels"
                                :key="item.id"
                                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>


                        <div >
                            <label>Classes</label>
                            <el-select clearable v-model="classVal" placeholder="Classes">
                                <el-option
                                v-for="item in classes"
                                :key="item.id"
                                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>


                        <div >
                            <label>Sections</label>
                            <el-select clearable v-model="sectionVal" placeholder="Sections">
                                <el-option
                                v-for="item in sections"
                                :key="item.id"
                                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>


                        <div >
                            <label>Subjects</label>
                            <el-select clearable v-model="subjectVal" placeholder="Subjects">
                                <el-option
                                v-for="item in subjects"
                                :key="item.id"
                                :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>


                        
                  </div>
              </div>

              <div class="col-md-9">
                  <NoData v-if="allTeachers.length == 0" />
                  <div class="teachers-section" v-else>
                      
                      <div class="row">
                          <div class="col-md-4" v-for="teacher in allTeachers" :key="teacher.id">
                             <div class="stud">
                                    <div class="text-center">
                                            <vs-avatar size="70" style="margin:auto;margin-bottom:10px;" >
                                                <img style="height:100%" :src="teacher.photo" alt="">
                                            </vs-avatar>
                                    </div>
                                    <div class="content">
                                        <h6> {{teacher.username}} </h6>
                                        <h6 > {{teacher.email}} </h6>
                                        <h6 > {{teacher.phone}} </h6>
                                        <h6> {{teacher.address}} </h6>
                                        <h6 @click="handleChangeSubject(teacher)" class="btn subject"> Assign To Section </h6>
                                        <h6 @click="showAssignedToTeacher(teacher)" class="btn subject" style="background: var(--success)"> Assigned </h6>
                                    </div>
                             </div>
                          </div>
                      </div>


                       <div class="center con-pagination">
                        <vs-pagination color="warning" progress v-model="page" :length="totalPages" />
                      </div>

                  </div>
              </div>
          </div>
          </div>
      </div>




      <vs-dialog v-model="addNewTeacherPopup">

          <template #header>
            <h4 class="not-margin">
                Add Teacher
            </h4>
            </template>

          <el-form :model="addTeacher" ref="addTeacher" class="add-teacher-form">


              <el-form-item
                prop="username"
                :rules="[
                  {
                    required: true,
                    message: 'Please input username',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  placeholder="User Name"
                  v-model="addTeacher.username"
                ></el-input>
              </el-form-item>

              <el-form-item
                prop="email"
                :rules="[
                  {
                    required: true,
                    message: 'Please input email address',
                    trigger: 'blur'
                  },
                  {
                    type: 'email',
                    message: 'Please input correct email address',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-input
                  placeholder="Email"
                  v-model="addTeacher.email"
                ></el-input>
              </el-form-item>

              <el-form-item
                prop="password"
                :rules="[
                  {
                    required: true,
                    message: 'Please input password',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  placeholder="Password"
                  type="password"
                  v-model="addTeacher.password"
                ></el-input>
              </el-form-item>



             

              <el-form-item
               prop="phone"
                :rules="[
                  {
                    required: true,
                    message: 'Please input phone',
                    trigger: 'blur'
                  }
                ]"
                >
                  <vue-phone-number-input
                    @update="updatePhone"
                    v-model="addTeacher.phone"
                    default-country-code="JO"
                    
                    />
              </el-form-item>


               <el-form-item
                    prop="photo"
                    
                >
                    <el-upload
                    class="upload-demo"
                    :limit="1"
                    action="#"
                    :show-file-list="true"
                    :auto-upload="false"
                    :on-change="handleImage"
                    :on-remove="removeImage"
                    >
                    <el-button size="small" type="primary">Click to upload</el-button>
                    <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
                    

                    
                    </el-upload>

                    <vs-avatar v-if="url" size="70">
                        <img :src="url" alt="">
                    </vs-avatar>

                </el-form-item>






              <el-form-item>
                <el-button class="form-button" type="primary" @click="addNewTeacher('addTeacher')"
                  >add</el-button
                >
              </el-form-item>
            </el-form>
      </vs-dialog>



      <vs-dialog class="change-subject" v-model="openChangeSubject">
          <template #header>
            <h5 class="not-margin" v-if="currTeacher">
                Change {{currTeacher.username}} Subject
            </h5>
            </template>


            <el-form :model="changeSubject" ref="changeSubject" class="change-teacher-form">


              <el-form-item
                prop="levelVal"
                :rules="[
                  {
                    required: true,
                    message: 'Please input level',
                    trigger: 'blur'
                  }
                ]"
              >
                <label>Levels</label>
                <el-select @change="getClasses(changeSubject.levelVal)" clearable v-model="changeSubject.levelVal" placeholder="Levels">
                    <el-option
                    v-for="item in levels"
                    :key="item.id"
                    :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                    :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>



              <el-form-item
                prop="classVal"
                :rules="[
                  {
                    required: true,
                    message: 'Please input class',
                    trigger: 'blur'
                  }
                ]"
              >
                <label>Classes</label>
                <el-select @change="getSections(changeSubject.classVal)" clearable v-model="changeSubject.classVal" placeholder="Levels">
                    <el-option
                    v-for="item in classes"
                    :key="item.id"
                    :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                    :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>



              <el-form-item
                prop="sectionVal"
                :rules="[
                  {
                    required: true,
                    message: 'Please input section',
                    trigger: 'blur'
                  }
                ]"
              >
                <label>Sections</label>
                <el-select clearable @change="getSubjects(changeSubject.sectionVal)" v-model="changeSubject.sectionVal" placeholder="Sections">
                    <el-option
                    v-for="item in sections"
                    :key="item.id"
                    :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                    :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>


              <el-form-item
                prop="subjectVal"
                :rules="[
                  {
                    required: true,
                    message: 'Please input subject',
                    trigger: 'blur'
                  }
                ]"
              >
                <label>Subjects</label>
                <el-select clearable v-model="changeSubject.subjectVal" placeholder="Subjects">
                    <el-option
                    v-for="item in subjects"
                    :key="item.id"
                    :label="$i18n.locale == 'ar' ? item.nameAr : item.nameEn"
                    :value="item.id">
                    </el-option>
                </el-select>
              </el-form-item>

              

              <el-form-item>
                <el-button class="form-button" type="primary" @click="updateTeacherSubject('changeSubject')"
                  >Assign To Teacher</el-button
                >
              </el-form-item>


             


            </el-form>
      </vs-dialog>


      <vs-dialog v-model="showAssignedPopup">
        <template #header>
            <h5 class="not-margin responsive-heading">
                <b>Prof: </b> {{currTeacher.username}}
            </h5>
        </template>

        <div>
            <h6> <img style="width:23px" src="@/assets/imgs/group.svg" alt=""> Sections</h6>
            <NoData width="100px" v-if="currTeacher.sections && currTeacher.sections.length == 0" />
            <div class="p-2" style="padding-top:0 !important" v-else>
                <div class="row">
                    <div v-for="sec in currTeacher.sections" :key="sec.id" class="col-md-4">
                        <div>
                            <img style="width: 14px;margin-top: -2px" src="@/assets/imgs/oval.svg" alt="">
                            {{sec.nameEn}}
                        </div>
                    </div>


                </div>
            </div>
        </div>

        <el-divider></el-divider>
        <div>
            <h6> <img style="width: 20px;" src="@/assets/imgs/search.svg" alt=""> Subjects</h6>

            <NoData width="100px" v-if="currTeacher.subjects && currTeacher.subjects.length == 0" />
            <div class="p-2 pt-0" style="padding-top:0 !important" v-else>
                <div class="row">
                    <div v-for="sec in currTeacher.subjects" :key="sec.id" class="col-md-4">
                        <div>
                            <img style="width: 14px;" src="@/assets/imgs/oval.svg" alt="">
                            {{sec.nameEn}}
                        </div>
                    </div>


                </div>
            </div>
        </div>

      </vs-dialog>
  </div>
</template>

<script>
import StarHeader from '@/components/StarHeader'
import NoData from '@/components/NoData'
export default {
    middleware:['auth'],
    components:{
        StarHeader,
        NoData
    },
    mounted(){
        this.getTeachers();
        this.getSystems();
        this.getLevels();
    },
    data(){
        return {
            

            showAssignedPopup: false,
            subjectVal:'',
            subjects:[],
            currTeacher:{},
            addTeacher:{},
            openChangeSubject: false,
            allTeachers: [],
            addNewTeacherPopup: false,
            page:1 ,
            usernameVal:"",
            emailVal:"",
            totalPages: 1,
            classVal:"",
            systems:[],
            systemVal:"",
            levels:[],
            classes:[],
            classVal:"",
            levelVal:"",
            sections:[],
            sectionVal:"",
            usernameVal:"",
            emailVal:"",
            phoneVal:"",
            phoneObj:{},
            changeSubject:{},
            photo:"",
            url:""
        }
    },
    watch:{
        levelVal(val){
            if(val != ''){
                this.getClasses(val);
            }
            this.getTeachers();
        },
        classVal(val){
            if(val != ''){
                this.getSections(val);
            }
            this.getTeachers();
        },
        sectionVal(val){
            if(val != ''){
                this.getSubjects(val);
            }
            this.getTeachers();
        },
        systemVal(){
            this.getTeachers()
        },
        subjectVal(){
            this.getTeachers()
        },
        page(){
            this.getTeachers()
        }
    },
    methods:{
        showAssignedToTeacher(teacher){
            this.showAssignedPopup = true;
            this.currTeacher = {...teacher};
        },
        handleAddTeacher(){
            this.addNewTeacherPopup = true;
            this.photo = "";
            this.url = "";
        },
        handleImage(e){
            if(e.raw){
                this.url = URL.createObjectURL(e.raw);
                this.photo = e.raw;
                console.log(e.raw)
            }
        },
        removeImage(e){
            this.photo = "";
        },
        handleChangeSubject(teacher){
            this.currTeacher = {...teacher};
            this.openChangeSubject = true;
        },
        changeTeacherSubject(){
            this.openChangeSubject = false;
            const loading = this.$vs.loading();
            
            this.$axios.patch(`/teachers/${this.currTeacher.id}/assign`, {subject: this.changeSubject.subjectVal}).then(res => {
                this.$message({
                    message: `Subject Assigned To Teacher Successfully!`,
                    type: 'success'
                });
                this.changeSubject = {};
                this.getTeachers();
            })
            .finally(() => loading.close())
        },
        updatePhone(val) {
            this.phoneObj = val;
        },



        updateTeacherSubject(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.changeTeacherSubject();
                }
            });
        },

    addNewTeacher(formName){
        
        this.$refs[formName].validate(valid => {
            if (valid) {
                this.addTeacherInBackend();
            }
      });
    },
    addTeacherInBackend(){
        const loading = this.$vs.loading();

        let formData = new FormData();
        formData.append("username", this.addTeacher.username);
        formData.append("email", this.addTeacher.email);
        formData.append("phone", this.phoneObj.formattedNumber);
        formData.append("password", this.addTeacher.password);
        if (this.photo){
          formData.append("photo", this.photo);
        }

        this.$axios.post(`/teachers`, formData).then(res => {
            this.addNewTeacherPopup = false;
            this.$message({
                message: `Teacher Added Successfully!`,
                type: 'success'
            });
            this.phoneObj = {}
            this.addTeacher = {};
            this.getTeachers();
        }).catch((error) => {
                console.log(error)
                if(error.response && error.response.status == 400){
                    this.$message.error({
                        message: `Email Or Phone Already Exist`,
                    });
                }else{
                    this.$message.error({
                        message: `There Are Something Wrong!`,
                    });
                }
            })
            .finally(() => loading.close());
    },
        getTeachers(){

            const loading = this.$vs.loading();
            let qrySrting = '/teachers?';

            // if(this.systemVal != ''){
            //     qrySrting += 'system=' + this.systemVal + '&' ;
            // }

            if(this.emailVal != ''){
                qrySrting += 'email=' + this.emailVal + '&' ;
            }

            if(this.usernameVal != ''){
                qrySrting += 'username=' + this.usernameVal + '&' ;
            }

            if(this.phoneVal != ''){
                qrySrting += 'phone=' + this.phoneVal + '&' ;
            }

            // if(this.levelVal != ''){
            //     qrySrting += 'level=' + this.levelVal + '&';
            // }

            if(this.classVal != ''){
                qrySrting += 'classes=' + this.classVal + '&';
            }

            if(this.sectionVal != ''){
                qrySrting += 'sections=' + this.sectionVal + '&';
            }

            if(this.subjectVal != ''){
                qrySrting += 'subjects=' + this.subjectVal + '&';
            }

            if(this.page > 1){
                qrySrting += 'page=' + this.page + '&';
            }

            qrySrting += 'limit=12&'

            if(qrySrting.endsWith('&') || qrySrting.endsWith('?')){
                qrySrting = qrySrting.split('')
                qrySrting.splice(qrySrting.length -1, 1);
                qrySrting = qrySrting.join('');
            }

            console.log(qrySrting)

            this.isLoading = true;
            this.$axios.get(qrySrting).then(res => {
                this.allTeachers = res.data.docs;
                this.page = res.data.page;
                this.totalPages = res.data.totalPages;
            }).finally(() => loading.close());
        },
        getSystems(){
            this.isLoading = true;
            this.$axios.get(`/systems?paginate=false`).then(res => {
                this.systems = res.data;
                
            }).finally(() => this.isLoading = false);
        },
        getLevels(){
            this.isLoading = true;
            this.$axios.get(`/levels?paginate=false`).then(res => {
                this.levels = res.data;
                
            }).finally(() => this.isLoading = false);
        },
        getClasses(val){
            this.isLoading = true;
            this.$axios.get(`/levels/${val}/classes?paginate=false`).then(res => {
                this.classes = res.data;
                
            }).finally(() => this.isLoading = false);
        },
        getSections(val){
            this.isLoading = true;
            this.$axios.get(`/classes/${val}/sections?paginate=false${this.systemVal ? '&system='+this.systemVal : ''}`).then(res => {
                this.sections = res.data;
                
            }).finally(() => this.isLoading = false);
        },
        getSubjects(val){
            this.isLoading = true;
            this.$axios.get(`/sections/${val}/subjects?paginate=false`).then(res => {
                this.subjects = res.data;
                
            }).finally(() => this.isLoading = false);
        }
    }
}
</script>

<style lang="scss">
.teachers-page{

    label{
        color:#2c4484;
    }
    
    .teachers{
        margin-top: 15px;
        .filters{
        padding: 10px;
        background: #FFF;
        
        .el-select{
            width: 100%;
            margin-bottom: 10px;
        }
    }
    }

    .teachers-section{
        .stud{
            position: relative;
            padding: 5px;
            text-align: center;
            background: #FFF;
            border: 1px solid #e8e8e8;
            margin-bottom: 11px;
        }
        .content{

            
            h6{
                &:not(:first-of-type){
                        font-size: 13px;
                        color: #2c4484;
                        font-weight: 400;
                }
                &:first-of-type{
                    margin-bottom: 5px;
                }
            }

            .subject{
                display: inline-block;
                background: #2c4484ad;
                padding: 3px;
                color: #FFF !important;
                
                font-weight: bold;
            }


        }
    }

    
}
.country-selector__label{
        top:-9px !important;
}
.input-tel__label{
    top:-8px !important;
}
.el-popper[x-placement^=bottom]{
    z-index: 99999999999999 !important;
}
.change-subject{
    label{
        margin-bottom: 0;
    }
    .el-select{
        width:100% !important;
    }
}

.el-upload__tip{
        margin-top: 0;
}
</style>