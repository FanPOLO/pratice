import Modal from 'bootstrap/js/dist/modal';

export default {
  methods: {
    showmodal() {
      this.modal.show();
    },
    hidemodal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
  },
};
