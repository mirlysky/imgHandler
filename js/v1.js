//位移
// const matrix = [0,0,0,0,0,0,0,1,0];
//模糊
const matrix = [1/8,1/8,1/8,1/8,0,1/8,1/8,1/8,1/8];
//锐化
// const matrix = [0,-1,0,-1,5,-1,0,-1,0];
//浮雕
// const matrix = [-2,-1,0,-1,1,1,0,1,2];
//边缘增强
// const matrix = [0,0,0,-1,1,0,0,0,0];
//边缘检测
// const matrix = [0,1,0,1,-4,1,0,0,0];
//索贝尔边缘检测，横向
// const horizonMatrix = [-1,0,1,-2,0,2,-1,0,1];
//检测所有边缘的滤波器
const horizonMatrix = [-1,-1,-1,-1,8,-1,-1,-1,-1];
//索贝尔边缘检测，纵向
const verticalMatrix = [1,2,1,0,0,0,-1,-2,-1];

window.onload = () => {
	const canvas = document.querySelector('#canvas1');
	const ctx = canvas.getContext('2d');
	const img = document.querySelector('#img1');
	const iWidth = img.width;
	const iHeight = img.height;

	canvas.width = iWidth;
	canvas.height = iHeight;
	ctx.drawImage(img,0,0,iWidth,iHeight);

	let imgData = ctx.getImageData(0,0,iWidth,iHeight);
	// console.log(imgData);

	document.querySelector('#revert').addEventListener('click',function(){
		ctx.putImageData(revert(imgData),0,0);
	});
	document.querySelector('#gray').addEventListener('click',function(){
		ctx.putImageData(gray(imgData),0,0);
	});	
	document.querySelector('#light').addEventListener('click',function(){
		ctx.putImageData(light(imgData),0,0);
	});
	document.querySelector('#cross').addEventListener('click',function(){
		ctx.putImageData(asycImgData(imgData,crossMatrix(imgData,matrix)),0,0);
	});
	document.querySelector('#noise').addEventListener('click',function(){
		ctx.putImageData(removeNoise(imgData),0,0);
	});
	document.querySelector('#horizonFilter').addEventListener('click',function(){
		ctx.putImageData(
			asycImgData(imgData,crossMatrix(imgData,horizonMatrix)),
			0,
			0);
	});
	document.querySelector('#verticalFilter').addEventListener('click',function(){
		ctx.putImageData(
			asycImgData(imgData,crossMatrix(imgData,verticalMatrix)),
			0,
			0);
	});	
	document.querySelector('#filter').addEventListener('click',function(){
		ctx.putImageData(
			mergeFilter(imgData),
			0,
			0);
	});

	document.querySelector('#remove').addEventListener('click',function(){
		console.log('1');
		ctx.putImageData(
			asycImgData(imgData,removeSinglePoint(imgData)),
			0,
			0);
	});
}

function revert(imgData){
	console.log('revert');
	for(let i=0;i<imgData.data.length;i+=4){
		imgData.data[i]=255-imgData.data[i];
		imgData.data[i+1]=255-imgData.data[i+1];
		imgData.data[i+2]=255-imgData.data[i+2];
		imgData.data[i+3]=255;			
	}
	return imgData;		
}

function gray(imgData){
	console.log('gray');
	for(let i=0;i<imgData.data.length;i+=4){ 
		let gray = 0.2126*imgData.data[i] + 0.7152*imgData.data[i+1] + 0.0722*imgData.data[i+2];	     
		imgData.data[i] = gray;
		imgData.data[i+1] = gray;
		imgData.data[i+2] = gray;
	}
	return imgData;		
}

function light(imgData){
	console.log('light');
	for(let i=0;i<imgData.data.length;i+=4){ 
		imgData.data[i] += 20;
		imgData.data[i+1] += 20;
		imgData.data[i+2] += 20;
	}
	return imgData;		
}

//图片矩阵与滤波矩阵叉乘
function crossMatrix(imgData,m){
	let w = imgData.width;
	let h = imgData.height;

	let d = imgData.data;
	let tmp = Object.assign({},imgData.data);

	for(let i=0;i<imgData.data.length;i+=4){
		let not_first_row = i >= w*4;
		let not_last_row  = i < imgData.data.length-w*4; 
		let not_first_col = i%(w*4)!=0
		let not_last_col = (i+4)%(w*4)!=0
		if(
			not_first_row &&
			not_last_row &&
			not_first_col &&
			not_last_col
			){
			tmp[i] = calc(0,i,m);
			tmp[i+1] = calc(1,i,m);
			tmp[i+2] = calc(2,i,m);				
		}
	}
	function calc(o,i,m){
		return d[i-w*4-4+o]*m[0]+d[i-w*4+o]*m[1]+d[i-w*4+4+o]*m[2]+d[i-4+o]*m[3]+d[i+o]*m[4]+d[i+4+o]*m[5]+d[i+w*4-4+o]*m[6]+d[i+w*4+o]*m[7]+d[i+w*4+4+o]*m[8];
	}
	return tmp;
}

function asycImgData(imgData,tmp){
	for(let i=0;i<imgData.data.length;i++){ 
		imgData.data[i] = tmp[i];
	}	
	return imgData;
}

function mergeFilter(imgData){
	let horizonMat = crossMatrix(imgData,horizonMatrix);
	let verticalMat = crossMatrix(imgData,verticalMatrix);
	for(let i=0;i<imgData.data.length;i+=4){
		let val = (horizonMat[i]==verticalMat[i]&&horizonMat[i+1]==verticalMat[i+1]&&horizonMat[i+2]==verticalMat[i+2])?255:0;
		imgData.data[i] = val;
		imgData.data[i+1] = val;
		imgData.data[i+2] = val;		
	}
	return imgData;
}

function removeNoise(imgData){
	for(let i=0;i<imgData.data.length;i+=4){
		let val = (imgData.data[i]*0.3+imgData.data[i+1]*0.59+imgData.data[i+2]*0.11)>128?255:0;
		imgData.data[i] = val;
		imgData.data[i+1] = val;
		imgData.data[i+2] = val;		
	}
	return imgData;
}

function a(){
	console.log('a');
}

function later(func,time){
	return func;
}

var a = later(a,3000);

a();