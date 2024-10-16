<template>
  <section class="login">
    <div class="flex flex-col items-center justify-center px-4 py-8 mx-auto lg:py-0 align-center">
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700 p-4">
        <div class="p-2">
          <h1 class="text-center">
            Connectez-vous
          </h1>
            <div>
              <label for="username" class="block my-1 text-sm font-medium text-gray-900">Nom d'utilisateur</label>
              <input v-model="name" type="text" name="username" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-1" placeholder="Nom" required="">
            </div>
            <div>
              <label for="password" class="block mb-1 mt-2 text-sm font-medium text-gray-900">Mot de passe</label>
              <input v-model="password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg y-600 block w-full p-1" required="">
            </div>
            <button class="button" @click="login">Validez</button>
          </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  name: "Login",
  data: () => ({
    username: null,
    password: null
  }),
  methods: {
    async login(){
      try{
        const { name, password } = this
        const userResponse = await axios.post(`http://127.0.0.1:3001/api/login`, {
          name,
          password
        })
        console.log('logedIn')
        if(userResponse){
          const token = userResponse.data.token
          const {name, house, id} = userResponse.data.user;
          const houseName = house.name;
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('userId', id)
          this.$router.push('/');
          try {
            await axios.post(`http://127.0.0.1:3001/api/user`, {
              token,
              name,
              "house": houseName,
              apiId : id
            })
          }catch(err){
            console.error({ err })
          }

        }
      } catch(err) {
        console.error({ err })
      }
    }
  }

}
</script>

<style scoped lang="scss">
.login{
  background-color: var(--griffondor);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1{
    color: var(--griffondor);
    margin-bottom: 2rem;
  }
  label{
    color: var(--poufsouffle);
    line-height: 100%;
  }
  input{
    line-height: 100%;
    margin-bottom: 1rem;
  }

  .button{
    margin: auto;
    margin-top: 1rem;
    color: var(--poufsouffle);
    background-color: var(--griffondor);
    font-size: 1.7rem;
  }
}
</style>