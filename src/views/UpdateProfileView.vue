<script setup lang="ts">
  import ProfileForm from '@/components/ProfileForm.vue';
  import { useAuthStore } from '@/store/auth';
  import customAPI from '@/utils/api';
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
    queryKey: ['profileForm'],
    queryFn: fetchDataProfile,
  });
</script>
<template>
  <h1 class="text-3xl font-bold text-info">Update Profile</h1>
  <div v-if="isLoading"><Loading /> Loading .... </div>
  <div v-else-if="error"><ErrorComponent /></div>
  <div v-else>
    <ProfileForm :isUpdate="true" :data="data.profile"/>
  </div>
</template>