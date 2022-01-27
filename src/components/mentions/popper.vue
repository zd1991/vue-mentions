<template>
  <div ref="popper" class="popper-list" :style="{...computedStyle}">
    <template v-if="internalOptions.length">
      <div
        v-for="(item, index) in internalOptions"
        :key="item.value"
        :class="{
          'popper-list-item': true,
          'selected': !item.disabled && selectedIndex === index,
          'disabled': item.disabled
        }"
        @mouseover="() => handleMouseover(index)"
        @mousedown="($event) => handleClick($event)"
      >
        <img :src="item.url"/>
        <span>{{ item.label }}</span>
      </div>
    </template>

    <div v-else class="popper-list-empty">暂无数据</div>
  </div>
</template>

<script>
import { keyMap, scrollIntoView } from './util';

export default {
  props: {
    visible: Boolean,
    keyword: String,
    // 距视口顶部距离
    topPoint: {
      type: Number,
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
    },
    position: {
      type: Object,
      required: true,
    },
    offset: {
      type: Object,
      default: () => ({}),
    },
    filter: {
      type: Function,
      default: (keyword) => {
        return ({ label, value }) => (  
          label.includes(keyword) ||
          value.includes(keyword)
        )
      }
    },
  },
  data() {
    return {
      selectedIndex: -1,
      computedStyle: { top: '0px' },
    }
  },
  computed: {
    internalOptions() {
      const filter = this.filter(this.keyword);
      return this.options.filter(filter);
    },
  },
  watch: {
    visible() {
      this.getDefaulStelectedIndex();
    },
    internalOptions() {
      this.getDefaulStelectedIndex();
    },
    // 光标位置发生变化时，需重新计算样式
    position(val) {
      this.visible && this.calcPosition(val);
    }
  },
  methods: {
    /**
     * 计算popper位置
     */
    calcPosition({ top, left }) {
      // popper的宽、高及距离视口左侧的距离
      const { width, height } = this.$refs.popper.getBoundingClientRect();
      // 偏移量
      const { top: topOffset, left: leftOffset } = this.offset;
      // 视口高度
      const clientHeight = document.documentElement.clientHeight;
      const clientWidth = document.documentElement.clientWidth;

      // popper 是否向上
      const isUp = this.topPoint + top + topOffset + height + 5 > clientHeight
        && height + 20 < this.topPoint;

      // popper 是否向右
      const isRight = left + leftOffset + width + 5 < clientWidth;

      this.computedStyle = {
        top: isUp ? 'auto' : `${top + topOffset}px`,
        bottom: isUp ? '90px' : 'auto',
        left: isRight ? `${left + leftOffset}px` : 'auto',
        // 视口宽度 - left
        right: isRight ? 'auto' : `${clientWidth - left}px`
      };
    },
    /**
     * 滚动到可视区域
     */
    scrollIntoView() {
      this.$nextTick(() => {
        scrollIntoView(this.$el.querySelector('.selected'));
      });
    },
    /**
     * 获取默认选中索引
     */
    getDefaulStelectedIndex() {
      this.selectedIndex = this.internalOptions.findIndex(({ disabled }) => !disabled);
      this.scrollIntoView();
    },
    /**
     * 获取选中索引
     */
    getSelectedIndex(direction) {
      const optionsLength = this.internalOptions.length;
      const getCurrentIndex = (direction, length, index) => {
        let currentIndex = index;
        if (direction === keyMap.ARROWDOWN) {
          return ++currentIndex % length
        }
        // 保证结果正数
        return (--currentIndex + length) % length
      }
      // 计算下一次选中的元素及索引
      let currentIndex = this.selectedIndex;
      currentIndex = getCurrentIndex(direction, optionsLength, currentIndex);
      let currentItem = this.internalOptions[currentIndex];

      // 跳过 disabled
      while (currentItem.disabled) {
        currentIndex = getCurrentIndex(direction, optionsLength, currentIndex);
        currentItem = this.internalOptions[currentIndex];
      }

      return currentIndex;
    },
    /**
     * 上、下按键
     */
    changeSelected(direction) {
      this.selectedIndex = this.getSelectedIndex(direction);
      console.log('===>', this.selectedIndex);
      this.scrollIntoView();
    },
    /**
     * 鼠标事件
     */
    handleMouseover(index) {
      const { disabled } = this.internalOptions[index];
      if (!disabled) {
        this.selectedIndex = index;
      }
    },
    /**
     * 点击事件
     * 使用 mousedown 事件，click事件会使输入框失去焦点
     */
    handleClick(event) {
      const selectedItem = this.internalOptions[this.selectedIndex];

      if (!selectedItem.disabled) {
        this.$emit('selected', selectedItem);
      }

      event.preventDefault();
      event.stopPropagation();
    }
  }
}
</script>

<style lang="less" scoped>
.popper-list {
  position: absolute;
  z-index: 66;
  min-width: 85px;
  min-height: 30px;
  max-height: 150px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  overflow-y: auto;
  font-size: 13px;
  &-item {
    display: flex;
    padding: 0px 4px 2px;
    line-height: 30px;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    & > img {
      width: 25px;
      height: 25px;
      margin-right: 4px;
    }
  }
  &-empty {
    text-align: center;
    line-height: 30px;
  }
  .selected {
    color: #409eff;
    background-color: #ecf5ff;
  }
  .disabled {
    background-color: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
}
</style>