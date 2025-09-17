export interface UserInfo {
  userName: string
  email: string
  uid: string
  avatarUrl: string
  token: string
  free: string | null
}

export interface PersonalInfo {
  userName: string
  email: string
  uid: string
  avatarUrl: string
  registrationDate: string
  authority: string
  briefIntroduction: string
  followersCount: number
  myFollowersCount: number
}

export interface RegisterInfo {
  userName: string
  email: string
  password: string
  confirmPassword: string
}

export interface DisplayFile {
  id: number
  name: string
  type: string
  description: string
  uploadDate: string
  collectionCount: number
}

export interface FilePage {
  currentPage: number;
  totalPages: number;
  latestVersion: number;
  results: DisplayFile[];
}

export interface DetailFile extends DisplayFile {
  uploader: string
  introduce: string
  imgs: string[]
  size: string
  downloadUrl: string
  tags: string[]
}

export interface FileRequestCondition {
  needPage: number
  currentVersion: number
  isFiltered?: boolean
  fileSearchCondition?: FileSearchCondition | null
}

export interface FileSearchCondition {
  searchTerm: string | null
  ResourceType?: ResourceType | null
  dateRange?: 'last24Hours' | 'last7Days' | 'last30Days' | 'last90Days' | 'allTime' | '' | null
  order: 'newest' | 'oldest' | 'mostCollected' | '' | null
}

export const ResourceTypes = {
  ARTICLE: 'article',       // 文章/博客/教程
  BOOK: 'book',             // 电子书、文档
  VIDEO: 'video',           // 视频课程、讲解
  AUDIO: 'audio',           // 音频、播客
  IMAGE: 'image',           // 图片、插画、壁纸
  CODE: 'code',             // 源代码、代码片段
  TOOL: 'tool',             // 工具、软件
  DATASET: 'dataset',       // 数据集、表格
  PRESENTATION: 'presentation', // PPT、演示文档
  ARCHIVE: 'archive',       // 压缩包、合集
  OTHER: 'other',           // 其他
  NULL: null                // 所有类型
} as const;

export type ResourceType = typeof ResourceTypes[keyof typeof ResourceTypes];

