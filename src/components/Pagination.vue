<script setup lang="ts">
  import { computed,ref,watchEffect } from 'vue';
  import { useRoute,useRouter } from 'vue-router';
  import customAPI from '../utils/api';

  const route = useRoute();
  const router = useRouter();

  const page = computed(() => { return parseInt(route.query.page as string) || 1; });
  const pageLimit = computed(() => { return parseInt(route.query.limit as string) || 6; });
  const title = computed(() => (route.query.title as string) || '' );
  const categoryId = computed(() => (route.query.categoryId as string) || null);
  const sortBy = computed(() => (route.query.sortBy as string) || 'createAt');
  const sortOrderBy = computed(() => (route.query.sortOrderBy as string) || 'desc');

  const lastPage = ref(1);

  function goToPage(newPage: number) {
    // if (newPage < 1) newPage = 1;
    // if (newPage > lastPage.value) newPage = lastPage.value;
    //console.log(route.query);
    router.push({ query: { ...route.query, page: newPage.toString(), limit: pageLimit.value }});
  }

  watchEffect( async () => {
    //console.log(sortBy.value,route.query.sortBy);
    const { data } = await customAPI.get('/article', {
      params: {
        page: page.value,
        limit: pageLimit.value,
        title: title.value,
        categoryId: categoryId.value, 
        sortBy: sortBy.value,
        sortOrderBy: sortOrderBy.value
      },
    });
    lastPage.value = data.lastPage;
  });
</script>
<template>
  <div class="join">
    <button class="join-item btn btn-info" @click="goToPage(page-1)" :disabled="page<=1">«</button>
    <button class="join-item btn font-bold">Page {{page}}</button>
    <button class="join-item btn btn-info" @click="goToPage(page+1)" :disabled="page>= lastPage">»</button>
  </div>
</template>