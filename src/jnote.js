"use strict";
var jnote = (function(){
    // our main module
    var jnote = {

        // all jnote objects on the page
        items: {},

        // default settings
        settings: {
            radius: 10,
            hoverPadding: 18,
            color: "red"
        },

        // hack for unique IDs
        id: 0,

        // default class for jnote
        selector: "jnote",

        // initialize all charts on the page
        init: function(){
            // populate our array
            this.items = document.querySelectorAll("." + this.selector);

            // create a canvas to go on top of each item
            for (var i = 0; i < this.items.length; i++){
                var item = this.items[i];
                item.sheet = new sheet(item);
                item.sheet.canvas.draw();
            }

            // setup canvas to resize when window is resized
            addResizeEvent(resizeCanvas);
            function resizeCanvas(){
                for (var i = 0; i < jnote.items.length; i++){
                    var item = jnote.items[i];
                    item.sheet.canvas.resize();

                    item.onload = item.sheet.canvas.resize.bind(item.sheet.canvas);
                }
            }

            // resize canvas when images finished loading

            resizeCanvas();
        }
    }

    // add a new window resize event
    function addResizeEvent(func) {
        var oldResize = window.onresize;
        window.onresize = function () {
            func();
            if (typeof oldResize === 'function') {
                oldResize();
            }
        };
    }

    // create a new canvas attached to our image
    function sheet(el){
        // deserialize the JSON hidden in our data-jnote attribute
        var data = JSON.parse(el.dataset.jnote);

        // sure am glad javascript has no idea how to handle scope sanely
        var sheet = this;

        // set our comments array
        this.comments = [];
        for (var i = 0; i < data.length; i++){
            this.comments.push(new comment(data[i]));
        }   

        // create a canvas object
        this.canvas = document.createElement("CANVAS");
        this.canvas.classList.add("jnote-canvas");
        this.canvas.ctx = this.canvas.getContext("2d");
        this.canvas.style.position = "relative";
        
        this.canvas.expansion = 0;

        // create main div that will display our comments
        this.window = document.createElement("DIV");
        this.window.classList.add("jnote-window");
        el.parentNode.insertBefore(this.canvas, el);
        el.parentNode.insertBefore(this.window, el);

        this.showComment = function(comment){
            this.window.style.opacity = 1;
            this.window.style.left = el.offsetLeft + (comment.x * el.width) + "px";
            this.window.style.top = el.offsetTop + (comment.y * el.height) + "px";
            this.window.innerHTML = "<h2 class='jnote-header'>" + comment.title + "</h2>" + "<p>" + comment.caption + "</p>";
        }

        this.hideComment = function(comment){
            this.window.style.opacity = 0;
        }

        this.canvas.draw = function(time){

            // clear canvas
            this.ctx.clearRect(0,0,el.width, el.height);

            // base circle
            this.ctx.fillStyle = jnote.settings.color;
            this.ctx.restore();
            this.ctx.globalAlpha = 0.6;

            for (var i = 0; i < sheet.comments.length; i++){
                var comment = sheet.comments[i];
                this.ctx.beginPath();
                this.ctx.arc(
                    comment.x * this.width,
                    comment.y * this.height,
                    jnote.settings.radius,
                    0,
                    Math.PI * 2,
                    false);
                this.ctx.fill();
            }

            // expanding circle
            var maxRadius = jnote.settings.radius * 1.5;
            if (this.expansion < maxRadius){
            this.expansion += 0.1;
            }else{
                this.expansion = 0;
            }

            this.ctx.save();

            // fade out to 0 opacity
            this.ctx.globalAlpha = (Math.round(((maxRadius - this.expansion) / maxRadius) * 50) / 50) / 2;

            for (var i = 0; i < sheet.comments.length; i++){
                var comment = sheet.comments[i];
                this.ctx.beginPath();
                this.ctx.arc(
                    comment.x * this.width,
                    comment.y * this.height,
                    jnote.settings.radius + this.expansion,
                    0,
                    Math.PI * 2,
                    false);
                this.ctx.fill();
            }

            requestAnimationFrame(this.draw.bind(this));
        };  

        // add function for canvas
        this.canvas.resize = function(){
            this.width = el.width;
            this.height = el.height;
            this.style.marginBottom = "-" + el.height + "px";
            this.style.left = el.offsetLeft + "px";
        };      

        this.canvas.onmousemove = function (event){
            var mouseX = event.clientX - this.offsetLeft;
            var mouseY = event.pageY - this.offsetTop;

            // use trig to see which circle we are in, if any
            for (var i = 0; i < sheet.comments.length; i++){
                var comment = sheet.comments[i];
                var dx = mouseX - (comment.x * el.width);
                var dy = mouseY - (comment.y * el.height);
                var dist = Math.abs(dx * dx + dy * dy);

                if (dist <= Math.pow(jnote.settings.radius + jnote.settings.hoverPadding, 2)){
                    sheet.showComment(comment);
                    document.body.style.cursor = 'pointer';
                    break;
                } else {
                    sheet.hideComment(comment);
                    document.body.style.cursor = 'default';
                }
            }
        }
    }

    // create new comment belonging to a sheet, belonging to an image
    function comment(data){
        // x and y are relative to the overall width / height of the image
        // range between 0 and 1
        this.x = data.x;
        this.y = data.y;
        this.id = jnote.id++;

        // title (optional) is a large summary of the caption
        this.title = data.title;

        // a short comment
        this.caption = data.caption;

        // 
    }

    // expose our objects
    return jnote;
})();