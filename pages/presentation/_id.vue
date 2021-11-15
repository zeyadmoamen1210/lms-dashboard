<template>
  <div class="presentation-content">
      <div class="container">

          <div class="presentation-control pt-3 d-flex mb-3">
              <div style="flex: 1">
                  <h3> {{presentation.name}} </h3>
              </div>
              <div>
                  <el-button class="pt-2" type="warning" @click="addPresentation()"> {{ $i18n.locale == 'ar' ? 'إضافة سلايد' : 'Add Slide'  }} </el-button>
              </div>
          </div>

          <div v-for="(slide, index) in presentation.slides" :key="index">
              <Slide @removeSlide="removeSlide" :index="index" :slide="slide" />
          </div>

          <div class="p-2">
              <el-button type="warning" @click="savePresentation"> {{ $i18n.locale == 'ar' ? 'حفظ محتوي العرض' : 'Save The Presentation'  }} </el-button>
          </div>


      </div>
  </div>
</template>

<script>



import Slide from '@/components/Presentation/Slide.vue';
export default {
    components:{ Slide },
    middleware:['auth'],
    created(){
        this.getPresentation()
    },
    data(){
        return {
            presentation: {},
            
        }
    },
    methods:{


        validatePresentation(){


            if(this.presentation.slides.length == 0){
                

                return {status: false, flag: 1};
            }

            for(let i = 0 ; i < this.presentation.slides.length ; i++){

                let slide = this.presentation.slides[i];

                if(!slide.content){
                    return {status: false, flag: 2};
                }

               if(!slide.order){
                   return {status: false, flag: 3};
               }

               console.log(slide.content)
            }

            

            return {status: true, flag: 0};;
        },

          savePresentation(){

              console.log(this.validatePresentation())
            if(!this.validatePresentation().status){


                if(this.validatePresentation().flag == 2 ){
                    this.$vs.notification({
                        color: "danger",
                        position: "top-center",
                        text: this.$i18n.locale == 'ar' ? `أدخل جميع البيانات أولا` : 'Enter All Slides data (content - order - photos)!',
                    });

                }

                if(this.validatePresentation().flag == 3 ){
                    this.$vs.notification({
                        color: "danger",
                        position: "top-center",
                        text: this.$i18n.locale == 'ar' ? `ترتيب الاسلايد مطلوب و يجب ان يكون أكبر من الصفر ` : 'Slide Order Is Required And Greeter Than 0',
                    });

                }

                else if (this.validatePresentation().flag == 1 ){
                    this.$vs.notification({
                        color: "danger",
                        position: "top-center",
                        text: this.$i18n.locale == 'ar' ? `يجب إضافة علي الأقل سلايد ` : 'You Must Add Atleast One Slide',
                    });
                }

                return;
            }

            const loading = this.$vs.loading();


            let photosToUpload = []
            let requests = []

            this.presentation.slides.map((slide, index) => {
                let recivedPhotos = [];

                photosToUpload.push([])

                if(slide.fileList && slide.fileList.length > 0){

                    slide.fileList.map(file => {
                        if(file.status == 'ready'){
                            photosToUpload[index].push(file.raw)
                        }
                    })
                }


                let formData = new FormData();



                for(let i = 0 ; i < photosToUpload[index].length ; i++){
                    if(photosToUpload[index][i]){
                        formData.append("photo", photosToUpload[index][i])
                    }
                    
                }


                if(photosToUpload[index].length > 0){
                    let req = this.$axios.post(`/images`, formData).then(res => {
                        photosToUpload[index] = []
                        res.data.map(ele => {
                            photosToUpload[index].push(ele.photo)
                        });
                    });

                    requests.push(req)

                }else{
                    photosToUpload[index] = []
                }

                


                

            })


            let slides = [];
            Promise.all([...requests]).then(res => {
                
                this.presentation.slides.map((slide, index) => {
                    slide.photos.map(ele => {
                        photosToUpload[index].push(ele)
                    })

                    slides.push({
                        order: slide.order,
                        content: slide.content,
                        photos: [...photosToUpload[index]]
                    })
                })



                this.$axios.patch(`/presentations/${this.presentation.id}`, {slides: [...slides]}).then(res => {
                    this.$vs.notification({
                        color: "success",
                        position: "top-center",
                        text: this.$i18n.locale == 'ar' ? `تم إضافة محتوي العرض بنجاح` : 'Presentation Content Added Successfully',
                    });
                    this.getPresentation();
                    window.scrollTo({top:0, behavior: "smooth"});
                }).finally(() => loading.close())


            })





            

            
             

            


        },


        removeSlide(slideIndex){
            this.presentation.slides.splice( slideIndex , 1 );
        },

        addPresentation(){

            this.presentation.slides.push({order: null , content: null , fileList: [], photos: []});

            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight, "smooth");
            }, 0);

        },

        getPresentation(){
            const loading = this.$vs.loading();
            this.$axios.get(`/presentations/${this.$route.params.id}`).then(res => {
                this.presentation = res.data;
            }).finally(() => loading.close())
        }
    }
}
</script>

<style>

</style>