<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import phoneCountryCode from './phone_country_code.json'

const props = defineProps(['onChange'])

const countryList = ref([])

const showFlag = ref(false) //下拉是否显示
function show() {
  showFlag.value = true
}
function hide() {
  showFlag.value = false
}

const countrySelected = ref() //选择的值
function itemClickHandler(value) {
  countrySelected.value = value
  hide()
  if (props.onChange) {
    props.onChange(value)
  }
}

// 搜索国家
const searchText = ref()
const filteredCountry = computed(() => {
  if (searchText.value) {
    const nameMatch = countryList.value.filter((country) => {
      if (country.name.includes(searchText.value)) {
        console.log(country.name, searchText.value, country.name.includes(searchText.value))
      }
      return country.name.includes(searchText.value)
    })
    if (nameMatch && nameMatch.length > 0) {
      return nameMatch
    }
    const codeMatch = countryList.value.filter((country) =>
      country.code.toString().includes(searchText.value)
    )
    return codeMatch
  } else {
    return countryList.value
  }
})

onMounted(() => {
  // 根据导入的json数据，初始化列表数据
  phoneCountryCode.forEach((country) => {
    countryList.value.push({
      countryCode: country['country_code'],
      code: '+' + country['phone_code'],
      name: country['country_cn'],
      // flag: new URL(`./images/${country['country_code']}.svg`, import.meta.url).href
    })
  })
  countrySelected.value = countryList.value[0]
  // 默认值需要传递
  props.onChange(countryList.value[0])
})

onBeforeUnmount(() => {
  document.removeEventListener('click', hide)
})

onMounted(() => {
  document.addEventListener('click', hide)
})

// 国旗图片懒加载
function flagLazyLoad() {

  const options = {
    root: document.querySelector('.dropdown-list ul'),
    rootMargin: "10px",
    threshold: 0.5
  };

  let observer = new IntersectionObserver((entries)=>{
    console.log(entries)
  }, options)

  observer.observe(document.querySelector('.dropdown-list ul li'))


}
onMounted(() => {
  // TODO 图片懒加载
  // flagLazyLoad();
})


</script>

<template>
  <div class="form-input-dropdown">
    <div class="dropdown-selected" @click.stop="show" v-if="countrySelected">
      <span class="select-flag"><img :src="`/flags/${countrySelected.countryCode}.svg`" /></span>
      <span class="name">{{ countrySelected.name }}</span>
      <span>{{ countrySelected.code }}</span>
    </div>
    <div class="dropdown-list" v-show="showFlag" @click.stop="">
      <div class="search-container">
        <input type="text" placeholder="搜索区号" v-model="searchText" />
        <img src="@/assets/images/icons/clear.svg" @click="searchText = ''" />
      </div>
      <ul>
        <li
          v-for="country in filteredCountry"
          :key="country.countryCode"
          @click.stop="itemClickHandler(country)"
        >
          <span class="icon-flag"><img :src="`/flags/${country.countryCode}.svg`" class="flag" /></span>
          <span>{{ country.name }}</span>
          <span>{{ country.code }}</span>
        </li>
      </ul>
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
.form-input-dropdown {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
}
.dropdown-selected {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
  gap: 5px;
  cursor: pointer;
  .select-flag {
    position: relative;
    width: 24px;
    height: 15px;
    overflow: hidden;
    border-radius: 3px;
    img {
      position: absolute;
      top: -8px;
      left: -3px;
      width: 32px;
    }
  }
  .name {
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.dropdown-list {
  position: absolute;
  top: 100%;
  z-index: 99;
  background: #484848;
  width: 297px;
  padding: 16px 16px 0px 16px;
  overflow: hidden;
  border-radius: 8px;
  ul {
    height: 320px;
    &:hover {
      overflow-y: scroll;
    }
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    //去掉图片黑边
    .icon-flag {
      position: relative;
      width: 40px;
      height: 24px;
      overflow: hidden;
      border-radius: 5px;
      img {
        position: absolute;
        top: -12px;
        left: -4px;
        width: 48px;
      }
    }
  }
}
.search-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  input {
    width: 230px;
    height: 25px;
    line-height: 25px;
    padding: 0 0 0 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    box-sizing: border-box;
    &::placeholder {
      font-size: 1.1rem;
    }
  }
  img {
    cursor: pointer;
  }
}
</style>
