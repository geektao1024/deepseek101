---
title: "安装和部署 LemoBook：分步指南"
description: "一个适合初学者的完整指南，介绍如何在本地安装 LemoBook 并将其部署到 Vercel。"
date: "2024-08-11"
coverImage: /images/pictures/webcn.webp
tags:
  - 教程
---

# 安装和部署 LemoBook：分步指南

本指南将带您完成在本地机器上安装 LemoBook 并将其部署到 Vercel 的过程。即使您是 Web 开发新手，也能按照这些步骤成功运行您的 LemoBook 实例。

## 前置要求

- Node.js（14 版本或更高）
- npm（通常随 Node.js 一起安装）
- Git
- GitHub 账号
- Vercel 账号

## 步骤 1：克隆仓库

1. 打开终端或命令提示符。
2. 导航到您想存储项目的目录。
3. 运行以下命令：

```bash
git clone https://github.com/lemoabc/gitbase.git
cd gitbase
```

## 步骤 2：安装依赖

在项目目录中运行：

```bash
npm install
```

这将安装项目所需的所有依赖。

## 步骤 3：设置环境变量

1. 在项目根目录创建一个名为 `.env.local` 的文件。
2. 打开此文件并添加以下内容：

```
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
ACCESS_PASSWORD=your_secure_access_password
```

用您的实际 GitHub 信息和期望的访问密码替换这些占位符。

## 步骤 4：配置 GitHub 仓库

1. 如果还没有，在 GitHub 上创建一个新仓库。
2. 在您的 GitHub 仓库中，创建两个文件夹：`data/json` 和 `data/md`。
3. 在 `data/json` 文件夹中，创建一个名为 `resources.json` 的文件，内容为空数组：`[]`。

## 步骤 5：运行开发服务器

要启动开发服务器，运行：

```bash
npm run dev
```

在浏览器中打开 `http://localhost:3000`。您应该能看到 LemoBook 主页。

## 步骤 6：构建项目

如果开发服务器运行正常，尝试构建项目：

```bash
npm run build
```

如果构建成功完成，您的项目就可以部署了。

## 步骤 7：部署到 Vercel

1. 登录您的 Vercel 账号。
2. 点击"New Project"。
3. 从 GitHub 导入您的 LemoBook 仓库。
4. 在"Configure Project"步骤中，添加以下环境变量：
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `ACCESS_PASSWORD`
   使用与 `.env.local` 文件中相同的值。
5. 点击"Deploy"。

## 步骤 8：测试您的部署

部署完成后，Vercel 会提供一个 URL。在浏览器中打开这个 URL，验证您的 LemoBook 实例是否正常工作。

## 步骤 9：配置自定义域名（可选）

如果您想使用自己的域名：

1. 在 Vercel 项目仪表板中，转到"Settings" > "Domains"。
2. 添加您的自定义域名并按照 Vercel 的说明配置 DNS。

## 使用 LemoBook

- 访问 `/admin` 并使用您设置的 `ACCESS_PASSWORD` 进入管理面板。
- 您现在可以通过管理界面创建、编辑和管理文章和资源。
- 所有更改都会自动与您的 GitHub 仓库同步。

## 故障排除

如果遇到任何问题：
- 确保所有环境变量在本地和 Vercel 上都正确设置。
- 检查浏览器控制台和 Vercel 部署日志中的错误消息。
- 确保您的 GitHub token 具有必要的权限（repo 作用域）。

恭喜！您已成功设置并部署了自己的 LemoBook 实例。享受您的新的无数据库、GitHub 驱动的网站吧！

如需更多帮助，请参考 [LemoBook 文档](https://github.com/lemoabc/gitbase) 或在 GitHub 仓库中提出问题。 