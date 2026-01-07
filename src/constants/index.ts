//logo地址
export const SYSTEM_LOGO = require('@/assets/logo.png');

/**
 * 将逗号分隔的标签字符串转换为数组格式
 * @param tagsString - 逗号分隔的标签字符串，例如 "js,前端,react"
 * @returns 标签数组，例如 ['js', '前端', 'react']
 */
export const parseTagsString = (tagsString: string | undefined | null): string[] => {
  if (!tagsString) {
    return [];
  }

  if (Array.isArray(tagsString)) {
    return tagsString;
  }

  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};



/**
 * 迁移旧格式的标签数据，确保返回数组格式
 * @param tags - 可能是字符串或数组格式的标签数据
 * @returns 标准化的标签数组
 */
export const migrateTags = (tags: string | string[] | undefined | null): string[] => {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
  }

  if (typeof tags === 'string') {
    return parseTagsString(tags);
  }

  return [];
};
