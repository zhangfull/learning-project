import { ElNotification } from "element-plus";
import { h } from "vue";

export function openSuccessNotice(notice: string): void {
    // 传入配置对象，类型会自动推断为 NotificationParams
    ElNotification({
        title: '提示',
        zIndex: 9999,
        message: h(
            'i',
            { style: 'color: teal' },
            notice
        ),
        position: 'bottom-right',
        type: 'success'
    })
}

export function openWarningNotice(notice: string): void {
    // 传入配置对象，类型会自动推断为 NotificationParams
    ElNotification({
        title: '提示',
        zIndex: 9999,
        message: h(
            'i',
            { style: 'color: teal' },
            notice
        ),
        position: 'bottom-right',
        type: 'warning'
    })
}