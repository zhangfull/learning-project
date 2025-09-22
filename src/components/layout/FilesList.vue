<script setup lang="ts">
import { handlePageAcquisition, handleIsSearch } from '@/service/FileService';
import { ResourceTypes, type DisplayFile, type FilePage, type FileRequestCondition, type FileSearchCondition } from '@/types';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Loading } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
let timer: number | null = null
const version = ref(0)
const currentPage = ref(1)
const fp = ref<FilePage | null>({
    currentPage: 0,
    totalPages: 0,
    pageSize: 0,
    latestVersion: 0,
    results: []
})  // 文件列表
// 创建响应式的筛选条件
const fileSearchCondition = reactive<FileSearchCondition>({
    searchTerm: '',
    resourceType: '',
    dateRange: '',
    order: ''
});
// 创建中文的类型标签

// 使用LRU队列限制缓存页数（最大缓存10页）
const MAX_CACHE_PAGES = 10
const searchCache = ref<Map<number, FilePage>>(new Map())
const normalCache = ref<Map<number, FilePage>>(new Map())
// 更新LRU缓存
function updateLRUCache(cache: Map<number, FilePage>, pageIndex: number, data: FilePage) {
    // 如果缓存已满，移除最久未使用的项
    if (cache.size > MAX_CACHE_PAGES) {
        const firstKey = cache.keys().next().value
        if (firstKey !== undefined) {
            cache.delete(firstKey)
        }
    }
    // 删除现有项（如果存在）然后重新添加，使其成为最新使用的
    cache.delete(pageIndex)
    cache.set(pageIndex, data)
}
const ready = ref(false)
//提交搜索方法
async function submitSearch(needPage: number) {
    ready.value = false
    window.scrollTo({ top: 0, behavior: 'instant' })
    console.log('搜索条件:', fileSearchCondition)
    const currentCache = handleIsSearch(fileSearchCondition) ? searchCache.value : normalCache.value
    //测试部分
    if (handleIsSearch(fileSearchCondition)) {
        console.log('这是一个搜索请求')
    } else {
        console.log('这不是一个搜索请求')
    }
    // 先检查缓存
    if (currentCache.has(needPage)) {
        console.log('从缓存中获取页码:', needPage)
        fp.value = currentCache.get(needPage)!
    } else {
        console.log('从服务器获取页码:', needPage)
        const frc: FileRequestCondition = {
            needPage: needPage,
            currentVersion: version.value,
            fileSearchCondition: { ...fileSearchCondition }
        };
        fp.value = await handlePageAcquisition(frc)
        if (fp.value && fp.value.latestVersion !== version.value) {
            console.log('旧版本为:', version.value)
            version.value = fp.value.latestVersion
            console.log('版本更新为:', version.value)
            console.log('清除缓存');
            // 清除缓存
            searchCache.value.clear()
            normalCache.value.clear()
        }
    }
    updateLRUCache(currentCache, needPage, fp.value!)
    ready.value = true
    return
}
// 监视筛选条件变化进行自动搜索
watch(fileSearchCondition, (newVal) => {
    if (timer) clearTimeout(timer)
    console.log('搜索条件变化后:', newVal);
    timer = window.setTimeout(() => {
        searchCache.value.clear()
        currentPage.value = 1
        submitSearch(1)
    }, 1000)
})
// 页码跳转和上下页
function jumpPage(page: number) {
    if (page < 1) return
    if (page > fp.value!.totalPages) return
    currentPage.value = page
    submitSearch(page)
}
// 页面滚动位置和分页信息
const pageInfo = ref({
    y: 0,
    pageIndex: 0,
})

// 跳转到文件详情页
function goToFile(row: DisplayFile) {
    const fileId = row.id
    // 保存当前滚动位置和页码
    pageInfo.value.y = window.scrollY || document.documentElement.scrollTop
    pageInfo.value.pageIndex = currentPage.value
    const jsonStr = JSON.stringify(pageInfo.value)
    localStorage.setItem('pageInfo', jsonStr)
    //同步变量
    console.log('跳转到文件详情页，文件ID:', fileId)
    router.push({ name: 'detail', params: { id: fileId } })
}

onMounted(async () => {
    const jsonStr = localStorage.getItem('pageInfo') || '{}'
    const parsed = JSON.parse(jsonStr)
    pageInfo.value = parsed
    if (pageInfo.value.pageIndex !== 0 && pageInfo.value.pageIndex !== null && pageInfo.value.pageIndex !== undefined) {
        if (route.query.from === 'detail') {
            router.replace({ path: '/files' })
            console.log("重返回列表:", pageInfo.value.pageIndex)
            currentPage.value = pageInfo.value.pageIndex
            await submitSearch(pageInfo.value.pageIndex)
            localStorage.removeItem('pageInfo')
            window.scrollTo({
                top: pageInfo.value.y,
                behavior: 'instant'
            })
            return
        }
    }
    localStorage.removeItem('pageInfo')
    submitSearch(1);
});
</script>

<template>
    <div class="list-box">
        <div class="fixed-component">
            <div class="search-filters-row">
                <div class="search-container">
                    <!-- 搜索框 -->
                    <input id="searchTerm" v-model="fileSearchCondition.searchTerm" type="text"
                        placeholder="请输入搜索关键词" />
                </div>
                <div class="filters-container">
                    <!-- 资源类型选择框 -->
                    <label for="resourceType">资源类型:</label>
                    <select id="resourceType" v-model="fileSearchCondition.resourceType">
                        <option value=''>全部</option>
                        <option v-for="(type, key) in ResourceTypes" :key="key" :value="key">
                            {{ type }}
                        </option>
                    </select>
                    <!-- 日期范围选择框 -->
                    <label for="dateRange">日期范围:</label>
                    <select id="dateRange" v-model="fileSearchCondition.dateRange">
                        <option value=''>默认</option>
                        <option value="last24Hours">最近24小时</option>
                        <option value="last7Days">最近7天</option>
                        <option value="last30Days">最近30天</option>
                        <option value="last90Days">最近90天</option>
                    </select>

                    <!-- 排序方式选择框 -->
                    <label for="order">排序方式:</label>
                    <select id="order" v-model="fileSearchCondition.order">
                        <option value=''>默认</option>
                        <option value="newest">最新</option>
                        <option value="mostCollected">收藏最多</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- 展示区 -->
        <div v-if="ready" class="table-container">
            <div v-if="fp && fp.results && fp.results.length">
                <el-table :data="fp.results" stripe style="width: 90%; margin: 0 auto; cursor: pointer;"
                    @row-click="goToFile">
                    <el-table-column prop="name" label="文件名" min-width="20%">
                    </el-table-column>
                    <el-table-column prop="fileType" label="类型" min-width="10%">
                    </el-table-column>
                    <el-table-column prop="description" label="描述" min-width="30%">
                    </el-table-column>
                    <el-table-column prop="uploadDate" label="上传时间" min-width="10%">
                    </el-table-column>
                    <el-table-column prop="collectionCount" label="收藏次数" min-width="10%">
                    </el-table-column>
                </el-table>
            </div>
            <div v-else class="no-data-container">
                <p style="color: #ccc;">暂无文件数据</p>
            </div>
            <!-- 跳转 -->
            <footer class="pagination-container">
                <el-pagination layout="prev, pager, next, jumper" :total="fp!.totalPages * 20"
                    :current-page="currentPage" :page-size="fp!.pageSize" @current-change="jumpPage">
                </el-pagination>
            </footer>
        </div>
        <div v-else class="loading-container">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
        </div>


    </div>
</template>

<style scoped>
.list-box {
    width: 100%;
    height: 100vh;
    background-color: #ffffff;
}

.fixed-component {
    position: fixed;
    /* 固定位置 */
    top: 60px;
    left: 0;
    /* 确保紧贴左边 */
    width: 100%;
    /* 设置宽度 */
    background-color: #fff;
    /* 背景颜色 */
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 添加阴影使其更显眼 */
    z-index: 1000;
    /* 确保该组件显示在页面上层 */
    box-sizing: border-box;
}

.search-filters-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.search-container {
    flex: 1;
    text-align: center;
    /* 搜索框居中 */
}

.search-container input {
    width: 300px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.filters-container {
    display: flex;
    justify-content: flex-end;
    /* 选择框靠右 */
    gap: 15px;
    /* 增加间距 */
    align-items: center;
}

.filters-container label {
    margin-right: 5px;
    /* 标签和选择框之间的间距 */
    white-space: nowrap;
}

.filters-container select {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-width: 100px;
}

.table-container {
    padding-top: 100px;
}

.no-data-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
}

.pagination-container {
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    gap: 10px;
    /* 按钮、页码和输入框之间的间距 */
    margin-top: 50px;
    /* 上方间距 */
    padding-bottom: 100px;

}


/* 调整分页按钮大小 */
.pagination-container :deep(.el-pagination button) {
    width: 50px;
    height: 40px;
}

/* 调整数字页码 */
.pagination-container :deep(.el-pager li) {
    width: 40px;
    height: 40px;
    line-height: 50px;
    font-size: 16px;
}

/* 调整跳转输入框 */
.pagination-container :deep(.el-pagination__editor.el-input) {
    width: 60px;
    height: 30px;
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 64px;
    /* 调大图标大小，比如 64px */
    color: #56615c;
    /* 可选：改颜色 */
}
</style>
