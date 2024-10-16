<template>
  <div >
    <Test :id="id" v-if="id"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null
    }
  },

  mounted() {
    this.id = this.$route.params.id
  }
}
</script>

<style scoped>

</style>