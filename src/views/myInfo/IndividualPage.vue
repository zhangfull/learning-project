<script setup lang="ts">
import { User, Upload, Dessert, Lollipop, Refrigerator } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const handleSelect = (index: string) => {
    switch (index) {
        case '1':
            router.push('/individual/information')
            break;
        case '2':
            router.push('/individual/upload')
            break;
        case '3':
            router.push('/individual/followers')
            break;
        case '4':
            router.push('/individual/favorite')
            break;
        case '5':
            router.push('/individual/browsing-history')
            break;
    }
}
</script>

<template>
    <aside class="sider">
        <el-menu class="nav-menu" default-active="1" @select="handleSelect">
            <el-menu-item index="1" class="nav-item">
                <el-icon>
                    <User />
                </el-icon>
                <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="2" class="nav-item">
                <el-icon>
                    <Upload />
                </el-icon>
                <span>我的上传</span>
            </el-menu-item>
            <el-menu-item index="3" class="nav-item">
                <el-icon>
                    <Dessert />
                </el-icon>
                <span>我的关注</span>
            </el-menu-item>
            <el-menu-item index="4" class="nav-item">
                <el-icon>
                    <Lollipop />
                </el-icon>
                <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item index="5" class="nav-item">
                <el-icon>
                    <Refrigerator />
                </el-icon>
                <span>浏览历史</span>
            </el-menu-item>
        </el-menu>
    </aside>

    <section class="content">
        <RouterView />
    </section>
</template>

<style scoped>
.sider {
    width: 200px;
    height: 100%;
    position: fixed;
    top: 60px;
    /* 如果有头部导航栏 */
    left: 0;
}

.nav-menu {
    width: 240px;
    height: 100%;
}

.content {
    flex: 1;
    margin-left: 240px;
    /* 预留出侧边栏的空间 */
    padding: 20px;
}
</style>
