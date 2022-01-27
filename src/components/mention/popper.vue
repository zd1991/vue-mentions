<template>
  <div class="popper-list" :style="{...position}">
    <template v-for="(item, index) in internalOptions">
      <div
        :key="item.value"
        :class="{
          'popper-list-item': true,
          'selected': selectedIndex === index,
        }"
        @mouseover="() => handleMouseenter(index)"
        @click="() => handleClick(index)"
    >{{ item.label }}</div>
    </template>
  </div>
</template>

<script>
import { keyMap } from './util';

export default {
  props: {
    visible: Boolean,
    keyword: String,
    options: Array,
    position: Object,
    // TODO filter
    filter: {
      type: Function,
    //   default: (options, keyword) => {
    //     return options.filter(({ label, value }) => (  
    //         label.includes(keyword)
    //         || value.includes(keyword)
    //       )
    //     )
    //   }
    },
  },
  data() {
    return {
      selectedIndex: 0,
    }
  },
  computed: {
    internalOptions() {
      return this.options.filter(
        ({ label, value }) => (  
          label.includes(this.keyword)
          || value.includes(this.keyword)
        )
       )
    }
  },
  watch: {
    visible() {
      this.selectedIndex = 0;
    },
    internalOptions() {
      this.selectedIndex = 0;
    },
  },
  methods: {
    handleMouseenter(index) {
      this.selectedIndex = index;
    },
    handleClick() {
      const selectedItem = this.internalOptions[this.selectedIndex];
      this.$emit('selected', selectedItem);
    },
    changeSelected(direction) {
      // TODO 移动滚动条
      switch (direction) {
        case keyMap.ARROWDOWN:
          if (this.selectedIndex !== this.internalOptions.length) {
            this.selectedIndex++;
          }
          break;
        
        case keyMap.ARROWUP:
          if (this.selectedIndex !== 0) {
            this.selectedIndex--;
          }
          break;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.popper-list {
  position: absolute;
  cursor: pointer;
  min-width: 85px;
  min-height: 100px;
  max-height: 150px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  overflow-y: auto;
  &-item {
    padding: 0px 4px 2px;
    line-height: 30px;
    font-size: 13px;
  }
  .selected {
    color: #409eff;
    background-color: #ecf5ff;
  }
}
</style>