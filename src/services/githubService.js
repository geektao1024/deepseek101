// src/services/githubService.js
// GitHub API服务，负责从GitHub获取仓库和贡献者信息

// GitHub API基础URL
const GITHUB_API_BASE = 'https://api.github.com';

// 缓存系统，防止频繁请求相同数据
const cache = new Map();
const CACHE_TTL = 3600 * 1000; // 缓存有效期1小时

// 获取API请求头
function getApiHeaders() {
  // 基础请求头
  return {
    'Accept': 'application/vnd.github.v3+json',
    // GitHub Token会在服务器端自动由Next.js注入
    // 无需在此处显式处理，避免linter错误
  };
}

// 辅助函数：从缓存获取数据
function getFromCache(key) {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }
  return null;
}

// 辅助函数：将数据存入缓存
function setToCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// 从URL提取仓库所有者和名称
function extractRepoInfo(url) {
  try {
    // 处理URL格式，例如: https://github.com/ThinkInAIXYZ/deepchat
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'github.com') {
      throw new Error('不是有效的GitHub仓库URL');
    }
    
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error('GitHub URL格式不正确');
    }
    
    return {
      owner: pathParts[0],
      repo: pathParts[1]
    };
  } catch (error) {
    console.error('解析GitHub URL失败:', error);
    return null;
  }
}

// 获取仓库信息
export async function getRepositoryInfo(repoUrl) {
  try {
    // 检查缓存
    const cacheKey = `repo:${repoUrl}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    // 解析仓库URL
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      throw new Error('无法解析GitHub仓库URL');
    }
    
    const { owner, repo } = repoInfo;
    
    // 获取仓库基本信息
    const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: getApiHeaders(),
      next: { revalidate: 3600 } // 缓存1小时
    });
    
    if (!repoResponse.ok) {
      throw new Error(`GitHub API请求失败: ${repoResponse.status}`);
    }
    
    const repoData = await repoResponse.json();
    
    // 获取最后提交时间
    const commitsResponse = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=1`, {
      headers: getApiHeaders(),
      next: { revalidate: 3600 } // 缓存1小时
    });
    
    let lastCommitDate = null;
    if (commitsResponse.ok) {
      const commitsData = await commitsResponse.json();
      if (commitsData.length > 0) {
        lastCommitDate = new Date(commitsData[0].commit.committer.date);
      }
    }
    
    // 格式化仓库年龄
    const createdAt = new Date(repoData.created_at);
    const now = new Date();
    const ageInMonths = Math.floor((now - createdAt) / (30 * 24 * 60 * 60 * 1000));
    
    let repoAge;
    if (ageInMonths < 1) {
      repoAge = "less than 1 month";
    } else if (ageInMonths < 12) {
      repoAge = `${ageInMonths} ${ageInMonths === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const remainingMonths = ageInMonths % 12;
      if (remainingMonths === 0) {
        repoAge = `${years} ${years === 1 ? 'year' : 'years'}`;
      } else {
        repoAge = `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
      }
    }
    
    // 格式化最后提交时间
    let lastCommit = "unknown";
    if (lastCommitDate) {
      const diffInDays = Math.floor((now - lastCommitDate) / (24 * 60 * 60 * 1000));
      if (diffInDays === 0) {
        lastCommit = "today";
      } else if (diffInDays === 1) {
        lastCommit = "yesterday";
      } else if (diffInDays < 30) {
        lastCommit = `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
      } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        lastCommit = `${months} ${months === 1 ? 'month' : 'months'} ago`;
      } else {
        const years = Math.floor(diffInDays / 365);
        lastCommit = `${years} ${years === 1 ? 'year' : 'years'} ago`;
      }
    }
    
    // 构建结果对象
    const result = {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.subscribers_count || repoData.watchers_count,
      lastCommit,
      repoAge,
      license: repoData.license ? repoData.license.spdx_id || repoData.license.name : 'unknown'
    };
    
    // 存入缓存
    setToCache(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('获取GitHub仓库信息失败:', error);
    return null;
  }
}

// 获取仓库贡献者信息
export async function getRepositoryContributors(repoUrl, limit = 3) {
  try {
    // 检查缓存
    const cacheKey = `contributors:${repoUrl}:${limit}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    // 解析仓库URL
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      throw new Error('无法解析GitHub仓库URL');
    }
    
    const { owner, repo } = repoInfo;
    
    // 获取贡献者列表
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=${limit}&anon=0`,
      {
        headers: getApiHeaders(),
        next: { revalidate: 3600 } // 缓存1小时
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API请求失败: ${response.status}`);
    }
    
    const contributorsData = await response.json();
    
    // 格式化贡献者数据
    const contributors = contributorsData.map(contributor => ({
      name: contributor.login,
      avatarUrl: contributor.avatar_url,
      commits: contributor.contributions,
      profileUrl: contributor.html_url
    }));
    
    // 存入缓存
    setToCache(cacheKey, contributors);
    
    return contributors;
  } catch (error) {
    console.error('获取GitHub贡献者信息失败:', error);
    return null;
  }
}

// 获取仓库语言分布
export async function getRepositoryLanguages(repoUrl) {
  try {
    // 检查缓存
    const cacheKey = `languages:${repoUrl}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    // 解析仓库URL
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      throw new Error('无法解析GitHub仓库URL');
    }
    
    const { owner, repo } = repoInfo;
    
    // 获取语言分布
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
      {
        headers: getApiHeaders(),
        next: { revalidate: 3600 } // 缓存1小时
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API请求失败: ${response.status}`);
    }
    
    const languagesData = await response.json();
    
    // 计算总字节数
    const totalBytes = Object.values(languagesData).reduce((sum, bytes) => sum + bytes, 0);
    
    // 计算每种语言的百分比并格式化数据
    const languages = Object.entries(languagesData)
      .map(([language, bytes]) => ({
        name: language,
        percentage: parseFloat(((bytes / totalBytes) * 100).toFixed(1)),
        bytes
      }))
      .sort((a, b) => b.percentage - a.percentage);
    
    // 存入缓存
    setToCache(cacheKey, languages);
    
    return languages;
  } catch (error) {
    console.error('获取GitHub语言分布失败:', error);
    return null;
  }
} 