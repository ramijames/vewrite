<template>
  <div id="HeaderButtons">
    <router-link class="button dark" to="/account">Account</router-link>  
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

@import 'assets/_variables.scss';

#HeaderButtons {
  display: flex;
  flex-direction: row;
  gap: $spacing-xs;
}

</style>