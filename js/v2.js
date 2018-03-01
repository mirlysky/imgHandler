const canvas = document.querySelector('#canvas2');
const ctx = canvas.getContext('2d');
var width = 0;
var height = 0;
var imgData = [];

chooseImg('img/2.png');

function chooseImg(url){
	const img = new Image();
	img.src = url;
	img.onload = (e) => {
		initCanvas(img,e.path[0].width,e.path[0].height);
	}
}

function initCanvas(img,width,height){
	canvas.width = width;
	canvas.height = height;
	ctx.drawImage(img,0,0,width,height);
	createImgMatrix(ctx.getImageData(0,0,width,height));
}

function createImgMatrix(obj){
	const data = obj.data;
	width = obj.width;
	height = obj.height;

	imgData = new Array(height);
	for(let j=0;j<height;j++){
		imgData[j] = new Array(width);
		for(let i=0;i<width;i++){
            offset=4*(width*j+i);
            let red = data[offset];
            let green = data[offset + 1];
            let blue = data[offset + 2];
            let opcity = data[offset + 2];
            imgData[j][i] = [red,green,blue,opcity];
		}
	}

	handleData(imgData,function(data){
		gray(data);
	});
}

function handleData(obj,cbk){
	obj.forEach((row,runNum) => {
		row.forEach((point,pNum) => {
			cbk(point);
		})
	})
}

function gray(point){
	point[0] = 0;
	point[1] = 0;
	point[2] = 0;
	render(imgData);
}

function render(data){
	ctx.putImageData(data,0,0);
}