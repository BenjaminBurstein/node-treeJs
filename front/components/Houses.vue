<template>
<section class="houses bg-white">
  <p class="section-inner titre">Pose tes bagages, tu es à Poudlard l’école des sorciers.
    <br /><br />
    Je vais te présenter les 4 maisons qui composent cette école :</p>
  <ul>
    <li class="griffondor">
      <img src="../assets/images/Gryffindor.png" alt="griffondor" />
      <h3>Gryffondor</h3>
      <p>Gryffondor est une des quatre maisons de l’école de sorcellerie Poudlard, fondée par Godric Gryffondor. Son animal emblématique est le lion, qu’on retrouve sur les couleurs rouge et or de ses armoiries. Son fantôme est Sir Nicholas, aussi surnommé Nick Quasi-sans-tête.</p>
    </li>
    <li class="serpentard">
      <img src="../assets/images/Slytherin.png" alt="serpentard" />
      <h3>Serpentard</h3>
      <p>Serpentard est une des quatre maisons de l’école de sorcellerie Poudlard, fondée par Salazar Serpentard. Ce n’est pas pour rien que son fondateur parlait le Fourchelang… Avec ses tons verts et argents, les armoiries de Serpentard sont plutôt froides. </p>
    </li>
    <li class="poufsouffle">
      <img src="../assets/images/Hufflepuff.png" alt="poufsouffle" />
      <h3>Poufsouffle </h3>
      <p>Poufsouffle est une des quatre maisons de l’école de sorcellerie Poudlard, fondée par Helga Poufsouffle. Son animal emblématique est le blaireau, qu’on retrouve sur les couleurs jaune et noir de ses armoiries. Son fantôme est le Moine Gras.</p>
    </li>
    <li class="serdaigle">
      <img src="../assets/images/Ravenclaw.png" alt="serfaigle" />
      <h3>Serdaigle </h3>
      <p>Serdaigle est une des quatre maisons de l’école de sorcellerie Poudlard, fondée par Rowena Serdaigle. Son animal emblématique est l’aigle, qu’on retrouve sur les couleurs bleu et bronze de ses armoiries. Son fantôme est la Dame Grise.</p>
    </li>
  </ul>
</section>
</template>

<script>
export default {
  name: "Houses"
}
</script>

<style scoped lang="scss">
.houses{
  display: flex;
  flex-direction: column;

  .titre{
    font-size: 1rem;
    text-align: center;
    margin-bottom: 5rem;
    color: black;
  }

  p{
    line-height: var(--lineHeight);
    padding: 0 0.2rem;
    text-align: center;

    @media screen and (min-width: 921px){
      font-size: 0.8rem;
    }
  }

  ul{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    @media screen and (max-width: 920px) {
      flex-direction: column;
    }

    li{
      margin: 0 0.2rem;
      display: flex;
      flex-direction: column;
      width: 100%;
      flex: 1;
      text-align: center;

      @media screen and (max-width: 920px) {
        margin-bottom: 3rem;
      }

      h3{
        margin-bottom: 0.5rem;
      }

      &.poufsouffle{
        color: var(--poufsouffle);
      }

      &.griffondor{
        color: var(--griffondor);
      }

      &.serpentard{
        color: var(--serpentard);
      }

      &.serdaigle{
        color: var(--serdaigle);
      }


      img{
        width: 100%;
      }
    }
  }
}
</style>