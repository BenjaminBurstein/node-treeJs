<template>
  <div>
    <client-only placeholder="Loading...">
      <!-- this component will only be rendered on client-side -->
      <NuxtPage/>
    </client-only>
  
  </div>
</template>

<script>
export default {
  middleware: 'authenticated'
}
</script>
