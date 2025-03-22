const codeTemplates = {
  python: (functionName, parameters, returnType) => `\
class Solution:
  def ${functionName}(${parameters
    .map((p) => `${p.name}`)
    .join(", ")}) -> ${returnType}:
      # write your code here
      pass\
    `,

  cpp: (functionName, parameters, returnType) => `class Solution {
    public:
        ${getType(returnType)} ${functionName}(${parameters
    .map((p) => `${getType(p.type)} ${p.name}`)
    .join(", ")}) {
            // write your code here
        }
};`,

  java: (functionName, parameters, returnType) => `class Solution {
    public ${getType(returnType)} ${functionName}(${parameters
    .map((p) => `${getType(p.type)} ${p.name}`)
    .join(", ")}) {
          // write your code
    }
}`,

  javascript: (functionName, parameters, returnType) => `\
var ${functionName} = function (${parameters.map((p) => p.name).join(", ")}) {
      // write your code here
}\
    `,
};

function getType(type) {
  switch (type) {
    case "int":
      return "int";
    case "float":
      return "float";
    case "string":
      return "String";
    case "boolean":
      return "boolean";
    case "array-int":
      return "int[]";
    case "array-float":
      return "float[]";
    case "array-string":
      return "String[]";
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

function generateDefaultCode(language, functionName, parameters, returnType) {
  if (!codeTemplates[language]) {
    throw new Error(`Unsupported language: ${language}`);
  }
  return codeTemplates[language](functionName, parameters, returnType);
}

module.exports = {
  generateDefaultCode,
};
