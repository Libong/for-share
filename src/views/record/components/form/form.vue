<script lang="ts" setup>

import {PropType, reactive, ref} from "vue";
import {IShoppingRecord, Label} from "@/views/record/index";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import Button2 from "@/components/common/button/Button2.vue";

let props = defineProps({
  data: {
    type: Object as PropType<IShoppingRecord>,
    default: {},
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  selectGoodsTypes: {
    type: Array as PropType<Label[]>,
  },
  isAddForm: {
    type: Boolean,
    default: false,
  }
})

let isDisabledTeleport = ref(true)
//定义事件 用于给父组件获取
const emits = defineEmits(['update:isShow', 'addRecord']);

const closeAddModel = () => {
  emits('update:isShow', !props.isShow);
};
const addConfirmed = async (formEl: FormInstance | undefined) => {
  if (formEl) {
    await formEl.validate((valid, fields) => {
      if (valid) {
        ElMessage({
          message: "记录成功",
          type: "success",
          plain: true,
          customClass: "form-message",
          duration: 1500
        });
        //先将表单隐藏不可用 然后再执行动画归位
        setTimeout(function () {
          isDisabledTeleport.value = !isDisabledTeleport.value;
          closeAddModel();
        }, 1000);
        //再重置表单可用
        setTimeout(function () {
          isDisabledTeleport.value = !isDisabledTeleport.value;
        }, 1000);
        emits('addRecord');
      } else {
        ElMessage({
          message: "请检查表单内容",
          type: "warning",
          plain: true,
          customClass: "form-message",
          duration: 1500
        });
        return;
      }
    })
  }
}

function fixOverdueAt(value: number) {
  if (value != null) {
    props.data.overdueAt = value + 86400 - 1;
  }
}

/*规则*/
const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<typeof props.data>>({
  produceAt: [{
    required: true, validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('请输入生产时间'));
      }
      if (props.data.overdueAt != null && props.data.overdueAt != 0 && value > props.data.overdueAt) {
        callback(new Error('生产日期必须小于过期时间'));
      } else if (props.data.buyAt != null && props.data.buyAt != 0 && value > props.data.buyAt) {
        callback(new Error('生产日期必须小于购买日期'));
      } else {
        callback();
      }
    }, trigger: 'change'
  }],
  overdueAt: [{
    required: true, validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('请输入过期时间'));
      }
      if (props.data.produceAt != null && props.data.produceAt != 0 && value < props.data.produceAt) {
        callback(new Error('过期时间必须大于生产日期'));
      } else if (props.data.buyAt != null && props.data.buyAt != 0 && value < props.data.buyAt) {
        callback(new Error('过期时间必须大于购买日期'));
      } else {
        callback();
      }
    }, trigger: 'change'
  }],
  buyAt: [{
    required: true, validator: (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('请输入购买时间'));
      }
      if ((props.data.produceAt != null && props.data.produceAt != 0 && value < props.data.produceAt) || (props.data.overdueAt != null && props.data.overdueAt != 0 && value > props.data.overdueAt)) {
        callback(new Error('购买日期必须大于等于生产日期，且小于过期时间'));
      } else {
        callback();
      }
    }, trigger: 'change'
  }],
  goodsName: [
    {required: true, message: '物品名称未填写', trigger: 'blur'},
  ]
})

</script>

<template>
  <Teleport v-if="isDisabledTeleport" to="body">
    <transition mode="out-in"
                name="slide-and-grow">
      <div v-if="isShow"
           class="model">
        <div class="container">
          <p class="addText">{{ isAddForm ? '新增' : '更新' }}</p>
          <el-form
              ref="ruleFormRef"
              :label-position="'right'"
              :model="data"
              :rules="rules"
              class="container-form"
              label-width="auto">
            <el-form-item label="物品名称" prop="goodsName">
              <el-input v-model="data.goodsName"
                        placeholder="请输入物品名称"
                        style="width:230px"/>
            </el-form-item>
            <el-form-item label="生产日期" prop="produceAt">
              <el-date-picker
                  v-model="data.produceAt"
                  :editable="false"
                  format="YYYY-MM-DD"
                  style="width:230px"
                  type="date"
                  value-format="x"
              />
            </el-form-item>
            <el-form-item label="过期时间" prop="overdueAt">
              <el-date-picker
                  v-model="data.overdueAt"
                  :editable="false"
                  editable:false
                  format="YYYY-MM-DD"
                  style="width:230px"
                  type="date"
                  value-format="x"
                  @change="fixOverdueAt"
              />
            </el-form-item>
            <el-form-item label="购买日期" prop="buyAt">
              <el-date-picker
                  v-model="data.buyAt"
                  :editable="false"
                  format="YYYY-MM-DD"
                  style="width:230px"
                  type="date"
                  value-format="x"
              />
            </el-form-item>
            <el-form-item label="分类">
              <el-select
                  v-model="data.goodsTypes"
                  :max-collapse-tags="2"
                  collapse-tags
                  collapse-tags-tooltip
                  filterable
                  multiple
                  placeholder="Select"
                  style="width: 230px"
                  value-key="id"
              >
                <el-option
                    v-for="item in selectGoodsTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="bottom-btn">
            <button
                class="bottom-btn-cancel"
                @click="closeAddModel">
              <span>等一下!</span>
            </button>
            <Button2 :text="isAddForm?'记录':'更新'"
                     class="bottom-btn-confirm"
                     @click="addConfirmed(ruleFormRef)">
            </Button2>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@import "form.scss";
</style>