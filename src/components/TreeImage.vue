<template>
  <img v-bind:src="src"/>
</template>

<script>
export default {
  props: {
    file: File
  },
  data() {
    return {
      src: null
    }
  },
  created: function() {
    const reader = new FileReader();

    reader.onloadend = (function(scope) {
      let parentComponent = scope;
      return function() {
        parentComponent.src = reader.result;
      }
    }(this));
    reader.onabort = function() {
      console.error("aborted");
    };
    reader.onerror = function() {
      console.error("error");
    };

    reader.readAsDataURL(this.file);       
  }
}
</script>

<style>
</style>