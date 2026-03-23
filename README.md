# hydrus-predownloader

in 2025, i started using [hydrus](https://hydrusnetwork.github.io/hydrus/) to organize all the images i'd saved to my PC, but there was a problem: i also wanted to convert the images i downloaded to jxl (as well as resizing them if they were above a certain height/width) before archiving them, which meant i couldn't use hydrus' built-in downloader, since it doesn't have those functionalities. this meant downloading the images and tagging them/adding their metadata manually, which is a huge chore.

so i made this extension to solve that issue. it lets you open a dialog on relevant pages, where you can select the specific images you want to save, and input the tags you'll want to add to it on hydrus, and you can then download not just the pictures but a json [sidecar](https://hydrusnetwork.github.io/hydrus/advanced_sidecars.html) with those tags. much more convenient!!!

## installation

1. you have to be using [firefox developer edition](https://www.firefox.com/en-US/channel/desktop/developer/). you also need to have the [CORS everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) extension installed, with `/^https://www.pixiv.net/` added to its activation whitelist (available on the extension options).
2. go to [about:config](about:config). there, search for `xpinstall.signatures.required`, and set it to `false`.
3. head over to the [releases](https://github.com/saoricake/hydrus-predownloader/releases) page, and download the zip of whatever the latest release is (not the source code one).
4. go to about:addons, and drag the zip you downloaded from the previous step into this page. firefox will ask you if you want to install the extension, so accept.
5. that's it

## supported sites

currently, only [pixiv](https://www.pixiv.net/) galleries (`https://www.pixiv.net/artworks/{id}`) are supported, but i plan on adding a few more.

## usage

once the extension is installed, you can press `Ctrl + Q` on a supported page to open the downloader dialog:

![](https://nothinghappens.neocities.org/stuff/hydrus-predownloader-ui.webp)

1. a text field for the artist's name. (i don't just grab it automatically from the page because i want it to be romanized, and sometimes the artist doesn't even use their primary pen name as their pixiv username anyway.) this field is required, and its contents will be added to the `tags` array in the JSON file, with `creator:` prepended to it.
2. multi-line text areas for adding series, character, and generic tags. all are optional. each line on each text area will be considered as a separate tag, with the series and character ones having `series:` and `character:` prepended to them, respectively.
   - below the text areas is the "add page tags" checkbox, which, when checked, will add a `page:{n}` tag to each of the selected images, with `n` being the (1-based) index of the given image among the selected images. (so, if there are 10 images but only 1, 5, and 8 were selected, 1 will get `page:1`, 5 will get `page:2`, and 8 will get `page:3`.)
3. a grid showing all the images in the gallery. at least one must be selected, and only the selected ones will be downloaded.
4. the download button. after inputting the artist's name and selecting at least one image, click this, and the images and their respective JSON files will be downloaded! (note that it might take a little bit for the downloads to start, so don't click the download button again before they do.) (there's currently no progress indicator, though i'd like to add one someday.) (...also, all the files are downloaded separately. i would've liked to put all of them in a single zip file, but couldn't figure out how to do it without requiring an external library.)

---

<details>
<summary>dev stuff</summary>

## project structure

| folder/file | contents |
| --- | --- |
| `/dist` | after running `yarn build`, everything in `/src` will be moved to here, maintaining the same folder structure, and with `.ts` files being converted to `.js` |
| `/src` | root folder of the extension source code |
| `/src/css/layout.css` | css file that defines the layout of the dialog (primarily css grid-related rules, but also some box model stuff) |
| `/src/css/style.css` | css file that defines the look of the dialog |
| `/src/js/data/*.ts` | files that define site-specific functions that get the data using during the download (for example, the URLs of the images, their metadata, etc.) |
| `/src/js/consts.ts` | defines constants used in various other files |
| `/src/js/download.ts` | defines the functions that actually execute the downloads |
| `/src/js/html.ts` | defines the functions that create the dialog's html |
| `/src/js/init.ts` | defines the functions that initialize the dialog when it opens on a given page for the first time |
| `/src/js/run.ts` | defines the function that opens the dialog |
| `/src/js/utils.ts` | defines some utility functions used in various other files |
| `/src/manifest.json` | [what it says on the tin](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json) |

## building it yourself

0. install [git](https://git-scm.com/install/) (if you somehow don't have it yet) and [yarn](https://yarnpkg.com/getting-started/install) (4.6.0)
1. open the command line on the folder you want the project folder to be in, then run `git clone https://github.com/saoricake/hydrus-predownloader.git`
2. inside the `/hydrus-predownloader` folder that appeared, run `yarn install`...
3. ...and then `yarn build`
4. zip all the files inside the `/dist` folder (the files, not the folder itself!) with your preferred zipping program (i use 7zip). ta-da
5. if you ever change something in the code, run `yarn build` again to make the new code appear on `/dist`. then, you can test it through a temporary install by going to about:debugging → "This Firefox" → "Load Temporary Add-on..." and selecting `/dist/manifest.json`, or zip the contents of `/dist` again to install it permanently.

## adding support for other sites

create a new typescript file inside `/src/js/data`, named after the site you're adding support for or whatever. it should define the following functions:

| function's name | return type | details |
| --- | --- | --- |
| `isIllustPage` | `boolean` | makes some sort of additional check to see if the dialog should open. (hmm, maybe i should've given it a more generic name.) if the site's not a single-page app, then you can probably just have it return `true`. |
| `getImgSource` | `string` | the string returned by this one will be recorded as the image's "source" in hydrus. in most cases, it'll probably be the url of the current page. |
| `getDateAndUserId` | `{ artistId: string; illustDate: string }` | the artist's id is used when saving their name on the dialog, so it should be something unique. the date will be recorded on hydrus, and needs to be something that can be fed into [`Temporal.Instant.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant/from). |
| `getImgURLs` | `Promise<{ url: string; thumb: string }[]>` | the `url` field is the address the full image will be downloaded from, while `thumb` will be used as the image's thumbnail in the dialog's grid. |

once that's all done, open the `/src/manifest.json`, and...

1. add the site to [the `matches` array](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/content_scripts#matching_url_patterns) in the first and last objects of the `content_scripts` array. if the site is a single-page app, you should add just the domain, so the match is as broad as possible; otherwise, add the specific page.
2. add a new object to the `content_scripts` array, between the last and second-to-last ones. give it a `matches` field with an array with the same match pattern used in the previous step, and a `js` field, also with an array, containing the path to the file with the functions you created earlier (`/src/js/data/{etc}.js`). important: you made a `.ts` file, but it should have a `.js` extension here!

</details>
