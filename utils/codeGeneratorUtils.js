const codeTemplates = {
  Python: (functionName, parameters, returnType) => `\
class Solution:
  def ${functionName}(${parameters.map((p) => `${p.name}`).join(", ")}):
      # write your code here
      pass\
    `,

  "C++": (functionName, parameters, returnType) => `class Solution {
    public:
        ${getType(returnType)} ${functionName}(${parameters
    .map((p) => `${getType(p.type)} ${p.name}`)
    .join(", ")}) {
            // write your code here
        }
};`,

  Java: (functionName, parameters, returnType) => `class Solution {
    public ${getType(returnType)} ${functionName}(${parameters
    .map((p) => `${getType(p.type)} ${p.name}`)
    .join(", ")}) {
          // write your code
    }
}`,

  JavaScript: (functionName, parameters, returnType) => `\
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
function wrapUserCodeForExecution(
  userCode,
  functionName,
  parameters,
  returnType,
  language,
  inputs
) {
  const paramNames = parameters.map((param) => param.name).join(", ");

  if (language === "Java") {
    return `\
${userCode}

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();

        // Define inputs as variables
        ${parameters
          .map(
            (param, index) =>
              `${getTypeConversionJava(param.type)} ${
                param.name
              } = ${getTypeValueJava(param.type, inputs[index])};`
          )
          .join("\n        ")}

        // Call the user-defined function
        ${
          returnType !== "void" ? `${getType(returnType)} result = ` : ""
        }solution.${functionName}(${paramNames});

        // Print the result if not void
        ${returnType !== "void" ? `System.out.println(result);` : ""}
    }
}`;
  } else if (language === "Python") {
    return `\
${userCode}

def main():
    # Define inputs as variables
    ${parameters
      .map(
        (param, index) =>
          `${param.name} = ${getTypeValuePython(param.type, inputs[index])}`
      )
      .join("\n    ")}

    # Call the user-defined function
    result = Solution.${functionName}(${paramNames})

    # Print the result if not None
    ${returnType !== "None" ? `print(result)` : ""}

if __name__ == "__main__":
    main()
`;
  } else if (language === "C++") {
    return `\
#include <iostream>
using namespace std;

${userCode}

int main() {
    // Define inputs as variables
    ${parameters
      .map(
        (param, index) =>
          `${getTypeConversionCpp(param.type)} ${
            param.name
          } = ${getTypeValueCpp(param.type, inputs[index])};`
      )
      .join("\n    ")}

    // Call the user-defined function
    ${
      returnType !== "void" ? `${getType(returnType)} result = ` : ""
    }Solution().${functionName}(${paramNames});

    // Print the result if not void
    ${returnType !== "void" ? `cout << result << endl;` : ""}

    return 0;
}
`;
  } else if (language === "JavaScript") {
    return `\
${userCode}

// Define inputs as variables
${parameters
  .map(
    (param, index) =>
      `const ${param.name} = ${getTypeValueJavaScript(
        param.type,
        inputs[index]
      )};`
  )
  .join("\n")}

// Call the user-defined function
${
  returnType !== "undefined" ? `const result = ` : ""
}${functionName}(${paramNames});

// Print the result if not undefined
${returnType !== "undefined" ? `console.log(result);` : ""}
`;
  } else {
    throw new Error(`Unsupported language: ${language}`);
  }
}

function getTypeConversionCpp(type) {
  switch (type) {
    case "int":
      return "int";
    case "float":
      return "float";
    case "double":
      return "double";
    case "string":
      return "string";
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

function getTypeValuePython(type, value) {
  switch (type) {
    case "int":
      return parseInt(value);
    case "float":
      return parseFloat(value);
    case "str":
      return `"${value}"`; // Add quotes around string values
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
function getTypeValueCpp(type, value) {
  switch (type) {
    case "int":
      return parseInt(value);
    case "float":
    case "double":
      return parseFloat(value);
    case "string":
      return `"${value}"`;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

function getTypeValueJavaScript(type, value) {
  switch (type) {
    case "int":
    case "float":
      return parseFloat(value);
    case "string":
      return `"${value}"`;
    case "boolean":
      return value === "true";
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
module.exports = {
  generateDefaultCode,
  wrapUserCodeForExecution,
};
