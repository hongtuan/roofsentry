/**
* map uitl js lib by Tim @ USA
**/

String.prototype.hashCode = function() {
	var hash = 0, i = 0, len = this.length, chr;
   while ( i < len ) {
		hash  = ((hash << 5) - hash + this.charCodeAt(i++)) << 0;
   }
   return hash;
};
	
/**
* remove char at i
**/
function removeAt(s,i) {
	s = s.substring(0,i)+s.substring(i+1,s.length);
	return s;
}
/**
* round to p 4~5!
**/
function roundnum(x,p) {
 	var n=parseFloat(x);
	//var m=n.toPrecision(p+1);
	var m=n.toFixed(p);
	var y=String(m);
	//*
	var i=y.length;
	var j=y.indexOf('.');
	if(i>j && j!=-1) {
		while(i>0) {
			if(y.charAt(--i)=='0')
				y = removeAt(y,i);
			else
				break;
		}
		if(y.charAt(i)=='.')
			y = removeAt(y,i);
	}//*/
	return y;
}



function ft2m(x){
  var y = parseFloat(x)/3.2808;
  //return parseFloat(roundnum(y,2));
  //return Math.round(y*100.0)/100.0;//.toFixed(5);
  return y;
}

function sm2sft(x){
  var y=x*3.2808*3.2808;
  return Math.round(y*100.0)/100.0;//.toFixed(5);
}

function m2ft(x){
  var y = 3.2808*x;
  //return Math.round(y*100.0)/100.0;//.toFixed(5);
  return y;
}

/**
* remain 10
**/
function roundresult(x) {
 	var y = parseFloat(x);
 	y = roundnum(y,10);
 	return y;
}

function dd2Dms(x) {
	var dd = parseFloat(x);
	var sign = '';
	if( dd<0 ) { sign='-'; dd=-dd; }
	var dv = Math.floor(dd);
	var dds = String(dd);
	var m_s = dds.substring(dds.indexOf('.'));//parseFloat(dd-dv);!!!
	var mv = Math.floor(m_s*60);
	var sv = (m_s*60 - mv)*60.0
	sv = roundnum(sv,3);//remain 3 fraction
	return [sign,dv,'\u00B0',mv,"'",sv,'"'].join('');
}

function getDmsLat(x){
	var y = dd2Dms(x);
	return y.startsWith('-')?y.substring(1).concat('S'):y.concat('N');
}

function getDmsLng(x){
	var y = dd2Dms(x);
	return y.startsWith('-')?y.substring(1).concat('W'):y.concat('E');
}

function parserDd2Dms(latLng){
	return [getDmsLat(latLng.lat()),
		getDmsLng(latLng.lng())].join(', ');
}

function dd2Ddm(x){
	var dd = x;
	var sign = '';
	if( dd<0 ) { sign='-'; dd=-dd; }
	var dv = Math.floor(dd);
	var mv = roundnum((dd - dv)*60.0,3);
	return [sign,dv,'\u00B0',mv,"'"].join('');	
}

function getDdmLat(x){
	var y = dd2Ddm(x);
	return y.startsWith('-')?y.substring(1).concat('S'):y.concat('N');
}

function getDdmLng(x){
	var y = dd2Ddm(x);
	return y.startsWith('-')?y.substring(1).concat('W'):y.concat('E');
}


function dms2Dd (dms) {
	if (!dms) {
		return Number.NaN;
	}
	var neg = dms.match(/(^\s?-)|(\s?[SW]\s?$)/) != null ? -1.0 : 1.0;
	var parts = dms.match(gpsDC.dmsReg);
	if (parts == null) {
		return Number.NaN;
	}
	// parts:
	// 0 : dms
	// 1 : degree
	// 2 : minutes
	// 3 : secondes
	// 4 : fractions of seconde
	var d = (parts[1] ? parts[1] : '0.0') * 1.0;
	var m = (parts[2] ? parts[2] : '0.0') * 1.0;
	var s = (parts[3] ? parts[3] : '0.0') * 1.0;
	var r = (parts[4] ? ('0.' + parts[4]) : '0.0') * 1.0;
	//var dec = (d + (m / 60.0) + (s / 3600.0) + (r / 3600.0)) * neg;
	var dec = (d + (m+(s+r)/60.0)/60.0) * neg;
	return roundnum(dec,6);//remain 6 fraction
}

function ddm2Dd(ddm){
	if (!ddm) {
		return Number.NaN;
	}
	var neg = ddm.match(/(^\s?-)|(\s?[SW]\s?$)/) != null ? -1.0 : 1.0;
	var parts = ddm.match(gpsDC.ddmReg);
	if (parts == null) {
		return Number.NaN;
	}
	// parts:
	// 0 : ddm
	// 1 : degree
	// 2 : minutes (in Decimal)
	// 3 : Decimal Minutes fractions
	var d = (parts[1] ? parts[1] : '0.0') * 1.0;
	var m = (parts[2] ? parts[2] : '0.0') * 1.0;
	var s = (parts[3] ? ('0.'+parts[3]) : '0.0') * 1.0;
	var dec = (d + (m + s) / 60.0) * neg;
	return roundnum(dec,6);//remain 6 fraction	
}

function dms2Ddm(dms){
	//var parts = dms.match(/(\d{1,3})[°]?\s*(\d{0,2})[']?\s*(\d{0,2})[.]?(\d{0,})["]?(\s?[NSEW]\s?$)/);
	var parts = dms.match(gpsDC.dmsReg);
	if (parts == null) {
		return Number.NaN;
	}
	// parts:
	// 0 : degree
	// 1 : degree
	// 2 : minutes
	// 3 : secondes
	// 4 : fractions of seconde
	// 5 : NSEW
	var d = (parts[1] ? parts[1] : '0.0') * 1.0;	
	var m = (parts[2] ? parts[2] : '0.0') * 1.0;
	var s = (parts[3] ? parts[3] : '0.0') * 1.0;
	var r = (parts[4] ? ('0.' + parts[4]) : '0.0') * 1.0;	
	var c = parts[5] ? parts[5] : '';
	var dm = roundnum(m + (s+r)/60.0,3);//remain 3 fraction	
	return [d,'\u00B0',dm,"'",c].join('');
}

function ddm2Dms(ddm){
	if (!ddm) {
		return Number.NaN;
	}
	var parts = ddm.match(gpsDC.ddmReg);
	if (parts == null) {
		return Number.NaN;
	}
	// parts:
	// 0 : ddm
	// 1 : degree
	// 2 : minutes (in Decimal)
	// 3 : Decimal Minutes fractions
	// 4 : NSEW
	var d = (parts[1] ? parts[1] : '0.0') * 1.0;
	var m = (parts[2] ? parts[2] : '0.0') * 1.0;
	var s = (parts[3] ? ('0.'+parts[3]) : '0.0') * 1.0;
	var c = parts[4] ? parts[4] : '';
	var sr = roundnum(s*60.0,3);//remain 3 fraction
	return [d,'\u00B0',m,"'",sr,'"',c].join('');
}

/**
*GPS Data Checker
**/
var gpsDC = {
	//dmsReg : /(\d{1,3})[.,°d ]?(\d{0,2})[']?(\d{0,2})[.,]?(\d{0,})(["]|[']{2})(\s?[NSEW]\s?$)/i,
	dmsReg : /(\d{1,3})[°]?\s*(\d{0,2})[']?\s*(\d{0,2})[.]?(\d{0,})["]?(\s?[NSEW]\s?$)/i,
	//ddmReg : /(\d{1,3})[.,°d ]?\s*(\d{0,2})[.,]?(\d{0,})(['])(\s?[NSEW]\s?$)/i,
	ddmReg : /(\d{1,3})[°]?\s*(\d{0,2})[.]?(\d{0,})[']?(\s?[NSEW]\s?$)/i,
	latReg : /^[-\+]?([0-8]?\d{1}\.\d{1,8}|90\.0{1,8})$/,
	lngReg : /^[-\+]?((1[0-7]\d{1}|0?\d{1,2})\.\d{1,8}|180\.0{1,8})$/,
	//dms check
	isDms:function(input){
		return this.dmsReg.test(input);
	},
	isDdm:function(input){
		return this.ddmReg.test(input);
	},
	//Latitude check
	isLat:function(input){
		return this.latReg.test(input);
	},
	//Longitude check
	isLng:function(input){
		return this.lngReg.test(input);
	}
}
