<template>
  <div class="ee-tag" :class="className">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'EeTag',
  props: {
    type: {
      type: String,
      default: ''
    },
    shape: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'normal'
    },
    single: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className() {
      return `ee-tag--${this.shape} is-${this.type} is-${this.size} ${this.single ? 'is-single' : ''}`
    }
  }
};
</script>
<style lang="scss">
.ee-tag {
  display: inline-block;
}

.ee-tag--arrow {
  padding-right: 4px;
  flex-shrink: 0;
  width: 66px;
  height: 22px;
  background-position: left center;
  background-repeat: no-repeat;
  background-size: auto;
  text-align: center;
  font-size: 12px;
  line-height: 22px;
  color: #fff;

  &.is {
    &-primary {
      background-image: url("@/assets/images/tag-primary.svg");
    }

    &-success {
      background-image: url("@/assets/images/tag-success.svg");
    }

    &-danger {
      background-image: url("@/assets/images/tag-danger.svg");
    }

    &-warning {
      background-image: url("@/assets/images/tag-warning.svg");
    }

    &-info {
      background-image: url("@/assets/images/tag-info.svg");
    }
  }
}

.ee-tag--oval {
  padding: 0 12px;
  height: 21px;
  border-radius: 21px;
  line-height: 21px;
  font-size: 12px;
  font-weight: 500;

  &.is {
    &-success {
      background: rgba(104, 205, 68, 0.16);
      color: #68cd44;
    }

    &-primary {
      background: rgba(2, 173, 236, 0.16);
      color: #02adec;
    }

    &-info {
      background: rgba(183, 193, 197, 0.16);
      color: #b7c1c5;
    }
  }

  &.is-dark {
    &.is {
      &-success {
        background: #E7F7E1;
      }

      &-primary {
        background: #D7F2FC;
      }

      &-info {
        background: #F3F5F6;
      }
    }
  }
}

.ee-tag--round-rect {
  padding: 0 10px;
  height: 29px;
  border-radius: 8px;
  line-height: 29px;
  font-size: 12px;

  &.is {
    &-primary {
      background: #E5F6FD;
      color: #02adec;
    }

    &-success {
      background: #EFFAEC;
      color: #68CD44;
    }

    &-danger {
      background: #FCEDED;
      color: #E85050;
    }

    &-warning {
      background: #FEF7ED;
      color: #FAB752;
    }

    &-alert {
      background: #FDF3ED;
      color: #f28c53;
    }

    &-info {
      background: #F7F8F9;
      color: #a8acad;
    }
  }

  &.is-dark {
    color: #fff;
    font-weight: 500;

    &.is {
      &-primary {
        background: #02adec;
      }

      &-success {
        background: #68CD44;
      }

      &-danger {
        background: #E85050;
      }

      &-warning {
        background: #FAB752;
      }

      &-alert {
        background: #f28c53;
      }

      &-info {
        background: #B7C1C5;
      }
    }
  }

  &.is-single {
    padding: 0;
    width: 20px;
    height: 18px;
    line-height: 18px;
    border-radius: 4px;
    text-align: center;
  }

  &.is-small {
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    min-width: 64px;
    text-align: center;
  }

  &.is-mini {
    padding: 0 8px;
    height: 20px;
    line-height: 20px;
  }
}

.ee-tag--corner {
  padding: 0 20px;
  height: 32px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  line-height: 32px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;

  &.is {
    &-success {
      background: #68CD44;
    }

    &-primary {
      background: #02adec;
    }

    &-danger {
      background: #e85050;
    }

    &-alert {
      background: #f28c53;
    }

    &-info {
      background: #a8acad;
    }
  }
}

.ee-tag--dot {
  position: relative;
  padding-left: 12px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;

  &.sm-space {
    padding-left: 10px;
  }

  &.is-dark {
    font-weight: 500;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    transform: translateY(-50%);
  }

  .text {
    color: #929da3 !important;
  }

  &.is-primary {
    color: #02adec;

    &::before {
      background: #02adec;
    }
  }

  &.is-danger {
    color: #e85050;

    &::before {
      background: #e85050;
    }
  }

  &.is-warning {
    color: #fab752;

    &::before {
      background: #fab752;
    }
  }

  &.is-alert {
    color: #f28c53;

    &::before {
      background: #f28c53;
    }
  }

  &.is-success {
    color: #68cd44;

    &::before {
      background: #68cd44;
    }
  }

  &.is-info {
    color: #b7c1c5;

    &::before {
      background: #b7c1c5;
    }
  }

  &.is-blue {
    color: #2d69f6;

    &::before {
      background: #2d69f6;
    }
  }
}
</style>