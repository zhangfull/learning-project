<script setup lang="ts">
import { handlePageAcquisition, handleIsSearch } from '@/service/FileService';
import { ResourceTypes, type FilePage, type FileRequestCondition, type FileSearchCondition } from '@/types';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
let timer: number | null = null
const version = ref(0)
const currentPage = ref(1)
const fp = ref<FilePage | null>(null)  // 文件列表
// 创建响应式的筛选条件
const fileSearchCondition = reactive<FileSearchCondition>({
    searchTerm: null,
    ResourceType: null,
    dateRange: null,
    order: null
});
// 创建中文的类型标签
const ResourceTypesLabels = {
    ARTICLE: '文章/博客/教程',
    BOOK: '电子书/文档',
    VIDEO: '视频课程/讲解',
    AUDIO: '音频/播客',
    IMAGE: '图片/插画/壁纸',
    CODE: '源代码/代码片段',
    TOOL: '工具/软件',
    DATASET: '数据集/表格',
    PRESENTATION: 'PPT/演示文档',
    ARCHIVE: '压缩包/合集',
    OTHER: '其他',
    NULL: '所有类型'
};
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
//提交搜索方法
async function submitSearch(needPage: number) {
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
            // 清除缓存
            searchCache.value.clear()
            normalCache.value.clear()
        }
    }
    updateLRUCache(currentCache, needPage, fp.value!)
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
const jumpToPage = ref<number>(1)
// 跳转到文件详情页
function goToFile(fileId: number) {
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
                    <select id="resourceType" v-model="fileSearchCondition.ResourceType">
                        <option v-for="(type, key) in ResourceTypes" :key="key" :value="type">
                            {{ ResourceTypesLabels[key] }}
                        </option>
                    </select>
                    <!-- 日期范围选择框 -->
                    <label for="dateRange">日期范围:</label>
                    <select id="dateRange" v-model="fileSearchCondition.dateRange">
                        <option value="last24Hours">最近24小时</option>
                        <option value="last7Days">最近7天</option>
                        <option value="last30Days">最近30天</option>
                        <option value="last90Days">最近90天</option>
                        <option value="allTime">所有时间</option>
                        <option value=null>默认</option>
                    </select>

                    <!-- 排序方式选择框 -->
                    <label for="order">排序方式:</label>
                    <select id="order" v-model="fileSearchCondition.order">
                        <option value="newest">最新</option>
                        <option value="oldest">最旧</option>
                        <option value="mostCollected">收藏最多</option>
                        <option value=null>默认</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- 展示区 -->
        <div v-if="fp && fp.results && fp.results.length">
            <table cellspacing="0" cellpadding="8" class="file-table">
                <thead>
                    <tr>
                        <th>文件名</th>
                        <th>类型</th>
                        <th>描述</th>
                        <th>上传日期</th>
                        <th>收藏量</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="file in fp.results" :key="file.id" @click="goToFile(file.id)" class="file-table-tr">
                        <td>{{ file.name }}</td>
                        <td>{{ file.type }}</td>
                        <td>{{ file.description }}</td>
                        <td>{{ new Date(file.uploadDate).toLocaleDateString('zh-CN') }}</td>
                        <td>{{ file.collectionCount }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p style="color: #ccc;">暂无文件数据。</p>
        </div>
        <!-- 跳转 -->
        <div class="pagination-container">
            <button @click="jumpPage(currentPage - 1)">上一页</button>
            <span v-if="fp">当前页码: {{ currentPage }}</span>
            <button @click="jumpPage(currentPage + 1)">下一页</button>
            <span v-if="fp">总页数: {{ fp.totalPages }}</span>
            <input type="number" v-model="jumpToPage" class="page-input" />
            <button @click="jumpPage(jumpToPage)">跳转</button>
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
    top: 50px;
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

.file-table {
    width: 80%;
    /* 控制表格宽度 */
    max-width: 1000px;
    /* 控制表格最大宽度 */
    height: 400px;
    /* 控制表格的高度 */
    overflow: auto;
    /* 如果内容超过高度，显示滚动条 */
    border-collapse: collapse;
    /* 合并边框 */

    /* 设置表格相对于父容器的位置 */
    margin: 150px auto 20px;
    /* 上边距100px避免被固定栏覆盖，下边20px，左右居中 */
}


.file-table th,
.file-table td {
    padding: 8px 12px;
    /* 设置单元格内边距 */
    text-align: left;
    border-bottom: 1px dashed #ccc;
    /* 虚线隔开每行 */
}

.file-table-tr:hover {
    background-color: #f0f0f0;
    /* 鼠标悬浮时改变背景色 */
    transform: scale(1.05);
    /* 放大效果 */
}

.file-table th {
    background-color: #ffffff;
    /* 设置表头的背景色 */
    font-weight: bold;
    /* 加粗表头文本 */
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
}

.page-input {
    width: 60px;
    /* 调整输入框宽度 */
    padding: 5px;
    text-align: center;
    /* 输入框内的文本居中 */
    font-size: 14px;
    /* 调整字体大小 */
    border: 1px solid #ccc;
    /* 输入框边框 */
    border-radius: 4px;
    /* 圆角边框 */
}

button {
    padding: 5px 10px;
    /* 按钮的内边距 */
    font-size: 14px;
    /* 调整字体大小 */
    cursor: pointer;
    /* 鼠标指针样式 */
}

span {
    font-size: 14px;
    /* 页码的字体大小 */
}
</style>
