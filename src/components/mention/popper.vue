<template>
  <div class="popper-wraper" :style="{...position}">
    <template v-for="item in internalOptions">
      <div :key="item.value">{{ item.label }}</div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    keyword: String,
    filter: Function,
    options: Array,
    position: Object,
  },
  computed: {
    internalOptions() {
      return this.options.filter(({ label, value }) => label.includes(this.keyword) || value.includes(this.value));
    }
  }
}
</script>

<style scoped>
.popper-wraper {
    position: absolute;
    min-width: 85px;
    min-height: 50px;
    max-height: 150px;
    border: 1px solid #aaa
}
</style>