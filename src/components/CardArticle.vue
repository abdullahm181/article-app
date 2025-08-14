<template>
  <div class="card card-side bg-base-200 shadow-sm mt-10">
    <figure class="w-[200px] h-auto flex-shrink-0 ">
      <img :src="item.image" :alt="item.title" loading="lazy" class="w-full h-full object-cover" />
    </figure>
    <div class="card-body ">
      <RouterLink :to="{name:'detailArticle', params: {id: item.id}}" >
        <h2 class="card-title text-primary">{{item.title}}</h2>
      </RouterLink>
      <div class="badge badge-success ">{{item.category.name}}</div>
      <p>{{item.content.substring(0,200)}}</p>
      <div class="card-actions justify-between">
        <div>
          <p>writen by: <span class="font-bold">{{item.user.name}}</span></p>
          <span class="text-secondary">{{new Date(item.createAt).toDateString()}}</span>
        </div>
        <!-- <button class="btn btn-primary">Detail</button> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import type { ArticleProps } from '../types/articleProps';
  defineProps<{
    item: ArticleProps;
  }>();
</script>