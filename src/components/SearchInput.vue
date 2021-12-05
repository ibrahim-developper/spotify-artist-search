<template>
  <div class="search-container q-pa-sm">
    <!--
      we watch when user enter a character and fetch a result and display inside the suggestion
      when user click the enter button or choose from the suggestion list we push a new route and display
      the result inside the display artists component.
     -->
    <div class="input-search">
      <q-input
        outlined
        placeholder="Search for an artist..."
        v-model="searchInput"
        @keyup="displaySuggestionList"
      >
        <template v-if="searchInput" v-slot:append>
          <q-icon
            name="close"
            @click.stop="searchInput = null"
            class="cursor-pointer"
          />
        </template>
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-menu v-if="suggestion.length > 0" no-focus v-model="displaySuggestion">
        <q-list dense bordered padding class="rounded-borders">
          <q-item
            clickable
            dense
            v-close-popup
            v-for="(artist, index) in suggestions"
            :key="index"
            @click="getArtist(artist.name)"
          >
            <q-item-section avatar v-if="artist.image">
              <q-img :src="artist.image" />
            </q-item-section>
            <q-item-section>
              {{ artist.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "searchInput",
  data() {
    return {
      searchInput: "",
      accessToken: "",
      searchLoading: false,
      suggestion: [],
      enableWatch: true,
      displaySuggestion: false,
    };
  },
  watch: {
    searchInput(newInputSearch) {
      if (newInputSearch) {
        this.searchLoading = true;
        this.displaySuggestion = true;
        //send request to fetch data and display in suggestion
        axios
          .get(
            `https://api.spotify.com/v1/search?q=${newInputSearch}&type=artist&limit=7`,
            {
              headers: {
                Authorization: "Bearer " + this.accessToken,
              },
            }
          )
          .then((response) => {
            this.searchLoading = false;
            this.suggestion = response.data.artists.items;
          })
          .catch((error) => {
            this.searchLoading = false;

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
      } else {
        this.suggestion = [];
      }
    },
  },
  computed: {
    suggestions() {
      return this.setUpSuggestion(this.suggestion);
    },
  },
  methods: {
    setUpSuggestion(items) {
      let array = [];
      if (items) {
        for (let item of items) {
          let img = item.images[0];
          array.push({
            image: img?.url,
            name: item.name,
          });
        }
        return array;
      }
      return null;
    },
    getArtist(artist) {
      if (artist) {
        this.displaySuggestion = false;
        this.suggestion = [];
        this.$router.push({ path: "/search", query: { artist: artist } });
        // this.$emit("display-artists", artist);
      }
    },
    displaySuggestionList(ev) {
      if (ev.key == "Enter") {
        this.getArtist(this.searchInput);
      } else {
        //set suggestion visible
        this.displaySuggestion = true;
      }
    },
  },
  mounted() {
    let token = this.$q.cookies.get("access_token");
    if (token) {
      this.accessToken = token;
      this.searchInput = this.$route.query.artist || "";
      this.displaySuggestion = false;
    } else {
      this.$router.push({ path: "/", query: { error: "Please login first" } });
    }
  },
};
</script>

<style>
.search-container {
  width: 400px;
}
.search-container .input-search {
  position: relative;
}
.q-menu {
  width: 385px;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  scrollbar-track-color: gray;
  background-color: white;
}

@media (max-width: 400px) {
  .search-container {
    width: 100%;
  }
  .q-menu {
    width: auto;
  }
}

::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
