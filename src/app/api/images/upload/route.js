import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

export async function POST(request) {
  console.log('开始处理文件上传请求...');
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const type = formData.get('type'); // 'favicon' 或 'pictures'
    const folderPath = `public/images/${type}`;

    console.log('上传信息:', {
      文件数量: files.length,
      类型: type,
      目标路径: folderPath
    });

    // 处理所有文件上传
    const uploadPromises = files.map(async (file) => {
      try {
        console.log('处理文件:', file.name);
        const buffer = await file.arrayBuffer();
        const content = Buffer.from(buffer).toString('base64');

        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: `${folderPath}/${file.name}`,
          message: `Upload ${type} image: ${file.name}`,
          content,
          branch: 'main'
        });

        console.log(`文件 ${file.name} 上传成功`);
        return { name: file.name, status: 'success' };
      } catch (error) {
        console.error(`文件 ${file.name} 上传失败:`, error);
        return { name: file.name, status: 'error', error: error.message };
      }
    });

    const results = await Promise.all(uploadPromises);
    console.log('所有文件处理完成:', results);

    // 检查是否有任何文件上传失败
    const hasErrors = results.some(result => result.status === 'error');
    if (hasErrors) {
      return NextResponse.json({ 
        message: 'Some files failed to upload',
        results 
      }, { status: 207 }); // 使用 207 Multi-Status 状态码
    }

    return NextResponse.json({ 
      message: 'All files uploaded successfully',
      results
    });
  } catch (error) {
    console.error('文件上传过程中出错:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload files',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// 配置文件大小限制
export const config = {
  api: {
    bodyParser: false, // 禁用默认的 body 解析
    responseLimit: false, // 禁用响应大小限制
  },
}; 