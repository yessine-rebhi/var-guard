import { loadConfig } from '../config';

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoding of environment variables',
      category: 'Best Practices',
      recommended: 'error',
    },
    schema: [],
  },

  create(context) {
    const config = loadConfig();
    const checkVariables = config.checkVariables || [];
    const ignorePatterns = config.ignorePatterns || [];

    const isIgnored = (variableName) => {
      return ignorePatterns.some((pattern) => new RegExp(pattern).test(variableName));
    };

    return {
      VariableDeclarator(node) {
        const id = node.id;
        const init = node.init;

        if (id.type === 'Identifier' && init && init.type === 'Literal' && typeof init.value === 'string') {
          const variableName = id.name;
          if (checkVariables.includes(variableName) && !isIgnored(variableName)) {
            context.report({
              node,
              message: `Hardcoded environment variable '${variableName}' detected.`,
            });
          }
        }
      },
      AssignmentExpression(node) {
        if (node.left.type === 'MemberExpression' && node.right.type === 'Literal' && typeof node.right.value === 'string') {
          const property = node.left.property;
          if (property.type === 'Identifier' && checkVariables.includes(property.name) && !isIgnored(property.name)) {
            context.report({
              node,
              message: `Hardcoded environment variable '${property.name}' detected.`,
            });
          }
        }
      },
      ObjectProperty(node) {
        if (node.value.type === 'Literal' && typeof node.value.value === 'string') {
          const propertyName = node.key.name;
          if (checkVariables.includes(propertyName) && !isIgnored(propertyName)) {
            context.report({
              node,
              message: `Hardcoded environment variable '${propertyName}' detected.`,
            });
          }
        }
      },
    };
  },
};