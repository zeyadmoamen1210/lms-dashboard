<template>
  <div class="presentation-slide">
      <div class="container">

          
        
        <section  class="content">

            <div class="d-flex slide-header">

                <div  style="flex: 1">
                    <h5 class="mb-0 pt-2"> <span>{{ $i18n.locale == 'ar' ? 'سلايد : ' : 'Slide : '  }}</span> {{index + 1}} </h5>
                </div>

                <div class="justify-content-end d-flex">
                    <el-button @click="removeSlide" type="danger">  
                        <img
                            src="@/assets/imgs/Icon-material-delete.svg"
                            alt=""
                        />  
                    </el-button>

                </div>
            </div>


            <div class="order mb-3">
                <h6>{{ $i18n.locale == 'ar' ? 'ترتيب الاسلايد' : 'Slide Order'  }}</h6>
                <el-input v-model.number="slide.order"></el-input>
            </div>
            <h6>{{ $i18n.locale == 'ar' ? 'محتوي الاسلايد' : 'Slide Content'  }}</h6>
            <client-only>
                <quill-editor
                    ref="editor"
                    v-model="slide.content"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    
                />
            </client-only>
         

            <h6 class="mt-3">{{ $i18n.locale == 'ar' ? 'صور الاسلايد' : 'Slide Photos'  }}</h6>
            <el-upload
            :auto-upload="false"
            multiple
            :file-list="fileList"
            class="avatar-uploader"
            action="#"
            list-type="picture-card"
            ref="slidePhotos"
            :on-change="handleUpload"
            :on-remove="handleUpload"
            >   
            
                
                <i  class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </section>

        <hr>
      
      </div>
  </div>
</template>

<script>




export default {
    props:['slide', 'index'],
    created(){
        if (this.slide.photos.length > 0) {
            
            this.slide.photos.map(ele => {
                this.fileList.push({url: ele})
            })

        }
    },
    data:() => ({
        dialogHidden: false,
        fileList: [],
        editorOption: {
            theme: 'bubble',
          placeholder: "Add Slide Content",
          modules: {
   
        
            toolbar: {
                
                
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'align': [] }],
                    ['link'],
                    ['clean'],
                    
                    
                ],
                
            }
            

          }
        },
    }),
    computed:{
        
    },
    
    methods: {
        removeSlide(){
            this.$emit("removeSlide", this.index);
        },
        handleUpload(){
            this.slide.fileList = this.$refs.slidePhotos.uploadFiles;
        },

      onEditorBlur(editor) {
        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        console.log('editor ready!', editor)
      }
    }
}
</script>

<style lang="scss">

.presentation-slide{
    .quill-editor {
      min-height: 100px;
    }
    .content{
        padding: 15px;
        background: #ffffff;
        margin-bottom: 10px;
        h6{
            font-size: 13px;
            color: var(--yellow);
        }

        .order{
            .el-input{
                width: auto;
            }
        }

        .slide-header{
            background: #fff8eb73;
            padding: 6px;
            margin-bottom: 13px;
            border-bottom: 1px solid #ffa40052;

            h5{
                color: #7c77c7;
                font-weight: bold;
                font-size: 18px;
            }
        }
    }
    
}

.ql-bubble .ql-tooltip{
    z-index: 9999999999999999999;
    background-color: #060065 !important;
}

.ql-editor li:not(.ql-direction-rtl)::before{
    margin-left: 0.5em !important;
}

</style>