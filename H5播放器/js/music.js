// 1 歌曲列表
var str = '';
var n = 0;
var len = data.length;
for (var i=0;i<len;i++ )
{
	str += '<p><span>'+data[i].name+'</span><span>'+data[i].singer+'</span></p>';
};
m_list.innerHTML = str;

// 2 点击播放列表
var aP = m_list.getElementsByTagName('p');
for (var i=0;i<aP.length;i++ )
{
	aP[i].index = i;
	aP[i].love = 'love1'; //灰色的红心
	aP[i].mark = 'circle0';
	aP[i].icon = false;
	aP[i].onclick = function(){
		n = this.index;
		onOff = true; 
		playing();
		singerImg.className = 'rotate';
	
	};
};
// 3点击收藏
collect.onclick = function(){
	if( !aP[n].icon )  // 添加红心 收藏
	{
		aP[n].love = 'love0'; //红心
		aP[n].mark = 'circle1';
	}else{
		aP[n].love = 'love1'; //灰色的红心
		aP[n].mark = 'circle0';
	};
	love( aP[n].love ,aP[n].mark )
	aP[n].icon = !aP[n].icon;
};

// 4 点击播放按钮
var onOff = false;

var singerImg = singer.getElementsByTagName('img')[0];
play.onclick = function(){
	if( !onOff )
	{
		audio.play();
		this.style.backgroundImage = 'url(images/pause.png)';
		singerImg.className = 'rotate';

		aP[n].style.color= '#fff';
		aP[n].style.backgroundColor = 'rgb(139, 143, 135)';
		
	}else{
		audio.pause();
		this.style.backgroundImage = 'url(images/play.png)';
		singerImg.className = '';

		aP[n].style.color= '';
		aP[n].style.backgroundColor = 'rgba(139, 143, 135,0)';
		
	};
	onOff = !onOff;
};

// 5 左右按钮
prev.onclick = function(){
	if(randP){
		var rand1 =parseInt(Math.random()*data.length);
		n = rand1;
	}else{
		n --;
		if( n<0 )n = len-1;
	}
	playing();
};
next.onclick = function(){		
	if(randP){
		var rand1 =parseInt(Math.random()*data.length);
		n = rand1;
	} else {
		n ++;
		if( n==len )n=0;
	}
	playing();
};

// 6开始播放时间
audio.addEventListener(
	'timeupdate',
	function(){
		nowTime();
		finish();
	}

);
// 7 设置总时间
function load(){
	audio.addEventListener(
		'canplay',
		function(){
			allTime.innerHTML = time( audio.duration ); // 总时间
		}
	);
};

// 8音量控制
var scale1  , w1;

muteBtn.onmousedown = function(e){
	var e = e||event;
	var s = e.clientX - this.offsetLeft;

	document.onmousemove = function(e){
		var e = e||event;
		var w = e.clientX - s;
		if( w<0 )
		{
			w = 0;
		}else if( w>=mutePro.offsetWidth - muteBtn.offsetWidth ){
			w = mutePro.offsetWidth - muteBtn.offsetWidth;
		};
		var scale = w / (mutePro.offsetWidth - muteBtn.offsetWidth);
		audio.volume = scale;
		muteBar.style.width = w + 'px';
		scale1= scale;
		w1 = w ;

	};
	document.onmouseup = function(){
		document.onmousemove = null;
		
	};
};
//进度条控制
processBtn.onmousedown=function(e ){
	var e =e||event;
	var s = e.clientX - this.offsetLeft+57;
	document.onmousemove=function(e){
		var e = e||event;
		var w = e.clientX - s;
		if( w<0 )
		{
			w = 0;
		}else if( w>=proBar.offsetWidth - processBtn.offsetWidth ){
			w = proBar.offsetWidth - processBtn.offsetWidth;
		};
		var scale = w / (proBar.offsetWidth - processBtn.offsetWidth)*audio.duration; //进度条对应的播放时间
		 audio.currentTime  = scale;
		 curTime.innerHTML = time( audio.currentTime ); // 开始时间
		 processBar.style.width =w+ 'px';
	};
	document.onmouseup=function(){
		document.onmousemove=null;
	};
}
// 9 静音
var  ismute = true;
var mBar =muteBar.style.width;
var  mvolume = audio.volume;
m_mute.onclick = function(){
	if(!ismute){
		//判断 是否改变音量  再次点击回复原来的音量
		audio.volume= scale1 ? scale1 : mvolume ;
		muteBar.style.width= w1 ? w1 + 'px' : mBar ;
	}else{
		audio.volume = 0;
		muteBar.style.width = 0 + 'px';
	}
	ismute = !ismute;	
};

// 10 歌词同步
 txt = data[0].lrc;
 currentLrc();
function currentLrc(){
	var lrcArr = txt.split('[');
	var str = '';
	for (var i=0;i<lrcArr.length;i++ )
	{
		var arr = lrcArr[i].split(']');
		var time = arr[0].split('.');
		var timer = time[0].split(':');
		var ms = timer[0]*60 + timer[1]*1;
		var text = arr[1]; // 歌词内容
		if( text )
		{
			str += '<p id="gc'+ms+'">'+text+'</p>';
		}
	};
	// 把歌词放到歌词列表里面
	lrcCon.innerHTML = str;
	
	var curTime = 0;
	var sum = 0;
	// audio.currentTime ++;
	var p = lrcCon.getElementsByTagName('p');
	audio.addEventListener(
		'timeupdate',  // 在音频或视频 播放位置发生改变的时候触发
		function(){
			curTime = parseInt( this.currentTime );
			if( document.getElementById('gc'+curTime) )
			{
				document.getElementById('gc'+curTime).style.marginTop = 30+'px';
				for (var i=0;i<p.length;i++ )
				{
					p[i].style.cssText = 'color:#fff;font-size:16px;font-weight:400';
				};
				document.getElementById('gc'+curTime).style.cssText = 'color:#0f0;font-size:16px;font-weight:600';
				if( p[sum+8] && p[sum+8].id == 'gc'+curTime )
				{
					lrcCon.style.marginTop = 30 - sum*28 + 'px';
					sum ++;
				}

			}
		}
	);
};

// 11.切换播放顺序 
var num =1;

var one = false, randP = false, bloor = false;

rand.onclick = function(){
	// 默认循环播放
	 if(num==1){
	 	rand.style.backgroundImage='url(images/bloor.png)';
	 	num =2;
	 	bloor = true;
	 	one = false;
	 	randP=false; 
	 	return;
	 }
	 // 随机播放
	  if(num==2){
	 	rand.style.backgroundImage='url(images/rand.png)';
	 	num = 3;
	 	randP =true;
	 	bloor = false;
	 	one = false;
	 	
	 	return;
	 }
	 //单曲循环
	  if(num==3){
	 	rand.style.backgroundImage='url(images/one.png)';
	 	num = 1;
	 	one = true;
	 	randP =false;
	 	bloor = false;
	 	return;
	 }	 	
};
//下载 
dl.onclick = function(){
	 this.href= data[n].src;
	 this.download = data[n].name;
};
function downloadFile(url) {
        try{
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }catch(e){
            window.confirm("下载失败!");
        }
    }
//获取当前的时间
function nowTime(){
	curTime.innerHTML = time( audio.currentTime ); // 开始时间
	var scale = audio.currentTime / audio.duration;
	processBar.style.width = scale * ( proBar.offsetWidth - processBtn.offsetWidth ) + 'px';
};

// 时间格式转换
function time( changeTime ){ // 把3213.45432 转换成 00:00
	changeTime = parseInt( changeTime );
	//var h = Math.floor( changeTime/3600 ); //时
	var m = zero(Math.floor( changeTime%3600/60 )); //分
	var s = zero(Math.floor( changeTime%60 )); // 秒
	return m+':'+s;
};
// 个位数补0
function zero(num){
	return num<10 ? '0'+num : num;
}
//播放
function playing(){

	audio.src = data[n].src;
	if(onOff)audio.play();
	
	//播放时间 ，歌词 同步
	nowTime();
	load();
	txt = data[n].lrc;
	currentLrc();

	 //同步歌曲信息
	 singerImg.src=data[n].star;
	 m_gm.innerHTML=data[n].name;
	 m_singer.innerHTML=data[n].singer;
	 album.innerHTML=data[n].album;

	// onOff = true;
	if(onOff)play.style.backgroundImage = 'url(images/pause.png)';
	// 根据 p标签自身的自定义属性是否添加收藏
	love( aP[n].love ,aP[n].mark )
	for (var i=0;i<len;i++ )
	{
		aP[i].style.color= '';
		aP[i].style.backgroundColor = 'rgba(139, 143, 135,0)';

	}
	aP[n].style.color= '#fff';
	aP[n].style.backgroundColor = 'rgb(139, 143, 135)';

};
//改变 收藏红心背景
function love( s1 ,s2 ){
	collect.style.backgroundImage = 'url(images/'+s1+'.png)';
	aP[n].style.backgroundImage = 'url(images/'+s2+'.png)';
};
//判断 播放模式
function finish (){
	if(audio.currentTime == audio.duration){
		 if(n == data.length){
		 	n = 0;
		 }
		if(one){
			n=n;	
		}
		if(randP){
			var rand1 =parseInt(Math.random()*data.length);
			n = rand1;
		}
		if(bloor){
			n++;	
		}
			playing();
		}
}
