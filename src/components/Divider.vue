<template>
  <div class="divider-container">
    <span class="title"><b :style="`font-size: ${fSize}; color: ${fColor};`">{{ title }}</b></span>
    <div class="divider" :style="`border-bottom: ${dSize} solid ${dColor};`"></div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Divider",
  props: {
    "title": {
      type: String,
    },
    fSize: {
      type: String,
      default: "1.3rem"
    },
    fColor: {
      type: String,
      default: "black"
    },
    dSize: {
      type: String,
      default: "2px"
    },
    dColor: {
      type: String,
      default: "black"
    }
  }
}
</script>

<style scoped>
.divider-container {
  margin: 0 5px 0 5px;
  padding: 2px;
  display: flex;
  align-items: flex-end;
}

.title {
  width: 30%;
  margin: 0;
  height: 100%;
}

.divider {
  width: 70%;
  height: 100%;
  margin: 0;
}
</style>