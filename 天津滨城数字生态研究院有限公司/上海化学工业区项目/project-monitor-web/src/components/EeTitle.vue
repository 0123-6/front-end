<template>
  <div class="ee-title jc-between" :class="className">
    <span class="ee-title__text">{{ title }}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'EeTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    level: {
      type: String,
      default: '1'
    },
    white: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className() {
      return `level-${this.level} ${this.white ? 'is-white' : ''}`
    }
  }
};
</script>
<style lang="scss">
.ee-title {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 36px;

  &__text {
    color: #1a262c;
    font-size: 22px;
    font-weight: 500;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 26px;
    height: 26px;
    background: url("@/assets/icons/svg/double-round.svg") center no-repeat;
    background-size: 100% 100%;
  }

  &--secondary,
  &.level-2 {
    padding-left: 18px;

    .ee-title__text {
      font-size: 16px;
    }

    &::before {
      width: 12px;
      height: 12px;
      background: url("@/assets/icons/svg/four-corner-star.svg") center no-repeat;
    }

    &.is-white {
      &::before {
        background: url("@/assets/icons/svg/four-corner-star-w.svg") center no-repeat;
      }
    }
  }

  &.level-3 {
    padding-left: 14px;

    .ee-title__text {
      font-size: 14px;
    }

    &::before {
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background: #02ADEC;
    }
  }

  &.is-white {
    .ee-title__text {
      color: #fff;
    }
  }
}
</style>