<template>
  <div>
    <div v-for="room in rooms" :key="room.id">
      <Room :room-id="room.id" :user="user" />
    </div>
  </div>
</template>

<script>
import Room from '../components/Room.vue';

export default {
  name: 'Chat',
  components: {
    Room,
  },
  data: function () {
    return {
      rooms: [],
      user: null,
    };
  },
  mounted: async function () {
    if (!this.$route.params.userId) {
      this.$router.push({ name: 'Home' });
      return;
    }
    this.user = this.$route.params.userId;
    this.rooms = (await this.axios.get('/chat')).data;
  },
};
</script>
