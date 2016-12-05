Filtering Images
By default, the Images API returns all images that are relevant to the query. To filter the images, use the following filter query parameters.
aspect—Filter images by aspect ratio (for example, standard or wide screen images)
color—Filter images by color or black and white
freshness—Filter images by age (for example, images discovered by Bing in the past week)
height—Filter images by height
imageContent—Filter images by content (for example, images that show only a person's face)
license—Filter images by the type of license that applies to the image
width—Filter images by width
To get images from a specific domain, use the site: query operator.
The following example shows how to get small images from ContosoSailing.com that Bing has discovered in the past week.
