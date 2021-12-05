<template>
  <div class="login-container">
    <!--
      when user login we check the url inside beforeEach method inside the router file (src/router/index.js) and set the token inside cookies
      and expire after 1 hour.
     -->
    <q-btn
      style="width: 270px"
      text-color="black"
      no-caps
      size="md"
      @click="login"
    >
      <div>Login</div>
      <q-icon right size="md" name="img:spotify.png" />
    </q-btn>
  </div>
  <!--
    errors
    401
    Bad or expired token. This can happen if the user revoked a token or the access token has expired. You should re-authenticate the user.

    403
    Bad OAuth request (wrong consumer key, bad nonce, expired timestamp...). Unfortunately, re-authenticating the user won't help here.

    429
    The app has exceeded its rate limits.
   -->
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      client_id: "3674e5f153bf4862a5e64d1c8aff8810",
      // scope: ["user-top-read", "user-follow-read"],
      scope: "user-top-read",
      redirect_url: "http://localhost:8080/search",
    };
  },
  watch: {
    $route: {
      handler(route) {
        if (route.query.error) {
          //display error to the user
          this.$q.notify({
            message: route.query.error,
            color: "negative",
            position: "top",
            icon: "report_problem",
          });
        }
      },
      immediate: true,
    },
  },
  methods: {
    login() {
      console.log(this.authRequestUrl);
      window.location = this.authRequestUrl;
    },
  },
  computed: {
    authRequestUrl() {
      let url = `https://accounts.spotify.com/authorize?response_type=token`;
      url += `&client_id=${this.client_id}`;
      url += `&scope=${this.scope}`;
      url += `&redirect_uri=${this.redirect_url}`;
      url += `&state=${this.generateString}`;
      // url += "&show_dialog=true";
      return url;
    },
    generateString() {
      let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < 16; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
