<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'

const props = defineProps(['placeholder', 'onChange'])

const hours = Array(24)
  .fill(0)
  .map((_, i) => (i < 10 ? `0${i}` : i))

const mins = Array(60)
  .fill(0)
  .map((_, i) => (i < 10 ? `0${i}` : i))

const showFlag = ref(false) //下拉是否显示
function show() {
  if (hourValue.value) {
    hourSelected.value = hourValue.value
  } else {
    hourSelected.value = '00'
  }
  if (minValue.value) {
    minSelected.value = minValue.value
  } else {
    minSelected.value = '00'
  }
  showFlag.value = true
}
function hide() {
  showFlag.value = false
}
onBeforeUnmount(() => {
  document.removeEventListener('click', hide)
})
onMounted(() => {
  document.addEventListener('click', hide)
})

const hourSelected = ref() //选中的小时
const minSelected = ref() //选中的分钟
function hourClickHandler(value) {
  hourSelected.value = value
}
function minClickHandler(value) {
  minSelected.value = value
}

const hourValue = ref()
const minValue = ref()
function okHandler() {
  if (hourSelected.value && minSelected.value) {
    hourValue.value = hourSelected.value
    minValue.value = minSelected.value
    if (props.onChange) {
      props.onChange(hourSelected.value + ': ' + minSelected.value)
    }
    hide()
  }
}

function nowHandler() {
  let hour = new Date().getHours()
  if (hour < 10) {
    hour = `0${hour}`
  } else {
    hour = hour.toString()
  }
  let min = new Date().getMinutes()
  if (min < 10) {
    min = `0${min}`
  } else {
    min = min.toString()
  }
  hourValue.value = hour
  minValue.value = min
  if (props.onChange) {
    props.onChange(hour + ': ' + min)
  }
  hide()
}

const selectedTime = computed(() => {
  if (showFlag.value) {
    if (hourSelected.value && minSelected.value) {
      return hourSelected.value + ': ' + minSelected.value
    } else {
      return props.placeholder ? props.placeholder : '请选择时间'
    }
  } else {
    if (hourValue.value && minValue.value) {
      return hourValue.value + ': ' + minValue.value
    } else {
      return props.placeholder ? props.placeholder : '请选择时间'
    }
  }
})

// 清空数据，暴露给父组件
function clearData() {
  hourSelected.value = null
  minSelected.value = null
  hourValue.value = null
  minValue.value = null
}
defineExpose({
  clearData
})
</script>

<template>
  <div class="time-picker-container">
    <div class="time-picker-value" :class="{ hasValue: hourValue && minValue }" @click.stop="show">
      {{ selectedTime }}
    </div>
    <div class="time-picker-dropdown" v-show="showFlag">
      <div class="time-select">
        <div class="hour">
          <ul>
            <li
              v-for="item in hours"
              :key="item"
              @click.stop="hourClickHandler(item)"
              :class="{ selected: item === hourSelected }"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="min">
          <ul>
            <li
              v-for="item in mins"
              :key="item"
              @click.stop="minClickHandler(item)"
              :class="{ selected: item === minSelected }"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="time-picker-footer">
        <span class="now" @click.stop="nowHandler">此刻</span>
        <span class="ok" @click.stop="okHandler"><span>OK</span></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  opacity: 0.3;
  border-radius: 3px;
}
.time-picker-container {
  position: relative;
}
.time-picker-dropdown {
  position: absolute;
  top: 100%;
  z-index: 99;
}
.time-picker-value {
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.1) url('@/assets/images/icons/time.svg') no-repeat right 10px
    top 50%;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  &.hasValue {
    color: #fff;
  }
}
.time-picker-dropdown {
  width: 112px;
  border-radius: 8px;
  overflow: hidden;
}
.time-select {
  display: flex;
  height: 276px;
  background: #484848;
  > div {
    flex: 1;
    overflow-y: hidden;
    font-size: 1.4rem;
    color: #fff;
    scrollbar-gutter: stable;
    user-select: none;
    &:hover {
      overflow-y: scroll;
    }
    ul {
    }
    li {
      width: 100%;
      text-align: center;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      &:hover,
      &.selected {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
.time-picker-footer {
  height: 44px;
  background: #5a5a5a;
  display: flex;
  > span {
    flex: 1;
    font-size: 1.4rem;
    color: #c6a175;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .ok {
    color: #fff;
    span {
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      background: #c6a175;
      border-radius: 4px;
    }
  }
}
</style>
