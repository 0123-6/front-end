/* eslint-disable */

export default {
  methods: {
    toCorporatePortrait(id) {
      if (window.location.pathname.indexOf('/corporate-portrait') > -1) {
        window.open(`${location.origin}/corporate-portrait/${id}`, '_blank')
        return;
      }
      this.$emit('detail')
      this.$router.push(`/corporate-portrait/${id}`);
    },
  }
};
