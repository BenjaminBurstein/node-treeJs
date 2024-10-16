<template>
  <Login />
</template>

<script>
export default {
  name: "login",
  middleware: 'authenticated',
  mounted() {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.$router.push('/')
    }
  }
}
</script>