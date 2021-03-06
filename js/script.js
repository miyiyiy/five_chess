var me=true;
var chessBoard=[];//棋盘
for(var i=0;i<15;++i){
	chessBoard[i]=[];
	for(var j=0;j<15;++j){
		chessBoard[i][j]=0;
	}
}
var over=false;
//赢法数组
var wins=[];
//赢法的统计数组
var myWin=[];
var comWin=[];

//init

for(var i=0;i<15;++i){
	wins[i]=[];
	for(var j=0;j<15;++j)
		wins[i][j]=[];
}

var count=0;//赢法总数
for(var i=0;i<15;++i){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;++k){
			wins[i][j+k][count]=true;
		}
		count++;
	}
}
for(var i=0;i<15;++i){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;++k){
			wins[j+k][i][count]=true;
		}
		count++;
	}
}
for(var i=0;i<11;++i){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;++k){
			wins[i+k][j+k][count]=true;
		}
		count++;
	}
}
for(var i=0;i<11;++i){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;++k){
			wins[i+k][j-k][count]=true;
		}
		count++;
	}
}

// console.log(count);
for(var i=0;i<count;++i){
	myWin[i]=0;
	comWin[i]=0;
}

var chess=document.getElementById('chess');
var cxt=chess.getContext('2d');
cxt.strokeStyle='#bfbfbf';
var logo=new Image();
logo.src='./images/logo.jpg';

logo.onload=function () {
	/* body... */
	cxt.globalAlpha=0.2;
	cxt.beginPath();
	cxt.drawImage(logo,0,0,450,450);
	cxt.closePath();
	drawChessBoard();
};
var drawChessBoard=function(){
	cxt.globalAlpha=1;
	cxt.save();
	for(i=0;i<15;++i)
	{
		cxt.moveTo(15+i*30,15);
		cxt.lineTo(15+i*30,435);
		cxt.moveTo(15,15+i*30);
		cxt.lineTo(435,15+i*30);
	}
	cxt.stroke();
	cxt.restore();
};

var oneStep=function(i,j,me){
	cxt.beginPath();
	cxt.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	var linearGrad=cxt.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
	if(me){
		linearGrad.addColorStop(0,'#0a0a0a');
		linearGrad.addColorStop(1,'#636766');
	}
	else{
		linearGrad.addColorStop(0,'#d1d1d1');
		linearGrad.addColorStop(1,'#f9f9f9');
	}
	cxt.fillStyle=linearGrad;
	cxt.fill();
	cxt.closePath();
};

chess.onclick=function(e){
	if(over||!me)
		return;
	var x=e.offsetX;
	var y=e.offsetY;
	var i=Math.floor(x/30);
	var j=Math.floor(y/30);
	if(chessBoard[i][j]==0){
		oneStep(i,j,me);
		chessBoard[i][j]=1;
	
		for(var k=0;k<count;++k){
			if(wins[i][j][k]){
				myWin[k]++;
				comWin[k]=6;
				if(myWin[k]==5){
					window.alert("你赢了！");
					over=true;
				}
			}
		}
		if(!over){
			me=!me;
			computerAI();
		}
	}
};

var computerAI=function(){
	var myScore=[];
	var comScore=[];
	var max=0;
	var u=0,v=0;
	for(var i=0;i<15;++i){
		myScore[i]=[];
		comScore[i]=[];
		for(var j=0;j<15;++j){
			myScore[i][j]=0;
			comScore[i][j]=0;
		}
	}
	for(var i=0;i<15;++i)
	{
		for(var j=0;j<15;++j)
		{
			if(chessBoard[i][j]===0){
				for(var k=0;k<count;++k){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=200;
						}
						else if(myWin[k]==2){
							myScore[i][j]+=400;
						}
						else if(myWin[k]==3){
							myScore[i][j]+=2000;
						}
						else if(myWin[k]==4){
							myScore[i][j]+=10000;
						}
						if(comWin[k]==1){
							comScore[i][j]+=220;
						}
						else if(comWin[k]==2){
							comScore[i][j]+=420;
						}
						else if(comWin[k]==3){
							comScore[i][j]+=2100;
						}
						else if(comWin[k]==4){
							comScore[i][j]+=20000;
						}
					}
				}
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;v=j;
				}
				else if(myScore[i][j]==max){
					if(comScore[i][j]>comScore[u][v])
					{
						u=i;v=j;
					}
				}
				if(comScore[i][j]>max){
					max=comScore[i][j];
					u=i;v=j;
				}
				else if(comScore[i][j]==max){
					if(myScore[i][j]>myScore[u][v])
					{
						u=i;v=j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v]=2;
	for(var k=0;k<count;++k){
		if(wins[u][v][k]){
			comWin[k]++;
			myWin[k]=6;
			if(comWin[k]==5){
				window.alert("计算机赢了！");
				over=true;
			}
		}
	}
	if(!over){
		me=!me;
	}
};
