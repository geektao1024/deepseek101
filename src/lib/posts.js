// 文章数据处理工具
// 提供文章数据的读取、解析和处理功能
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { slug } from 'github-slugger'  // 需要安装这个包
import { visit } from 'unist-util-visit'

// 文章目录路径
const postsDirectory = path.join(process.cwd(), 'data/md')

// 获取所有文章数据并排序
export function getSortedPostsData() {
  // 获取 /data/md 目录下的所有文件名
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map(fileName => {
    // 从文件名中移除 ".md"
    const id = fileName.replace(/\.md$/, '')

    // 读取 markdown 文件内容
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // 使用 gray-matter 解析 markdown 文件的元数据部分
    const matterResult = matter(fileContents)

    // 合并数据和 id
    return {
      id,
      title: matterResult.data.title,
      description: matterResult.data.description,
      date: matterResult.data.date,
      coverImage: matterResult.data.coverImage || '',  // 添加封面图片
      tags: matterResult.data.tags || [],              // 添加标签
    }
  })

  // 按日期排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// 获取单篇文章的完整数据
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // 自定义处理函数，为标题添加 id
  function addIdsToHeadings() {
    return (tree) => {
      let headings = [];

      // 首先解析 Markdown 为 AST
      const ast = remark().parse(matterResult.content);
      
      // 遍历 AST 查找标题节点
      visit(ast, 'heading', (node) => {
        if (!node.children) return;

        const title = node.children
          .filter(n => n.type === 'text')
          .map(n => n.value)
          .join('')
        
        const id = slug(title)
        
        // 添加 id 属性到标题节点
        node.data = node.data || {}
        node.data.hProperties = node.data.hProperties || {}
        node.data.hProperties.id = id
        
        // 收集标题信息
        headings.push({
          id,
          text: title,
          level: node.depth
        })

        console.log('Found heading:', { id, text: title, level: node.depth });
      });
      
      console.log('Collected headings:', headings);
      
      // 将标题信息存储在树的数据中
      tree.data = tree.data || {}
      tree.data.headings = headings;

      return tree;
    }
  }

  try {
    // 先解析 Markdown
    const ast = remark().parse(matterResult.content);
    
    // 收集标题信息
    let headings = [];
    visit(ast, 'heading', (node) => {
      if (!node.children) return;
      
      const title = node.children
        .filter(n => n.type === 'text')
        .map(n => n.value)
        .join('')
      
      const id = slug(title)
      
      headings.push({
        id,
        text: title,
        level: node.depth
      })
    });

    // 转换为 HTML
    const processedContent = await remark()
      .use(() => tree => {
        // 为标题添加 ID
        visit(tree, 'heading', (node) => {
          if (!node.children) return;
          
          const title = node.children
            .filter(n => n.type === 'text')
            .map(n => n.value)
            .join('')
          
          const id = slug(title)
          
          node.data = node.data || {}
          node.data.hProperties = node.data.hProperties || {}
          node.data.hProperties.id = id
        });
        return tree;
      })
      .use(html)
      .process(matterResult.content);

    const contentHtml = processedContent.toString();

    console.log('Final headings data:', headings);

    return {
      id,
      contentHtml,
      headings,
      ...matterResult.data
    }
  } catch (error) {
    console.error('Error processing markdown:', error);
    throw error;
  }
}

export async function getPostData2(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}