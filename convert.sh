#!/bin/bash

input_file=$1
color_file=$2

# gdalbuildvrt -srcnodata "0 0 0" virtualimage.vrt $input_file
# gdal_translate virtualimage.vrt o1.tif
gdalwarp $input_file outfile.tif -t_srs "+proj=longlat +ellps=WGS84"
gdaldem color-relief -alpha outfile.tif $color_file out.tif
gdal2tiles.py out.tif