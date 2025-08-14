<script setup lang="ts">
  import { ref } from 'vue';
  import { useMutation } from '@tanstack/vue-query';
  import customAPI from '@/utils/api';
  import { RouterLink, useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/auth';

  const router= useRouter();
  const authStore = useAuthStore();

  // props 
  const props = defineProps({
    isRegister: {
      type: Boolean,
      default: false,
    },
  });

  const name = ref('');
  const email = ref('');
  const password = ref('');

  const AuthMutation = useMutation({
    mutationFn: async () => {
      //Register
      if (props.isRegister) {
        await customAPI.post('/auth/register', {
          name: name.value,
          email: email.value,
          password: password.value,
        });
      }

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
    <form @submit.prevent="AuthSubmitHandle">
      <fieldset class="fieldset bg-base-300 border-info rounded-box w-md border p-4">
          <!-- <legend class="fieldset-legend">Login</legend> -->
           <h1 class="text-3xl font-bold text-info text-center">{{ props.isRegister?'Register':'Login' }}</h1>

          <label v-if="props.isRegister" class="label">Username</label>
          <input v-if="props.isRegister" v-model="name" type="text" class="input w-full" placeholder="insert your username" />
  
          <label class="label">Email</label>
          <input v-model="email" type="email" class="input w-full" placeholder="Email" />
  
          <label class="label">Password</label>
          <input v-model="password" type="password" class="input w-full" placeholder="Password" />
  
          <button class="btn btn-info mt-4" type="submit">{{ props.isRegister?'Register':'Login' }}</button>
          <p v-if="props.isRegister" class="text-center">
            Sudah punya akun? <RouterLink :to="{name:'login'}" class="link link-primary">Login disini</RouterLink>
          </p>
          <p v-else>
            Belum punya akun? <RouterLink :to="{name:'register'}" class="link link-primary">Register disini</RouterLink>
          </p>
        </fieldset>
    </form>
  </div>  
</template>