<script setup lang="ts">
  import customAPI from '@/utils/api';
  import { useAuthStore } from '@/store/auth';
  import { useQuery } from '@tanstack/vue-query';
  import ErrorComponent from '@/components/ErrorComponent.vue';
  import Loading from '@/components/Loading.vue';

  const authStore = useAuthStore();

  const fetchDataProfile = async () => {
    const { data } = await customAPI.get('/profile',{
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchDataProfile,
  });

</script>
<template>
  <h1 class="text-info text-2xl font-bold">Halaman Profile</h1>
  <div v-if="isLoading"><Loading /> Loading ....</div>
  <div v-else-if="error">
    <ErrorComponent :error="error" />
  </div>
  <div v-else class="my-3">
    <div v-if="data.profile" class="card bg-base-300">
      <div class="card-body">
      <h2 class="card-title">{{ data.name }} ({{ data.age }} Tahun)</h2>
      <p>{{ data.profile.bio }}</p>
      <div class="card-actions">
        <RouterLink :to="{name:'updateProfile'}" class="btn btn-info my-2">Update Profile</RouterLink>
      </div>
    </div>
    </div>
    <div v-else>
      <h2 class="text-xl font-bold">Belum ada Profile</h2>
      <RouterLink :to="{name:'createProfile'}" class="btn btn-info my-2">Buat Profile</RouterLink>
    </div>
  </div>
</template>