<script setup lang="ts">
  import { useQuery } from '@tanstack/vue-query';
  import customAPI from '../utils/api';
  import Loading from '../components/Loading.vue';
  import ErrorComponent from '../components/ErrorComponent.vue';
  import CardArticle from '../components/CardArticle.vue';

  const fetchData = async () => {
    const {data} = await customAPI.get('/article?limit=5&sortBy=createAt&sortOrder=desc');
    //console.log(data);

    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchData,
  });
  
</script>

<template>
  <main>
    <div v-if="isLoading"><Loading />Loading .....</div>
    <div v-else-if="error"><ErrorComponent/></div>
    <section v-else>
      <h1 class="text-primary font-bold text-3xl underline">List Artikel Terbaru</h1>
      <CardArticle :item="item" v-for="item in data.data" :key="item.id"/>
      <RouterLink :to="{name:'article'}" class="btn btn-block btn-primary mt-10">Tampil Semua Artikel</RouterLink>
    </section>
  </main>
</template>


