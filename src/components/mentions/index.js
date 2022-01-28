import mentions from './src/index.vue';

mentions.install = function(Vue) {
  Vue.component(mentions.name, mentions);
};

export default mentions;