# User-Lookup

Check if username exists in many services like Instagram, TikTok, Paypal, Wikipedia, and Youtube

## Legal
[Legal Notice](https://github.com/StringManolo/user-lookup/blob/main/LEGAL.md#disclaimer-notice)

### Preview
![Preview](https://raw.githubusercontent.com/StringManolo/user-lookup/378c42812db7c84d6c81394259fa9516d67f8b68/images/user_lookup_image_1.jpg)

### Live
[Live Demo](https://user-lookup.glitch.me/) 

* This demo is running on a free service, so it may take time for "wake up" or answer. For best performance run it locally on your machine. Or run it on another server.

### Usage

##### Download the Software
```bash
git clone https://github.com/stringmanolo/user-lookup
```

##### Move to the Directory
```bash
cd user-lookup
```

##### Install Dependencies
```bash
npm install
```

##### Start the Program
```bash
npm start # or node main.js
```

##### Open the Webpage in your Browser
http://localhost:3000/user-lookup


### API Usage
http://localhost:3000/search_{x}?username={y}

Where __x__ is the service you want to use, and __y__ is the username you want to search. For example http://localhost:3000/search_youtube?username=stringmanolo

* Api returns true when the account exists in the service, and false when it doesn't

##### Available Services

* 50 Available Services

- aboutme
- allrecipes
- anime-planet
- behance
- boardgamegeek
- buzzfeed
- cnet
- cnn
- codecademy
- coursera
- dailymotion
- deviantart
- discussions_apple
- douban
- dribbble
- dzen
- ebay
- flickr
- gaana
- github
- goodreads
- habr
- imdb
- instagram
- kompasiana
- lastfm
- livejournal
- medium
- mercadolivre
- pakwheels
- paypal
- pinterest
- pornhub
- producthunt
- quora
- reddit
- snapchat
- soundcloud
- spotify
- telegram
- theguardian
- tieba
- tiktok
- tumblr
- twitch
- vice
- vimeo
- wikipedia
- wordpress
- xvideos
- youtube

* Services may become unavailable at any time if breaking changes are made by the developers of the target service. Open an issue if the case occurs and we will update the service. 
