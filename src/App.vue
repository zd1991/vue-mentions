<template>
  <div id="app">
    <div>
      <div>使用默认输入框</div>
      <div>value: {{ value1 }}</div>
    </div>
    <mentions
      :rows="4"
      :options="options"
      v-model="value1"
    />

    <div class="item">
      <div>使用自定义组件（需支持v-model)</div>
      <div>value: {{ value2 }}</div>
    </div>
    <mentions
      v-model="value2"
      :options="options"
      :rows="4"
      :extraProps="{
        type: 'textarea',
        style: {
          width: '500px'
        }
      }"
    >
      <template v-slot:textarea="{ nativeInput, nativeKeydown, ...otherProps }">
        <el-input
          v-model="value2"
          v-bind="otherProps"
          @input.native="nativeInput"
          @keydown.native="nativeKeydown"
        />
      </template>
    </mentions>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: '',
      value2: '',
      options: [
        {
          url: '',
          label: 'username1',
          value: 'username1'
        },
        {
          url: '',
          label: 'username2',
          value: 'username2'
        },
        {
          url: '',
          label: 'username3333',
          value: 'username3333'
        },
        {
          url: '',
          label: 'username4',
          value: 'username4'
        },
        {
          url: '',
          label: 'username5',
          value: 'username5'
        },
        {
          url: '',
          label: 'username6',
          value: 'username6'
        },
        {
          url: '',
          label: 'username7',
          value: 'username7'
        },
        {
          url: '',
          label: 'username8',
          value: 'username8',
          disabled: true
        },
        {
          url: '',
          label: 'username9',
          value: 'username9'
        },
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  margin-top: 70px;
}
</style>
