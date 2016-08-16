/**core functions for map operate**/
var map;
var mapCenter;
var markers = [];
//var infoWindow;

var gmgSph;//google.maps.geometry.spherical
var gmgPoly;//google.maps.geometry.poly;

var crtRect = null,crtPolygon = null,crtCircle = null;
var scs = [];
var gls = [];
var crtRectInfo = null,crtPolygonInfo = null,crtCircleInfo = null;
var crtRectInfoWin,crtPolygonInfoWin,crtCircleInfoWin;

//roof edge offset and node span config.
var roofConfig = {
  weSpan:ft2m(40),    //West-East direction spance unit:meter
  snSpan:ft2m(40),    //South-North direction spance unit:meter
  weOffset:ft2m(20),   //West-East direction offset to edge unit:meter
  snOffset:ft2m(20)    //South-North direction offset to edge unit:meter
};

function initMap() {
  mapCenter = new google.maps.LatLng(42.345858,-87.885888);
  //mapCenter = new google.maps.LatLng(44.5452,-78.5389);
  map = new google.maps.Map(document.getElementById('map'), {
    center: mapCenter,
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.HYBRID
    /*
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    heading: 90,
    tilt: 45//*/
  });
  //get two object for calc.
  gmgSph = google.maps.geometry.spherical;
  gmgPoly = google.maps.geometry.poly;
  // Define an info window on the map.
  crtRectInfoWin = new google.maps.InfoWindow();
  crtPolygonInfoWin = new google.maps.InfoWindow();
  crtCircleInfoWin = new google.maps.InfoWindow();
  var infoWindow = new google.maps.InfoWindow();
  //search box.
  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function() {
    infoWindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address);
    infoWindow.open(map, marker);
  });//*/
  //init drawingManager.
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        //google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.RECTANGLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.CIRCLE,
        //google.maps.drawing.OverlayType.POLYLINE,
      ]
    },
    //markerOptions: {icon: 'images/beachflag.png'},
    rectangleOptions:{
      strokeWeight: 2,
      strokeColor:'#0000FF',
      fillColor: '#0000FF',
      fillOpacity: 0.35,
      clickable: true,
      editable: true,
      draggable:true,
      zIndex: 1
    },
    polygonOptions: {
      strokeWeight: 2,
      strokeColor:'#0000FF',
      fillColor: '#0000FF',
      fillOpacity: 0.35,
      clickable: true,
      editable: false,
      draggable:false,
      zIndex: 1
    },
    circleOptions: {
      strokeWeight: 2,
      strokeColor:'#0000FF',
      fillColor: '#0000FF',
      fillOpacity: 0.35,
      clickable: true,
      editable: true,
      draggable:true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);
  drawingManager.setDrawingMode(null);
  
  drawingManager.addListener('rectanglecomplete',function(rect){
    drawingManager.setDrawingMode(null);
    crtRectInfo = getRectInfo(rect);
    rect.addListener('bounds_changed', updateRectInfo);
    rect.addListener('click', viewRect);
  });
  
  drawingManager.addListener('polygoncomplete',function(polygon){
    drawingManager.setDrawingMode(null);
    /*
    polygon.addListener('click',function(pme){
      alert([pme.edge,pme.path,pme.vertex].join('<br />'));
    });
    alert('look!'+gmgPoly.containsLocation(mapCenter,polygon));//*/
    crtPolygon = polygon;
  });
  
  drawingManager.addListener('circlecomplete',function(circle){
    drawingManager.setDrawingMode(null);
    //crtBI = getRectInfo(rect);
    //rect.addListener('bounds_changed', recordBoundChang);
  });
}

function updateRectInfo() {
  crtRectInfo = getRectInfo();
  clearRect();
  //viewRect();
}

function viewRect(){
  if(crtRectInfo==null) return;
  var contentString = getRectInfoDesc('<br/>');
  //showInfoWin(contentString,crtRectInfo.rt);
  crtRectInfoWin.setContent(contentString);
  crtRectInfoWin.setPosition(crtRectInfo.rt);
  crtRectInfoWin.open(map);
}

function getRectInfo(rect){
  if(rect){
    crtRect = rect;
  }
  var bounds = crtRect.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  var bi = {
    rt:ne,                                          //right-top(ne)
    rb:new google.maps.LatLng(sw.lat(),ne.lng()),  //right-bottom
    lb:sw,                                          //left-bottom(sw)
    lt:new google.maps.LatLng(ne.lat(),sw.lng()), //left-top
    ct:bounds.getCenter()
  };
  var w = gmgSph.computeDistanceBetween(bi.rt,bi.lt);
  var h = gmgSph.computeDistanceBetween(bi.lt,bi.lb);
  bi.w = w.toFixed(2);
  bi.h = h.toFixed(2);
  bi.area = (w*h).toFixed(2);
  //var bid = String(String(bi.ct.lat()+bi.ct.lng()+bi.h+bi.w).hashCode());
  var hc = JSON.stringify(bi).hashCode();
  bi.id = hc>0?hc:-1*hc;
  return bi;
}

function getPolygonInfo(polygon){
  if(polygon){
    crtPolygon = polygon;
  }
  //calc polygon's area,lengths
  var paths = crtPolygon.getPath();
  //var totalLen = 0.0,
  var tmpLen = 0.0,perimeter = 0.0;
  var len = paths.getLength();
  for(var i=0,j=i+1;i<len;i++,j++){
    if(j==len) j = 0;
    var p = paths.getAt(i),np = paths.getAt(j);
    tmpLen = gmgSph.computeDistanceBetween(p,np);
    perimeter += tmpLen;
  }
  var area = gmgSph.computeArea(paths);
  var baseLineInfo = getBaseLineInfo(crtPolygon);
  var detectOpt = getDetectOption(baseLineInfo,crtPolygon);
  //calc center point of polygon.
  var centerPoint = gmgSph.computeOffset(baseLineInfo.middlePoint,
    detectOpt.detectMaxOffset*0.4,detectOpt.offsetHeading+baseLineInfo.heading);
  //putSensor(centerPoint,'red');
  var hc = JSON.stringify(baseLineInfo).hashCode();
  return {
    edgeCount:len,
    perimeter:perimeter,
    area:area,
    baseLineInfo:baseLineInfo,
    detectOpt:detectOpt,
    centerPoint:centerPoint,
    id:hc>0?hc:-1*hc
  }
}

function clearRect(){
  clearGrid();
  clearSenors();
}

function clearSenors(){
  if(scs.length >0){
    for(var i=0;i<scs.length;i++){
      scs[i].setMap(null);
    }
    scs.length = 0;
  }
}

function clearGrid(){
  if(gls.length>0){
    for(var i=0;i<gls.length;i++){
      gls[i].setMap(null);
    }
    gls.length = 0;
  }
}


function cvtUnit(uiv,dv,isFt){
  var num = 0.0;
  try{
    num = parseFloat(uiv);
  }catch(e){
    num = dv;
  }
  return isFt?ft2m(num):num;
}

function updateRoofConfig(){
  var isFt = 'ft'==$("input[name='du']:checked").val();
  roofConfig.weOffset = cvtUnit($("#weOffset").val(),20.0,isFt);
  roofConfig.weSpan = cvtUnit($("#weSpan").val(),40.0,isFt);
  roofConfig.snOffset = cvtUnit($("#snOffset").val(),20.0,isFt);
  roofConfig.snSpan = cvtUnit($("#snSpan").val(),40.0,isFt);
  //putAheadLogInfo(JSON.stringify(roofConfig));
}

function swithGrid(){
  var needGrid = $("input[name='dg']:checked").val();
  if(!needGrid){
    clearGrid();
  }else{
    drawRectangleGrid();
  }
}

function swUnit(){
  var sdu = $("input[name='du']:checked").val();
  if('ft'==sdu){
    $("#weOffset").val(m2ft($("#weOffset").val()));
    $("#snOffset").val(m2ft($("#snOffset").val()));
    $("#weSpan").val(m2ft($("#weSpan").val()));
    $("#snSpan").val(m2ft($("#snSpan").val()));
    //$(".dut").css('width','30px');
  }else{
    $("#weOffset").val(ft2m($("#weOffset").val()));
    $("#snOffset").val(ft2m($("#snOffset").val()));
    $("#weSpan").val(ft2m($("#weSpan").val()));
    $("#snSpan").val(ft2m($("#snSpan").val()));
    //$(".dut").css('width','40px');
  }
}

//draw grid
function drawRectangleGrid(){
  if(crtRectInfo == null) return;
  for(var i=roofConfig.snOffset;i<crtRectInfo.h;i+=roofConfig.snSpan){
    var p1 = gmgSph.computeOffset(crtRectInfo.lb,i,0);
    var p2 = gmgSph.computeOffset(p1,crtRectInfo.w,90);
    drawGridLine([p1,p2],"#FF0000");
  }
  for(var i=roofConfig.weOffset;i<crtRectInfo.w;i+=roofConfig.weSpan){
    var p1 = gmgSph.computeOffset(crtRectInfo.lb,i,90);
    var p2 = gmgSph.computeOffset(p1,crtRectInfo.h,0);
    drawGridLine([p1,p2],'green');
  }
}

function doDeploy(){
  //*
  if(crtRect == null){
    alert('Please draw a Rectangle first!(drag and move to resize it.)');
    return;
  }//*/
  //updateRoofConfig();
  crtRectInfo = getRectInfo();
  clearRect();
  if('1' == $("input[name='dg']:checked").val()){
    drawRectangleGrid();
  }
  for(var i=roofConfig.snOffset;i<crtRectInfo.h;i+=roofConfig.snSpan){
    var p1 = gmgSph.computeOffset(crtRectInfo.lb,i,0);
    var p2 = gmgSph.computeOffset(p1,crtRectInfo.w,90);
    putSensors(p1,p2);
  }
  viewRect();
}

function clearData(){
  scs.length = 0;
  gls.length = 0;
  crtRectInfo = null;
  crtRect = null;
}

function getRectInfoDesc(jb){
  var isFt = 'ft'==$("input[name='du']:checked").val();
  //var whDesc = isFt?(['width:',m2ft(crtBI.w),'ft',',height:',m2ft(crtBI.h),'ft'].join('')):(['width:',crtBI.w,'m',',height:',crtBI.h,'m'].join(''));
  //var whDesc = ['width:',crtBI.w,'m',',height:',crtBI.h,'m'].join('');
  return [
    ['Rect_',crtRectInfo.id,'\'s info:'].join(''),
    ['lb:',roundnum(crtRectInfo.lb.lat(),6),',',roundnum(crtRectInfo.lb.lng(),6)].join(''),
    ['rt:',roundnum(crtRectInfo.rt.lat(),6),',',roundnum(crtRectInfo.rt.lng(),6)].join(''),
    isFt?(['width:',m2ft(crtRectInfo.w).toFixed(2),'ft',',height:',m2ft(crtRectInfo.h).toFixed(2),'ft'].join('')):(['width:',crtRectInfo.w,'m',',height:',crtRectInfo.h,'m'].join('')),
    isFt?['area:',sm2sft(crtRectInfo.area),'sft'].join(''):['area:',crtRectInfo.area,'㎡'].join(''),
    isFt?['weOffset:',m2ft(roofConfig.weOffset),'ft',',snOffset:',m2ft(roofConfig.snOffset),'ft'].join(''):['weOffset:',roofConfig.weOffset.toFixed(2),'m',',snOffset:',roofConfig.snOffset.toFixed(2),'m'].join(''),
    isFt?['weSpan:',m2ft(roofConfig.weSpan),'ft',',snSpan:',m2ft(roofConfig.snSpan),'ft'].join(''):['weSpan:',roofConfig.weSpan.toFixed(2),'m',',snSpan:',roofConfig.snSpan.toFixed(2),'m'].join(''),
    ['sensor count:',scs.length,''].join(''),
  ].join(jb);
}

function doSave(){
  if(scs.length == 0){
    alert('Please deploy first.');
    return;
  }
  //save rect data to db
  //...
  var str = getRectInfoDesc('\n');
  var ov = $("#saveLog").val();
  $("#saveLog").val([str,JSON.stringify(crtRectInfo),ov].join('\n'));

  //then stop crtRect's editable function.
  crtRect.setDraggable(false);
  crtRect.setEditable(false);
  clearData();
}

function putSensor(p,c){
  var sc = new google.maps.Circle({
    strokeColor: c||'#FFFF00',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: c||'#FFFF00',
    fillOpacity: 0.35,
    center: p,
    radius: 0.5
  });
  sc.setMap(map);
  scs.push(sc);
}

function putSensors(p1,p2){
  var ps = getPointsBetween(p1,p2,roofConfig.weOffset,roofConfig.weSpan);
  for(var i=0;i<ps.length;i++){
    putSensor(ps[i]);
  }
}

function getPointsBetween(p1,p2,start,offset){
  var ps = [];
  var dist = gmgSph.computeDistanceBetween(p1,p2);
  for(var i=start;i<dist;i+=offset){
    var p = gmgSph.computeOffset(p1,i,90);
    ps.push(p);
  }
  return ps;
}

function drawGridLine(points,c){
  var gl = new google.maps.Polyline({
    path:points,
    strokeColor:c||"#0000FF",
    strokeOpacity:0.8,
    strokeWeight:2
  });
  gl.setMap(map);
  gls.push(gl);
}

function showInfoWin(cnt,posLatLng){
  var infoWin = new google.maps.InfoWindow();
  infoWin.setContent(cnt);
  infoWin.setPosition(posLatLng);
  infoWin.open(map);
}

function appendLogInfo(str){
  if($("#saveLog").val()=='')
    $("#saveLog").val(str+'\n');
  else
    $("#saveLog").val([$("#saveLog").val(),str].join('\n'));
}

function putAheadLogInfo(str){
  $("#saveLog").val([str,$("#saveLog").val()].join('\n'));
}

function getBaseLineInfo(polygon){
  var paths = polygon.getPath();
  var tmpLen = 0.0,baseLineLen = 0.0;
  var start,end;
  var lineIndex = 0;
  var lineHeading = 0;
  var len = paths.getLength();
  for(var i=0,j=i+1;i<len;i++,j++){
    if(j==len) j = 0;
    var p = paths.getAt(i),np = paths.getAt(j);
    tmpLen = gmgSph.computeDistanceBetween(p,np);
    if(baseLineLen<tmpLen){
      baseLineLen = tmpLen;
      start = p;
      end = np;
      lineIndex = i;
      lineHeading = gmgSph.computeHeading(start,end);
    }
  }
  return {
    index:lineIndex,
    start:start,
    end:end,
    middlePoint:gmgSph.interpolate(start,end,0.5),
    len:baseLineLen,
    heading:lineHeading
  };
}

function doDeployPolygon(){
  //alert('doDeployPolygon');
  if(crtPolygon == null){
    alert('Please click mouse to draw a Polygon first!');
    return;
  }
  crtPolygonInfo = getPolygonInfo();
  appendLogInfo(JSON.stringify(crtPolygonInfo));
  
  var sensorPositions = calcSensorPositionInPolygon(
    crtPolygonInfo.detectOpt,crtPolygonInfo.baseLineInfo,crtPolygon);
  //*
  for(var i=0;i<sensorPositions.length;i++){
    putSensor(sensorPositions[i]);
  }//*/
  //alert('sensorPositions.length='+sensorPositions.length);
}

function getDetectOption(baseLineInfo,polygon){
  //detectOpt
  var detectOpt = {
    isWeDetect:Math.abs(baseLineInfo.heading)>=45.0&&Math.abs(baseLineInfo.heading)<=135.0,
    offsetHeading:90.0,
    lineHeading:baseLineInfo.heading
  };
  //get middle point of baseline.
  //var baseLineMiddlePoint = gmgSph.interpolate(baseLineInfo.start,baseLineInfo.end,0.5);
  //get a detect point.
  var offset = detectOpt.isWeDetect?roofConfig.snOffset:roofConfig.weOffset;
  var detectPoint = gmgSph.computeOffset(
    baseLineInfo.middlePoint,offset,detectOpt.offsetHeading+baseLineInfo.heading);
  //if detect point not in polygon,change offsetHeading.
  if(!gmgPoly.containsLocation(detectPoint,polygon)){
    //update offsetHeading.
    detectOpt.offsetHeading = -90.0;
    //get new detectPoint.
    detectPoint = gmgSph.computeOffset(
      baseLineInfo.middlePoint,offset,detectOpt.offsetHeading+baseLineInfo.heading);
  }
  //return detectPoint to reuse.
  detectOpt.firstDetectPoint = detectPoint;
  //calc detectMaxOffset
  var dist = 0.0;
  var paths = polygon.getPath();
  for(var i=0;i<paths.getLength();i++){
    var tmpDist = gmgSph.computeDistanceBetween(baseLineInfo.middlePoint,paths.getAt(i));
    if(tmpDist>dist)
      dist = tmpDist;
  }
  detectOpt.detectMaxOffset = dist;
  return detectOpt;
}

function getDetectLine(detectPoint,baseLineInfo,polygon){
  //step value
  var offset = 0.03;//,tolerance = 0.001;
  //get upper point
  var pus = gmgSph.computeOffset(detectPoint,baseLineInfo.len,baseLineInfo.heading);
  var pu = null;
  for(var i=offset;i<2*baseLineInfo.len;i+=offset){
    var tp = gmgSph.computeOffset(pus,i,baseLineInfo.heading+180.0);
    if(gmgPoly.containsLocation(tp,polygon)){
      pu = tp;
      break;
    }
  }
  //get down point.
  var pds = gmgSph.computeOffset(detectPoint,baseLineInfo.len,baseLineInfo.heading+180.0);
  var pd = null;
  for(var i=offset;i<2*baseLineInfo.len;i+=offset){
    var tp = gmgSph.computeOffset(pds,i,baseLineInfo.heading);
    if(gmgPoly.containsLocation(tp,polygon)){
    //if(gmgPoly.isLocationOnEdge(tp,polygon,tolerance)){
      pd = tp;
      break;
    }
  }
  if(pu == null || pd == null) return null;
  /*/show point to test
  putSensor(detectPoint,'#FF0000');
  putSensor(pu);
  putSensor(pd);//*/
  return {start:pd,end:pu,len:gmgSph.computeDistanceBetween(pd,pu)};
}

function drawGridInPolygon(lineInfo){
  drawGridLine([lineInfo.start,lineInfo.end],'red');
}

function putSensorInLine(lineInfo,detectOpt,baseLineInfo,polygon){
  var sensorPositions = [];
  var offset = detectOpt.isWeDetect?roofConfig.weOffset:roofConfig.snOffset;
  var span = detectOpt.isWeDetect?roofConfig.weSpan:roofConfig.snSpan;
  for(var i=offset;i<lineInfo.len;i+=span){
    var p = gmgSph.computeOffset(lineInfo.start,i,baseLineInfo.heading);
    if(gmgPoly.containsLocation(p,polygon))
      sensorPositions.push(p);
  }
  return sensorPositions;
}

function calcSensorPositionInPolygon(detectOpt,baseLineInfo,polygon){
  var sensorPositions = [];
  var offset = detectOpt.isWeDetect?roofConfig.snOffset:roofConfig.weOffset;
  var span = detectOpt.isWeDetect?roofConfig.snSpan:roofConfig.weSpan;
  for(var i=offset;i<detectOpt.detectMaxOffset;i+=span){
    var detectPoint = gmgSph.computeOffset(
      baseLineInfo.middlePoint,i,detectOpt.offsetHeading+baseLineInfo.heading);
    var lineInfo = getDetectLine(detectPoint,baseLineInfo,polygon);
    if(lineInfo == null) {
      //$("#saveLog").val(['lineInfo is null.',$("#saveLog").val()].join('\n'));
      //putSensor(detectPoint);
      continue;
    }
    if('1' == $("input[name='dg']:checked").val()){
      drawGridInPolygon(lineInfo);
    }
    var lineSensorPositions = putSensorInLine(lineInfo,detectOpt,baseLineInfo,polygon);
    if(lineSensorPositions.length == 0) continue;
    sensorPositions = sensorPositions.concat(lineSensorPositions);
  }
  return sensorPositions;
}

function doDelete(){
  if(crtRect!=null){
    crtRect.setMap(null);
    clearRect();
    crtRect = null;
  }
  if(crtPolygon!=null){
    crtPolygon.setMap(null);
    crtPolygon = null;
  }
  if(crtCircle!=null){
    crtCircle.setMap(null);
    crtCircle = null;
  }
}
