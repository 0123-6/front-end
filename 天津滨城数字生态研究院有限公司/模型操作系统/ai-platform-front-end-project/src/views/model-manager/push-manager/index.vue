<template>
  <div class="flex flex-direction test" :style="isHeight ? 'height: 100%' : ''">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isHeight'])
  }
};
</script>
