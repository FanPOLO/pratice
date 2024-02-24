<template>
    <LoaDing :active="isLoading"></LoaDing>
    <div class="text-end">
        <button class="btn btn-primary" type="button"
        @click="openmodal(true)">
            增加產品
        </button>
    </div>
    <table class="table mt-4">
    <thead>
        <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="item in products" :key="item.id">
        <td>{{ $filters.currency( item.category ) }}</td>
        <td>{{ item.title }}</td>
        <td class="text-right">
            {{ currency( item.price ) }}
        </td>
        <td class="text-right">
            100
        </td>
        <td>
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
            <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm"
            @click="openmodal(false, item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm"
            @click="openDelProductModal(item)">刪除</button>
            </div>
        </td>
        </tr>
    </tbody>
    </table>
    <Pagination :pages="pagination"
    @emit-pages="getProducts"></Pagination>
    <ProductModal ref="productModal"  :product="tempProduct"
    @update-product="updateProduct"></ProductModal>
    <DelModal :item="tempProduct" ref="delModal" @del-item="delProduct"/>
</template>

<script>
import Pagination from '@/components/Pagination.vue';
import ProductModal from '../components/ProductModal.vue';
import DelModal from '../components/DelModal.vue';
import { currency } from '../methods/filters';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false, //  是否是新增狀態
      isLoading: false,
    };
  },
  components: {
    ProductModal,
    DelModal,
    Pagination,
  },
  inject: ['emitter'],
  methods: {
    currency,
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products/?page=${page}`;
      this.isLoading = true;
      this.$http.get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            console.log(res);
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }
        });
    },
    openmodal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
      } else {
        this.tempProduct = { ...item };
      }
      this.isNew = isNew;
      const productComponent = this.$refs.productModal;
      productComponent.showmodal();
    },
    updateProduct(item) {
      console.log(item);
      this.tempProduct = item;
      console.log('傳遞近來', this.tempProduct);
      // 新增
      let api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`;
      console.log('傳遞近來', api);
      let httpMethod = 'post';
      // 編輯
      if (!this.isNew) {
        api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
        httpMethod = 'put';
      }
      const productComponent = this.$refs.productModal;
      console.log('傳遞近來', productComponent);
      this.$http[httpMethod](api, { data: this.tempProduct }).then((response) => {
        console.log(response);
        productComponent.hidemodal();
        if (response.data.success) {
          this.getProducts();
          this.emitter.emit('push-message', {
            style: 'success',
            title: '更新成功',
          });
        } else {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新失敗',
            content: response.data.message.join('、'),
          });
        }
      });
    },
    // 開啟刪除 Modal
    openDelProductModal(item) {
      this.tempProduct = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.showmodal();
    },
    delProduct() {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      this.$http.delete(url).then((response) => {
        console.log(response.data);
        const delComponent = this.$refs.delModal;
        delComponent.hidemodal();
        this.getProducts();
        if (!response.data.success) {
          this.emitter.emit('push-message', {
            style: 'fail',
            title: '更新失敗',
          });
        } else {
          this.emitter.emit('push-message', {
            style: 'success',
            title: '更新成功',
          });
        }
      });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
