<template>
  <a-card>
    <template #title>表单不存在！</template>
    <a-list :header="null">
      <a-list-item
        ><a-tag
          >可通过流程设计行操作“设计”（右键->实例启动表单）修改流程属性（注：只有配置为元数据表单才可在线设计）</a-tag
        ></a-list-item
      >
      <a-list-item
        ><a-tag
          >如果为开发表单，可参考views/wf/processDefine/wfForm/leaveWfForm.vue，增加**WfForm.vue文件</a-tag
        ></a-list-item
      >
      <a-list-item
        ><a-tag>如果为元数据表单，可通过流程设计行操作“表单设计”进行在线设计</a-tag></a-list-item
      >
    </a-list>
  </a-card>
</template>
<script setup></script>
