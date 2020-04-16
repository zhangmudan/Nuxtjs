<template>
  <div>
    <!-- 类似于router-view 匹配到组件的坑位 -->
    <nuxt />
  </div>
</template>

<style lang='less'>
//公共样式
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a {
  //inherit 继承父元素的样式
  color: inherit;
  text-decoration: none;
}
a:hover {
  color: inherit;
}
ul,
li,
ol {
  list-style: none;
}
i,
em {
  font-style: normal;
}
input,
button {
  outline: none;
}
</style>
