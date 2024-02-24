<template>
    <nav-bar></nav-bar>
    <div class="container-fluid mt-3 position-relative">
      <ToastMessages></ToastMessages>
      <router-view/>
    </div>
</template>

<script>
import ToastMessages from '@/components/ToastMessages.vue';
import emitter from '../methods/emitter';
import NavBar from '../components/NavBar.vue';

export default {
  components: {
    NavBar,
    ToastMessages,
  },
  provide() {
    return {
      emitter,
    };
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    console.log(token);
    this.$http.defaults.headers.common.Authorization = `${token}`;
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    this.$http.post(api).then((res) => {
      if (!res.data.success) {
        this.$router.push('/LoginAccount');
        emitter.emit('push-message', {
          style: 'danger',
          title: '登入失敗',
        });
      } else {
        emitter.emit('push-message', {
          style: 'success',
          title: '登入成功',
        });
      }
    });
  },
};
</script>
