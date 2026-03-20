# hydrus-predownloader

on 2025, i started using [hydrus](https://hydrusnetwork.github.io/hydrus/) to organize all the images i'd saved to my PC, but there was a problem: i also wanted to convert the images i downloaded to jxl (as well as resizing them if they were above a certain height/width) before archiving them, which meant i couldn't use hydrus' built-in downloader, since it doesn't have those functionalities. this meant downloading the images and tagging them/adding their metadata manually, which is a huge chore.

so i made this extension to solve that issue. it lets you open a dialog on relevant pages, where you can select the specific images you want to save, and input the tags you'll want to add to it on hydrus, and you can then download not just the pictures but a json [sidecar](https://hydrusnetwork.github.io/hydrus/advanced_sidecars.html) with those tags. much more convenient!!!

## installation

1. you have to be using [firefox developer edition](https://www.firefox.com/en-US/channel/desktop/developer/). you also need to have the [CORS everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) extension installed, with `/^https://www.pixiv.net/` added to its activation whitelist (available on the extension options).
2. go to [about:config](about:config). there, search for `xpinstall.signatures.required`, and set it to `false`.
3. head over to the [releases](https://github.com/saoricake/hydrus-predownloader/releases) page, and download the zip of whatever the latest release is (not the source code one).
4. go to [about:addons](about:addons), and drag the zip you downloaded from the previous step into this page. firefox will ask you if you want to install the extension, so accept.
5. that's it

## usage

<figure style="max-width: 800px; margin: 0 auto 2rem;">
<img src="https://nothinghappens.neocities.org/stuff/hydrus-predownloader-ui.webp"/>
<figcaption style="margin: 0 auto; width: max-content;">pictured: the downloader dialog, circa v1.0.0, open on <a href="https://www.pixiv.net/artworks/128454842">this pixiv gallery</a></figcaption>
</figure>

once the extension is installed, you can press `Ctrl + Q` on a supported page to open the downloader dialog, shown on the picture above with key areas highlighted. they are:

1. a text field for the artist's name. (i don't just grab it automatically from the page because i want it to be romanized, and sometimes the artist doesn't even use their primary pen name as their pixiv username anyway.) this field is required, and its contents will be added to the `tags` array in the JSON file, with `creator:` prepended to it.
2. multi-line text areas for adding series, character, and generic tags. all are optional. each line on each text area will be considered as a separate tag, with the series and character ones having `series:` and `character:` prepended to them, respectively.
   - below the text areas is the "add page tags" checkbox, which, when checked, will add a `page:{n}` tag to each of the selected images, with `n` being the (1-based) index of the given image among the selected images. (so, if there are 10 images but only 1, 5, and 8 were selected, 1 will get `page:1`, 5 will get `page:2`, and 8 will get `page:3`.)
3. a grid showing all the images in the gallery. at least one must be selected, and only the selected ones will be downloaded.
4. the download button. after inputting the artist's name and selecting at least one image, click this, and the images and their respective JSON files will be downloaded! (note that it might take a little bit for the downloads to start, so don't click the download button again before they do.) (there's currently no progress indicator, though i'd like to add one someday.) (...also, all the files are downloaded separately. i would've liked to put all of them in a single zip file, but couldn't figure out how to do it without requiring an external library.)

## supported sites

currently, only [pixiv](https://www.pixiv.net/) is supported, but i plan on adding a few more.

## project structure

TBA

## building it yourself

TBA
