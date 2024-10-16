<template>
  <Welcome />
  <Train />
  <Houses />
  <MyHouse />
  <Game />
</template>

<script>
import MessageGame from "~/pages/game/win.vue";

export default {
  name: "Home",
  components: {MessageGame},
  middleware: 'authenticated',
  mounted() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.$router.push('/login')
    }
  }
}
</script>
