<?
for ($i=0;$i<=32; $i++) {

$str = '/'.$i;
$font = 2;

echo $str."\n";

$w = ImageFontWidth($font) * strlen($str);
$h = ImageFontHeight($font);


$im = ImageCreate($w, $h);
$bg = ImageColorAllocate($im, 255, 255, 255);
$fg = ImageColorAllocate($im, 0, 0, 0);
ImageColorTransparent($im, $bg);
ImageString($im, $font, 0, 0, $str, $fg);
ImageGIF($im, 'tmp/'.$i.'.gif');
#system("/usr/bin/convert -rotate 90 tmp/".$i.".gif img/".$i.".gif");


//for i in tmp/*; do  convert -rotate 90 $i img/`basename $i`; done
}