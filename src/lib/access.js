export const PUBLIC_TOOL_LIMIT = 10;

export function isPublicTool(tool) {
  return Boolean(tool && tool.id <= PUBLIC_TOOL_LIMIT);
}

export function canAccessTool(tool, isAuthenticated) {
  return isPublicTool(tool) || isAuthenticated;
}
