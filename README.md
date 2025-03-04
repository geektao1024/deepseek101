# LemoBook

## Bug Fixes and Feature Improvements Log
2025/01/06
- [improvement] Optimized SearchDialog

2025/01/03
- [improvement] Optimized mobile display: 1. Enhanced header display; 2. Improved article content display

2024/12/27
- [bugfix] Fixed incorrect table of contents highlighting when clicking navigation links
- [feature add] Added full-text search functionality on homepage

## Description
[LemoBook](https://lemobook.vercel.app/) is an open-source dynamic website solution without a traditional database, built with Next.js, Tailwind CSS, and Shadcn/UI. It leverages GitHub as a content management system, providing a seamless way to create and manage website content.

![LemoBook](./public/images/gititd/shili1.png)
![LemoBook](./public/images/gititd/shili2.png)
![LemoBook](./public/images/gititd/shili3.png)
![LemoBook](./public/images/gititd/shili7.png)
![LemoBook](./public/images/gititd/shili4.png)
![LemoBook](./public/images/gititd/shili5.png)
![LemoBook](./public/images/gititd/shili6.png)


## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flemoabc%2FGitBase&project-name=LemoBook&repository-name=LemoBook&external-id=https%3A%2F%2Fgithub.com%2Flemoabc%2FGitBase%2Ftree%2Fmain)


## Features

- **Database-free Architecture**: Utilizes GitHub for content storage and management.
- **Dynamic Content**: Renders content dynamically using Next.js server-side rendering.
- **Markdown Support**: Write your content in Markdown format for easy editing and version control.
- **Admin Interface**: Built-in admin panel for content management.
- **Responsive Design**: Fully responsive design using Tailwind CSS.
- **SEO Friendly**: Optimized for search engines with dynamic metadata.
- **Easy Deployment**: Simple deployment process to Vercel.

## Prerequisites

- Node.js (version 14 or later)
- npm (comes with Node.js)
- Git
- GitHub account
- Vercel account (for deployment)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/lemoabc/gitbase.git
   cd gitbase
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repo_name
   ACCESS_PASSWORD=your_secure_access_password
   ```

4. Set up your GitHub repository:
   - Create a new repository on GitHub
   - Create two folders in the repository: `data/json` and `data/md`
   - In `data/json`, create a file named `resources.json` with an empty array: `[]`

5. Run the development server:
   ```
   npm run dev
   ```

Visit `http://localhost:3000` to see your LemoBook instance running locally.

## Deployment

1. Push your code to GitHub.
2. Log in to Vercel and create a new project from your GitHub repository.
3. Configure the environment variables in Vercel:
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `ACCESS_PASSWORD`
4. Deploy the project.

For a detailed deployment guide, please refer to our [Installation and Deployment Guide](https://lemobook.vercel.app/posts/gitbase-install-guide).

## Usage

- Access the admin panel by navigating to `/admin` and using your `ACCESS_PASSWORD`.
- Create and edit articles through the admin interface.
- Manage resources in the admin panel.
- All changes are automatically synced with your GitHub repository.

## Contributing

We welcome contributions to LemoBook! Please read our [Contributing Guide](https://lemobook.vercel.app/posts/how-to-contributing-to-gitbase) for details on our code of conduct and the process for submitting pull requests.

## License

LemoBook is open-source software licensed under the [MIT license](https://github.com/lemoabc/gitbase/?tab=MIT-1-ov-file).

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

## Acknowledgements

LemoBook is built with the following open-source libraries:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

We are grateful to the maintainers and contributors of these projects.

## GitHub统计信息自动更新

本项目支持自动获取并更新GitHub仓库的统计信息（星星数、fork数和查看数），以展示在工具卡片中。

### 使用方法

1. 手动更新GitHub统计信息：

```bash
npm run update:github-stats
```

2. 设置定时任务（使用cron或其他调度工具）定期更新数据。例如，通过crontab每天更新一次：

```bash
# 每天凌晨2点更新GitHub统计信息
0 2 * * * cd /path/to/project && npm run update:github-stats >> logs/github-stats.log 2>&1
```

### 注意事项

- GitHub API有调用限制，未认证的请求每小时限制60次
- 如果有大量工具，建议申请GitHub Token并在脚本中配置
- 可以在工具列表底部看到最后更新时间
