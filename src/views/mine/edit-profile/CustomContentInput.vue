<script lang="ts" setup>
import {PropType, reactive, ref} from "vue";
import eyeClose from "@/assets/eye-hide.svg"
import eyeOpen from "@/assets/eye-open.svg"

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
  src: eyeClose,
});

function showChange() {
  inputType.value = inputType.value == "text" ? "password" : "text";
  passwordEye.src =
      passwordEye.src == eyeOpen
          ? eyeClose
          : eyeOpen;
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
        class="custom-input"
        @input="updateModel"
    />
    <span class="content">{{ input.name }}</span>
    <img v-if="type == 'password'"
         :src="passwordEye.src"
         alt=""
         class="eye"
         @click="showChange()"
    />
    <span v-show="showNoticeText" class="notice-content">{{ noticeText }}</span>
  </div>
</template>

<style scoped>
@import "customContentInput.scss";
</style>
