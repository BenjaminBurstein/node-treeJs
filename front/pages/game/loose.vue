<template>
  <div class="messageGame">
    <p>DEFAITE ! <br /><br />Tu n'es pas un si bon sorcier que ça... entraine toi.</p>
    <div class="divButton">
      <button  class="button" @click="home"> Accueil</button>
      <button  class="button" @click="rank"> Classement</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageGame",
  methods: {
    home(){
      this.$router.push(`/`)
    },
    rank(){
      this.$router.push(`/rank`)
    }
  }
}
</script>
<style scoped lang="scss">
.messageGame{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  p{
    font-size: 2.5rem;
    text-align: center;
  }

  .divButton{
    margin-top: 3rem;
    display: flex;

    .button{
      margin: 0.5rem;
    }
  }
}
</style>
