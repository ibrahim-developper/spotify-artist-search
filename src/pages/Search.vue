<template>
  <div class="artist-search-container q-pa-md">
    <!--
      user can't enter to this page if is not logged in
      if user enter some url contain token, inside the search input and the display artists we check if it is not valid we redirect the user
      to login page.

      this search component contain the search input and the grid to display all artists
      when user search for an artist we push new route and inside the display artists we watch immadiate the route
      and send request to fetsh the artist.
     -->
    <search-input />
    <display-artists class="q-mt-lg" />
  </div>
</template>

<script>
import SearchInput from "src/components/SearchInput.vue";
import DisplayArtists from "src/components/DisplayArtists.vue";
export default {
  name: "search",
  components: { SearchInput, DisplayArtists },
};
</script>

<style>
.artist-search-container {
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
