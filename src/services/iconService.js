/**
 * 工具图标服务
 * 
 * 提供与工具图标相关的功能，包括：
 * 1. 根据工具ID获取图标路径
 * 2. 图标加载失败时的回退策略
 * 3. 图标缓存管理
 */

// 图标加载策略的常量定义
const ICON_STRATEGIES = {
  BY_ID: 'by_id',           // 优先通过工具ID匹配图标
  BY_HOSTNAME: 'by_hostname' // 通过URL主机名匹配图标
};

// 默认图标路径
const DEFAULT_ICON_PATH = '/images/favicon/default.png';

// 图标基础路径
const ICON_BASE_PATH = '/images/favicon';

/**
 * 尝试从URL中提取主机名
 * @param {string} url - 工具的URL
 * @returns {string|null} - 提取的主机名或null
 */
export function extractHostnameFromUrl(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    // 移除www前缀，获取更干净的主机名
    return urlObj.hostname.replace(/^www\./i, '');
  } catch (e) {
    console.error('Error parsing URL:', e);
    return null;
  }
}

/**
 * 生成工具ID的所有可能变体形式
 * @param {string} id - 工具ID
 * @returns {string[]} - ID的可能变体形式数组
 */
export function generateIdVariations(id) {
  if (!id) return [];
  
  const variations = [id];
  
  // 添加常见的变体形式
  // 1. 将连字符替换为下划线
  if (id.includes('-')) {
    variations.push(id.replace(/-/g, '_'));
  }
  
  // 2. 将下划线替换为连字符
  if (id.includes('_')) {
    variations.push(id.replace(/_/g, '-'));
  }
  
  // 3. 移除所有连字符和下划线
  variations.push(id.replace(/[-_]/g, ''));
  
  return variations;
}

/**
 * 生成主机名的可能变体
 * @param {string} hostname - 主机名
 * @returns {string[]} - 主机名变体数组
 */
export function generateHostnameVariations(hostname) {
  if (!hostname) return [];
  
  const variations = [hostname];
  
  // 只保留主域名（去掉子域）
  const parts = hostname.split('.');
  if (parts.length > 2) {
    // 对于形如 api.example.com 的域名，添加 example.com
    variations.push(parts.slice(-2).join('.'));
  }
  
  // 添加常见的变体形式
  // 1. 将点替换为连字符
  variations.push(hostname.replace(/\./g, '-'));
  
  // 2. 移除所有点
  variations.push(hostname.replace(/\./g, ''));
  
  return variations;
}

/**
 * 获取工具图标路径
 * 
 * 策略：
 * 1. 优先尝试使用工具ID精确匹配图标
 * 2. 如果找不到，尝试使用主机名匹配图标
 * 3. 最后回退到默认图标
 * 
 * @param {string} toolId - 工具ID
 * @param {string} url - 工具URL，用于备选策略
 * @param {string} officialUrl - 工具官方URL，优先于url使用
 * @param {string} strategy - 图标加载策略，默认为BY_ID
 * @returns {string} - 图标路径
 */
export function getToolIconPath(toolId, url, strategy = ICON_STRATEGIES.BY_ID, officialUrl) {
  if (!toolId) {
    return DEFAULT_ICON_PATH;
  }
  
  // 根据策略选择加载方式
  if (strategy === ICON_STRATEGIES.BY_ID) {
    return `${ICON_BASE_PATH}/${toolId}.png`;
  } else if (strategy === ICON_STRATEGIES.BY_HOSTNAME) {
    // 优先使用官方URL，如果不存在则使用普通URL
    const urlToUse = officialUrl || url;
    if (urlToUse) {
      const hostname = extractHostnameFromUrl(urlToUse);
      return hostname ? `${ICON_BASE_PATH}/${hostname}.png` : DEFAULT_ICON_PATH;
    }
  }
  
  return DEFAULT_ICON_PATH;
}

/**
 * 检查图标是否存在
 * 用于客户端检查图标是否可访问
 * 
 * @param {string} iconPath - 图标路径
 * @returns {Promise<boolean>} - 返回图标是否存在的Promise
 */
export function checkIconExists(iconPath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = iconPath;
  });
}

/**
 * 获取完整的图标加载链
 * 生成所有可能的图标路径供逐个尝试
 * 
 * @param {string} toolId - 工具ID
 * @param {string} url - 工具URL
 * @returns {string[]} - 图标路径数组，按优先级排序
 */
export function getIconLoadChain(toolId, url) {
  const loadChain = [];
  
  // 1. 优先尝试通过工具ID加载
  if (toolId) {
    // 添加工具ID的所有变体
    const idVariations = generateIdVariations(toolId);
    idVariations.forEach(variation => {
      loadChain.push(`${ICON_BASE_PATH}/${variation}.png`);
    });
  }
  
  // 2. 然后尝试通过主机名加载
  if (url) {
    const hostname = extractHostnameFromUrl(url);
    if (hostname) {
      // 添加主机名的所有变体
      const hostnameVariations = generateHostnameVariations(hostname);
      hostnameVariations.forEach(variation => {
        loadChain.push(`${ICON_BASE_PATH}/${variation}.png`);
      });
    }
  }
  
  // 3. 最后使用默认图标
  loadChain.push(DEFAULT_ICON_PATH);
  
  // 移除重复项
  return [...new Set(loadChain)];
}

/**
 * 获取工具官网的截图路径
 * 
 * @param {string} toolId - 工具ID
 * @returns {string} - 截图路径
 */
export function getToolScreenshotPath(toolId) {
  if (!toolId) {
    return '/images/placeholder-screenshot.jpg';
  }
  
  // 返回基于工具ID的截图路径
  // 注意：使用toolId，因为截图可能在public/images/screenshots/目录中
  const specificPath = `/images/screenshots/${toolId}.png`;
  
  return specificPath;
} 