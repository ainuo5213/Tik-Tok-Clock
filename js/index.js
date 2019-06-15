function createArr(length, subFix, flag) { //false从0开始计，true从1
    let arr = [];
    for (let i = flag ? 1 : 0; i <= length; i++) {
        arr.push(i + '' + subFix)
    }
    return arr
}

let monthText = createArr(12, '月', true),
    dayText = createArr(31, '号', false),
    weekText = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    hourText = createArr(23, '点', false),
    minuteText = createArr(59, '分', false),
    secondsText = createArr(59, '秒', false),
    clock = document.getElementsByClassName('clock')[0],
    // 存放dom元素的数组
    monthList = [],
    dayList = [],
    weekList = [],
    hourList = [],
    minuteList = [],
    secondsList = [],
    // 当前展示是否为圆形
    isCircle = false,
    //二维数组 存放文字内容及页面显示标签
    textSet = [monthText, dayText, weekText, hourText, minuteText, secondsText],
    domSet = [monthList, dayList, weekList, hourList, minuteList, secondsList];

window.onload = function () {
    //延迟两秒，变成圆形
    init();
    //改变位置
    changePosition();
    //变成圆
    changeCircle();
    //每100ms更新一下当前时间
    setInterval(function () {
        updateTime()
    }, 100);
};

//创建元素，并插入进clock
function init() {
    let textSetLength = textSet.length;
    for (let i = 0; i < textSetLength; i++) {
        let setLength = textSet[i].length;
        for (let j = 0; j < setLength; j++) {
            let div = createDiv(textSet[i][j]);
            clock.appendChild(div);
            domSet[i].push(div)
        }
    }
}

//创建div
function createDiv(text) {
    let div = document.createElement('div');
    div.classList.add('label');
    div.innerText = text;
    return div;
}

//以下标形式更新当前时间
function updateTime() {
    let now = new Date();
    let month = now.getMonth();
    let day = now.getDate();
    let week = now.getDay();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    //消除以前的样式
    initStyle();
    //给匹配的dom添加样式
    let nowTime = [month, day, week, hour, minute, second], len = nowTime.length;
    for (let i = 0; i < len; i++) {
        let nowNum = nowTime[i];
        domSet[i][nowNum].classList.add('color')
    }
    if (isCircle) {
        toCircle(nowTime)
    }
}

//变成圆形
function toCircle(nowValue) {
    //确定圆心
    let mWidth = document.body.clientWidth / 2,
        mHeight = document.body.clientHeight / 2;
    //将每个dom确定到相应的位置
    let len = domSet.length;
    for (let i = 0; i < len; i++) {
        let domLen = domSet[i].length;
        for (let j = 0; j < domLen; j++) {
            //每个圆的半径
            let radius = (i + 1) * 35 + 50 * i,
                deg = 360 / domLen * (j - nowValue[i]),//将循环的这一次的dom固定在一排，故要减去自己的当前所对应的时分秒等
                x = radius * Math.sin(deg * Math.PI / 180) + mWidth,//确定x
                y = mHeight - radius * Math.cos(deg * Math.PI / 180),//确定y
                temp = domSet[i][j];
            //调整样式
            //让每一排相对于自身旋转-90deg，使其摆正
            temp.style.transform = 'rotate(' + (-90 + deg) + 'deg)';
            temp.style.left = x + 'px';
            temp.style.top = y + 'px';
        }
    }
}

function initStyle() {
    let label = document.getElementsByClassName('label'), len = label.length;
    for (let i = 0; i < len; i++) {
        label[i].classList.remove('color')
    }
}

//改变每个dom的position以让他拼成一个圆
function changePosition() {
    let len = domSet.length;
    for (let i = 0; i < len; i++) {
        let domLen = domSet[i].length;
        for (let j = 0; j < domLen; j++) {
            //先获得原来每个div的位置，然后再设置他的位置
            let tempX = domSet[i][j].offsetLeft + 'px';
            let tempY = domSet[i][j].offsetTop + 'px';
            //防止同步之后获取不到tempX
            setTimeout(function () {
                domSet[i][j].style.position = "absolute";
                domSet[i][j].style.left = tempX;
                domSet[i][j].style.top = tempY;
            }, 50)
        }
    }
}

function changeCircle() {
    isCircle = true;
    clock.style.transform = "rotate(90deg)";//让容器旋转90，摆正显示的
}