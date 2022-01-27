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
      <div>使用自定义组件</div>
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
import mentions from './components/mentions/index.vue';

export default {
  name: 'App',
  components: {
    mentions,
  },
  data() {
    return {
      value1: '',
      value2: '',
      options: [
        {
          label: '123',
          value: '123'
        },
        {
          label: '234',
          value: '234'
        },
        {
          label: '2341',
          value: '2341'
        },
        {
          label: '2342',
          value: '2342'
        },
        {
          label: '2343',
          value: '2343'
        },
        {
          label: '2344',
          value: '2344'
        },
        {
          label: '2345',
          value: '2345'
        },
        {
          label: '23431',
          value: '23431'
        },
        {
          label: '23441',
          value: '23441'
        },
        {
          label: '23451',
          value: '23451'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  margin-top: 50px;
}
</style>
