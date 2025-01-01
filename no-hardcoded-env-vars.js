module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoding of environment variables',
      category: 'Best Practices',
      recommended: 'error',
    },
    schema: [
      {
        type: 'object',
        properties: {
          checkVariables: { type: 'array', items: { type: 'string' } },
          ignorePatterns: { type: 'array', items: { type: 'string' } },
        },
      },
    ],
  },

  create(context) {
    const config = context.options[0] || {};
    const checkVariables = config.checkVariables || [];
    const ignorePatterns = config.ignorePatterns || [];

    const isIgnored = (variableName) => {
      return ignorePatterns.some(pattern => new RegExp(pattern).test(variableName));
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
    };
  },
};