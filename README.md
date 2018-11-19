# Data_Viz_2018

Change projection
`gdalwarp infile.tif outfile.tif -t_srs "+proj=longlat +ellps=WGS84"`

Change color map
`gdaldem color-relief outfile.tif color.txt out.tif`

Generates html/css javascript
`gdal2tiles.py out.tif`

