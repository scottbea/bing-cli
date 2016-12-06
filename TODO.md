# Short List
## Defects

- <del>Fix -version flag on displaying author</del> ✓
- <del>Change the News Search to have valid URLs</del> ✓
 

## Enhancements

- Add details on installing iTerm2 for the Mac
- Add a -help command with details
- Run tests for downlevel versions of NodeJS
- Run tests on NodeJS for Windows
- Update the docs for platform-specific installs
- Start adding real test coverage
 

# Image Search
## Additional Query Filters

By default, the Images API returns all images that are relevant to the query. To filter the images, use the following filter query parameters.

- aspect—Filter images by aspect ratio (for example, standard or wide screen images) 
- color—Filter images by color or black and white
- freshness—Filter images by age (for example, images discovered by Bing in the past week)
- height—Filter images by height
- imageContent—Filter images by content (for example, images that show only a person's face)
- license—Filter images by the type of license that applies to the image
- width—Filter images by width

## Download Image to File
We want to allow users to download the image (for one image) with the -output <file> command.


## ASCII Rendering Control
We need to add more flexibility in rendering. The following are proposed:

- <del>Support black and white mode with -bw flag (ASCII only)</del> ✓
- <del>Support greyscale mode with -grey flag (ASCII only)</del> ✓
- <del>Enable user to force rendering to ASCII with -ascii</del> ✓ 


## Future: Image Manipulation
In the future, we want to consider adding image processing features that would make the experience better. Top ideas include:

- Make background transparent (helpful in ASCII)
- Image Tiling / Collage to render image results into one image
- Image filters like Sepia, Noir, Bright, etc.
- Image border injection to make layout look better
- Image transforms to improve ASCII rendering (hard)
- Alternate image rendering for any image by url, site, or name
- Image to text via Cognitive Services APIs


## Allow for site-constrained searches
To get images from a specific domain, use the site: query operator. 

```
$ bing image site:wikipedia.org bill gates
```


# Better Text Handling
## Random Ideas:

- Support Text-Based Browsers (http://w3m.sourceforge.net)
- Look for Longer Captions
- Allow for Wikipedia Content
- Consider PDF conversion to Text


# Video Search
We might be able to do some stuff here:

- Allow for video search with image thumbanil and video URL
- Sample video and convert to animated GIF for iTerm2
- Downsample Video and Convert to ASCII animation (pain)

# Answers
We might be able to support the following richer results:

- Spelling Corrections
- Word Definition
- Weather for location
- Time in location
- Stock Price
- Flight Status
- Movie Times
- StackOverflow

# Document Other Terminals

https://www.enlightenment.org/about-terminology?s%5B%5D=terminology
https://en.wikipedia.org/wiki/Guake
https://github.com/Swordfish90/cool-retro-term
http://alternativeto.net/software/cool-retro-term/

https://www.idera.com/productssolutions/freetools/powershellplus
http://cmder.net/
https://conemu.github.io/
https://mridgers.github.io/clink/
https://git-for-windows.github.io/
https://sourceforge.net/projects/console/
https://poshconsole.codeplex.com/

## Caca
http://askubuntu.com/questions/97542/how-do-i-make-my-terminal-display-graphical-pictures
http://caca.zoy.org/wiki/libcaca
sudo apt-get install caca-utils
cacaview /PATH/TO/image.jpg
mplayer -vo caca /PATH/TO/video.mpg

## Linux FBI
sudo apt-get install fbi

## Terminology
https://www.youtube.com/watch?feature=player_embedded&v=ibPziLRGvkg


https://github.com/ichinaski/pxl
http://savannah.nongnu.org/projects/fbi-improved/
http://www.nongnu.org/fbi-improved/
https://github.com/saitoha/libsixel




