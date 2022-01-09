<template>
  <b-container>
    <h1>Chat app</h1>
    <b-alert
      v-model="showErrorTime"
      variant="danger"
      dismissible
      @dismiss-count-down="countDownChanged"
    >
      {{ error || 'Login not successful, please try later' }}
    </b-alert>
    <b-form
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <b-form-group
        id="input-group-1"
      >
        <b-form-input
          id="input-1"
          v-model="name"
          placeholder="Enter name"
          required
        />
      </b-form-group>
      <b-button
        type="reset"
        size="sm"
        variant="outline-secondary"
      >
        Reset
      </b-button>
      <b-button
        type="submit"
        size="sm"
        variant="outline-dark"
      >
        Submit
      </b-button>
    </b-form>
  </b-container>
</template>

<script>
export default {
  name: 'Login',
  data: function () {
    return {
      name: null,
      showErrorTime: 0,
      error: null,
    };
  },
  methods: {
    onSubmit: async function () {
      try {
        const result = await this.axios.post('/login', { name: this.name });
        this.$router.push({ name: 'Chat', params: { userId: result.data.userId } });
      } catch (err) {
        this.error = err.response.data;
        this.showErrorTime = 5;
      }
    },
    onReset: function () {
      this.name = null;
    },
    countDownChanged: function (dismissCountDown) {
      this.showErrorTime = dismissCountDown;
    },
  },
};

</script>
