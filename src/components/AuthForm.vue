<script setup lang="ts">
  import { ref } from 'vue';
  import { useMutation } from '@tanstack/vue-query';
  import customAPI from '@/utils/api';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/Auth';

  const router= useRouter();
  const authStore = useAuthStore();

  const email = ref('');
  const password = ref('');

  const AuthMutation = useMutation({
    mutationFn: async () => {
      //Login
      const { data } = await customAPI.post('/auth/login', {
        email: email.value,
        password: password.value,
      });

      //Get user
      const user=await customAPI.get('/auth/getUser',{
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        }
      });
      return {user: user.data, access_token: data.access_token};
    },
    onSuccess: (data) => {
      authStore.setAuth(data.access_token,data.user); 
      router.push({ name: 'home' });
    },
    onError: (error) => {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    },
  });

  const AuthSubmitHandle = () => {
    AuthMutation.mutate();
  };
</script>
<template>
  <div class="flex justify-center">
    <form @submit.prebvent="AuthSubmitHandle">
      <fieldset class="fieldset bg-base-300 border-info rounded-box w-md border p-4">
          <legend class="fieldset-legend">Login</legend>
  
          <label class="label">Email</label>
          <input v-model="email" type="email" class="input w-full" placeholder="Email" />
  
          <label class="label">Password</label>
          <input v-model="password" type="password" class="input w-full" placeholder="Password" />
  
          <button class="btn btn-neutral mt-4" type="submit">Login</button>
        </fieldset>
    </form>
  </div>  
</template>