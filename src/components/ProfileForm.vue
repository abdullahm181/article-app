<script setup lang="ts">
  import { ref,onMounted } from 'vue';
  import { useAuthStore } from '@/store/auth';
  import { useMutation } from '@tanstack/vue-query';
  import customAPI from '@/utils/api';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();

  //mutation
  const ProfileMutation = useMutation({
    mutationFn: async () => {
      const profileData = {
        age: age.value,
        bio: bio.value,
      };
      // Simulate API call
      const { data } = await customAPI.post('/profile', profileData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      router.replace({ name: 'profile' });
    },
    onError: (error) => {
      console.error('Profile creation failed:', error);
      alert('Profile creation failed. Please try again.');
    },
  });

  //props
  const props = withDefaults(defineProps<{
  isUpdate?: boolean
  ,data?: {
      age: number;
      bio: string;
    }
}>(), {
  isUpdate: false
});
  
  onMounted(() => {
    if (props.isUpdate && props.data) {
      age.value = props.data.age || 0;
      bio.value = props.data.bio || '';
    }
  });

  //state
  const age = ref(0);
  const bio = ref('');

  //Event Handlers
  const handleSubmit = async () => {
    ProfileMutation.mutate();
  };
  
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <label class="label my-2">Age</label>
    <input type="number" v-model="age" placeholder="Masukkan umur anda" class="input w-full" required />

    <label class="label my-2">Biodata</label>
    <textarea v-model="bio" placeholder="Masukkan biodata anda" class="textarea w-full" required />

    <button type="submit" class="btn btn-info mt-4">{{ isUpdate ?'Update Profile':'Create Profile' }}</button>
  </form>
</template>