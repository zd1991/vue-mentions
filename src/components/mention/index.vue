<template>
  <div class="mention-wraper">
    <textarea
      ref="textarea"
      class="mention-editor"
      :placeholder="placeholder"
      v-model="internalValue"
      @input="handleInput"
      @keydown="keydown"
    />

    <popper
      v-show="showPopper"
      :options="options"
      :keyword="keyword"
      :position="popperPosition"
      @select="handleSelected"
    />
  </div>
</template>

<script>
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
      default: '请输入',
    },
    suffix: {
      type: String,
      default: ' ',
    },
    // 候选列表
    options: {
      type: Array,
      default: () => [{
        label: '123',
        value: '123'
      }]
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
      // TODO
      popperPosition: { left: '200px' },
    };
  },
  methods: {
    // 设置光标位置
    setSelectionRange(postion) {
      this.$nextTick(() => {
        setSelectionRange(this.textarea, postion, postion);
      });
    },

    getSelectedItem(str) {
      for (let i = 0; i < this.options.length; i++) {
        const { label } = this.options[i];
        if (label && str.endsWith(`@${label}${this.suffix}`)) {
          return label
        }
      }
      return null;
    },

    deleteAtContent() {
      // 获取光标结束位置
      const selectionEnd = this.textarea.selectionEnd;
      let prefix = this.internalValue.substring(0, selectionEnd);
      const selectedItem = this.getSelectedItem(prefix);

      if (selectedItem) {
        event.preventDefault();
        event.stopPropagation();
        // 计算要要删除子窜的长度
        const length = `@${selectedItem}${this.suffix}`.length;
        this.internalValue = prefix.substring(0, selectionEnd - length) + this.internalValue.substring(selectionEnd);
        this.setSelectionRange(selectionEnd - length);
      }
    },

    openPopper() {
      this.showPopper = true;
      this.atPosition = this.internalValue.length;
    },

    closePopper() {
      this.showPopper = false;
      this.atPosition = 0;
      this.keyword = '';
    },

    // 监听按键
    keydown(event) {
      switch (event.key) {
        case keyMap.BACKSPACE:
          this.deleteAtContent()
          break;

        case keyMap.ESCAPE:
          this.closePopper();
          break;
      }
    },

    // TODO 计算列表位置
    calcPopperPosition() {},

    // 输入
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
        this.keyword = this.internalValue.substring(this.atPosition)
      }
    },
    
    // TODO
    handleSelected() {}
  },
  created() {
    this.internalValue = this.value;
  },
  mounted() {
    this.textarea = this.$refs.textarea;
  }
};
</script>

<style>
.mention-wraper {
  position: relative;
}
.mention-editor {
  padding: 8px;
  width: 500px;
  outline: none;
  border-radius: 3px;
  border: 1px solid #aaa
}
</style>