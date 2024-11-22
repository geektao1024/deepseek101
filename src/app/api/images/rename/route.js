import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

export async function POST(request) {
  try {
    const { type, oldName, newName } = await request.json();
    const folderPath = `public/images/${type}`;

    console.log('重命名操作开始:', {
      type,
      oldName,
      newName,
      folderPath,
      完整路径: `${folderPath}/${oldName}`
    });

    try {
      // 先检查文件是否存在
      const { data: files } = await octokit.repos.getContent({
        owner,
        repo,
        path: folderPath,
        ref: 'main',
        headers: {
          'If-None-Match': ''  // 强制刷新缓存
        }
      });

      // 找到要重命名的文件
      const targetFile = files.find(file => file.name === oldName);
      if (!targetFile) {
        console.error('找不到原文件:', oldName);
        return NextResponse.json(
          { error: `File not found: ${oldName}` },
          { status: 404 }
        );
      }

      console.log('找到原文件:', targetFile);

      // 获取原文件的具体内容
      const { data: fileContent } = await octokit.repos.getContent({
        owner,
        repo,
        path: targetFile.path,
        ref: 'main'
      });

      // 创建新文件，使用原文件的内容
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: `${folderPath}/${newName}`,
        message: `Rename ${type} image: ${oldName} -> ${newName}`,
        content: fileContent.content,
        branch: 'main'
      });

      // 删除旧文件
      await octokit.repos.deleteFile({
        owner,
        repo,
        path: `${folderPath}/${oldName}`,
        message: `Delete old ${type} image after rename: ${oldName}`,
        sha: targetFile.sha,
        branch: 'main'
      });

      // 重新获取最新的文件列表
      const { data: updatedFiles } = await octokit.repos.getContent({
        owner,
        repo,
        path: folderPath,
        ref: 'main',
        headers: {
          'If-None-Match': ''  // 强制刷新缓存
        }
      });

      // 过滤并格式化图片数据
      const images = updatedFiles
        .filter(file => file.type === 'file' && /\.(png|jpg|jpeg|gif|svg)$/i.test(file.name))
        .map(file => ({
          name: file.name,
          path: file.path,
          sha: file.sha,
          size: file.size,
          url: file.download_url
        }));

      console.log('重命名操作完成，返回最新数据:', images);
      return NextResponse.json({ 
        message: 'Image renamed successfully',
        images  // 返回最新的图片列表
      });
    } catch (error) {
      console.error('GitHub API 错误:', {
        status: error.status,
        message: error.message,
        path: `${folderPath}/${oldName}`,
        response: error.response?.data
      });
      throw error;
    }
  } catch (error) {
    console.error('重命名操作失败:', error);
    return NextResponse.json(
      { 
        error: 'Failed to rename image',
        details: error.message,
        path: error.response?.data?.documentation_url
      },
      { status: error.status || 500 }
    );
  }
} 