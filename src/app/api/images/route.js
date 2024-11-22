import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

// 检查环境变量
console.log('环境变量检查:', {
  hasGithubToken: !!process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO
});

// 获取图片列表
export async function GET(request) {
  console.log('开始处理获取图片请求...');
  const { searchParams } = new URL(request.url);
  const sync = searchParams.get('sync') === 'true';  // 检查是否需要强制同步

  try {
    let faviconFiles = [];
    let pictureFiles = [];

    // 获取 favicon 图片
    try {
      console.log('尝试获取 favicon 目录内容...');
      const { data: faviconResponse } = await octokit.repos.getContent({
        owner,
        repo,
        path: 'public/images/favicon',
        ref: 'main',  // 指定分支
        headers: {
          'If-None-Match': sync ? '' : undefined  // 强制同步时清除缓存
        }
      });
      console.log('favicon 目录内容:', faviconResponse);
      if (Array.isArray(faviconResponse)) {
        faviconFiles = faviconResponse;
      }
    } catch (error) {
      console.log('favicon 目录获取结果:', error.status === 404 ? '目录不存在' : error.message);
      if (error.status !== 404) {
        throw error;
      }
    }

    // 获取文章图片
    try {
      console.log('尝试获取 pictures 目录内容...');
      const { data: pictureResponse } = await octokit.repos.getContent({
        owner,
        repo,
        path: 'public/images/pictures',
        ref: 'main',  // 指定分支
        headers: {
          'If-None-Match': sync ? '' : undefined  // 强制同步时清除缓存
        }
      });
      console.log('pictures 目录内容:', pictureResponse);
      if (Array.isArray(pictureResponse)) {
        pictureFiles = pictureResponse;
      }
    } catch (error) {
      console.log('pictures 目录获取结果:', error.status === 404 ? '目录不存在' : error.message);
      if (error.status !== 404) {
        throw error;
      }
    }

    // 过滤并格式化图片数据
    console.log('开始处理图片数据...');
    const favicons = faviconFiles
      .filter(file => {
        const isImage = file.type === 'file' && /\.(png|jpg|jpeg|gif|svg)$/i.test(file.name);
        console.log(`文件 ${file.name} 是否为图片:`, isImage);
        return isImage;
      })
      .map(file => ({
        name: file.name,
        path: file.path,
        sha: file.sha,
        size: file.size,
        url: file.download_url
      }));

    const pictures = pictureFiles
      .filter(file => {
        const isImage = file.type === 'file' && /\.(png|jpg|jpeg|gif|svg)$/i.test(file.name);
        console.log(`文件 ${file.name} 是否为图片:`, isImage);
        return isImage;
      })
      .map(file => ({
        name: file.name,
        path: file.path,
        sha: file.sha,
        size: file.size,
        url: file.download_url
      }));

    console.log('处理完成，返回数据:', { favicons, pictures });
    return NextResponse.json({ favicons, pictures });
  } catch (error) {
    console.error('处理过程中出错:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
} 