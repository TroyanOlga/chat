<template>
  <div>
    <b-alert
      v-model="showErrorTime"
      variant="danger"
      dismissible
      @dismiss-count-down="countDownChanged"
    >
      Login not successful. Please try later
    </b-alert>
    <b-form
      @submit.prevent="onSubmit"
      @reset="onReset"
    >
      <b-form-group
        id="input-group-1"
        label="Your Name:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="name"
          placeholder="Enter name"
          required
        />
      </b-form-group>
      <b-button type="reset" variant="danger">
        Reset
      </b-button>
      <b-button type="submit" variant="primary">
        Submit
      </b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: function () {
    return {
      name: null,
      showErrorTime: 0,
    };
  },
  methods: {
    onSubmit: async function () {
      try {
        const result = await this.axios.post('/login', { name: this.name });
        this.$router.push({ name: 'Chat', params: { userId: result.data.userId } });
      } catch (err) {
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
