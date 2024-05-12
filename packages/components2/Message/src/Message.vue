<script>
import { reactive, toRefs } from "vue";
export default {
  props: {
    config: { type: Object, default: () => {} }, // 消息配置项
    remove: { type: Function, default: () => {} }, // 取消挂载回调
  },
  setup(props) {
    const state = reactive({
      visibled: false,
    })

    // 打开消息
    const onOpen = (config) => {
      setTimeout(() => {
        state.visibled = true;
      }, 10)

      // 指定时间后移除消息
      if (config.duration !== 0) {
        setTimeout(() => {
          onClose();
        }, config.duration);
      }
    }

    onOpen(props.config)

    // 消息关闭
    const onClose = () => {
      state.visibled = false;
      setTimeout(() => {
        props.remove()
      }, 200)
    };

    return {
      ...toRefs(state),
      onOpen,
      onClose,
    };
  },
};
</script>

<template>
  <!-- 消息列表 -->
  <Transition name="slide-fade">
    <div class="message-container" v-show="visibled">
      <!-- 内容 -->
      <div class="message-content">

        <!-- 消息类型图标，通过消息类型确定，text类型不配置图标 -->
        <div class="message-icon" v-if="config.icon">
          <i :class="config.icon"></i>
        </div>

        <!-- 消息文本 -->
        <span v-text="config.content"></span>

        <!-- 手动关闭消息 -->
        <div class="option" v-if="config.close">
          <i class="ri-close-fill" @click="onClose"></i>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
//加scope无效
$radius: 4px;
$normalHeight: 34px;

.message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  z-index: 9999;
  transform: translateZ(9999px);
  padding-top: 28px;
  transition: top .4s ease;

  .message-container {
    margin-bottom: 14px;

    .message-content {
      display: inline-block;
      padding: 0 18px;
      height: $normalHeight;
      text-align: left;
      line-height: $normalHeight;
      font-size: 14px;
      font-weight: 400;
      border-radius: $radius;
      color: #000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
      background:  linear-gradient(91.26deg, #FADF89 0.51%, #E4C7AA 50.6%, #C6822F 99.39%);

      .option {
        display: inline-block;
        pointer-events: all;
        margin-left: 18px;

        i {
          font-size: 18px;
          font-weight: 400;
          margin-top: -3px;
          display: inline-block;
          box-sizing: border-box;
          vertical-align: middle;
          cursor: pointer;
          color: #d9d9d9;
          transition: color 0.2s ease;

          &:hover {
            color: #ff7c75;
            transition: color 0.2s ease;
          }
        }
      }
    }

    .message-icon {
      display: inline-block;

      i {
        font-size: 18px;
        font-weight: 400;
        margin-top: -3px;
        margin-right: 6px;
        display: inline-block;
        box-sizing: border-box;
        vertical-align: middle;
      }

      .ri-checkbox-circle-fill {
        color: #58c05b;
      }

      .ri-close-circle-fill {
        color: #fd4f4d;
        width: 20px;
        height: 20px;
        background-color: red;
        -webkit-mask-image: url('close-circle-fill.svg');
        mask-image: url('close-circle-fill.svg');
      }
    }
  }
}
.slide-fade-enter-active {
  transition: all .2s ease-out;
}

.slide-fade-leave-active {
  transition: all .2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>