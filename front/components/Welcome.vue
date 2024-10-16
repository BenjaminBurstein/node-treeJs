<template>
  <section class="bg-griffondor min-h-100 welcome">
    <h1>Bienvenue jeune sorcier</h1>
  </section>
</template>

<script>
export default {
  name: "Welcome"
}
</script>

<style scoped lang="scss">

.welcome{
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;

  h1{
    padding: 0 0.2rem;
  }
}



</style>