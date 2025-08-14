<script setup lang="ts">
  import { useAuthStore } from '@/store/auth';
  import { RouterLink } from 'vue-router';
  import { useRouter } from 'vue-router';
  import { useMutation,useQuery } from '@tanstack/vue-query';
  import customAPI from '@/utils/api';

  const authStore = useAuthStore();
  const router = useRouter();

  const fecthCategories = async () => {
    const { data } = await customAPI.get('/category');
    return data;
  };

  const { data,isLoading,error } = useQuery({
    queryKey: ['categoriesNav'],
    queryFn: fecthCategories,
  });

  const LogoutMutation = useMutation({
    mutationFn: async () => {
      // Perform logout API call if needed
      // await customAPI.post('/auth/logout');
      authStore.clearAuth();
    },
    onSuccess: () => {
      router.push({ name: 'login' });
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    },
  });

  const handleLogout = () => {
    LogoutMutation.mutate();
  };
</script>
<template>
  <header>
    <div class="navbar bg-base-100 shadow-sm fixed z-10 top-0 right-0 left-0">
      <div class="navbar-start">
        <!-- Mobile -->
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><RouterLink :to="{name:'article'}">Article</RouterLink></li>
            <li>
              <a>Category</a>
              <ul class="p-2">
                <li v-if="isLoading">Loading .....</li>
                <li v-else-if="error">Error</li>
                <li v-else v-for="category in data" :key="category.id">
                  <RouterLink :to="{name:'article',query:{categoryId:category.id}}">{{category.name}}</RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <a class="btn btn-ghost text-xl">Logo</a>
      </div>
      <!-- PC -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><RouterLink :to="{name:'article'}">Article</RouterLink></li>
          <li>
            <details>
              <summary>Category</summary>
              <ul class="p-2">
                <li v-if="isLoading">Loading .....</li>
                <li v-else-if="error">Error</li>
                <li v-else v-for="category in data" :key="category.id">
                  <RouterLink :to="{name:'article',query:{categoryId:category.id}}">{{category.name}}</RouterLink>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div class="navbar-end">
        <div v-if="authStore?.isAuthenticated">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-info rounded-field">{{ authStore?.user?.name }}</div>
            <ul
              tabindex="0"
              class="menu dropdown-content bg-base-200 border border-info rounded-box z-1 mt-4 w-52 p-2 shadow-sm">
              <li><RouterLink :to="{name:'dashboard'}">Dashboard</RouterLink></li>
              <li><RouterLink :to="{name:'profile'}">Profile</RouterLink></li>
              <li><span class="text-error" @click="handleLogout">Logout</span></li>
            </ul>
          </div>
        </div>
        <div v-else>
          <RouterLink :to="{name:'login'}" class="btn btn-primary">Login</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">

</script>
