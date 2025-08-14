import { defineStore } from "pinia";
import type { UserProps } from '../types/userProps';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user:null as UserProps | null,
    isAuthenticated: false as boolean,
  }),
  persist: true,
  actions: {
    setAuth(token:string,user: UserProps) {
      this.token = token;
      this.user = user;
      this.isAuthenticated = true;
    },
    clearAuth() {
      this.user = null ;
      this.isAuthenticated = false;
      this.token = null;
    },
  },
}); 