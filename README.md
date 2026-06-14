# 数据图工具

通用的每日数值记录与可视化工具，支持多项目管理。

## 功能

- 多项目切换管理（电费、水费、燃气费...）
- 每日数值记录，表格增删改查
- 折线图日趋势 + 柱状图月汇总
- 桌面应用，数据本地存储

## 启动

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`

## 打包桌面应用

```bash
npm run build
npx electron-packager . "数据图工具" --platform=win32 --arch=x64 --out=release
```

exe 文件在 `release/数据图工具-win32-x64/` 目录下。

## 技术栈

React + Vite + Tailwind CSS + ECharts + Electron
