<template>
  <div>
    <div>labelCol</div>
    <a-slider v-model:value="mValue" :min="0" :max="24" @change="handleSliderChange" />
    <a-space direction="vertical">
      <a-row>
        <a-col :span="4">xs</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'labelCol', 'xs')"
            v-model:value="colObj.labelCol.xs"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">sm</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'labelCol', 'sm')"
            v-model:value="colObj.labelCol.sm"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">md</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'labelCol', 'md')"
            v-model:value="colObj.labelCol.md"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">lg</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'labelCol', 'lg')"
            v-model:value="colObj.labelCol.lg"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">xl</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'labelCol', 'xl')"
            v-model:value="colObj.labelCol.xl"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">xxl</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'labelCol', 'xxl')"
            v-model:value="colObj.labelCol.xxl"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
    </a-space>
    <div>wrapperCol</div>
    <a-space direction="vertical">
      <a-row>
        <a-col :span="4">xs</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'wrapperCol', 'xs')"
            v-model:value="colObj.wrapperCol.xs"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">sm</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'wrapperCol', 'sm')"
            v-model:value="colObj.wrapperCol.sm"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">md</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'wrapperCol', 'md')"
            v-model:value="colObj.wrapperCol.md"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">lg</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'wrapperCol', 'lg')"
            v-model:value="colObj.wrapperCol.lg"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">xl</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'wrapperCol', 'xl')"
            v-model:value="colObj.wrapperCol.xl"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">xxl</a-col>
        <a-col :span="16">
          <a-Input-number
            @change="handleInputNumberChange($event, 'wrapperCol', 'xxl')"
            v-model:value="colObj.wrapperCol.xxl"
            :min="0"
            :max="24"
          />
        </a-col>
      </a-row>
    </a-space>
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue';
  const emits = defineEmits(['update:value', 'change']);
  const mValue = ref(4);
  const colObj = reactive({
    labelCol: {
      xs: 4,
      sm: 4,
      md: 4,
      lg: 4,
      xl: 4,
      xxl: 4,
    },
    wrapperCol: {
      xs: 20,
      sm: 20,
      md: 20,
      lg: 20,
      xl: 20,
      xxl: 20,
    },
  });
  const handleSliderChange = (value) => {
    colObj.labelCol.xs = value;
    colObj.labelCol.sm = value;
    colObj.labelCol.md = value;
    colObj.labelCol.lg = value;
    colObj.labelCol.xl = value;
    colObj.labelCol.xxl = value;
    colObj.wrapperCol.xs = 24 - value;
    colObj.wrapperCol.sm = 24 - value;
    colObj.wrapperCol.md = 24 - value;
    colObj.wrapperCol.lg = 24 - value;
    colObj.wrapperCol.xl = 24 - value;
    colObj.wrapperCol.xxl = 24 - value;
    emits('update:value', colObj);
    emits('change', colObj);
  };
  const handleInputNumberChange = (value, col, type) => {
    colObj[col][type] = value;
    if (col == 'labelCol') {
      colObj['wrapperCol'][type] = 24 - value;
    } else {
      colObj['labelCol'][type] = 24 - value;
    }
    emits('update:value', colObj);
    emits('change', colObj);
  };
</script>
