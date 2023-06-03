<script lang="ts">
  import Header from "./Header.svelte";
  import Grid from "./Grid.svelte";
</script>

<page actionBarHidden={true}>
  <gridLayout columns="*" rows="auto, *">
    <Header />
    <Grid />
  </gridLayout>
</page>

<style>
  page {
    background: #151515;
  }
</style>
