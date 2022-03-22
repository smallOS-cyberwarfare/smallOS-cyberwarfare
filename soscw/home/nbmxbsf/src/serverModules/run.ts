import * as exec from "child_process";

const _run = (args: string): string | null => {
  try {
    return exec.execSync(args).toString();
  } catch(e) {
    return null;
  }
}

const run = (text: string): string => {
  const output = _run(`${text.substring(5, text.length)}`);
  if (!output) {
    return "Void output from stdout"
  } else {
    return output;
  }
}

export default run;
