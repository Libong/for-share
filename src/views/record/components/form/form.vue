<script lang="ts" setup>

import {computed, PropType, reactive, ref, watch} from "vue";
import {IRecord, Label} from "@/api/proto/recordinterface";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import Button2 from "@/components/common/button/Button2.vue";
import SwitchIcon from "@/assets/switch.svg";
import {calculateShelfLife} from "@/tool/tool";

let props = defineProps({
  data: {
    type: Object as PropType<IRecord>,
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
const emits = defineEmits<{
  (event: 'update:isShow', value: boolean): void;
  (event: 'addRecord', callback: () => void): void;
  (event: 'updateRecord', callback: () => void): void;
}>();

const closeAddModel = () => {
  emits('update:isShow', !props.isShow);
};

/*过期时间*/
//选择的保质期类型
const selectDateType = ref("");
//选择的保质期时长
let selectDateNum = ref(0);

const overdueDataIsDate = ref(false);

//将过期时间转为保质期
watch(() => props.data.overdueAt, (newVal) => {
  if (props.data.overdueAt != 0 && props.data.produceAt != 0) {
    let shelfLife = calculateShelfLife(props.data.produceAt, props.data.overdueAt);
    selectDateNum.value = shelfLife.Num;
    selectDateType.value = shelfLife.DateType;
  }
});


function overdueItemSwitch() {
  overdueDataIsDate.value = !overdueDataIsDate.value;
}

/*过期时间更正为当日的最后一秒*/
function fixOverdueAt(value: number) {
  if (value != null) {
    props.data.overdueAt = value + 86400 - 1;
  }
}

const DateTypeSelectList = [
  {
    value: "年",
    label: "年",
  }, {
    value: "月",
    label: "月",
  }, {
    value: "日",
    label: "日",
  }
]
/*表单规则*/
const ruleFormRef = ref<FormInstance>();
const isFormConfirming = ref(false);

//TODO 很怪validateField调用后会将对应的规则的callback中的new Error作为reject返回 然后被全局捕获
async function validateSingleField(propName: string) {
  try {
    await ruleFormRef.value?.validateField(propName);
  } catch (err) {
  }
}

const formConfirmed = async (formEl: FormInstance | undefined) => {
  if (formEl) {
    isFormConfirming.value = true;
    //执行所有校验
    await formEl.validate((valid, fields) => {
      isFormConfirming.value = false;
      if (valid) {
        const callback = () => {
          //先将表单隐藏不可用 然后再执行动画归位
          isDisabledTeleport.value = !isDisabledTeleport.value;
          closeAddModel();
          //再重置表单可用
          setTimeout(function () {
            isDisabledTeleport.value = !isDisabledTeleport.value;
          }, 500);
        }
        if (props.isAddForm) {
          emits('addRecord', callback);
        } else {
          emits('updateRecord', callback);
        }
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
//blur 失焦时触发一次 change内容修改时触发一次
const rules = computed(() => {
  let ruleRef = reactive<FormRules>({
    produceAt: [{
      required: true, validator: (rule: any, value: any, callback: any) => {
        let isValid = true;
        let message = "";
        if (!value) {
          isValid = false;
          message = '请选择生产时间';
        }
        if (props.data.overdueAt != null && props.data.overdueAt != 0 && value > props.data.overdueAt) {
          isValid = false;
          message = '生产日期必须小于过期时间';
        } else if (props.data.buyAt != null && props.data.buyAt != 0 && value > props.data.buyAt) {
          isValid = false;
          message = '生产日期必须小于购买日期';
        }

        if (!isValid && isFormConfirming.value) {
          callback(new Error(message));
          return;
        }
        callback();
      }
    }],
    buyAt: [{
      required: true, validator: (rule: any, value: any, callback: any) => {
        let isValid = true;
        let message = "";
        if (!value) {
          isValid = false;
          message = '请选择购买时间';
        }
        if (props.data.produceAt != null && props.data.produceAt != 0 && value < props.data.produceAt) {
          isValid = false;
          message = '购买日期必须大于等于生产日期';
        }
        if (props.data.overdueAt != null && props.data.overdueAt != 0 && value > props.data.overdueAt) {
          isValid = false;
          message = '购买日期必须小于过期时间';
        }
        if (!isValid && isFormConfirming.value) {
          callback(new Error(message));
          return;
        }
        callback();
      }
    }],
    goodsName: [
      {
        required: true, validator: (rule: any, value: any, callback: any) => {
          if (!value && isFormConfirming.value) {
            callback(new Error("请输入物品名称"));
            return;
          }
          callback();
        }
      },
    ],
  })
  if (overdueDataIsDate.value) {
    ruleRef.overdueAt = [{
      required: true, validator: (rule: any, value: any, callback: any) => {
        let isValid = true;
        let message = "";
        if (!value) {
          isValid = false;
          message = '请选择过期时间';
        }
        if (props.data.produceAt != null && props.data.produceAt != 0 && value < props.data.produceAt) {
          isValid = false;
          message = '过期时间必须大于生产日期';
        } else if (props.data.buyAt != null && props.data.buyAt != 0 && value < props.data.buyAt) {
          isValid = false;
          message = '过期时间必须大于购买日期';
        }

        if (!isValid && isFormConfirming.value) {
          callback(new Error(message));
          return;
        }
        callback();
      }
    }]
  } else {
    ruleRef.overdueDuration = [
      {
        required: true, validator: (rule: any, value: any, callback: any) => {
          if (selectDateNum.value == 0 && isFormConfirming.value) {
            callback(new Error('请填写保质期时长'));
          }
          if (selectDateType.value == "" && isFormConfirming.value) {
            callback(new Error('请填写保质期类型'));
          }
          if (props.data.produceAt == 0 && isFormConfirming.value) {
            callback(new Error('请先填写生产日期'));
          }
          const date = new Date(props.data.produceAt);
          console.log(selectDateType.value);
          switch (selectDateType.value) {
            case "年":
              props.data.overdueAt = new Date(date.setFullYear(date.getFullYear() + selectDateNum.value)).getTime();
              break
            case "月":
              props.data.overdueAt = new Date(date.setMonth(date.getMonth() + selectDateNum.value)).getTime();
              break
            case "日":
              props.data.overdueAt = new Date(date.setDate(date.getDate() + selectDateNum.value)).getTime();
          }
          callback();
        }, trigger: []
      }
    ];
  }
  return ruleRef
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
            <el-form-item
                label="物品名称"
                prop="goodsName"
                @input="validateSingleField('goodsName')"
            >
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
            <el-form-item v-if="overdueDataIsDate" label="过期时间" prop="overdueAt">
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
              <img :src="SwitchIcon" alt="" class="switch-btn" @click="overdueItemSwitch">
            </el-form-item>
            <el-form-item v-if="!overdueDataIsDate" label="保质期" prop="overdueDuration">
              <el-input
                  v-model.number="selectDateNum"
                  style="width: 145px;"
                  type="number"
              />
              <el-select
                  v-model="selectDateType"
                  placeholder="单位"
                  style="width: 80px;margin-left: 5px"
              >
                <el-option
                    v-for="item in DateTypeSelectList"
                    :key="item.value"
                    :label=item.label
                    :value=item.value
                />
              </el-select>
              <img :src="SwitchIcon" alt="" class="switch-btn" @click="overdueItemSwitch">
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
                     @click="formConfirmed(ruleFormRef)">
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