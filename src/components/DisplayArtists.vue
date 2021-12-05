<template>
  <div>
    <div class="card-container">
      <q-card
        class="my-card"
        v-for="(artist, index) in getArtistsList"
        :key="index"
      >
        <router-link :to="`/albums/${artist.id}/${artist.name}`">
          <q-img
            :src="artist.image"
            placeholder-src="~assets/loading-spotify.jpg"
            fit="cover"
            height="240px"
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
            <div class="text-h6 title">{{ artist.name }}</div>
            <div class="text-subtitle2 text-grey-5">
              {{ artist.followers }} followers
            </div>
          </q-card-section>
          <q-card-section>
            <q-rating
              readonly
              :model-value="artist.rating"
              size="18px"
              :max="5"
              color="warning"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
            />
          </q-card-section>
        </router-link>
      </q-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "displayArtists",
  data() {
    return {
      accessToken: "",
      artistsList: [],
    };
  },
  watch: {
    $route: {
      handler(route) {
        //make request to fetch about 20 and display
        let name = route.query.artist;
        if (name) {
          this.$q.loading.show();
          axios
            .get(
              `https://api.spotify.com/v1/search?q=${name}&type=artist&limit=20`,
              {
                headers: {
                  Authorization: "Bearer " + this.accessToken,
                },
              }
            )
            .then((response) => {
              this.$q.loading.hide();
              this.artistsList = response.data.artists.items;
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
                  this.$router.replace({
                    path: "/",
                    query: { error: "Something wrong please try signin" },
                  });
              }
            });
        }
      },
      immediate: true,
    },
  },
  computed: {
    getArtistsList() {
      return this.setupArtistList(this.artistsList);
    },
  },
  methods: {
    setupArtistList(items) {
      let array = [];
      if (items) {
        for (let item of items) {
          let img = item.images[0];
          let rating = item.popularity ? item.popularity / 20 : 0;
          let followers = item.followers.total || 0;

          array.push({
            image: img?.url,
            name: item.name,
            rating,
            followers,
            id: item.id,
          });
        }
        return array;
      }
      return null;
    },
  },
  mounted() {
    let token = this.$q.cookies.get("access_token");
    if (token) {
      this.accessToken = token;
    } else {
      this.$router.push({ path: "/", query: { error: "Please login first" } });
    }
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
.title {
  line-height: normal;
}
.loading {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
