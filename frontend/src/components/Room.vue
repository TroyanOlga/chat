<template>
  <div>
    {{ roomId }}
    <div v-for="message in messages" :key="message.id">
      {{ message }}
    </div>
    <b-alert
      v-model="showErrorTime"
      variant="danger"
      dismissible
      @dismiss-count-down="countDownChanged"
    >
      An error occured, please try later
    </b-alert>
    <b-form
      @submit.prevent="onSubmit"
    >
      <b-form-textarea
        id="textarea"
        v-model="currentMessage"
        placeholder="Enter message here..."
        rows="3"
        max-rows="6"
        @keyup.enter="onSubmit"
      />
    </b-form>
  </div>
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
    this.messages = (await this.axios.get(`/room/${this.roomId}`)).data;
  },
  methods: {
    onSubmit: async function () {
      try {
        await this.axios.post(`/room/${this.roomId}`, {
          from: this.user,
          dateTime: new Date().getTime(),
          message: this.currentMessage,
        });
      } catch (err) {
        this.showErrorTime = 5;
      }
    },
    countDownChanged: function (dismissCountDown) {
      this.showErrorTime = dismissCountDown;
    },
  },
};

</script>
