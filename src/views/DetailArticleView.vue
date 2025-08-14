<script setup lang="ts">
  import customAPI from '../utils/api';
  import { useQuery } from '@tanstack/vue-query';
  import { useRoute } from 'vue-router';
  import Loading from '../components/Loading.vue';
  import ErrorComponent from '../components/ErrorComponent.vue';

  let route = useRoute();
  
  const fetchData = async () => {
    const {data} = await customAPI.get(`/article/${route.params.id}`);
    //console.log(data);

    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });
</script>
<template>
  <article>
    <div v-if="isLoading"><Loading />Loading .....</div>
    <div v-else-if="error"><ErrorComponent/></div>
    <section v-else>
      <h1 class="text-info text-4xl font-bold">{{data.title}}</h1>
      <span class="badge badge-success">{{data.category?.name}}</span>
      <section class="my-3 border-b border-info py-5">
        <span class="font-bold">writen by:</span> {{data.user?.name}}
        <span>{{new Date(data.createAt).toDateString()}}</span>
      </section>
      <section class="my-3 border-b border-info py-5 mb-5">
        <img :src="data.image" :alt="data.title" class="object-cover mx-auto" >
      </section>
      <section class="my-3 border-b border-info py-5 mb-5">
        <p>{{data.content}}</p>
      </section>
      <!-- TAG -->
       <div v-if="data?.articleTags && data.articleTags?.length>0">
        <div class="badge badge-success mr-3" v-for="articleTag in data.articleTags" :key="articleTag.id" >{{articleTag.tag.name}}</div>
       </div>
      <!-- END TAG -->  
       <section class="my-5">
        <h1 class="text-2xl font-bold text-info my-2">List Komentar</h1>
          <div v-if="data?.comments && data.comments?.length>0">
            <div class="card card-border border-info bg-base-300" v-for="comment in data.comments" :key="comment.id">
            <div class="card-body">
              <h2 class="card-title">{{comment.user.name}}</h2>
              <p>{{comment.content}}</p>
              <small class="text-xs">
                {{ new Date(comment.createdAt).toDateString() }}
              </small>
            </div>
          </div>
        </div>
        <div v-else>
          <h1 class="text-xl font-bold">Belum ada komentar</h1>
        </div>
        
       </section>
    </section>
  </article>
</template>