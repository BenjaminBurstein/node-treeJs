<template>
  <section class="myHouse bg-serpentard min-h-100">

      <img src="../assets/images/chapeau.png" alt="" />
    <div>
      <h2>Maintenant voyons a quel maison tu appartiens sorcier :</h2>
      <p v-if="user !== null">"Après mure réflexion, je crois que ta place est à... {{user.house}}. Bienvenue dans ta nouvelle famille !"</p>
      <p v-else>"Après mure réflexion, je crois que tu n'es pas digne de Poudlard !"</p>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  name: "MyHouse.vue",
  data() {
    return {
      user: null,
      userId: sessionStorage.getItem('userId')
    }
  },
  async mounted() {
    try {
      const { data: user } = await axios.get('http://localhost:3001/api/user/'+this.userId)
      this.user = user.user;
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped lang="scss">
  .myHouse{
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 920px) {
      flex-direction: column;
      justify-content: flex-start;
      min-height: auto;
    }

    h2{
      text-align: center;
      margin-bottom: 3rem;

      @media screen and (max-width: 920px) {
        font-size: 2rem;
        margin-top: 3rem;
      }
    }

    img{
      width: 40%;
      margin-right: 1rem;
    }

    p{
      text-align: center;
    }

  }
</style>