<script setup>
import {computed, ref, watchEffect} from "vue";

const total = 1282;
const page_size = 10;
const max_pager = 5;
const page_total = Math.ceil(total / page_size);
const current_page = ref(1)
const page_list = ref([]);

const is_first_page = computed(() => {
  return current_page.value <= 1
})
const is_max_page = computed(() => {
  return current_page.value >= page_total
})

function pre() {
  if (!is_first_page.value) {
    current_page.value = current_page.value - 1;
  }
}

function next() {
  if (!is_max_page.value) {
    current_page.value = current_page.value + 1;
  }
}

function onClick(page) {
  current_page.value = page;
}

watchEffect(() => {
  page_list.value = [];
  if (page_total <= max_pager) {
    for (let i = 1; i < page_total + 1; i++) {
      page_list.value.push({ index: i, type: "number" });
    }
    return;
  }

  /**
   * 除去首尾的两个页码后，中间需要动态变化的页码数量
   */
  const middle_page_count = max_pager - 2;

  let start_page = Math.max(1, current_page.value - (middle_page_count-1) / 2)
  if (start_page > page_total - (middle_page_count-1)) {
    start_page = page_total - (middle_page_count-1)
  }
  if (start_page > 1) {
    page_list.value.push({ index: 1, type: "number" });
  }
  if (start_page > 2) {
    page_list.value.push({ index: 0, type: "ellipsis" });
  }
  for (let i = 0; i < middle_page_count; i++) {
    page_list.value.push({ index: start_page + i, type: "number" })
  }
  if (start_page < page_total - (middle_page_count-1) - 1) {
    page_list.value.push({index: 0, type: "ellipsis"});
  }
  if (start_page < page_total - (middle_page_count-1)) {
    page_list.value.push({ index: page_total, type: "number" });
  }

})

</script>
<template>
  <div>
    <div>
      <input v-model="current_page" />
    </div>
    <div class="page-container">
      <a href="#" :class="{ dis: is_first_page }" @click="pre">上一页</a>

      <li
          v-for="(item, index) in page_list"
          :key="`page-item-${index}`"
          :class="{ act: current_page === item.index }"
          @click="onClick(item.index)">
        <span v-if="item.type === 'number'">{{ item.index }}</span>
        <span v-else>...</span>
      </li>

      <a href="#" :class="{ dis: is_max_page }" @click="next">下一页</a>
    </div>
  </div>
</template>
<style scoped>
.page-container {
  display: flex;
  gap: 10px;
}
.dis {
  color: #f00;
}
.act {
  color: #f00;
}
li {
  margin: 0;
  padding: 0;
  list-style: none;
  cursor: pointer;
  background: #535bf2;
  padding: 5px;
}
</style>