const express = require("express");
const fetch = require("node-fetch");

const app = express();
const port = 3000;

const host = `http://localhost:${port}`;

app.get("/user-lookup", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Lookup</title>
    <link rel="icon" href="data:image/png;base64,iVBORw0KGgo=">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            -webkit-text-size-adjust: none;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }

        .container {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 40px;
            width: 300px;
        }

        h1 {
            text-align: center;
            color: #333;
        }

        label {
            display: block;
            margin-bottom: 10px;
            color: #555;
        }

        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        input[type="submit"] {
            background-color: #0073e6;;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }

        input[type="submit"]:hover {
            background-color: #0059b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>User Lookup</h1>
        <form action="/search" method="get">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username">
            <input type="submit" value="Submit">
        </form>
    </div>
</body>
</html>
  `);


});

app.get("/search", async (req, res) => {
  const username = req.query.username;
 
  const promises = [
    //0
    fetch(`${host}/search_aboutme?username=${username}`).then((response) => aboutme = response.text()),

    //1
    fetch(`${host}/search_allrecipes?username=${username}`).then((response) => allrecipes = response.text()),

    //2
    fetch(`${host}/search_anime-planet?username=${username}`).then((response) => animeplanet = response.text()),

    //3
    fetch(`${host}/search_ao3?username=${username}`).then((response) => ao3 = response.text()),

    //4
    fetch(`${host}/search_boardgamegeek?username=${username}`).then((response) => boardgamegeek = response.text()),

    //5
    fetch(`${host}/search_buzzfeed?username=${username}`).then((response) => buzzfeed = response.text()),

    //6
    fetch(`${host}/search_cnn?username=${username}`).then((response) => cnn = response.text()),

    //7
    fetch(`${host}/search_discussions_apple?username=${username}`).then((response) => discussionsapple = response.text()),

    //8
    fetch(`${host}/search_ebay?username=${username}`).then((response) => facebook = response.text()),

    //9
    fetch(`${host}/search_github?username=${username}`).then((response) => instagram = response.text()),

    //10
    fetch(`${host}/search_imdb?username=${username}`).then((response) => reddit = response.text()),

    //11
    fetch(`${host}/search_instagram?username=${username}`).then((response) => instagram = response.text()),

    //12
    fetch(`${host}/search_pinterest?username=${username}`).then((response) => pinterest = response.text()),

    //13
    fetch(`${host}/search_pornhub?username=${username}`).then((response) => pornhub = response.text()),

    //14
    fetch(`${host}/search_reddit?username=${username}`).then((response) => reddit = response.text()),

    //15
    fetch(`${host}/search_snapchat?username=${username}`).then((response) => snapchat = response.text()),

    //16
    fetch(`${host}/search_spotify?username=${username}`).then((response) => spotify = response.text()),

    //17
    fetch(`${host}/search_telegram?username=${username}`).then((response) => telegram = response.text()),

    //18
    fetch(`${host}/search_tiktok?username=${username}`).then((response) => tiktok = response.text()),

    //19
    fetch(`${host}/search_twitch?username=${username}`).then((response) => twitch = response.text()),

    //20
    fetch(`${host}/search_twitter?username=${username}`).then((response) => twitter = response.text()),

    //21
    fetch(`${host}/search_vimeo?username=${username}`).then((response) => vimeo = response.text()),

    //22
    fetch(`${host}/search_wikipedia?username=${username}`).then((response) => wikipedia = response.text()),

    //23
    fetch(`${host}/search_xvideos?username=${username}`).then((response) => xvideos = response.text()),

    //24
    fetch(`${host}/search_youtube?username=${username}`).then((response) => youtube = response.text())
  ];

  try {
    const values = await Promise.all(promises);
    const sites = [];

    if (values[0] == "true") {
      sites.push(`<a href="https://about.me/${username}">about.me`);
    }
    if (values[1] == "true") {
      sites.push(`<a href="https://allrecipes.com/cook/${username}/">allrecipes.com</a>`);
    }
    if (values[2] == "true") {
      sites.push(`<a href="https://www.anime-planet.com/users/${username}">anime-planet.com</a>`);
    }
    if (values[3] == "true") {
      sites.push(`<a href="https://archiveofourown.org/users/${username}">archiveofourown.org</a>`);
    }
    if (values[4] == "true") {
      sites.push(`<a href="https://boardgamegeek.com/user/${username}">boardgamegeek.com</a>`);
    }
    if (values[5] == "true") {
      sites.push(`<a href="https://buzzfeed.com/${username}">buzzfeed.com</a>`);
    }
    if (values[6] == "true") {
      sites.push(`<a href="https://edition.cnn.com/profiles/${username}">cnn.com</a>`);
    }
    if (values[7] == "true") {
      sites.push(`<a href="https://discussions.apple.com/profile/${username}">discussions.apple.com</a>`);
    }
    if (values[8] == "true") {
      sites.push(`<a href="https://www.ebay.com/usr/${username}">ebay.com</a>`);
    }
    if (values[9] == "true") {
      sites.push(`<a href="https://github.com/${username}">github.com</a>`);
    }
    if (values[10] == "true") {
      sites.push(`<a href="https://www.imdb.com/user/${username}">imdb.com</a>`);
    }
    if (values[11] == "true") {
      sites.push(`<a href="https://www.instagram.com/${username}">instagram.com</a>`);
    }
    if (values[12] == "true") {
      sites.push(`<a href="https://www.pinterest.com/${username}">pinterest.com</a>`);
    }
    if (values[13] == "true") {
      sites.push(`<a href="https://www.pornhub.com/users/${username}">pornhub.com</a>`);
    }
    if (values[14] == "true") {
      sites.push(`<a href="https://www.reddit.com/user/${username}">reddit.com</a>`);
    }
    if (values[15] == "true") {
      sites.push(`<a href="https://www.snapchat.com/add/${username}">snapchat.com</a>`);
    }
    if (values[16] == "true") {
      sites.push(`<a href="https://open.spotify.com/user/${username}">spotify.com</a>`);
    }
    if (values[17] == "true") {
      sites.push(`<a href="https://t.me/${username}">t.me</a>`);
    }
    if (values[18] == "true") {
      sites.push(`<a href="https://www.tiktok.com/@${username}">tiktok.com</a>`);
    }
    if (values[19] == "true") {
      sites.push(`<a href="https://www.twitch.tv/${username}">twitch.tv</a>`);
    }
    if (values[20] == "true") {
      sites.push(`<a href="https://twitter.com/${username}">twitter.com</a>`);
    }
    if (values[21] == "true") {
      sites.push(`<a href="https://www.vimeo.com/${username}">vimeo.com</a>`);
    }
    if (values[22] == "true") {
      sites.push(`<a href="https://www.wikipedia.org/wiki/User:${username}">wikipedia.org</a>`);
    }
    if (values[23] == "true") {
      sites.push(`<a href="https://xvideos.com/profiles/${username}">xvideos.com</a>`);
    }
    if (values[24] == "true") {
      sites.push(`<a href="https://www.youtube.com/@${username}">youtube.com</a>`);
    }


    res.send(`
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      padding: 20px;
      background-color: #f4f4f4;
      -webkit-text-size-adjust: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    h1 {
      color: #333;
    }
    a {
      display: block;
      margin: 10px 0;
      color: #0073e6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    textarea {
      width: 70%;
      height: 200px;
      margin-top: 20px;
      padding: 10px;
      font-size: 16px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: none;
    }
    .button-container {
      margin-top: 10px;
    }
    .format-button {
      padding: 8px 16px;
      margin-right: 10px;
      background-color: #0073e6;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .format-button:hover {
      background-color: #005aa7;
    }
  </style>
</head>
<body>
  <h1>Results for ${username}</h1>
  ${sites.length > 0 ? sites.join("") : "<p>No profiles found.</p>"}
  <textarea id="resultsTextarea" placeholder="Results" readonly>${sites.map(site => {
    const hrefStartIndex = site.indexOf("href=\"") + 6;
    const hrefEndIndex = site.indexOf("\">");
    return site.substring(hrefStartIndex, hrefEndIndex);
  }).join("\n")}</textarea>
  <div class="button-container">
    <button class="format-button" onclick="formatDefault()">Default</button>
    <button class="format-button" onclick="formatCSV()">CSV</button>
    <button class="format-button" onclick="formatJSON()">JSON</button>
    <button class="format-button" onclick="formatHTML()">HTML</button>
    <button class="format-button" onclick="formatMarkdown()">Markdown</button>
    <button class="format-button" onclick="downloadFile()">Download</button>
  </div>

  <script>
    // Guardar el valor original del textarea
    const originalValue = document.getElementById('resultsTextarea').value;

    function formatDefault() {
      document.getElementById('resultsTextarea').value = originalValue;
    }

    function formatCSV() {
      formatDefault();
      const textarea = document.getElementById('resultsTextarea');
      const urls = textarea.value.split('\\n');
      const formatted = urls.map(url => \`"\${url}"\`).join(',\\n');
      textarea.value = formatted;
    }

    function formatJSON() {
      formatDefault();
      const textarea = document.getElementById('resultsTextarea');
      const urls = textarea.value.split('\\n');
      const json = JSON.stringify(urls, null, 2);
      textarea.value = json;
    }

    function formatHTML() {
      formatDefault();
      const textarea = document.getElementById('resultsTextarea');
    
      const urls = textarea.value.split('\\n').map(url => {
        const cleanUrl = url.replace('https://', '');
        const parts = cleanUrl.split('/');
        const domain = parts.length > 1 ? parts[0] : cleanUrl;
        return \`<a href="\${url}">\${domain}</a>\`;
      }).join('\\n');
      textarea.value = urls;
    }

    function formatMarkdown() {
      formatDefault();
      const textarea = document.getElementById('resultsTextarea');
    
      const urls = textarea.value.split('\\n').map(url => {
        const cleanUrl = url.replace('https://', '');
        const parts = cleanUrl.split('/');
        const domain = parts.length > 1 ? parts[0] : cleanUrl;
        return \`[\${domain}](\${url})\`;
      }).join('\\n');
      textarea.value = urls;
    }

    function downloadFile() {
      const text = document.getElementById('resultsTextarea').value;
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', prompt('Enter file name and extension (e.g. elon_musk_accounts.json)'));
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    

  </script>
</body>
</html>
`);


    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }

});

app.get("/search_aboutme", (req, res) => {
  const username = req.query.username;
  fetch(`https://about.me/${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_allrecipes", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.allrecipes.com/cook/${username}/`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_anime-planet", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.anime-planet.com/users/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp(`<a\\s+href="/users/${username}/following">`, "gi").test(response) ? res.send("true") : res.send("false");
  });
});

app.get("/search_ao3", (req, res) => {
  const username = req.query.username;
  fetch(`https://archiveofourown.org/users/${username}/works`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_boardgamegeek", (req, res) => {
  const username = req.query.username;
  fetch(`https://boardgamegeek.com/user/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp(`Error: User does not exist`, "gi").test(response) ? res.send("false") : res.send("true");
  });
});

app.get("/search_buzzfeed", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.buzzfeed.com/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    if (new RegExp(`joined`, "gi").test(response) && new RegExp(`trophies`, "gi").test(response)) {
      res.send("true");
    } else {
      res.send("false");
    }
  });
})

app.get("/search_cnn", (req, res) => {
  const username = req.query.username;
  fetch(`https://edition.cnn.com/profiles/${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_discussions_apple", (req, res) => {
  const username = req.query.username;
  fetch(`https://discussions.apple.com/profile/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp("user-profile-name", "gi").test(response) ? res.send("true") : res.send("false");
  });
});

app.get("/search_ebay", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.ebay.com/usr/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp("Member since", "gi").test(response) ? res.send("true") : res.send("false");
  });
});

app.get("/search_github", (req, res) => {
  const username = req.query.username;
  fetch(`https://github.com/${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_imdb", (req, res) => {
  const username = req.query.username;
  fetch(`https://html.duckduckgo.com/html?q=site:imdb.com%20%2B%20%22user%22%20%2B%20%22ur%22%20${username}%20-%22title%22`).then((response) => {
    return response.text(); 
  })
  .then((response) => {
    new RegExp(`<a[^>]+>${username}\&\#x27\;s Profile - IMDb</a>`, "gi").test(response) ? res.send("true") : res.send("false");
  });
});

app.get("/search_instagram", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.instagram.com/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    response.match(/httpErrorPage/g).length > 1 ? res.send("false") : res.send("true");
  });
});

app.get("/search_pinterest", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.pinterest.com/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp(`user not found`, "gi").test(response) ? res.send("false") : res.send("true");
  });

});

app.get("/search_pornhub", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.pornhub.com/users/${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_reddit", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.reddit.com/user/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp(`Sorry, nobody on Reddit goes by that name.`, "gi").test(response) ? res.send("false") : res.send("true");
  });
});

app.get("/search_snapchat", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.snapchat.com/add/${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_spotify", (req, res) => {
  const username = req.query.username;
  fetch(`https://open.spotify.com/user/${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_telegram", (req, res) => {
  const username = req.query.username;
  fetch(`https://t.me/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp(`tgme_page_title`, "gi").test(response) ? res.send("true") : res.send("false"); 
  });
});

app.get("/search_tiktok", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.tiktok.com/@${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp(`"uniqueId":"${username}"`, "gi").test(response) ? res.send("true") : res.send("false");
  });
});

app.get("/search_twitch", (req, res) => {
  const username = req.query.username;
  fetch(`https://m.twitch.tv/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    new RegExp(`profile_image`, "gi").test(response) ? res.send("true") : res.send("false");
  });
});

/* Not done yet */
app.get("/search_twitter", (req, res) => {
  const username = req.query.username;
  fetch(`https://x.com/${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    
    /* TODO:
     * Make manual redirection by "setting" cookie from response headers and follow URL redirection manually */

    res.send("false");
    //response.match(/httpErrorPage/g).length > 1 ? res.send("false") : res.send("true");
  });
});

app.get("/search_vimeo", (req, res) => {
  const username = req.query.username;
  fetch(`https://vimeo.com/${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_wikipedia", (req, res) => {
  const username = req.query.username;
  fetch(`https://en.wikipedia.org/wiki/User:${username}`).then((response) => {
    return response.text();
  })
  .then((response) => {
    if (new RegExp(`is not registered on this wiki`, "gim").test(response)) {
      res.send("false");
    } else if (new RegExp(`Wikipedia does not have a`, "gim").test(response)) {
      res.send("false");
    } else {
      res.send("true");
    }
  });
});

app.get("/search_xvideos", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.xvideos.com/profiles/${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});

app.get("/search_youtube", (req, res) => {
  const username = req.query.username;
  fetch(`https://www.youtube.com/@${username}`).then((response) => {
    response.status == 200 ? res.send("true") : res.send("false");
  });
});




app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
