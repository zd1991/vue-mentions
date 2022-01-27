<template>
  <div class="mention-wraper">
    <textarea
      ref="textarea"
      class="mention-editor"
      v-model="internalValue"
      :placeholder="placeholder"
      :rows="rows"
      @input="handleInput"
      @keydown="handleKeydown"
    />

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
  name: 'mention',
  components: {
    popper,
  },
  props: {
    // 绑定数据
    value: String,
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    rows: {
      type: Number,
      default: 2,
    },
    suffix: {
      type: String,
      default: ' ',
    },
    offset: {
      type: Number,
      default: 4,
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
  methods: {
    /**
     * 计算候选列表位置
     */
    calcPopperPosition() {
      const { top, left } = getCaretCoordinates(this.textarea, this.textarea.selectionEnd);
      this.popperPosition = { top: `${top}px`, left: `${left + this.offset}px` };
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

      // 删除 @xxx 内容
      if (selectedItem) {
        event.preventDefault();
        event.stopPropagation();
        // 计算要要删除子窜的长度
        const length = `@${selectedItem}${this.suffix}`.length;
        this.internalValue = prefixStr.substring(0, selectionEnd - length)
          + this.internalValue.substring(selectionEnd);
        this.setSelectionRange(selectionEnd - length);
        this.showPopper && this.closePopper();
        return;
      }
      // 删除 @ 字符
      if (
        this.showPopper
        && selectionEnd
        && this.internalValue.substring(selectionEnd - 1, selectionEnd) === '@'
      ) {
        this.closePopper();
        return;
      }
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
      }

      // 当打开popper记录keyword用于筛选
      if (this.showPopper) {
        this.keyword = this.internalValue.substring(this.atPosition);
        this.calcPopperPosition();
      }
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
      }
    }
  },
  created() {
    this.internalValue = this.value;
  },
  mounted() {
    this.textarea = this.$refs.textarea;
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
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    &:focus {
      border: 1px solid #409eff;
    }
  }
}

</style>