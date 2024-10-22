<script lang="ts" setup>
import {PropType, reactive, ref} from "vue";

interface NoticeSpanStyle {
  opacity: number;

  //加个这个就可以解决把对象当作style进行赋值且不会报错的volar提示问题
  [cssProperty: string]: string | number | undefined;
}

interface NoticeSpanProp {
  text: string;
  style: NoticeSpanStyle;
}

interface InputStyleProp {
  [cssProperty: string]: string | number | undefined;
}

interface InputProp {
  placeholder: string;
  name: string;
  // style: InputStyleProp;
  // type: string;
}

let props = defineProps({
  input: {
    type: Object as PropType<InputProp>,
    default: {
      placeholder: "",
      name: "",
    },
  },
  type: {
    type: String,
    default: "text",
  },
  isShow: {
    type: Boolean,
    default: true,
  },
  noticeText: {
    type: String,
    default: "",
  },
  inputValue: String,
  isShaking: Boolean,
});

let inputType = ref(props.type);
let passwordEye = reactive({
  type: "password",
  //TODO 将src里的相对路径src../../assets/eye-hide.svg改为响应式后只能用绝对路径否则会找不到
  src: "src/assets/eye-hide.svg",
});

function showChange() {
  inputType.value = inputType.value == "text" ? "password" : "text";
  passwordEye.src =
      passwordEye.src == "src/assets/eye-open.svg"
          ? "src/assets/eye-hide.svg"
          : "src/assets/eye-open.svg";
}

const emit = defineEmits(["update:inputValue"]);
const updateModel = (event: Event) => {
  let v = (event.target as HTMLInputElement).value;
  if (v == "") {
    showNotice(false);
  }
  emit("update:inputValue", v);
};

//提示词
const showNoticeText = ref(false);

function showNotice(isShow: boolean) {
  showNoticeText.value = isShow;
}

function isNoticeShow(): boolean {
  return showNoticeText.value;
}

/*将方法暴露出去给父组件使用*/
defineExpose({
  showNotice,
  isNoticeShow,
});
</script>

<template>
  <div v-if="isShow" class="input-er">
    <input
        :class="{ shaking: isShaking }"
        :placeholder="input?.placeholder"
        :type="inputType"
        :value="inputValue"
        @input="updateModel"
    />
    <span class="content">{{ input.name }}</span>
    <span v-if="type == 'password'">
      <img
          :src="passwordEye.src"
          alt=""
          class="eye"
          height="25px"
          width="25px"
          @click="showChange()"
      />
    </span>
    <span v-show="showNoticeText" class="notice-content">{{ noticeText }}</span>
  </div>
</template>

<style scoped>
@import "input.scss";

.input-er {
  /*固定位置*/
  position: relative;
  width: 100%;
  margin-top: 30px;

  input {
    width: 100%;
    height: 35px;
    /*不设置边框 否则会有边框会有阴影*/
    border: none;
    /*背景设置透明*/
    background: transparent;
    /*类似于边框border 描边*/
    outline: 2px solid rgb(0, 0, 0, 0.5);
    /*圆角边框*/
    border-radius: 5px;
    /*字体大小*/
    font-size: 14px;
    font-weight: bold;
    /*字体颜色*/
    color: rgba(0, 0, 0, 0.75);
    /*加边距使文本浮空 不会贴紧输入框*/
    padding: 0 15px;
    /*设置颜色*/

    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
      font-weight: bold;
      font-size: 12px;
    }

    /*聚焦时*/

    &:focus {
      /*改变描边的颜色*/
      outline: 2px solid rgb(255, 255, 255, 0.5);
      /*提示字消失*/

      &::placeholder {
        /*完全透明*/
        opacity: 0;
      }

      /*输入框外展示提示字*/

      & + .content {
        /*显示*/
        opacity: 1;
        top: -20px;
      }
    }

    /*当内部提示字未展示时(输入框中有内容) 展示外部提示字*/

    &:not(:placeholder-shown) + .content {
      /*显示*/
      opacity: 1;
      top: -20px;
    }
  }

  .content {
    /*会根据父标签中为relative的div 移动*/
    position: absolute;
    /*偏移到合适的位置*/
    top: -10px;
    left: 0;
    /*字体颜色*/
    color: #dddddd;
    /*字体大小 比提示小点*/
    font-size: 11px;
    /*字体加粗*/
    font-weight: bold;
    /*当改元素被改变时的动画 时间0.25 ease-out函数(使得变化开始较快，然后逐渐减慢)*/
    transition: 0.25s ease-out;
    /*默认隐藏*/
    opacity: 0;
  }

  .notice-content {
    /*会根据父标签中为relative的div 移动*/
    position: absolute;
    left: 33%;
    /*字体颜色*/
    color: rgba(255, 0, 0, 0.8);
    /*字体大小 比提示小点*/
    font-size: 11px;
    /*字体加粗*/
    font-weight: bolder;
    /*当改元素被改变时的动画 时间0.25 ease-out函数(使得变化开始较快，然后逐渐减慢)*/
    transition: 0.25s ease-out;
    top: 40px;
  }

  .eye {
    position: absolute;
    right: 10px;
    top: 5px;
    /*手指*/
    cursor: pointer;
  }
}
</style>
