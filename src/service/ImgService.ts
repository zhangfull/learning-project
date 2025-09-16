import { getImgRequest } from "@/api/ImgApi";

export const handleGetImg = async (url: string): Promise<string> => {
    const [base64, code] = await getImgRequest(url);
    if (code === 0 && base64) {
        // 在这里可以处理 userInfo，存储到状态管理和本地存储
        return "data:image/png;base64," + base64;
    } else {
        console.log("头像获取失败");
        return "/default.png"
    }
};