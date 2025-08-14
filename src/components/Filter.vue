<script setup lang="ts">
  import customAPI from '../utils/api';
  import { useQuery } from '@tanstack/vue-query';
  import { RouterLink, useRoute,useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { watch } from 'vue';

  const route = useRoute();
  const router = useRouter();

  const titleInput = ref(route.query.title as string || '');
  const categoryInput = ref(route.query.categoryId as string || '');
  const sortInput = ref(route.query.sortBy as string || 'createAt');
  const sortOrderInput = ref(route.query.sortOrder as string || 'desc');

  const fecthDataCategories = async () => {
    const { data } = await customAPI.get('/category');
    return data;
  };

  const { data,isLoading,error } = useQuery({
    queryKey: ['categories'],
    queryFn: fecthDataCategories,
  });

  const handleFilter = () => {
    router.push({query:{
      ...route.query,
      title: titleInput.value,
      categoryId: categoryInput.value,
      sortBy: sortInput.value,
      sortOrder: sortOrderInput.value,
      page: '1', // Reset to page 1 on filter change
      limit: route.query.limit || '6' // Maintain the limit or set default
    }})
  };
  watch(
    () => route.query,
    (newQuery) => {
      titleInput.value = (newQuery.title as string) || '';
      categoryInput.value = (newQuery.categoryId as string) || '';
      sortInput.value = (newQuery.sortBy as string) || 'createAt';
      sortOrderInput.value = (newQuery.sortOrder as string) || 'desc';
    },
    { immediate: true } // langsung dijalankan saat mounted
  );
</script>
<template>
  <fieldset class="fieldset bg-base-300 border-info rounded-box border p-4 w-full">
    <legend class="fieldset-legend">Filter Article</legend>

    <form @submit.prevent="handleFilter">
      <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-5">
        <input v-model="titleInput" type="text" class="input w-full" placeholder="Pencarian berdasarkan judul" />

        <select v-model="categoryInput" class="select w-full">
          <option value="" disabled>Pilih Category</option>
          <option value="" v-if="isLoading">Loading ....</option>
          <option value="" v-else-if="error">Category Error</option>
          <option v-else v-for="category in data" :value="category.id" :key="category.id">{{category.name}}</option>
        </select>

        <select v-model="sortInput" class="select w-full">
          <option value="" disabled>Pilih Sort By</option>
          <option value="createAt">Tanggal Pembuatan</option>
          <option value="title">Judul Article</option>
          <option value="category">Kategori Article</option>
        </select>

        <select v-model="sortOrderInput" class="select w-full">
          <option value="" disabled>Pilih Sort Order</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      

      <button class="btn btn-primary btn-block mt-4" type="submit">Filter</button>
      <RouterLink class="btn btn-error btn-block mt-4" :to="{name:'article'}">Reset Filter</RouterLink>
    </form>
  </fieldset>
</template>