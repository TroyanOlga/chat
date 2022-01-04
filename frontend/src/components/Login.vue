<template>
  <div>
    <b-form @submit.prevent="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="Your Name:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>
      <b-button type="reset" variant="danger">Reset</b-button>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data: function() {
    return {
      name: null,
    };
  },
  methods: {
    onSubmit: async function () {
      await this.axios.post('/login', { name: this.name });
    },
    onReset: function () {
      this.name = null;
    },
  },
};

</script>
