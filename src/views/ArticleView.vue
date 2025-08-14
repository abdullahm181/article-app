<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import customAPI from '../utils/api';
  import Loading from '../components/Loading.vue';
  import ErrorComponent from '../components/ErrorComponent.vue';
  import CardArticle from '../components/CardArticle.vue';
  import Pagination from '../components/Pagination.vue';
  import Filter from '../components/Filter.vue';
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const page = computed(() => { return parseInt(route.query.page as string) || 1; });
  const pageLimit = computed(() => { return parseInt(route.query.limit as string) || 6; });
  const title = computed(() => (route.query.title as string) || '' );
  const categoryId = computed(() => (route.query.categoryId as string) || null);
  const sortBy = computed(() => (route.query.sortBy as string) || 'createAt');
  const sortOrderBy = computed(() => (route.query.sortOrderBy as string) || 'desc');


  const fetchData = async () => {
    const {data} = await customAPI.get('/article', {
      params: {
        page: page.value,
        limit: pageLimit.value,
        title: title.value,
        categoryId: categoryId.value, 
        sortBy: sortBy.value,
        sortOrderBy: sortOrderBy.value
      },
    });
    //console.log(data);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['articles',page,pageLimit,title,categoryId,sortBy,sortOrderBy],
    queryFn: fetchData,
  });
</script>
<template>
  <!-- Filter -->
   <Filter />
  <!-- Article -->
  <div v-if="isLoading"><Loading />Loading .....</div>
  <div v-else-if="error"><ErrorComponent/></div>
  <section v-else>
    <h1 class="text-4xl font-bold text-info">List Artikel</h1>
    <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-5" v-if="data?.data && data.data.length > 0">
      <CardArticle :item="item" v-for="item in data.data" :key="item.id"/>
    </div>
    <div v-else>
      <h1 class="text-2xl font-bold mt-4">Data Article Tidak Ada</h1>
    </div>
    <div class="flex justify-center">
      <Pagination class="my-3"/>
    </div>
  </section>
  
</template>