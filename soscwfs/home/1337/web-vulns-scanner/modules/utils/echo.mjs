const echo = (msg, type="normal") => {
  const RED = "\x1b[31m",
    RESET = "\x1b[0m",
    YELLOW = "\x1b[33m",
    BLUE = "\x1b[34m",
    GREEN = "\x1b[32m";

  switch(type) {
    case "normal":
      console.log(msg);
    break;

    case "verbose":
      if (global.userSelected && global.userSelected.verbose) {
        console.log(GREEN + msg + RESET);
      }
    break;

    case "warning":
      console.log(YELLOW + msg + RESET);
    break

    case "critical":
      console.log(RED + msg + RESET);
    break;

    case "debug":
      if (global.userSelected && global.userSelected.debug) {
        console.log(BLUE + msg + RESET);
      }
  }
}

export default echo;
