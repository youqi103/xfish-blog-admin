# 移除项目国际化(i18n)功能重构计划

## 一、重构目标

全面移除项目中的国际化(i18n)功能，确保项目在单语言环境下稳定运行，代码结构清晰无冗余。

## 二、重构范围

1. **配置文件**：移除国际化相关配置
2. **语言文件**：删除所有语言包文件
3. **组件**：移除语言切换组件和相关功能
4. **页面代码**：替换所有翻译调用为直接文本
5. **依赖清理**：移除相关依赖和自动生成的文件

## 三、重构步骤

### 1. 移除国际化配置

* **文件**：`config/config.ts`

* **修改内容**：

  * 删除 `locale` 配置块

  * 修改 `layout` 配置，将 `locale: true` 改为 `locale: false`

### 2. 删除语言文件

* **目录**：`src/locales/`

* **操作**：删除该目录下的所有文件

### 3. 移除 SelectLang 组件

* **文件**：`src/components/SelectLang/`

* **操作**：删除该组件目录

* **更新**：从 `src/components/index.ts` 中移除 SelectLang 导出

### 4. 修改 app.tsx

* **文件**：`src/app.tsx`

* **修改内容**：

  * 删除 SelectLang 导入

  * 从 `actionsRender` 中移除 SelectLang 组件

### 5. 替换页面中的国际化调用

* **搜索模式**：`useIntl|formatMessage`

* **替换方式**：将所有 `intl.formatMessage({ id: 'xxx', defaultMessage: 'yyy' })` 替换为直接文本 `'yyy'`

* **需要修改的主要文件**：

  * `src/pages/Admin.tsx`

  * `src/pages/User/Register/index.tsx`

  * `src/pages/User/Login/index.tsx`

  * 其他使用国际化的页面

### 6. 清理自动生成的文件

* **目录**：`.umi/plugin-locale/`

* **操作**：运行 `npm run build` 或 `npm run dev` 后会自动清理

### 7. 测试验证

* **运行项目**：`npm run dev` 确保项目能正常启动

* **检查页面**：访问所有页面，确保没有错误和警告

* **运行测试**：`npm run test` 确保所有测试通过

* **构建验证**：`npm run build` 确保项目能正常构建

## 四、注意事项

1. 确保所有翻译文本都被正确替换，避免出现 `formatMessage` 未定义的错误
2. 检查所有组件和页面，确保没有遗漏的国际化调用
3. 移除国际化后，需要确保所有界面元素在单语言环境下显示正常
4. 测试过程中要特别关注表单验证、错误提示等可能使用国际化的地方

## 五、预期结果

1. 项目不再依赖国际化插件
2. 代码结构更加简洁，减少不必要的依赖
3. 项目在单语言环境下稳定运行
4. 没有因移除国际化功能导致的错误或警告
5. 所有测试通过，构建成功

