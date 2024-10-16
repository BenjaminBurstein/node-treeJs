<template>
  <section class="train bg-serdaigle">
    <p>Prend place dans le Poudlard Express <br/> et profite du voyage</p>
    <img src="https://static.vecteezy.com/system/resources/previews/009/877/070/non_2x/vintage-steam-locomotive-and-wagon-on-railroad-free-png.png" alt="train" />
  </section>
</template>

<script>
export default {
  name: "Train"
}
</script>

<style scoped lang="scss">
.train{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rem 0;

  p{
    line-height: var(--lineHeight);
    text-align: center;
    padding: 1rem 0.2rem 5rem;
  }
  img{
    width: 80%;
  }
}
</style>