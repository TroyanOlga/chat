<template>
  <b-container class="h-100 d-flex flex-column">
    <b-button
      type="button"
      size="sm"
      variant="outline-secondary"
      class="align-self-end my-3"
      @click="handleLogout"
    >
      Logout
    </b-button>
    <section class="mb-3">
      <div v-for="messageData in messages" :key="messageData.dateTime">
        <div class="d-flex align-items-center justify-content-between">
          <small class="fw-bold">{{ messageData.username }}</small>
          <small class="text-muted">{{ $dayjs(messageData.dateTime).fromNow() }}</small>
        </div>
        <p class="mb-0 border-bottom text-start">
          {{ messageData.message }}
        </p>
      </div>
    </section>
    <b-alert
      v-model="showErrorTime"
      variant="danger"
      dismissible
      @dismiss-count-down="countDownChanged"
    >
      An error occured, please try later
    </b-alert>
    <b-form
      class="mt-auto mb-3"
      @submit.prevent="onSubmit"
    >
      <b-form-textarea
        id="textarea"
        v-model="currentMessage"
        placeholder="Enter message here..."
        rows="3"
        max-rows="6"
        @keydown="inputHandler"
      />
    </b-form>
  </b-container>
</template>

<script>
export default {
  name: 'Room',
  props: {
    roomId: {
      type: Number,
      required: false,
      default: 0,
    },
    user: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      messages: [],
      currentMessage: '',
      showErrorTime: 0,
    };
  },
  mounted: async function () {
    const messages = (await this.axios.get(`/room/${this.roomId}`)).data;
    this.messages = messages.reverse();
    const connection = new WebSocket(process.env.VUE_APP_WEBSOCKET_URL);
    connection.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.username) {
          this.messages.push(JSON.parse(event.data));
        }
      } catch (err) {
        // do nothing
      }
    };

    // TODO remove before moving to prod
    connection.onopen = (event) => {
      console.log(event); // eslint-disable-line no-console
      console.log('Successfully connected to the echo websocket server...'); // eslint-disable-line no-console
    };

    // TODO replace with proper vuex solution
    window.onbeforeunload = async () => {
      await this.handleLogout();
    };
  },
  methods: {
    inputHandler(e) {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        this.onSubmit();
      }
    },
    onSubmit: async function () {
      try {
        await this.axios.post(`/room/${this.roomId}`, {
          from: this.user,
          dateTime: new Date().getTime(),
          message: this.currentMessage,
        });
        this.currentMessage = '';
      } catch (err) {
        this.showErrorTime = 5;
      }
    },
    async handleLogout() {
      await this.axios.post('logout', {
        user: this.user,
      });
      this.$router.push({ name: 'Home' });
    },
    countDownChanged: function (dismissCountDown) {
      this.showErrorTime = dismissCountDown;
    },
    isJsonString: (str) => {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
  },
};

</script>
