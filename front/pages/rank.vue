 <template>
   <section class="p-1 bg-griffondor min-h-100">
     <h1 class="mt-5 text-center">CLASSEMENT</h1>
    <div class="flex mt-3 items-center justify-around">
      <table v-if="topPlayers.length > 0" class="table mt-3 mb-3">
        <thead>
        <tr>
          <th class="text-center">Position</th>
          <th class="text-center">Pseudo</th>
          <th class="text-center">Maison</th>
          <th class="text-center">Victoires</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(player, index) in topPlayers" :key="player._id">
          <td class="text-center">{{ index + 1  === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1  === 3 ? "🥉" : index + 1}}</td>
          <td class="text-center">{{ player.user.name }}</td>
          <td class="text-center">{{ player.user.house }}</td>
          <td class="text-center">{{ player.victory }}</td>
        </tr>
        </tbody>
      </table>
      <div v-else>
        <h1 class="center">Classement en attente...</h1>
      </div>
      <div v-if="topHouses.length > 0">
        <p class="text-center">{{topHouses[0].house}} domine avec {{topHouses[0].victories}} victoires!</p>
        <img class="m-auto" :src="'_nuxt/assets/images/' + topHouses[0].house + '.png'" :alt="'baniière de ' + topHouses[0].house" />
      </div>
    </div>
     <button  class="button" @click="home">Accueil</button>
   </section>
  </template>

  <script>
    import axios from 'axios'

    export default {
      name: "rank",
      middleware: 'authenticated',
      data() {
        return {
          topPlayers: [],
          topHouses: [],
        }
      },
      async mounted() {
        try {
          const { data: topPlayers } = await axios.get('http://localhost:3001/api/top-players')
          this.topPlayers = topPlayers.topPlayers
          const { data: topHouses } = await axios.get('http://localhost:3001/api/top-house')
          this.topHouses = topHouses.houses
          console.log(topHouses.houses[0].house)
          console.log(this.topHouses)
        } catch (error) {
          console.error(error)
        }
      },
      methods: {
        home(){
          this.$router.push(`/`)
        },
      }
    }
  </script>

 <style scoped lang="scss">
section{
  display: flex;
  flex-direction: column;

  h1{
    margin-top: 5rem
  }

  th, td{
    padding: 1rem;
  }

  button{
    margin: 2rem auto;
    font-size: 1.2rem;
    background-color: var(--white);
  }
}
 </style>