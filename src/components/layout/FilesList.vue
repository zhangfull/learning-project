<script setup lang="ts">
import { handlePageAcquisition, handleIsSearch } from '@/service/FileService';
import { ResourceTypes, type FilePage, type FileRequestCondition, type FileSearchCondition } from '@/types';
import { onMounted, reactive, ref, watch } from 'vue';

let timer: number | null = null
const version = ref(0);
const currentPage = ref(1);
const fp = ref<FilePage | null>(null);  // 文件列表
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
    console.log('搜索条件:', fileSearchCondition);
    const currentCache = handleIsSearch(fileSearchCondition) ? searchCache.value : normalCache.value
    if (currentCache.has(needPage)) {
        console.log('从缓存中获取页码:', needPage);
        fp.value = currentCache.get(needPage)!;
    } else {
        console.log('从服务器获取页码:', needPage);
        const frc: FileRequestCondition = {
            needPage: needPage,
            currentVersion: version.value,
            fileSearchCondition: { ...fileSearchCondition }
        };
        fp.value = await handlePageAcquisition(frc);
        if (fp.value && fp.value.latestVersion !== version.value) {
            console.log('旧版本为:', version.value);
            version.value = fp.value.latestVersion;
            console.log('版本更新为:', version.value);
            // 清除缓存
            searchCache.value.clear()
            normalCache.value.clear()
        }
    }
    updateLRUCache(currentCache, needPage, fp.value!);
    return;
}
// 监视筛选条件变化进行自动搜索
watch(fileSearchCondition, (newVal) => {
    if (timer) clearTimeout(timer)
    console.log('搜索条件变化后:', newVal);
    timer = window.setTimeout(() => {
        searchCache.value.clear()
        currentPage.value = 1;
        submitSearch(1);
    }, 1000)
})
// 页码跳转和上下页
function jumpPage(page: number) {
    if (page < 1) return;
    if (page > fp.value!.totalPages) return;
    currentPage.value = page;
    submitSearch(page);
}

onMounted(() => {
    submitSearch(currentPage.value);
});
</script>

<template>
    <div class="list-box">
        <h2 style="text-align: center; padding: 16px 0;">文件列表</h2>
        <p style="text-align: center; color: #888;">这里将显示文件列表的内容。</p>
        <div>
            <!-- 搜索框 -->
            <label for="searchTerm">搜索内容:</label>
            <input id="searchTerm" v-model="fileSearchCondition.searchTerm" type="text" placeholder="请输入搜索关键词" />

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
                <option value="">选择日期范围</option>
                <option value="last24Hours">最近24小时</option>
                <option value="last7Days">最近7天</option>
                <option value="last30Days">最近30天</option>
                <option value="last90Days">最近90天</option>
                <option value="allTime">所有时间</option>
                <option value="">无时间范围</option>
            </select>

            <!-- 排序方式选择框 -->
            <label for="order">排序方式:</label>
            <select id="order" v-model="fileSearchCondition.order">
                <option value="">选择排序方式</option>
                <option value="newest">最新</option>
                <option value="oldest">最旧</option>
                <option value="mostCollected">收藏最多</option>
                <option value="">无排序</option>
            </select>

            <div v-if="fp && fp.results && fp.results.length">
                <ul>
                    <li v-for="file in fp.results" :key="file.id">
                        <strong>{{ file.name }}</strong>
                        <span>（类型：{{ file.type }}）</span>
                        <span> 上传日期：{{ file.uploadDate }}</span>
                        <!-- 可根据实际字段补充更多信息 -->
                    </li>
                </ul>
            </div>
            <div v-else>
                <p style="color: #ccc;">暂无文件数据。</p>
            </div>

            <div>
                <button @click="jumpPage(currentPage - 1)">上一页</button>
                <span v-if="fp">当前页码: {{ currentPage }}</span>
                <button @click="jumpPage(currentPage + 1)">下一页</button>
                <span v-if="fp">总页数: {{ fp.totalPages }}</span>
                <input type="number" v-model.number="currentPage" @change="jumpPage(currentPage)" />
            </div>

        </div>
    </div>
</template>

<style scoped>
.list-box {
    width: 100%;
    height: 100vh;
    background-color: #ffffff;
}
</style>
