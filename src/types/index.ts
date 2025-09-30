export interface UserInfo {
  userName: string
  email: string
  uid: string
  avatarUrl: string
  refreshToken: string
  accessToken: string
  free: string | null
}

export interface PersonalInfo {
  name: string
  email: string
  uid: string
  avatarUrl: string | null
  registrationDate: string | null
  authority: string | null
  briefIntroduction: string
  followersCount: number
  myFollowersCount: number
}

export interface LoginInfo {
  emailOrUid: string
  password: string
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
  fileType: string
  description: string
  uploader: string
  uploadDate: string
  collectionCount: number
}

export interface FilePage {
  currentPage: number;
  totalPages: number;
  latestVersion: number;
  pageSize: number;
  results: DisplayFile[];
}

export interface DetailFile extends DisplayFile {
  introduce: string
  imgs: string[]
  downloadUrl: string[]
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
  resourceType: string
  dateRange?: 'last24Hours' | 'last7Days' | 'last30Days' | 'last90Days' | '' | null
  order: 'newest' | 'oldest' | 'mostCollected' | '' | null
}

export const ResourceTypes = {
  ARTICLE: '文章',
  BOOK: '书籍',
  VIDEO: '视频',
  AUDIO: '音频',
  IMAGE: '图片',
  CODE: '代码',
  TOOL: '工具',
  DATASET: '数据集',
  PRESENTATION: '演示文稿',
  ARCHIVE: '归档',
  OTHER: '其他'
} as const;

export type ResourceType = typeof ResourceTypes[keyof typeof ResourceTypes];

