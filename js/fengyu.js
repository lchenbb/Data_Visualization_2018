// check the nearest point
function nearestPoint(point){

    let threshold = Number.MAX_SAFE_INTEGER;
    let val = 0;

    mapList.forEach(function(d){
        if (Math.abs(d[0] - point['lin']) + Math.abs(d[1] - point['lat']) < threshold){
            val = d[2];
            threshold = (Math.abs(d[0] - point['lin']) + Math.abs(d[1] - point['lat']));
        };
    });
    return val;
}