<template>
  <section class="game bg-griffondor min-h-100">
    <h2>Il est temps de tester ta puissance <br /> lors d’un duel magique</h2>
      <button class="button" :disabled="userId === null" @click="userId !== null ? roomGestion() : null"  v-if="!roomId">Jouez</button>
      <p v-else>En attente d'un joueur</p>
      <button  class="button" @click="rank"> Classement</button>
    <img src="https://www.pngkey.com/png/full/174-1743704_dobby-the-goblin-harry-potter-elf-thing.png" alt="dobby" />
  </section>
</template>

<script>

import socketIO from 'socket.io-client';

const ADDRESS_IP = 'http://192.168.0.12:3001';
const socket = socketIO.connect(ADDRESS_IP);

export default {
  name: "Game",
  data() {
    return {
      allData : [],
      userId: 0,
      roomId: null
    }
  },
  mounted() {
    this.userId = sessionStorage.getItem("userId")

    socket.on('dataResponse', (data) => {
      this.allData = data
    })

    socket.on("roomReady", (data) => {
      const currentUser = sessionStorage.getItem("userId")
      if (currentUser === data.player1.id || currentUser === data.player2.id) {
        this.$router.push(`/game/${data.idRoom}`)
      }
    })

  },
  methods: {
    rank(){
      this.$router.push(`/rank`)
    },
    roomGestion() {
      const filterRoom = this.allData.filter((room) => room.player2.id === null || room.player1.id === null )
      if (filterRoom.length === 0) {
        socket.emit('createRoom', {
          idRoom: this.allData.length + 1,
          player1: {
            id: this.userId,
            position: {
              x: 0,
              z: -5
            },
            rotation: 0.35,
            life: 100,
          },
          player2: {
            id: null,
            position: {
              x: null,
              z: null,
            },
            rotation: null,
            life: null,
          }
        })
        sessionStorage.setItem("roomId", (this.allData.length + 1))
        this.roomId = this.allData.length + 1
      } else {
        console.log(filterRoom)
        sessionStorage.setItem("roomId", filterRoom[0].idRoom)
        socket.emit('joinRoom', {
          idRoom: filterRoom[0].idRoom,
          player1: filterRoom[0].player1.id === null ? {id: this.userId, position: {x: 0, z: -5},rotation: 0.35 , life: 100} : {id: filterRoom[0].player1.id, position: { x: filterRoom[0].player1.position.x, z: filterRoom[0].player1.position.z }, rotation: filterRoom[0].player1.rotation ,life: filterRoom[0].player1.life},
          player2: filterRoom[0].player2.id === null ? {id: this.userId, position: {x: 20, z: 120},rotation: 3.5 , life: 100} : {id: filterRoom[0].player2.id, position: {x: filterRoom[0].player2.position.x, z: filterRoom[0].player2.position.z},rotation: filterRoom[0].player2.rotation , life: filterRoom[0].player2.life}
        })
        socket.emit("roomReady", (filterRoom[0].idRoom))
      }

    }
  }
}
</script>

<style scoped lang="scss">
.game{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 0;

  h2{
    line-height: var(--lineHeight);
    text-align: center;
    margin-bottom: 2rem;
    z-index: 1;

    @media screen and (max-width: 920px) {
      font-size: 2rem;
      margin-top: 3rem;
    }
  }

    img{
      margin-top: auto;
      width: 10rem;
  }

  .button{
    background-color: var(--white);
  }

}
</style>