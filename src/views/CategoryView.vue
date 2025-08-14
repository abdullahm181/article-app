<script setup lang="ts">
  import { useQuery,useMutation,useQueryClient } from '@tanstack/vue-query';
  import customAPI from '@/utils/api';
  import Loading from '@/components/Loading.vue';
  import ErrorComponent from '@/components/ErrorComponent.vue';
  import { useAuthStore } from '@/store/auth';
  import { ref } from 'vue';


  // state
  const isShowForm= ref<boolean>(false);
  const name = ref<string>('');
  const isUpdate = ref<null|boolean>(false);
  const id = ref<null|string>(null);

  const authStore = useAuthStore();
  const queryClient = useQueryClient();
  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: async () => {
      const { data } = await customAPI.post('/category', { name: name.value },{
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      closeForm();
      alert('Success to create category.')
      queryClient.invalidateQueries({ queryKey: ['CategoryDashboard'] });
    },
    onError: (error) => {
      console.error('Create category failed:', error);
      alert('Failed to create category. Please try again.');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async () => {
      const { data } = await customAPI.put(`/category/${id.value}`, { name: name.value },{
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      closeForm();
      alert('Success to update category.')
      queryClient.invalidateQueries({ queryKey: ['CategoryDashboard'] });
    },
    onError: (error) => {
      console.error('Create category failed:', error);
      alert('Failed to update category. Please try again.');
    },
  });
  // Events
  const showCreateForm= () => {
    isShowForm.value = true;
    name.value = '';
    isUpdate.value = false;
    id.value = null;
  };

  const showUpdateForm= (item:{name:string;id:string}) => {
    isShowForm.value = true;
    name.value = item.name;
    isUpdate.value = true;
    id.value = item.id;
  };

  const closeForm = () => {
    isShowForm.value = false;
    name.value = '';
    isUpdate.value = false;
    id.value = null;
  };

  const handleSubmit = () => {
    if (isUpdate.value) {
      updateCategoryMutation.mutate();
    } else {
      createCategoryMutation.mutate();
    }
  };

  const handleDelete = async (category:{id: string;name:string;}) => {
    if (confirm('Are you sure you want to delete this category "'+category.name+'"?')) {
      await customAPI.delete(`/category/${category.id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      .then(() => {
        alert('Category deleted successfully.');
        // queryClient.invalidateQueries({ queryKey: ['CategoryDashboard'] });
        refetch();
      })
      .catch((error) => {
        console.error('Delete category failed:', error);
        alert('Failed to delete category. Please try again.');
      });
    }
  };
  
  const fetchDataCategories = async () => {
    const {data} = await customAPI.get('/category');
    return data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['CategoryDashboard'],
    queryFn: fetchDataCategories,
  });
</script>
<template>
  <h1 class="text-3xl font-bold mb-3 text-info">Master Category</h1>
  <button type="button" class="btn btn-primary my-3" @click="showCreateForm">➕ Tambah</button>
  <!-- Form start -->
   <div class="my-5" v-if="isShowForm">
    <fieldset class="fieldset bg-base-300 border-info rounded-box border p-4">
      <h1 class="text-info text-xl">{{ isUpdate? 'Update Category':'Create Category'}}</h1>
      <form @submit.prevent="handleSubmit">
        <label class="label">Name</label>
        <input v-model="name" type="text" class="input w-full" placeholder="Masukan name Category anda" />

        <div class="flex gap-x-3">
          <button class="btn btn-info mt-4" type="submit">{{ isUpdate? 'Update':'Create'}}</button>
          <button class="btn btn-error mt-4" type="button" @click="closeForm">Batal</button>
        </div>
      </form>      
    </fieldset>
   </div>
  <!-- Form end -->
  <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- row  -->
        <tr v-if="isLoading"><Loading /> Loading ...</tr>
        <tr v-else-if="error"><ErrorComponent /></tr>
        <tr v-else v-for="(category,index) in data" :key="category.id">
          <th>{{ index+1 }}</th>
          <td>{{category.name}}</td>
          <td>
            <div class="flex gap-x-3">
              <button type="button" class="btn btn-warning btn-sm" @click="showUpdateForm(category)">Update</button>
              <button type="button" class="btn btn-error btn-sm" @click="handleDelete(category)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>