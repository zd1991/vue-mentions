<template>
  <el-input />
</template>

<script>
export default {
  name: 'customizeInput',
  inheritAttrs: false,
  props: {
    value: 'String',
    default: '',
  },
  created() {
    console.log(this.$attrs);
  }
}
</script>