jnote 
======

A simple, responsive javascript image-annotation system.

What does it do?
======

jnote provides a way to annotate images using the mouse and html5 canvas.  When a user hovers over an image hotspot, a caption will appear.

Status
======
jnote currently sort of works, but is ugly and not super usable!  Check back soon, or consider contributing.

How do I use it?
======

jnote requires no dependencies.  Simply download the `jnote.js` file and reference it in your project.
At the bottom of the body of your HTML, initialize jnote with the following:

```html
<script>jnote.init();</script>
```

To annotate images, you'll need an `<img>` tag.  Images are described using json in the `data-jnote` data attribute.
You also need to assign the image a class of `jnote`.
```html
<img class="jnote" src="image.png" data-jnote='
[
    {
        "title": "wow",
        "caption": "this is some text",
        "x": 0.1,
        "y": 0.2
    },
    {
        "title": "Move",
        "caption": "this is some more text",
        "x": 0.3,
        "y": 0.6
    }
]
' />
```

This is a rather unconventional way of doing things, and I'm unsure about support for older browsers.  Other
methods will be available in the future.

Note that the `x` and `y` coordinates refer to the percentage of the image - a value of `1` is the full
height or width of the image, and `0.5` is half that.

Examples
======
In this repo is an `index.html` file, along with an image that will get you started!

License
======
BSD 3