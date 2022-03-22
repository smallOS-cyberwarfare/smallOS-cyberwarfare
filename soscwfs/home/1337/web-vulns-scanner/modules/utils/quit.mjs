const quit = (msg, errorCode=0) => {
  console.log(msg);
  process.exit(errorCode);
}

export default quit;
