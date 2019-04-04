<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <Tree></Tree>
  </div>
</template>

<script>
import Tree from './components/Tree.vue';

export default {
  components: { Tree },
  data() {
    return {
      msg: 'Tree List Component'
    }
  }
}
</script>

<style>
h1 {
  color: rgb(91, 168, 187);
  text-align: center;
}
</style>