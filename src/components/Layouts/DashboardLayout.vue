<script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '@/store/auth';
  import { useRouter } from 'vue-router';
  import { useMutation } from '@tanstack/vue-query';

  const authStore = useAuthStore();
  const router = useRouter();

  const isOpenSidebar = ref(false);

  const toggleSidebar = () => {
    isOpenSidebar.value = !isOpenSidebar.value;
  };
  const closeSidebar = () => {
    isOpenSidebar.value = false;
  };

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
  <div class="flex h-screen">
    <!-- Sidebarr Large-->
     <div :class="[
        'bg-base-200 w-64 space-y-4 transition-transform duration-300 fixed z-40 h-full lg:static',
        isOpenSidebar ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0' // pastikan ini override di layar besar
      ]">
      <h2 class="text-2xl font-bold m-5">{{ authStore.user?.name }}</h2>
      <ul class="menu bg-base-200 rounded-box w-56">
        <li>
          <h2 class="menu-title">Dashboard</h2>
          <ul>
            <li><RouterLink class="text-md" :to="{name:'dashboard'}">🏠 Home</RouterLink></li>
          </ul>
        </li>
        <li>
          <h2 class="menu-title">User</h2>
          <ul>
            <li><RouterLink class="text-md" :to="{name:'profile'}">🖼 Profile</RouterLink></li>
          </ul>
        </li>
        <li v-if="authStore.user?.role === 'admin'">
          <h2 class="menu-title">Master</h2>
          <ul>
            <li><RouterLink class="text-md" :to="{name:'category'}">🛬 Category</RouterLink></li>
          </ul>
        </li>
      </ul>
     </div>
     <!-- Sidebarr Mobile-->
     <div v-if="isOpenSidebar" class="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" @click="closeSidebar"/>

     
     <!-- Main Content  -->
      <div class="flex-1 flex-col min-h-screen">
        <!-- Navbar -->
        <div class="navbar bg-base-200 shadow-sm">
          <div class="flex-none lg:hidden">
            <button class="btn btn-square btn-ghost" @click="toggleSidebar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
            </button>
          </div>
          <div class="flex-1 font-bold text-2xl px-2">
            <RouterLink :to="{name:'home'}" class="btn btn-ghost text-xl">Public</RouterLink>
          </div>
          <div class="flex-none">
            <button class="btn btn-sm btn-error text-white" @click="handleLogout">
              Logout
            </button>
          </div>
        </div>
        <!-- Page Content -->
         <main class="p-6 flex-1 overflow-y-auto">
          <RouterView />
         </main>
      </div>
  </div>
</template>