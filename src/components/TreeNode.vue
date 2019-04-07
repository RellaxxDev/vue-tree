<template>
  <li class="node"
      v-bind:class="{ 
        root: nodeItem.root,
        closed: isFolder,
        leaf: !isFolder        
      }"
  >
    <div class="expand"></div>
    <div class="content"
         v-bind:class="{ 'active-item':  currentActive === nodeItem.id }">
      <span>{{ nodeItem.name }}</span>
      <table v-if="!isFolder"
             class="table-desc"
      >
        <tbody>
          <tr>
              <td>Наименование:</td>
              <td>{{ nodeItem.name }}</td>
          </tr>
          <tr>
            <td>Дата изменения:</td>
            <td>{{ nodeItem.lastModifiedDate.getDate() + "."
                 + nodeItem.lastModifiedDate.getMonth() + "."
                 + nodeItem.lastModifiedDate.getFullYear() + " "
                 + nodeItem.lastModifiedDate.getMinutes() + ":"
                 + nodeItem.lastModifiedDate.getHours()
              }}</td>
          </tr>
          <tr v-if="nodeItem.type.includes('image')">
            <td colspan="2">
              <TreeImage :file="nodeItem"/>
            </td>
          </tr>
      </tbody>
      </table>
    </div>
    <ul v-if="isFolder && (!!Object.keys(nodeItem.folders).length || !!nodeItem.files.length)" class="container">
      <TreeNode v-for="childFolder in nodeItem.folders"
                :key="childFolder.id"
                :id="childFolder.id"
                :isFolder="true"
                :nodeItem="childFolder"
                :currentActive="sendActive"
      ></TreeNode>
      <TreeNode v-for="childFile in nodeItem.files"
                :key="childFile.id"
                :id="childFile.id"
                :isFolder="false"
                :nodeItem="childFile"
                :currentActive="sendActive"
      ></TreeNode>
    </ul>
  </li>
</template>

<script>

  import TreeImage from './TreeImage.vue';

  export default {
    name: 'TreeNode',
    props: {
      nodeItem: [ Object, File ],
      isFolder: Boolean,
      currentActive: Number
    },
    data() {
      return {
        sendActive: this.currentActive
      }
    },
    components: { TreeImage },
    watch: {
      currentActive: function(newVal, oldVal) {
        this.sendActive = newVal;
      }
    }
  }
</script>

<style>
  ul {
    padding: 0px;
    margin: 0px;
  }
  li {
    list-style-type: none;
  }
  .node {
    margin-left: 18px;
    zoom: 1;/* спецсвойство от багов IE6,7 */
    background-image: url('../images/long-line.gif');
    background-position: top left;
    background-repeat: repeat-y;
  }
  .last {
    background-image: url('../images/line.gif');
    background-repeat: repeat-y;
  }
  .root {
    margin-left: 0px;
  }
  .root.last {
    background-repeat: no-repeat;
  }
  .expand {
    width: 18px;
    height: 18px;
    float: left;
  }
  .content {
    display: inline-block;
    line-height: 0.8rem;
  }
  .opened .expand {
    background-image: url('../images/expand_minus.gif');
    cursor: pointer;
  }
  .closed .expand {
    background-image: url('../images/expand_plus.gif');
    cursor: pointer;
  }
  .leaf .expand {
    background-image: url('../images/expand_leaf.gif');
    cursor: auto;
  }
  .opened .container {
    display: block;
  }
  .closed .container {
    display: none;
  }
  .table-desc {
    display: inline;
    position: relative;
    margin-left: 10px;
  }
  .table-desc tbody {
    background-color: #c2e9ff;
  }
  .table-desc td:first-child {
    text-align: right;
  }
  .active-item {
    background-color: red;
  }
</style>