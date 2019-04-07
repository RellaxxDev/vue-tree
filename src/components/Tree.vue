<template>
  <div class="Tree">
    <input type="file" id="filepicker" name="fileList" multiple directory webkitdirectory mozdirectory v-on:change="openFolder"/>
    <ul v-if="!!structure && !!Object.keys(structure).length"
        v-on:click="toggleItem"
        class="container"
    >
      <TreeNode :nodeItem="Object.values(structure)[0]"
                :isFolder="true"
                :id="Object.values(structure)[0].id"
                :currentActive="currentActive"
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
      structure: null,
      currentActive: -1,
      structureLength: 0
    }
  },
  methods: {
    openFolder: gettingStructure,
    toggleItem: tree_toggle,
    changeActive: change_active
  },
  mounted() {
    document.addEventListener("keydown", this.changeActive);
  }
}

function change_active() {
  if (event.keyCode !== 38 && // up
      event.keyCode !== 40 && // down
      event.keyCode !== 13 && // enter
      event.keyCode !== 32) { // space
    return;
  }
  //debugger;

  // еще нет активных элементов
  if (this.currentActive === -1) {
    if (event.keyCode === 38) { // up
      return;

    } else if (event.keyCode === 40) { // down

      // в первый раз переход на нулевой элемент
      if (this.currentActive === -1) {
        this.currentActive++;
        return;
      }

    }
  }

  // текущий активный элемент
  let currentActiveNode = document.getElementById(this.currentActive);
  if (!currentActiveNode) {
    console.error("Error! Can't find active node.");
    return;
  }

  if (event.keyCode === 38 && this.currentActive > -1) { // up
    this.currentActive = +moveToPreviousNode(currentActiveNode);

  } else if (event.keyCode === 40 && this.currentActive < this.structureLength) { // down
    this.currentActive = +moveToNextNode(currentActiveNode, true);
  }

  console.log("Current active node:" + this.currentActive);
  console.log("Length of nodes:" + this.structureLength);
}

function moveToPreviousNode(currentActiveNode) {
  // поиск соседа
  let neighbour = currentActiveNode.previousElementSibling;

  // если соседа нет встаем на родителя
  if (!neighbour) {
    let parentOfActive = currentActiveNode.parentElement.parentElement; //родитель должен быть ul, следующий родитель li
  
    // если родитель не li - мы на вершине дерева, снимаем выделение и выходим
    if (parentOfActive.tagName !== 'LI') {
      return -1;
    }

    // смена активного элемента и выход
    return parentOfActive.id;
  }

  // если сосед не открытая папка - цель найдена, выходим
  if (!hasClass(neighbour, 'opened')) {
    return neighbour.id;
  }

  // если сосед открытая папка - нужно найти самый глубокий доступный элемент
  return getDeepestChildId(neighbour);
}

function getDeepestChildId(parentElement) {
  return hasClass(parentElement.lastChild, 'opened') ? getDeepestChildId(parentElement.lastChild) : parentElement.lastChild.id;
}

function moveToNextNode(currentActiveNode, needToCheckingChild) {
  // текущий элемент - открытая папка  
  if (hasClass(currentActiveNode, 'opened') && needToCheckingChild) {
    let childUl = currentActiveNode.getElementsByTagName('ul'); // дочерний список
    if (childUl) {
      return childUl[0].firstChild.id; // первый элемент дочернего списка
    }
  }

  // поиск соседа
  let neighbour = currentActiveNode.nextElementSibling;
  // сосед найден - выходим
  if (neighbour) {
    return neighbour.id;
  }

  // если соседа нет - идем искать соседа у родителя
  let parentOfActive = currentActiveNode.parentElement.parentElement; // родитель активного элемента

  // если родитель не li - мы достигли вершины дерева, выходим
  if (parentOfActive.tagName !== 'LI') return currentActiveNode.id;

  // рекурсивно ищем соседа у родителя
  return moveToNextNode(parentOfActive, false);
}

// подготовка структуры для отрисовки дерева
function gettingStructure(e) {
  this.structure = {};
  let files = Array.from(e.target.files);
  this.structureLength = 0;

  files.forEach((file, index) => {
    let paths = file.webkitRelativePath.split('/').slice(0, -1);
    let parentFolder = null;

    paths.forEach(path => {
      if (!parentFolder) {
        if (!this.structure[path]) {
          this.structure[path] = {
            id: this.structureLength,
            name: path,
            root: true,
            folders: {},
            files: []
          };
          this.structureLength++;
        }

        parentFolder = this.structure[path];

      } else {
        if (!parentFolder.folders[path]) {
          parentFolder.folders[path] = {
            id: this.structureLength,
            name: path,
            root: false,
            folders: {},
            files: []
          }
          this.structureLength++;
        }

        parentFolder = parentFolder.folders[path];
      }
    });

    file.id = this.structureLength;
    parentFolder.files.push(file);
    this.structureLength++;
  });

  console.log("Complete structure object:");
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