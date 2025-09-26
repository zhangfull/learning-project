export const login_rules = {
  emailOrUid: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

export const register_rules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value.length < 6) {
          callback(new Error('密码长度不能小于6位'))
        } else if (value.length > 20) {
          callback(new Error('密码长度不能大于20位'))
        } else if (value.includes(' ')) {
          callback(new Error('密码不能含空格'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ]
}