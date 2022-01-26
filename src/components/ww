<template>
  <div>
    <textarea
      class="textarea"
      ref="textarea"
      :placeholder="placeholder"
      v-model="value"
      @keydown.capture="handleKeydown"
    />
  </div>
</template>

<script>
export default {
  name: 'mention',
  props: {
    placeholder: {
      type: String,
      default: '请输入',
    }
  },
  data() {
    return {
      value: '',
    }
  },
  methods: {
    /**
     * 模拟删除行为
     */
    handleDelete(event) {
      // 禁止默认行为
      event.preventDefault();
      // event.stopPropagation()

      // const prevText = this.value;


      // 1、获取光标位置
      // 2、获取`起止`位置。拼接 ` @xxxx `，通过判断endWiths
      // 3、subString

      // 1、删除` @内容 `
      // 2、更新 value

      const names = ['123'];


      // 获取光标位置
      const selectionStart = this.$refs.textarea.selectionStart;
      const selectionEnd = this.$refs.textarea.selectionEnd;
      

      // 存在选中区域
      if (selectionStart !== selectionEnd) {
        this.value = this.value.substring(0, selectionStart) + this.value.substring(selectionEnd);
        return;
      } 


      // TODO 设置光标位置

      

      let subString = this.value.substring(0, selectionEnd);

      console.log(selectionEnd, subString, subString.length, selectionStart);

      if (subString.length > 0) {
        // 判断最后

        const isSelectedName = (names, str) => {
          let result = null;
          for (let index = 0; index < names.length; index++) {
            const name = names[index];
            if (str.endsWith(`@${name}`)) {
              result = name;
              break;
            }
          }
          return result;
        }

        // 删除被@的人
        const name = isSelectedName(names, subString)
        if (name) {
          subString = subString.substring(0, subString.length - name.length - 1)
        } else {
          subString = subString.substring(0, subString.length - 1);
        }
        this.value = subString + this.value.substring(selectionEnd);
        console.log(this.$refs.textarea.getSelectionRange)
        // setTimeout(() => {
        //   this.$refs.textarea.setSelectionRange(selectionEnd, selectionEnd - 1)
        // })
      }
    },
    handleKeydown(event) {
      const { keyCode } = event;

      switch (keyCode) {
        // delete
        case 8:
          // 删除时，触发
          this.handleDelete(event)
          break;
        default:
          break;
      }
    }
  },
}
</script>

<style scoped>
.textarea {
  /* letter-spacing: 1px; */
}
</style>
