import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const articlesJsonPath = 'data/json/articles.json';

export async function POST(request) {
  try {
    const { path: filePath, title } = await request.json();

    // 1. 删除 .md 文件
    const { data: file } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
    });

    await octokit.repos.deleteFile({
      owner,
      repo,
      path: filePath,
      message: `Delete article: ${title}`,
      sha: file.sha,
    });

    // 2. 更新 articles.json
    const { data: articlesFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: articlesJsonPath,
    });

    const articles = JSON.parse(Buffer.from(articlesFile.content, 'base64').toString());
    const updatedArticles = articles.filter(article => article.path !== filePath);

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: articlesJsonPath,
      message: `Update articles.json: remove ${title}`,
      content: Buffer.from(JSON.stringify(updatedArticles, null, 2)).toString('base64'),
      sha: articlesFile.sha,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
} 