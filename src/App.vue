<template>
  <div id="app">
    <mention :rows="4" :options="options" />
  </div>
</template>

<script>
import mention from './components/mention/index.vue'

export default {
  name: 'App',
  components: {
    mention
  },
  data() {
    return {
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
