;$(function(){
    var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');

    var photo = null;
    var bubble = bubble || {};

    var render = function(){

        if(!photo){return false;}
        
        bubble.x = bubble.x || 0;
        bubble.y = bubble.y || 0;

        // clear canvas
        canvas.width = canvas.width;
        var w = photo.width,
            h = photo.height;
        ctx.drawImage(photo,0,0,w,h,0,0,canvas.width,canvas.height);

        bubble.img && ctx.drawImage(bubble.img,bubble.x,bubble.y);

        ctx.fillStyle = "#b47dc6";
        ctx.font="30px MicsoftYahei";
        bubble.dialog && ctx.fillText(bubble.dialog,bubble.x+30,bubble.y+90);
    }

    var setPhoto = function(file){
        console.log(file);
        var reader = new FileReader();
        reader.onload = function (event) {
            var src = event.target.result;
            var img = new Image();
            img.src = src;
            img.onload = function(){
                photo = img;
                render();
            }
        };
        reader.readAsDataURL(file);
    }

    var appendBubbles = function(bubble){
        bubbles.push(bubble);
    }

    var _file = document.querySelector('#file');
    
    _file.onchange = function(){
        var file = _file.files[0];
        file && setPhoto(file);
    }

    $('.bubble').on('click',function(){
        $('.bubble.active').removeClass('active');
        var img = $(this).find('img')[0];
        bubble.img = img;
        $(this).addClass('active');
        render();
    });

    $('#dialog').on('change',function(){
        bubble.dialog = $(this).val();
        render();
    });

    iTouch({
        element : canvas,
        prevent : "all",
        move : function(e,dir,disX,disY,x,y){
            bubble.x = x*2 - 100;
            bubble.y = y*2 - 100;
            render();
        }
    });

    $('#submit').on('click',function(){
        var dataURL = canvas.toDataURL();
        $('#data').val(dataURL);
    });

    /**
     * Detecting vertical squash in loaded image.
     * Fixes a bug which squash image vertically while drawing into canvas for some images.
     * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
     * 
     */
    function detectVerticalSquash(img) {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio===0)?1:ratio;
    }

    /**
     * A replacement for context.drawImage
     * (args are for source and destination).
     */
    function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        var vertSquashRatio = detectVerticalSquash(img);
     // Works only if whole image is displayed:
     // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
     // The following works correct also when only a part of the image is displayed:
        ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio, 
                           sw * vertSquashRatio, sh * vertSquashRatio, 
                           dx, dy, dw, dh );
    }


});