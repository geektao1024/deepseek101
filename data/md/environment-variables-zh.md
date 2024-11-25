---
title: 配置 LemoBook 的环境变量
description: 如何配置 LemoBook 的环境变量
date: '2024-08-11T13:08:05.474Z'
coverImage: /images/pictures/webcn.webp
tags:
  - 教程
---

# 配置 LemoBook 的环境变量

LemoBook 依赖几个关键的环境变量来实现安全的 GitHub 集成、身份验证和管理员访问。本指南将解释每个变量的用途，并提供正确配置的分步说明。

环境变量在 LemoBook 项目的设置和安全性中起着关键作用。本指南将带您了解每个变量，解释其用途以及如何正确设置。

## GITHUB_TOKEN

**用途**：此令牌允许 LemoBook 与您的 GitHub 仓库交互，使其能够读取和写入内容。

**如何获取**：
1. 登录 GitHub 账号。
2. 点击右上角的头像，选择"Settings"。
3. 在左侧边栏中，点击"Developer settings"。
4. 选择"Personal access tokens"，然后点击"Tokens (classic)"。
5. 点击"Generate new token"，选择"Generate new token (classic)"。
6. 为您的令牌起一个描述性的名称，并选择以下权限：
   - repo（仓库的完全控制权限）
7. 点击页面底部的"Generate token"。
8. 立即复制生成的令牌 - 您以后将无法再次看到它！

**要求**：必须是具有正确权限的有效 GitHub 个人访问令牌。

## GITHUB_OWNER

**用途**：这是拥有 GitHub 仓库的用户名或组织名称，用于存储您的内容。

**如何获取**：这就是您的 GitHub 用户名或您的 GitHub 组织名称。

**要求**：必须与您使用的仓库的所有者完全匹配。

## GITHUB_REPO

**用途**：这是存储您内容的 GitHub 仓库的名称。

**如何获取**：这是您为 LemoBook 内容创建的仓库的名称。

**要求**：必须与仓库名称完全匹配，不包括所有者（例如，"my-lemobook-content"，而不是"username/my-lemobook-content"）。

## JWT_SECRET

**用途**：此密钥用于签署 JSON Web Tokens (JWTs)，用于您的 LemoBook 应用程序的身份验证。

**如何获取**：您应该生成一个随机的、安全的字符串。您可以使用密码生成器或在终端中运行以下命令：
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**要求**：应该是一个长的随机字符串。建议至少 32 个字符以确保安全性。

## DOMAIN

**用途**：指定您的 LemoBook 实例运行的域名。用于安全目的，防止未经授权的访问。

**如何获取**：这应该是您托管 LemoBook 实例的域名。对于本地开发，您可以使用"localhost"。

**要求**：应该是一个有效的域名。对于生产环境，这将是您的实际域名（例如，"mylemobook.com"）。对于本地开发，使用"localhost"。

## ACCESS_PASSWORD

**用途**：此密码用于访问您的 LemoBook 实例的管理界面。

**如何获取**：您应该创建一个强大、独特的密码。

**要求**：应该是一个强密码。建议使用大小写字母、数字和特殊字符的组合。至少 12 个字符。

## 设置您的环境变量

1. 在您的 LemoBook 项目根目录中，创建一个名为 `.env.local` 的文件。
2. 按以下格式将您的变量添加到此文件中：

```
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username_or_org
GITHUB_REPO=your_repo_name
JWT_SECRET=your_generated_jwt_secret
DOMAIN=your_domain_or_localhost
ACCESS_PASSWORD=your_strong_password
```

3. 保存文件。

请记住，永远不要将您的 `.env.local` 文件提交到版本控制中。它已经包含在 LemoBook 的 `.gitignore` 文件中，但始终要仔细检查，确保不会意外暴露您的敏感信息。

对于生产部署（例如在 Vercel 上），您需要在托管平台的设置中添加这些环境变量。

通过正确配置这些环境变量，您可以确保您的 LemoBook 实例能够安全地与 GitHub 交互、验证用户身份并保护您的管理界面。 