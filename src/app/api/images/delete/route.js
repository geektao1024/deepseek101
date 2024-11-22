import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

export async function POST(request) {
  try {
    const { type, filename } = await request.json();
    const folderPath = `public/images/${type}`;

    // 获取文件的 SHA
    const { data: file } = await octokit.repos.getContent({
      owner,
      repo,
      path: `${folderPath}/${filename}`,
    });

    // 删除文件
    await octokit.repos.deleteFile({
      owner,
      repo,
      path: `${folderPath}/${filename}`,
      message: `Delete ${type} image: ${filename}`,
      sha: file.sha,
    });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 