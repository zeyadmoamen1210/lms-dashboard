<template>
  <div class="header">
      <div>
            <img class="first-top" src="@/assets/imgs/star.svg" alt="">
            <img class="second-top" src="@/assets/imgs/star.svg" alt="">
            <img class="thired-top" src="@/assets/imgs/star.svg" alt="">
      </div>
      <span>
          {{title}}
      </span>
      <div>
            <img class="thired-top" src="@/assets/imgs/star.svg" alt="">
            <img class="second-top" src="@/assets/imgs/star.svg" alt="">
            <img class="first-top" src="@/assets/imgs/star.svg" alt="">
      </div>

  </div>
</template>

<script>
export default {
    props:["title"]
}
</script>

<style lang="scss" scoped>
.header{
    display:flex;
    >div{
        padding-top: 7px;
    }
    >span{
        // padding: 5px 5px;
        font-size: 20px;
    }
    .first-top{
        width: 9px;
        margin: 0px 2px;
        display: inline-block;
    }

    .second-top{
            width: 14px;
        margin: 0px 2px;
        display: inline-block;
    }

    .thired-top{
            width: 18px;
        margin: 0px 2px;
        display: inline-block;
    }
}

</style>