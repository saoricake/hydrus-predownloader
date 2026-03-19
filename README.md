# hydrus-predownloader

on 2025, i started using [hydrus](https://hydrusnetwork.github.io/hydrus/) to organize all the images i'd saved to my PC, but there was a problem: i also wanted to convert the images i downloaded to jxl (as well as resizing them if they were above a certain height/width) before archiving them, which meant i couldn't use hydrus' built-in downloader, since it doesn't have those functionalities. this meant downloading the images and tagging them/adding their metadata manually, which is a huge chore.

so i made this extension to solve that issue. it lets you open a dialog on relevant pages, where you can select the specific images you want to save, and input the tags you'll want to add to it on hydrus, and you can then download not just the pictures but a json [sidecar](https://hydrusnetwork.github.io/hydrus/advanced_sidecars.html) with those tags. much more convenient!!!

## installation

0. you have to be using [firefox developer edition](https://www.firefox.com/en-US/channel/desktop/developer/).
1. go to [about:config](about:config). there, search for `xpinstall.signatures.required`, and set it to `false`.
2. head over to the [releases](https://github.com/saoricake/hydrus-predownloader/releases) page, and download the zip of whatever the latest release is (not the source code one).
3. go to [about:addons](about:addons), and drag the zip you downloaded from the previous step into this page. firefox will ask you if you want to install the extension, so accept.
4. that's it

## usage

TBA

## project structure

TBA

## building it yourself

TBA
