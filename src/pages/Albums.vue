<template>
  <!--
  when component mounted
  1- check if user have token stored inside a cookies
  2- get the artist name from the url and display the result
   -->
  <div class="albums-container q-pa-md">
    <div style="max-width: 1090px">
      <div class="header q-mt-lg">
        <div>
          <div class="text-h6">{{ artistName }}</div>
          <div class="text-subtitle1 text-grey-6">Albums</div>
        </div>
      </div>
      <div class="albums-card-container">
        <div class="card-container q-my-lg a-mx-md">
          <q-card
            class="my-card album-card"
            v-for="(album, index) in getAlbums"
            :key="index"
          >
            <q-img
              :src="album.image"
              placeholder-src="~assets/loading-spotify.jpg"
              fit="cover"
            >
              <template v-slot:error>
                <div
                  class="absolute-full flex flex-center bg-negative text-white"
                >
                  Cannot load image
                </div>
              </template>
            </q-img>

            <q-card-section>
              <div class="text-h6">{{ album.name }}</div>
              <div
                class="text-subtitle2 text-grey-6"
                v-for="(artist, i) in album.artists"
                :key="i"
              >
                {{ artist.name }}
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-subtitle2">{{ album.year }}</div>
              <div class="text-subtitle2">{{ album.tracks }} tracks</div>
            </q-card-section>
            <!-- <q-separator /> -->

            <q-card-section class="bg-grey-4 text-center">
              <a class="text-light-green-8" :href="album.url" target="_blank"
                >Preview on Spotify</a
              >
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "albums",
  data() {
    return {
      artistName: "",
      albums: [],
    };
  },
  computed: {
    getAlbums() {
      return this.setupAlbums(this.albums);
    },
  },
  methods: {
    setupAlbums(items) {
      if (items) {
        let array = [];
        for (let item of items) {
          let img = item.images[0];
          array.push({
            name: item.name,
            artists: item.artists,
            url: item.external_urls.spotify,
            image: img?.url,
            year: item.release_date,
            tracks: item.total_tracks,
          });
        }
        return array;
      }
      return null;
    },
  },
  mounted() {
    //check id inside the route
    this.$q.loading.show();

    let token = this.$q.cookies.get("access_token");
    if (token) {
      this.accessToken = token;
    } else {
      this.$router.replace({
        path: "/",
        query: { error: "Please login first" },
      });
    }
    let route = this.$route;
    if (route.params.id && route.params.name) {
      this.artistName = route.params.name;
      //get albums and display
      axios
        .get(`https://api.spotify.com/v1/artists/${route.params.id}/albums`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          this.$q.loading.hide();
          this.albums = response.data.items;
        })
        .catch((error) => {
          this.$q.loading.hide();

          switch (error.response.status) {
            case 401:
              this.$router.replace({
                path: "/",
                query: { error: "Bad or expired token" },
              });
              break;
            case 403:
              this.$router.replace({
                path: "/",
                query: { error: "Bad OAuth request" },
              });
              break;
            case 429:
              this.$router.replace({
                path: "/",
                query: { error: "The app has exceeded its rate limits" },
              });
              break;
            default:
              this.$q.notify({
                type: "negative",
                position: "center",
                message: `${error.message}`,
              });
          }
        });
    } else {
      this.$router.replace({ path: "/", query: { error: "Invalid Search" } });
    }
  },
};
</script>

<style scoped>
.albums-container {
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.albums-container .header {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/* .albums-container .album-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
} */
a:hover {
  color: brown !important;
}
</style>
