export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'educational-dashboard',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
      // ...
      'quill/dist/quill.core.css',
      // for snow theme
      'quill/dist/quill.snow.css',
      // for bubble theme
      'quill/dist/quill.bubble.css',

      // ...

  ],
  bootstrapVue: {
    // Add the icon plugin to the `componentsPlugins` array
    componentPlugins: ['LayoutPlugin']
  },



  // some nuxt config...


  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/quil-editor.js', ssr: false },

    '@/plugins/element-ui',
    '@/plugins/moment.js',
    '@/plugins/vuesax.js',
    '@/plugins/nuxt-i18n.js',
    '@/plugins/vue-phone.js',
    '@/plugins/bootstrap-layout.js',
    '@/plugins/fontawesome',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/moment',
    'bootstrap-vue/nuxt',
    ['nuxt-i18n', {
      defaultLocale: 'ar',
      seo: false,


      strategy: 'no_prefix',


      locales: [{
          code: 'en',
          name: 'English',
          dir: 'ltr'
        },
        {
          code: 'ar',
          name: 'العربية',
          dir: 'rtl'
        },

      ]
    }]

  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://lms-systems.herokuapp.com/api/v1',
    common: {
      Accept: 'application/json',
      Authorization: '',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },


  auth: {
    // Options
    strategies: {
      local: {
        user: {
          property: ''
        },
        endpoints: {

          login: {
            url: 'login-email',
            method: 'post',
            propertyName: 'token',
          },
          user: { url: 'profile', method: 'get' },
          logout: false,
        },
        token: {
          maxAge: false,
        },
        refreshToken: {
          property: false,
          maxAge: false
        },

        autoLogout: false,
        // tokenRequired: true,
        tokenType: 'Bearer',
      },

    },
    resetOnError: false,
    plugins: [{
      src: '~plugins/auth.js',
      ssr: false,
    }, ],
  },


  i18n: {

    vueI18n: {
      defaultLocale: 'ar',
      fallbackLocale: 'en',

      messages: {
        en: {

          sidebar: {
            'system': "Edu System",
            'levels': "Edu Levels",
            'students2': "Our Students",
            'teachers': "Our Teachers",
            'questionsBank': "Questions Bank",
            "exams": "Exams",
            "Parents": "Parents",
            "Subjects": "Subjects",
            "presentations":"Presentations",
            "home": "Home"
          },

          auth: {
            "Login": "Login",
            "Email": "Email",
            "Password": "Password",
            "RememberMe": "Remember Me",
            "ForgetPassword": "Forget Password",
            "ValidateEmail2": "Invalid Email",
            "ValidateEmail": "Please Input Email ",
            "ValidatePassword": "Please Input Password ",
            "EmailPlaceholder": "Enter Email Address",
            "PasswordPlaceholder": "Enter Password",
            "Forget": "Forget your password?",

            "ForgetNote": "Enter your email to reset your password",
            "Send": "Send",
            "CodeNote": "Please enter the 5 numbers sent to your email",
            "Code": "verification code",
            "Verify": "Verify",
            "subNote": "Didn't get the code? Resend",
            "SavePass": "Save password"
          },
          classes: {
            "AddSection": "Add Section",
            "AddClass": "Add Class",
            "Systems": "Systems",
            "Levels": "Levels",
            "Sections": "Sections",
            "Capacity": "Capacity Of Class",
            "System": "System",
            "FilterWithSystems": "Filter With Systems",
            "NumberOfStud": "Number Of Students",
            "Students": "Students",
            "ShowStudents": "Show Students",
            "Subjects": "Subjects",
            "ShowSubjects": "Show Subjects",
            "Actions": "Actions",
            "Classes": "Classes",
            "System": "System"
          },

          "MustNumber": "This Field Must Be Number",

          levels: {
            "Sections": "Sections",
            "Classes": "Classes",
            "AddClass": "Add Class",
            "ShowClasses": "Show Classes",
            "AddLevel": "Add Levels",
            "Levels": "Levels",
            "ShowLevels": "Show Levels",
            "ShowSections" : "Show Sections"
          },

          subjects: {
            "Lessons": "Lectures",
            "available":"Activate",
            "notAvailable":"Deactivate",
            "ExamSolution": "Solutions",
            "AddSubject": "Add Subject",
            "Systems": "Systems",
            "Levels": "Levels",
            'Section': 'Section',
            'Class': "Class",
            'AssignToTeacher': 'Assign To Teacher',
            'AttachImg': 'Attach Image To Subject',
            'Unit': 'Units',
            'Lectures': 'Lectures',
            'AddLessons': 'Add Lecture',

            'questionTypes': 'Question Types',
            "ShowContent": "View Content",
            "Units": "Units",
            "Exams": "Exams",
            "Live": "Live",
            "QuestionBank": "Question Bank",
            "Questions": " Exam questions",
            "AddUnit": "Add Unit",
            "AddExam": "Add Exam",
            "AddLive": "Add Live",
            "LiveNow": "Live Now",
            "start": "Start",
            "update": "Update",
            "delete": "Delete",
            'Edit': "Edit",
            "Showexam": "Show Exams",
            "Examtitle": "Exam Title",
            "Rate": "success rate",
            "Count": "Times to solve",
            "Time": "Time",
            "available": "Available",
            "ChooseLevel": "Choose Level",
            "ChooseGrade": "Choose Grade",
            "ChooseSection": "Choose Class",
            "ChooseSubject": "Choose Subject",
            "ChooseUnit": "Choose Unit",
            "ChooseLesson": "Choose Lecture",
            "Typeofquestion": "Type Of Question",
            "Questiontype": "Question Type",
            "filter": "Question Type Filter",
            "Search": "Search",
            "SearchInExam": "Search In Exam",
            "Questions": "Questions",
            "AddQuestionsImage": "Add Question with image",
            "AddQuestions": "Add Question",
            "AddQuestionsGruop": "Add Group Question",
            "Paragraph": "Paragraph",
            "T/F": "True & False",
            "Group": "Group",
            "Complete": "Complete",
            "Choose": "Choose",
            "Voice": "Voice",
            "Degree": "Degree",
            "Answer": "Answer",
            "HideContent": "Hide Content",
            "ShowAnswer": "Show Answer",
            "questionHead": "Question Head",
            "AddPic": "Add Image",
            "AnswerReq": "Answer required",
            "FirstChoose": "First Choice",
            "Secondchoice": "Second Choice",
            "Thirdchoice": "Third Choice",
            "Fourthchoice": "Fourth Choice",
            "True": "True",
            "False": "False",
            "Addanswer": "Add Answer",
            "Questiontype": "Question Type :",
            "FirstDegree": "Degree 1",
            "SecondDegree": "Degree 2",
            "FirstDegree": "Degree 1",
            "SecondDegree": "Degree 2",
            "system": "System",
            "stages": "Stages",
            "Levels": "Levels",
            "Classes": "Classes",
            "SearchByName": "Search By Name",
            "Subject": "Subject",
            "BackToExams": "Back To Exams",
            "Addmorethanonequestion": "Add more than one question",
            "que": "Questions",
            "Examduration": "Exam Duration",
            "Minute": "Minute",
            "NewQuestion": "New Question",
            "RemoveFromExam": "Remove From Exam",
            "AddToExam": "Add To Exam",
            "AddQuestions": "Add Question",
            "AddQuestion": "Add Question",
            "AddExcel": "Add Excel",
            "downloadExcel": "Download Excel"


          },


          students: {
            "ChangeSectionStudent": "Change Section To Student",
            "updateStudentInformation": "Update ",
            "Students": "Students",
            "Student": "Student",
            "username": "Student Name",
            'ChangePass': "Must Change Password ",
            'add': "Add",
            'attchFile': 'Attach File',
            'Student': 'Student',
            'Systems': 'Systems',
            'Class': 'Class',
            'Levels': 'Levels',
            'Sections': "Sections",
            'addStudents': 'Add Students',
            "ProfileImg": "Personal Picture",

          },

          systems: {
            "Systems": "Systems",
            "AddSystem": "Add System"
          },

          teachers: {
            "teachers": "Doctors",
            "teacher": "Doctor",
            'system': 'System',
            'levels': 'Levels',
            'classes': "Classes",
            'sections': 'Sections',
            'searchByName': 'Search By Name',
            'deactivate': 'Deactivate',
            'activate': 'Activate',
            'addTeachers': 'Add Doctor'
          },

          sections: {
            "AttachImg": "Attach Image",
            "AssignToTeacher": "Assign To Doctor",
          },

          lesson: {
            "AttachFile": "Attach File",
            "AttachVideoPhoto": "Attach Video Cover",
            "timing": "Timing",
            "title": "Title",
            "FileTitle": "Lecture Title",
            "AttachVideo": "Attach Video",
            "link": "Enter Link Video",
            "Videos": "Videos",
            "Pdf": "Pdf",
            "Exams": "Exams",
            "AddVideo": " Add Video",
            "AddPdf": "Add Pdf",
            "AddExam": "Add Exam",
          },

          "exams": {
            'ExamQuestions': 'Exam Questions',
            'QuestionsBank': 'Questions Bank',
            'AddNewQuestions': 'Add New Questions',
            'AddQuestionWithImage': 'Add Question Image'
          },

          Validation: {
            "Level": "Level",
            "Section": "Section",
            "content":"Enter Content",
            "VContent":"Content Is Required",
            "number": 'This Field Must Be Number',
            "nameAr": "Name In Arabic",
            "name": "Title",
            "nameEn": "Name In English",
            "required": "This Field Is Required",
            "save": "Save",
            "close": "close",
            "delete": "delete",
            "AreYouSure": "Are You Sure You Want To Delete ?",
            "Id": 'ID',
            'createdAt': 'Created At',
            'updatedAt': 'Updated At',
            "Actions": "Actions",
            "ValidEmail": "Enter A Valid Email",
            "Email": "Email",
            "Phone": "Phone",
            "Username": "Username",
            "Img": "Image",
            "VPassword": "Enter A Password",
            "Password": "Password",
            "VAddress": "Enter A Address",
            "Address": "Address",
            "VPhone": "The Phone Is Required",
            "VLevel": "The Level Is Required",
            "VSection":"The Section Is Required",
            "VEmail": "The Email Is Required",
            "VClass": "The Class Is Required",
            "VName": "The Title Is Required",
            'Add': 'Add',
            'VSubject': 'Enter a Subject',
            "FileTitle": "File Title Is Required",
            "FileImage": "File Is Required",
            "description": "Description",
            "Title": "Title",
            "dateofjoin": "Date of join",
            "Student": "Student",
            "Educationalsystem": "Educational System",
            "Educationallevel": "Educational Level",
            "Classroom": "Classroom",
            "SearchForStudent": "Search For Student",

          },
          Parents: {
            "Addaparent": "Add a Parent",
            "name": "Name",
            "address": "Address",
            "password":"Password",
            "email": 'Email',
            "phone": 'Phone',
            "child": 'Child',
            "search": "Search",
            "clear": "Clear Search"
          }
        },
        ar: {
          sidebar: {
            'system': "الأنظمة",
            'levels': "المراحل",
            'students2': "الطُلاب",
            'teachers': "الدكاترة",
            "exams": "الإمتحانات",
            "Parents": "الاَباء",
            "Subjects": "المواد الدراسية",
            "questionsBank": "بنك الأسئلة",
            "presentations":"العروض التقديمية",
            "home": "الرئيسية"
          },
          auth: {
            "Login": "تسجيل الدخول",
            "Email": "البريد الإلكتروني",
            "Password": "كلمة المرور",
            "RememberMe": "تذكرني",
            "ForgetPassword": "هل نسيت كلمة المرور",
            "ValidateEmail": "البريد الإلكتروني مطلوب",
            "ValidateEmail2": "البريد الإلكتروني غير صحيح",
            "ValidatePassword": "كلمة المرور مطلوبة ",
            "EmailPlaceholder": "أدخل البريد الإلكتروني",
            "PasswordPlaceholder": "أدخل كلمة المرور",
            "AttachImg": "إضافة صورة للمادة",
            "Forget": "نسيت كلمة المرور ؟",
            "ForgetNote": "ادخل البريد الالكترونى الخاص بك  لاعادة  تعين كلمة المرور  ",
            "Send": "ارسال",
            "CodeNote": "من فضلك ادخل ال 5  ارقام التي أرسلت الى بريدك الالكترونى",
            "Code": "كود التأكيد",
            "Verify": "تاكيد",
            "subNote": "لم احصل على الكود؟ إعادة ارسال",
            "SavePass": "حفظ كلمة المرور"

          },

          levels: {
            "Sections": "الشُعب الدارسية",
            "Classes": "الصفوف التعليمية",
            "ShowClasses": "عرض الفصول",
            "AddClass": "إضافة صف",
            "Levels": "المراحل",
            "AddLevel": "إضافة مرحلة",
            "ShowLevels": "عرض المراحل",
            "ShowSections" : "عرض الشُعب"
          },

          sections: {
            "AttachImg": "إرفاق صورة",
            "AssignToTeacher": "الإسناد إلي دكتور",
          },

          teachers: {
            "teachers": "الدكاترة",
            "teacher": "الدكتور",
            'system': 'النٌطم',
            'levels': 'المراحل',
            'classes': "الصفوف",
            "Sections": "الشُعب",
            'sections': 'الفصول',
            'searchByName': 'بحث بالإسم',
            'deactivate': 'تعطيل',
            'activate': 'تفعيل',
            'addTeachers': 'إضافة دكتور'
          },


          "MustNumber": "هذا الحقل يجب ان يكون رقم",

          subjects: {
            "available":"متاح",
            "notAvailable":"غير متاح",
            "Lessons": "المحاضرات",

            "ExamSolution": "إجابات ",
            "AddSubject": "إضافة مادة",
            "Systems": "الأنطمة",
            "Levels": " المراحل التعليمة",
            'Section': 'الصفوف',
            'Class': "الفصول",
            'AssignToTeacher': 'إسناد دكتور للمادة',
            'Student': 'الطالب',
            'Unit': 'الوحدات',
            'Lectures': 'المحاضرات',
            'AddLessons': ' إضافة محاضرة',
            'questionTypes': 'إختر نوع السؤال',
            "ShowContent": "عرض المحتوى",
            "Units": "الوحدات",
            "Exams": "الإمتحانات",
            "Live": "البث",
            "QuestionBank": " بنك الاسئلة",
            "Questions": " اسئلة االامتحان",
            "AddUnit": "إضافة وحدة",
            "AddExam": "إضافة امتحان",
            "AddLive": "إضافة لايف",
            "LiveNow": "لايف ناو ",
            "start": "أبدء",
            "update": "تعديل",
            "delete": "  حذف",
            "Showexam": "عرض الأسئلة",
            "Examtitle": "عنوان الامتحان",
            "Rate": "نسبة النجاح",
            "Count": "عدد مرات الحل",
            "Time": "الوقت",
            "available": "متاح",
            "ChooseLevel": "إختر الصف",
            "ChooseGrade": "إختر الفصل",
            "ChooseSection": "إختر الشعبه",
            "ChooseSubject": "إختر المادة",
            "ChooseUnit": "إختر الوحدة",
            "ChooseLesson": "إختر المحاضرة",
            "Typeofquestion": "إختر نوع السؤال",
            "Questiontype": " نوع الأسئلة",
            "filter": "فلتر  بنوع السؤال",
            "Search": "بحث",
            "SearchInExam": "بحث في الأسئلة",
            "Questions": "الأسئلة",
            "AddQuestionsImage": "إضافة سؤال بصورة",
            "AddQuestions": "إضافة أسئلة",
            "AddQuestionsGruop": "إضافة سؤال جروب",
            "Paragraph": "سؤال إنشائي",
            "T/F": "صح اما خطا",
            "Group": "سؤال مركب",
            "Complete": "اكمل",
            "Choose": "اختر",
            "Voice": "صوتى",
            "Degree": "الدرجه",
            "Answer": "الاجابه",
            "HideContent": " إخفاء الاجابه",
            "ShowAnswer": " عرض الاجابه",
            "questionHead": "رأس السؤال",
            "AddPic": "إضافة صورة",
            "AnswerReq": "الإجابة مطلوب",
            "FirstChoose": "الاختيار الأول",
            "Secondchoice": "الاختيار الثاني",
            "Thirdchoice": "الاختيار الثالث",
            "Fourthchoice": "الاختيار الرابع",
            "True": "صح",
            "False": "خطأ",
            "Addanswer": "إضافة إجابة",
            "Questiontype": " : نوع السؤال",

            "FirstDegree": "الدرجه 1",
            "SecondDegree": "الدرجه 2",
            "system": "النٌطم",
            "stages": "المراحل",
            "Levels": "الصفوف",
            "Classes": "الفصول",
            "SearchByName": "بحث بالإسم",
            "Subject": "الماده",
            "BackToExams": "الرجوع إلي الامتحانات",
            "Addmorethanonequestion": "إضافة اكثر من سؤال",
            "que": "الاسئلة",
            "Examduration": "مدة الامتحان",
            "Minute": "دقيقة",
            "NewQuestion": "سؤال جديد",
            "RemoveFromExam": "إزالة من الامتحان",
            "AddToExam": "إضافة إلي الامتحان",
            "AddQuestions": "إضافة الأسئلة",
            "AddQuestion": "إضافة السؤال",
            "AddExcel": " إضافة إكسيل شيت طلاب",
            "downloadExcel":"تحميل ملف إكسيل"



          },


          students: {
            "Student": "الطالب",
            "ChangeSectionStudent": "تغير الشُعبة للطالب",
            "updateStudentInformation": "تعديل ",
            "Students": "الطُلاب",
            "username": "اسم الطالب",
            'Systems': 'الأنظمة',
            "ChangePass": "شرط تغيير كلمة المرور",
            'add': "إضافة",
            'attchFile': 'إرفاق ملف',
            'systems': 'الأنظمة',
            'Class': 'الصف',
            'Levels': 'المراحل التعليمة',
            'Sections': 'الفصول',
            'addStudents': 'إضافة طالب',
            "ProfileImg": "الصورة الشخصية",
          },


          "exams": {
            'ExamQuestions': 'أسئلة الإمتحان',
            'QuestionsBank': 'بنك الأسئلة',
            'AddNewQuestions': 'أسئلة جديدة',
            'AddQuestionWithImage': 'سؤال بصورة'
          },

          lesson: {
            "AttachFile": "إرفاق ملف",
            "AttachVideoPhoto": "إرفاق صورة للفيديو",
            "timing": "الوقت",
            "title": "العنوان",
            "FileTitle": "ادخل عنوان المحاضرة",
            "AttachVideo": "إرفاق فيديو",
            "link": "ادخل رابط للفيديو",
            "Videos": "الفيديوهات",
            "Pdf": "الملفات",
            "Exams": "الامتحانات",
            "AddVideo": " إضافة فيديو",
            "AddPdf": "إضافة ملف",
            "AddExam": "إضافة امتحان",
          },

          systems: {
            "Systems": " الأنظمة التعليمية",
            "AddSystem": "إضافة نظام"
          },


          classes: {
            "AddClass": "إضافة فصل",
            "AddSection": "إضافة شعُبة",
            "Systems": "الأنظمة التعليمية",
            "Levels": "المراحل التعليمة",
            "Sections": "الفصول",
            "Capacity": "الحد الأقصي للفصل",
            "System": "النظام",
            "FilterWithSystems": "البحث بالنظام التعليمي",
            "NumberOfStud": "عدد الطُلاب",
            "Students": "الطُلاب",
            "ShowStudents": "عرض الطُلاب",
            "Subjects": "المواد",
            "ShowSubjects": "عرض المواد",

            "ShowClasses": "عرض الفصول الدراسية",
            "Actions": "الاجراءات",
            "Classes": "الفصول",
            "System": "النظُم التعليمية",

          },
          Validation: {
            "Level": "المرحلة",
            "Section": "الشعُبة",
            "content":"اكتب النص",
            "VContent":"هذا النص مطلوب",
            "number": 'يجب ان يكون رقم',
            "name": "العنوان",
            "nameAr": "الإسم باللغة العربية",
            "nameEn": "الإسم باللغة الإنجليزية",
            "required": "هذا الحقل مطلوب",
            "save": "حفظ",
            "close": "إلغاء",
            "delete": "حذف",
            "AreYouSure": "هل أنت متأكد من انك تريد الحذف ؟",
            "Id": 'الرقم',
            'createdAt': 'الإنشاء منذ',
            'updatedAt': 'أخر تعديل',
            "Actions": "الاجراءات",
            "ValidEmail": "اكتب بريد إلكتروني صالح",
            "VEmail": "ادخل البريد الإلكتروني",
            "Email": "البريد الإلكتروني",
            "VPassword": "أدخل كلمة المرور",
            "Password": " كلمة المرور",
            "VAddress": "ادخل عنوان المنزل",
            "Address": "العنوان",
            "VPhone": "رقم الهاتف مطلوب",
            "VLevel": "المرحلة التعليمية مطلوبة",
            "VSection":"الشُعبة التعليمية مطلوبة",
            "VClass": "الفصل الدراسي مطلوب",
            "VName": "العنوان مطلوب",
            "Phone": "رقم الهاتف",
            "Username": "الإسم",
            "Img": "الصورة",
            'Add': 'إضافة',
            'VSubject': 'ادخل مادة',
            "FileTitle": " عنوان الملف",
            "FileImage": "ادخل الملف",
            "description": "وصف",
            "Title": "عنوان",
            "dateofjoin": "تاريخ الإنضمام",
            "Student": "الطالب",
            "Educationalsystem": "النظام التعليمي",
            "Educationallevel": "المرحلة التعليمية",
            "Classroom": "الصف الدراسي",
            "SearchForStudent": "بحث عن طالب",
          },

          Parents: {
            "Addaparent": "إضافة ولي الأمر",
            "name": "الاسم",
            "address": "العنوان",
            "password": "كلمة المرور",
            "email": 'البريد الإلكتروني',
            "phone": 'رقم الموبايل',
            "child": 'اسم الطالب',
            "search": "بحث",
            "clear": "إلغاء البحث"
          }
        },
      }
    }
  },



}
