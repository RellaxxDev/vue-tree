<template>
  <div class="Tree">
    <input type="file" id="filepicker" name="fileList" multiple directory webkitdirectory mozdirectory v-on:change="openFolder"/>
    <ul v-if="!!structure && !!Object.keys(structure).length"
        v-on:click="toggleItem"
        class="container"
    >
      <TreeNode :nodeItem="Object.values(structure)[0]"
                :isFolder="true"
      ></TreeNode>
    </ul>
  </div>  
</template>

<script>

  import TreeNode from './TreeNode.vue';

  export default {
    components: { TreeNode },
    data () {
      return {
        structure: null
      }
    },
    methods: {
      openFolder: gettingStructure,
      toggleItem: tree_toggle
    }
  }

  // подготовка структуры для отрисовки дерева
  function gettingStructure(e) {
    this.structure = {};
    let files = Array.from(e.target.files);

    files.forEach((file, index) => {
      let paths = file.webkitRelativePath.split('/').slice(0, -1);
      let parentFolder = null;

      paths.forEach(path => {
        if (!parentFolder) {
          if (!this.structure[path]) {
            this.structure[path] = {
              name: path,
              root: true,
              folders: {},
              files: []
            };
          }

          parentFolder = this.structure[path];

        } else {
          if (!parentFolder.folders[path]) {
            parentFolder.folders[path] = {
              name: path,
              root: false,
              folders: {},
              files: []
            }
          }

          parentFolder = parentFolder.folders[path];
        }
      });
      
      parentFolder.files.push(file);

    });

    console.log(this.structure);
  }

  // клик на элементах дерева. Сворачивание/разворачивание
  function tree_toggle(event) {
    event = event || window.event;
    let clickedItem = event.target || event.srcElement; // srcElement - IE support

    if ( !hasClass(clickedItem, 'expand') ) return; // клик не там

    var node = clickedItem.parentNode;
    if ( hasClass(node, 'leaf') ) return; // клик на листе

    var newClass = hasClass(node, 'opened') ? 'closed' : 'opened';

    // жуткий регексп, разбирает открыт или закрыт элемент node
    var reg = /(^|\s)(opened|closed)(\s|$)/;  
    node.className = node.className.replace(reg, '$1' + newClass + '$3');
  }

  function hasClass(el, className) {
    return new RegExp( "(^|\\s)" + className + "(\\s|$)" ).test(el.className);
  }

</script>

<style>
</style>