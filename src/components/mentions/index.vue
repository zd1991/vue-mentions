<template>
  <div class="mention-wraper">
    <slot
      name="textarea"
      v-bind="{
        ...extraProps,
        rows,
        placeholder,
        nativeInput: handleInput,
        nativeKeydown: handleKeydown,
      }"
    >
      <textarea
        class="mention-editor"
        v-model="internalValue"
        v-bind="extraProps"
        :placeholder="placeholder"
        :rows="rows"
        @input="handleInput"
        @keydown="handleKeydown"
      />
    </slot>

    <popper
      ref="popper"
      v-show="showPopper"
      :visible="showPopper"
      :options="options"
      :keyword="keyword"
      :position="popperPosition"
      @selected="handleSelected"
    />
  </div>
</template>

<script>
import getCaretCoordinates from 'textarea-caret';
import popper from './popper.vue'; 
import { keyMap, setSelectionRange } from './util';

export default {
  name: 'mentions',
  components: {
    popper,
  },
  props: {
    // 绑定数据
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    rows: {
      type: Number,
      default: 2,
    },
    extraProps: {
      type: Object,
      default: () => ({}),
    },
    suffix: {
      type: String,
      default: ' ',
    },
    offset: {
      type: Object,
      default: () => ({
        top: 15,
        left: 4,
      }),
    },
    // 候选列表
    options: {
      type: Array,
      default: () => []
    },
    filter: Function,
  },
  data() {
    return {
      textarea: null,
      showPopper: false,
      atPosition: 0,
      internalValue: '',
      keyword: '',
      popperPosition: {},
    };
  },
  watch: {
    value(val) {
      this.internalValue = val;
    },
  },
  methods: {
    /**
     * 计算候选列表位置
     */
    calcPopperPosition() {
      const { top, left } = getCaretCoordinates(this.textarea, this.textarea.selectionEnd);
      const { top: topOffset, left: leftOffset } = this.offset
      this.popperPosition = { top: `${top + topOffset}px`, left: `${left + leftOffset}px` };
    },
    /**
     * 设置光标位置
     */
    setSelectionRange(postion) {
      this.$nextTick(() => {
        setSelectionRange(this.textarea, postion, postion);
      });
    },
    /**
     * 提取输入框内容中的候选信息
     */
    getSelectedItem(str) {
      for (let i = 0; i < this.options.length; i++) {
        const { label } = this.options[i];
        if (label && str.endsWith(`@${label}${this.suffix}`)) {
          return label
        }
      }
      return null;
    },
    /**
     * 删除`@`内容
     */
    deleteAtContent(event) {
      // 获取光标结束位置
      const selectionEnd = this.textarea.selectionEnd;
      let prefixStr = this.internalValue.substring(0, selectionEnd);
      const selectedItem = this.getSelectedItem(prefixStr);

      if (selectedItem) { // 删除 @xxx 内容
        event.preventDefault();
        event.stopPropagation();
        this.setSelectionRange(selectionEnd - length);
        this.showPopper && this.closePopper();

        // 计算要要删除子窜的长度
        const length = `@${selectedItem}${this.suffix}`.length;
        this.internalValue = prefixStr.substring(0, selectionEnd - length)
          + this.internalValue.substring(selectionEnd);
        
      } else if ( // 删除 @ 字符
        this.showPopper
        && selectionEnd
        && this.internalValue.substring(selectionEnd - 1, selectionEnd) === '@'
      ) {
        this.closePopper();
      }
      // v-model
      this.$emit('input', this.internalValue);
    },
    /**
     * 打开候选列表
     */
    openPopper() {
      this.showPopper = true;
      this.atPosition = this.internalValue.length;
    },
    /**
     * 关闭候选列表
     */
    closePopper() {
      this.showPopper = false;
      this.atPosition = 0;
      this.keyword = '';
    },
    /**
     * 监听按键
     */
    handleKeydown(event) {
      switch (event.key) {
        // 删除
        case keyMap.BACKSPACE:
          this.deleteAtContent(event);
          break;

        // esc
        case keyMap.ESCAPE:
          if (this.showPopper) {
            this.closePopper();
            event.preventDefault();
            event.stopPropagation();
          }
          break;

        // 回车
        case keyMap.ENTER:
          if (this.showPopper) {
            this.$refs.popper.handleClick();
            event.preventDefault();
            event.stopPropagation();
          }
          break;

        // 上、下箭头
        case keyMap.ARROWDOWN:
        case keyMap.ARROWUP: 
          if (this.showPopper) {
            this.$refs.popper.changeSelected(event.key);
          }
          break;
      }
    },
    /**
     * 处理输入事件
     */
    handleInput(event) {
      if (event.inputType) {
        // 获取本次输入内容
        if (event.data === '@') {
          // @ 前的字符
          const prevChar = this.internalValue.charAt(this.internalValue.length - 2);
          if (!(/^[a-z0-9]$/i.test(prevChar))) {
            this.openPopper();
          }
        }

        // 输入空格隐藏 popper
        if (this.showPopper && event.data === ' ') {
          this.closePopper();
        }
      }

      // 当打开popper记录keyword用于筛选
      if (this.showPopper) {
        this.keyword = this.internalValue.substring(this.atPosition);
        this.calcPopperPosition();
      }

      this.$emit('input', this.internalValue);
    },
    /**
     * 处理选中事件
     */
    handleSelected(data) {
      if (this.showPopper) {
        const { label } = data;
        const subStr = this.internalValue.substring(0, this.atPosition - 1);
        const temp = `@${label}${this.suffix}`;
        this.internalValue = subStr + temp;
        this.setSelectionRange(this.atPosition + temp.length)
        this.closePopper();

        // v-model
        this.$emit('input', this.internalValue);
      }
    }
  },
  created() {
    this.internalValue = this.value;
  },
  mounted() {
    this.textarea = this.$el.querySelector('input') || this.$el.querySelector('textarea');
    // 避免抖动
    this.calcPopperPosition();
  }
};
</script>

<style lang="less" scoped>
.mention-wraper {
  position: relative;
  .mention-editor {
    padding: 8px;
    width: 500px;
    outline: none;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    &:focus {
      border: 1px solid #409eff;
    }
  }
}
</style>