// Mock数据和接口拦截
import { sha256 } from 'js-sha256'

// 模拟用户数据库
const mockUsers = [
  {
    id: '1',
    account: 'admin',
    password: sha256('123456'), // 密码加密存储
    name: '管理员',
    email: 'admin@example.com',
    sex: '男',
    image_url: 'https://via.placeholder.com/100'
  },
  {
    id: '2',
    account: 'user',
    password: sha256('123456'),
    name: '普通用户',
    email: 'user@example.com',
    sex: '女',
    image_url: 'https://via.placeholder.com/100'
  }
]

// 模拟Token生成
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    account: user.account,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天过期
  }
  return btoa(JSON.stringify(payload))
}

// 模拟Token刷新
const refreshToken = (oldToken) => {
  try {
    const payload = JSON.parse(atob(oldToken))
    payload.exp = Date.now() + 7 * 24 * 60 * 60 * 1000 // 刷新过期时间
    return btoa(JSON.stringify(payload))
  } catch (error) {
    return null
  }
}

// 检查Token是否过期
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token))
    return Date.now() > payload.exp
  } catch (error) {
    return true
  }
}

// Mock接口响应延迟
const mockDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 登录接口Mock
export const mockLogin = async (data) => {
  await mockDelay()
  const user = mockUsers.find(u => u.account === data.account)
  if (!user) {
    return { status: 1, message: '用户名不存在' }
  }
  if (user.password !== sha256(data.password)) {
    return { status: 1, message: '密码错误' }
  }
  const token = generateToken(user)
  return { status: 0, message: '登录成功', token, user: { id: user.id, account: user.account, name: user.name } }
}

// 注册接口Mock
export const mockRegister = async (data) => {
  await mockDelay()
  const existingUser = mockUsers.find(u => u.account === data.account)
  if (existingUser) {
    return { status: 1, message: '用户名已存在' }
  }
  const newUser = {
    id: mockUsers.length + 1,
    account: data.account,
    password: sha256(data.password),
    name: data.account,
    email: `${data.account}@example.com`,
    sex: '男',
    image_url: 'https://via.placeholder.com/100'
  }
  mockUsers.push(newUser)
  const token = generateToken(newUser)
  return { status: 0, message: '注册成功', token, user: { id: newUser.id, account: newUser.account, name: newUser.name } }
}

// 用户信息接口Mock
export const mockGetUserInfo = async (id) => {
  await mockDelay()
  const user = mockUsers.find(u => u.id === id)
  if (!user) {
    return { status: 1, message: '用户不存在' }
  }
  return { status: 0, message: '获取用户信息成功', results: user }
}

// 刷新Token接口Mock
export const mockRefreshToken = async (token) => {
  await mockDelay()
  if (isTokenExpired(token)) {
    return { status: 1, message: 'Token已过期' }
  }
  const newToken = refreshToken(token)
  return { status: 0, message: 'Token刷新成功', token: newToken }
}