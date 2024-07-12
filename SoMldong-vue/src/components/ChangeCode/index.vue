<template>
  <div class="change-code-wrap">
    <a-select
      v-if="selectValueName"
      v-model:value="codeValue"
      @change="onChange"
      class="change-select-item"
      placeholder="请选择"
      :allowClear="allowClear"
      :disabled="disabled"
    >
      <a-select-option v-for="item in listData" :value="item.code" :key="item.code">
        {{ item.value }}
      </a-select-option>
    </a-select>
    <span v-else class="change-status">{{ changeLabel || '-' }}</span>
  </div>
</template>
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { selectData } from '/@/api/sys/dict';
  import { useCodeEnumStore } from '/@/store/modules/codeEmun';
  const props = defineProps({
    code: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    selectValueName: { type: String, default: '' },
    exclude: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    allowClear: { type: Boolean, default: true },
  });
  const emit = defineEmits(['selectValue', 'update:value', 'change']);

  const emunStore = useCodeEnumStore();

  let changeLabel = ref('');
  let listData = ref([]);
  let emum = null;
  let codeValue = ref(null);

  watch(
    () => props.value,
    (newCode) => {
      handleChangeValue(newCode);
      codeValue.value = String(newCode);
    },
  );
  watch(codeValue, (newCode) => {
    if (newCode == '' || newCode == 'null') {
      codeValue.value = undefined;
    }
  });
  onMounted(() => {
    getData();
    codeValue.value = props.value;
    if (props.value != -1) {
      handleChangeValue(props.value);
    }
  });

  const getData = () => {
    emum = emunStore.getCodeEnum;
    const lock = emunStore.getLockCode;
    if (lock.indexOf(props.code) == -1) {
      // 给组件store加锁，控制同时请求
      emunStore.setLockCode(props.code);
      // 请求接口，获取枚举值
      selectData(props.code)
        .then((res) => {
          const single = {
            code: props.code,
            list: res,
          };
          emunStore.setCodeEnum(single);
        })
        .catch(() => {
          emunStore.removeLockCode(props.code);
        });
    }
    // 如果存在枚举就直接转换
    if (emum[props.code]) {
      handleChangeValue(props.value);
    }
  };
  // 单个值转换
  const changeSingleCode = (changeValue) => {
    let code = '';
    if (changeValue == -1) {
      return code;
    }
    const emumList = emunStore.getCodeEnum[props.code];
    if (!Array.isArray(emumList) || emumList.length == 0) {
      return changeValue;
    }
    listData.value = emumList.filter((item) => {
      let bol = true;
      if (
        Array.isArray(props.exclude) &&
        props.exclude.length &&
        props.exclude.indexOf(item.code) > -1
      ) {
        bol = false;
      }
      return bol;
    });
    Array.isArray(emumList) &&
      emumList.forEach((single) => {
        if (changeValue == single.value) {
          code = single.label;
        }
      });
    // 将默认值加上，防止转换失败后显示空白，兜底
    return code || changeValue;
  };
  // 转换枚举值为对应的中文
  const handleChangeValue = (changeValue) => {
    let codes = [];
    // 如果是数组
    if (Array.isArray(changeValue) && changeValue.length) {
      codes = changeValue;
    } else if (changeValue && typeof changeValue == 'string') {
      codes = changeValue.split(',');
    } else {
      codes = [changeValue];
    }
    let changes = [];
    codes.forEach((item) => {
      changes.push(changeSingleCode(item));
    });
    changeLabel.value = changes.join('，');
  };

  // 监听store变化，接口回调后存入store将触发这个监听，对数据进行转换
  const subscribe = emunStore.$subscribe(
    (mutation, state) => {
      /*
      * mutation主要包含三个属性值：
      *   events：当前state改变的具体数据，包括改变前的值和改变后的值等等数据
      *   storeId：是当前store的id
      *   type：用于记录这次数据变化是通过什么途径，主要有三个分别是
      *         “direct” ：通过 action 变化的
                ”patch object“ ：通过 $patch 传递对象的方式改变的
                “patch function” ：通过 $patch 传递函数的方式改变的
      *
      * */
      // 我们就可以在此处监听store中值的变化，当变化为某个值的时候，去做一些业务操作之类的
      // console.log('mutation', mutation);
      // console.log('state', state);
      if (state.codeEnum[props.code]) {
        handleChangeValue(props.value);
        // 有值转换后，停止订阅
        subscribe(); //调用上方声明的变量值，示例（subscribe），即可以停止订阅
      }
    },
    { detached: false },
  );

  const onChange = (value) => {
    emit('selectValue', value);
    emit('update:value', value);
    emit('change', value);
  };
</script>
