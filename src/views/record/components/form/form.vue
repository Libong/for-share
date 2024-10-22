<script lang="ts" setup>

import {PropType} from "vue";
import {IShoppingRecord} from "@/views/record/index";

interface ITransformStyle {
  scale: number,
  left: number,
  top: number,
}

let props = defineProps({
  data: {
    type: Object as PropType<IShoppingRecord>,
    default: {},
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  transformStyle: {
    type: Object as PropType<ITransformStyle>,
    default: {
      scale: 0,
      left: 0,
      top: 0,
    }
  }
})

const emits = defineEmits(['update:isShow']);

const toggleShow = () => {
  emits('update:isShow', !props.isShow);
};
</script>

<template>
  <Teleport to="body">
    <transition name="slide-and-grow">
      <div v-if="isShow"
           class="model">
        <div class="container">
          <el-form :model="data" class="container-form">
            <el-form-item label="物品名称">
              <el-input v-model="data.goodsName"/>
            </el-form-item>
          </el-form>
          <div class="demo-datetime-picker">
            <div class="block">
              <el-date-picker
                  v-model="value1"
                  date-format="MMM DD, YYYY"
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Pick a Date"
                  time-format="HH:mm"
                  type="datetime"
              />
            </div>
            <div class="line"/>
            <div class="block">
              <el-date-picker
                  v-model="value2"
                  date-format="YYYY/MM/DD ddd"
                  end-placeholder="End date"
                  format="YYYY-MM-DD HH:mm:ss"
                  start-placeholder="Start date"
                  time-format="A hh:mm:ss"
                  type="datetimerange"
              />
            </div>
          </div>
          <button @click="toggleShow">测试</button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@import "form.scss";
</style>