var game = document.querySelector('#game');
var field = game.querySelector('.field');

var rowsNum  = 15;
var colsNum = 15;
var gamers = ['gamer1', 'gamer2'];
var gamerNum = 0;
var addStarClick = false;


var array = fillField(field, rowsNum, colsNum);
//.log(array[0][0]);
//console.log(checkWin('gamer1', array));


//точка игрока (1 или 2) записывается в массив arrayGamerDots для этого игрока
//возвращается количество точек - 1
function recordingPoints(gamer, arrayGamerDots, count){
    
    for (var i = 0; i < rowsNum; i++){
        for (var j = 0; j < colsNum; j++){//j =0
            if (array[i][j].classList.contains(gamer)) {//если точка выставлена конкретным игроком (1 или 2)
                arrayGamerDots[count] = [];
                //console.log("count = ");
                //console.log(count);
                arrayGamerDots[count][0] = j;//координата по Х
                arrayGamerDots[count][1] = i;//координата по У
                arrayGamerDots[count][2] = count + 1;//вспомогательная для сочетаний
                count++;
            }
        }
    }
    //массив arrayGamerDots - это все точки конкретного игрока (1 или 2)
    //for (var i = 0; i < count; i++){
        //console.log(arrayGamerDots[i]);
    //}
    //console.log("__");
    return count;
}


function recordingSquares (gamer, arrayGamerDots, count, squares, arraySquares){
    var countFour = 0;//номер объединения из четырех точек походу не нужен
    var arrayFourPoints = [];

    if (count > 3){
        var fours = 0;
        while (nextSet(arrayGamerDots, count)){
            arrayFourPoints[fours] = []
            for (var j = 0; j < 4; j++){//заполняем массив из четверок
                arrayFourPoints[countFour+fours][j*2]=arrayGamerDots[arrayGamerDots[j][2]-1][0];
                arrayFourPoints[countFour+fours][j*2+1]=arrayGamerDots[arrayGamerDots[j][2]-1][1];
            }

            //console.log(arrayFourPoints[fours]);
            fours = fours + 1;
            //printI(arrayGamerDots, count);
            //console.log("_-_");
        }
        //console.log(fours);
        arrayFourPoints[fours] = [];//здесь записываем первые четыре точки тоже в этот массив
        //потому что алгоритм брал все точки, кроме первых четырех
        arrayFourPoints[fours][0] = arrayGamerDots[0][0];
        arrayFourPoints[fours][1] = arrayGamerDots[0][1];
        arrayFourPoints[fours][2] = arrayGamerDots[1][0];
        arrayFourPoints[fours][3] = arrayGamerDots[1][1];
        arrayFourPoints[fours][4] = arrayGamerDots[2][0];
        arrayFourPoints[fours][5] = arrayGamerDots[2][1];
        arrayFourPoints[fours][6] = arrayGamerDots[3][0];
        arrayFourPoints[fours][7] = arrayGamerDots[3][1];
        //console.log(arrayFourPoints[fours]);
        fours = fours + 1;
       // console.log(fours);


        for (var i = 0; i < fours; i++){
            var points = [{ x: arrayFourPoints[i][0], y: arrayFourPoints[i][1] },
                { x: arrayFourPoints[i][2], y: arrayFourPoints[i][3] },
                { x: arrayFourPoints[i][4], y: arrayFourPoints[i][5] },
                { x: arrayFourPoints[i][6], y: arrayFourPoints[i][7] }];

            var isSquare = false;
            var sides = [];
            sides.push(distance(points[0],points[1]));//push - добавляем в конец массива
            sides.push(distance(points[0],points[2]));
            sides.push(distance(points[0],points[3]));

            // существуют ли две равные стороны и если да, то какие
            var equalSide1 = -1;
            var equalSide2 = -1;
            var unequalSide = -1;

            if (sides[0] == sides[1]) {
                if (sides[0] != sides[2]) {
                    equalSide1 = 0;
                    equalSide2 = 1;
                    unequalSide = 2;
                }
            } else if (sides[1] == sides [2]) {
                if (sides[1] != sides[0]) {
                    equalSide1 = 1;
                    equalSide2 = 2;
                    unequalSide = 0;
                }
            } else if (sides[0] == sides[2]) {
                if (sides[0] != sides[1]) {
                    equalSide1 = 0;
                    equalSide2 = 2;
                    unequalSide = 1;
                }
            }
                //Если первое условие не выполнено, то конец
                //Если выполнено, проверим второе
            if (equalSide1 != -1)
            {
                //Условие 2 - Есть одна неравная сторона
                //Противоположные стороны должны находиться на том же расстоянии
                var opposing = 0;
                switch (unequalSide) {
                    case 0:
                        opposing = distance(points[2], points[3]);
                        break;
                    case 1:
                        opposing = distance(points[1], points[3]);
                        break;
                    case 2:
                        opposing = distance(points[1], points[2]);
                        break;
                    default:
                        break;
                }

                if (opposing == sides[unequalSide]) {
                    //Условие 2 пройдено

                    //Последнее условие - то что каждая точка должна быть на одинаковом расстоянии от двух ближайшей к ней
                    //и на расстоянии диагонали с еще одной точкой

                    var diagonal = opposing;
                    var adjacent = sides[equalSide1];
                    var stillOK = true;
                    for (a = 0; a < 4; a++) {
                        var diagonalCount = 0;
                        var adjacentCount = 0;
                        for (b = 0; b < 4; b++) {
                            if (a != b) {
                                var dist = distance(points[a], points[b]);
                                if (dist == diagonal) {
                                    diagonalCount++;
                                } else if (dist == adjacent) {
                                    adjacentCount++;
                                }
                            }
                        }
                        // Получили ли мы одну диагональ и две стороны?
                        if (! (diagonalCount == 1 && adjacentCount == 2)){
                            stillOK = false;
                            break;
                        }
                    }
                    if (stillOK) {
                        // Все условия выполнены - четыре точки образуют квадрат.
                        //console.log(points);
                        arraySquares[squares] = [];
                        arraySquares[squares][0] = points[0].x;//первая точка квадрата
                        arraySquares[squares][1] = points[0].y;
                        arraySquares[squares][2] = points[1].x;//вторая точка квадрата
                        arraySquares[squares][3] = points[1].y;
                        arraySquares[squares][4] = points[2].x;//третья точка квадрата
                        arraySquares[squares][5] = points[2].y;
                        arraySquares[squares][6] = points[3].x;//четвертая точка квадрата
                        arraySquares[squares][7] = points[3].y;
                        arraySquares[squares][8] = squares + 1;//от 1 до числа квадратов (для будущего)
                        squares++;//увеличиваем число квадратов
                        isSquare = true;
                    }
                }
            }
        }
    }
    return squares;
}

function checkLose(gamer, squares, pairs, arraySquares, arrayPairsSquares, pointsInsideOne, pointsInsideTwo, pointsOnLineOne, pointsOnLineTwo, touches){
    if (squares > 1) {
        //var pairs = 0; //число пар квадратов
        while (nextSetSquares(arraySquares, squares)) {
            arrayPairsSquares[pairs] = [];
            for (var i = 0; i < 2; i++) {//заполняем массив из пар квадратов
                arrayPairsSquares[pairs][i * 8] = arraySquares[arraySquares[i][8] - 1][0];
                arrayPairsSquares[pairs][i * 8 + 1] = arraySquares[arraySquares[i][8] - 1][1];
                arrayPairsSquares[pairs][i * 8 + 2] = arraySquares[arraySquares[i][8] - 1][2];
                arrayPairsSquares[pairs][i * 8 + 3] = arraySquares[arraySquares[i][8] - 1][3];
                arrayPairsSquares[pairs][i * 8 + 4] = arraySquares[arraySquares[i][8] - 1][4];
                arrayPairsSquares[pairs][i * 8 + 5] = arraySquares[arraySquares[i][8] - 1][5];
                arrayPairsSquares[pairs][i * 8 + 6] = arraySquares[arraySquares[i][8] - 1][6];
                arrayPairsSquares[pairs][i * 8 + 7] = arraySquares[arraySquares[i][8] - 1][7];
            }
            pairs++;
        }
        arrayPairsSquares[pairs] = [];//записываем первую пару, потому что алгоритм брал все пары кроме первой
        arrayPairsSquares[pairs][0] = arraySquares[0][0];
        arrayPairsSquares[pairs][1] = arraySquares[0][1];
        arrayPairsSquares[pairs][2] = arraySquares[0][2];
        arrayPairsSquares[pairs][3] = arraySquares[0][3];
        arrayPairsSquares[pairs][4] = arraySquares[0][4];
        arrayPairsSquares[pairs][5] = arraySquares[0][5];
        arrayPairsSquares[pairs][6] = arraySquares[0][6];
        arrayPairsSquares[pairs][7] = arraySquares[0][7];
        arrayPairsSquares[pairs][8] = arraySquares[1][0];
        arrayPairsSquares[pairs][9] = arraySquares[1][1];
        arrayPairsSquares[pairs][10] = arraySquares[1][2];
        arrayPairsSquares[pairs][11] = arraySquares[1][3];
        arrayPairsSquares[pairs][12] = arraySquares[1][4];
        arrayPairsSquares[pairs][13] = arraySquares[1][5];
        arrayPairsSquares[pairs][14] = arraySquares[1][6];
        arrayPairsSquares[pairs][15] = arraySquares[1][7];
        pairs++;
        console.log(pairs);
        //пишем условие победы, что два квадрата обязательно должны пересекаться РОВНО в одной вершине
        //вершины первого (0,1) (2,3) (4,5) (6,7)
        //вершины второго (8,9) (10,11) (12,13) (14,15)
        //var touches = []; //касания
        for (var i = 0; i < pairs; i++) {
            touches[i] = 0;
        }
        for (var i = 0; i < pairs; i++) {
            console.log(arrayPairsSquares[i]);
            for (var k = 0; k < 4; k++) {
                for (var j = 0; j < 4; j++) {
                    if (arrayPairsSquares[i][k * 2] == arrayPairsSquares[i][j * 2 + 8] && arrayPairsSquares[i][k * 2 + 1] == arrayPairsSquares[i][j * 2 + 8 + 1]) {
                        touches[i]++
                    }
                }
            }
            
        }

        for (var i = 0; i < pairs; i++) {
            var leftOne;
            var leftTwo;
            var topOne;
            var topTwo;
            var rightOne;
            var rightTwo;
            var bottomOne;
            var bottomTwo;
            if (arrayPairsSquares[i][0] <= arrayPairsSquares[i][2]) {//квадрат обыкновенный
                leftOne = [arrayPairsSquares[i][0], arrayPairsSquares[i][1]];
                topOne = [arrayPairsSquares[i][2], arrayPairsSquares[i][3]];
                rightOne = [arrayPairsSquares[i][6], arrayPairsSquares[i][7]];
                bottomOne = [arrayPairsSquares[i][4], arrayPairsSquares[i][5]];
            } else {//квадрат повернутый
                leftOne = [arrayPairsSquares[i][2], arrayPairsSquares[i][3]];
                topOne = [arrayPairsSquares[i][0], arrayPairsSquares[i][1]];
                rightOne = [arrayPairsSquares[i][4], arrayPairsSquares[i][5]];
                bottomOne = [arrayPairsSquares[i][6], arrayPairsSquares[i][7]];
            }
            if (arrayPairsSquares[i][8] <= arrayPairsSquares[i][10]) {
                leftTwo = [arrayPairsSquares[i][8], arrayPairsSquares[i][9]];
                topTwo = [arrayPairsSquares[i][10], arrayPairsSquares[i][11]];
                rightTwo = [arrayPairsSquares[i][14], arrayPairsSquares[i][15]];
                bottomTwo = [arrayPairsSquares[i][12], arrayPairsSquares[i][13]];
            } else {
                leftTwo = [arrayPairsSquares[i][10], arrayPairsSquares[i][11]];
                topTwo = [arrayPairsSquares[i][8], arrayPairsSquares[i][9]];
                rightTwo = [arrayPairsSquares[i][12], arrayPairsSquares[i][13]];
                bottomTwo = [arrayPairsSquares[i][14], arrayPairsSquares[i][15]];
            }
            console.log(leftOne);
            console.log(topOne);
            console.log(rightOne);
            console.log(bottomOne);
            console.log("_");
            console.log(leftTwo);
            console.log(topTwo);
            console.log(rightTwo);
            console.log(bottomTwo);
            console.log("_")

            var polygonOne = [leftOne, topOne, rightOne, bottomOne];
            pointA = [arrayPairsSquares[i][8], arrayPairsSquares[i][9]];
            pointB = [arrayPairsSquares[i][10], arrayPairsSquares[i][11]];
            pointC = [arrayPairsSquares[i][12], arrayPairsSquares[i][13]];
            pointD = [arrayPairsSquares[i][14], arrayPairsSquares[i][15]];

            var polygonTwo = [leftTwo, topTwo, rightTwo, bottomTwo];
            pointE = [arrayPairsSquares[i][0], arrayPairsSquares[i][1]];
            pointF = [arrayPairsSquares[i][2], arrayPairsSquares[i][3]];
            pointG = [arrayPairsSquares[i][4], arrayPairsSquares[i][5]];
            pointH = [arrayPairsSquares[i][6], arrayPairsSquares[i][7]];

            pointsInsideOne[i] = 0; //потом массив [] для каждой пары
            if (inside(pointA, polygonOne)) pointsInsideOne[i]++;
            if (inside(pointB, polygonOne)) pointsInsideOne[i]++;
            if (inside(pointC, polygonOne)) pointsInsideOne[i]++;
            if (inside(pointD, polygonOne)) pointsInsideOne[i]++;
            pointsOnLineOne[i] = 0; //...
            if (onLine(leftOne, topOne, pointA)) pointsOnLineOne[i]++;
            if (onLine(leftOne, topOne, pointB)) pointsOnLineOne[i]++;
            if (onLine(leftOne, topOne, pointC)) pointsOnLineOne[i]++;
            if (onLine(leftOne, topOne, pointD)) pointsOnLineOne[i]++;
            if (onLine(topOne, rightOne, pointA)) pointsOnLineOne[i]++;
            if (onLine(topOne, rightOne, pointB)) pointsOnLineOne[i]++;
            if (onLine(topOne, rightOne, pointC)) pointsOnLineOne[i]++;
            if (onLine(topOne, rightOne, pointD)) pointsOnLineOne[i]++;
            if (onLine(rightOne, bottomOne, pointA)) pointsOnLineOne[i]++;
            if (onLine(rightOne, bottomOne, pointB)) pointsOnLineOne[i]++;
            if (onLine(rightOne, bottomOne, pointC)) pointsOnLineOne[i]++;
            if (onLine(rightOne, bottomOne, pointD)) pointsOnLineOne[i]++;
            if (onLine(bottomOne, leftOne, pointA)) pointsOnLineOne[i]++;
            if (onLine(bottomOne, leftOne, pointB)) pointsOnLineOne[i]++;
            if (onLine(bottomOne, leftOne, pointC)) pointsOnLineOne[i]++;
            if (onLine(bottomOne, leftOne, pointD)) pointsOnLineOne[i]++;

            console.log("#");
            console.log(pointsInsideOne[i]);
            console.log(pointsOnLineOne[i]);

            //__________________________two______________________

            pointsInsideTwo[i] = 0; //потом массив [] для каждой пары
            if (inside(pointE, polygonTwo)) pointsInsideTwo[i]++;
            if (inside(pointF, polygonTwo)) pointsInsideTwo[i]++;
            if (inside(pointG, polygonTwo)) pointsInsideTwo[i]++;
            if (inside(pointH, polygonTwo)) pointsInsideTwo[i]++;
            pointsOnLineTwo[i] = 0; //...
            if (onLine(leftTwo, topTwo, pointE)) pointsOnLineTwo[i]++;
            if (onLine(leftTwo, topTwo, pointF)) pointsOnLineTwo[i]++;
            if (onLine(leftTwo, topTwo, pointG)) pointsOnLineTwo[i]++;
            if (onLine(leftTwo, topTwo, pointH)) pointsOnLineTwo[i]++;
            if (onLine(topTwo, rightTwo, pointE)) pointsOnLineTwo[i]++;
            if (onLine(topTwo, rightTwo, pointF)) pointsOnLineTwo[i]++;
            if (onLine(topTwo, rightTwo, pointG)) pointsOnLineTwo[i]++;
            if (onLine(topTwo, rightTwo, pointH)) pointsOnLineTwo[i]++;
            if (onLine(rightTwo, bottomTwo, pointE)) pointsOnLineTwo[i]++;
            if (onLine(rightTwo, bottomTwo, pointF)) pointsOnLineTwo[i]++;
            if (onLine(rightTwo, bottomTwo, pointG)) pointsOnLineTwo[i]++;
            if (onLine(rightTwo, bottomTwo, pointH)) pointsOnLineTwo[i]++;
            if (onLine(bottomTwo, leftTwo, pointE)) pointsOnLineTwo[i]++;
            if (onLine(bottomTwo, leftTwo, pointF)) pointsOnLineTwo[i]++;
            if (onLine(bottomTwo, leftTwo, pointG)) pointsOnLineTwo[i]++;
            if (onLine(bottomTwo, leftTwo, pointH)) pointsOnLineTwo[i]++;
            console.log("*");
            console.log(pointsInsideTwo[i]);
            console.log(pointsOnLineTwo[i]);


            //ЗДЕСЬ ЕЩЕ БАХНУТЬ ТО, ЧТОБ ВСЕ КОНЧАЛОСЬ
            if (touches[i] > 1) {//если больше одной общей точки, то это нарушение правил
                $('.lose1').css('display','flex');
                $('td').css('pointer-events', 'none');
                //alert("Игрок нарушил правило построения квадратов - больше одной общей точки");
                return 777;
            }

            //тоже через фор для каждой пары
            if (pointsInsideOne[i] > 1 || touches[i] == 0 && pointsInsideOne[i] == 1) {//потом просто написать нарушил правило построения квадратов
                $('.lose2').css('display','flex');
                $('td').css('pointer-events', 'none');
                //alert("Игрок нарушил правило построения квадратов - часть одного квадрата внутри другого");
                return 777;
            }
            if (touches[i] == 0 && pointsOnLineOne[i] >= 2
                || touches[i] == 1 && pointsOnLineOne[i] >= 3
                || pointsInsideOne[i] == 1 && pointsOnLineOne[i] >= 1 && pointsInsideTwo > 0//третья дописана искуственно
                || touches[i] == 0 && pointsInsideOne[i] == 0 && pointsOnLineOne[i] == 1
                //|| ((pointsInsideTwo[i] >= 1 || pointsOnLineTwo[i] >= 1) && pointsInsideOne[i] > 0)
                || ((pointsInsideTwo[i] >= 1 || pointsOnLineTwo[i] >= 1) && pointsInsideOne[i] == 0 && pointsOnLineOne[i] == 0)
            ) { //0=i
                $('.lose3').css('display','flex');
                $('td').css('pointer-events', 'none');
                //alert('Игрок нарушил правила построения квадратов - часть одного квадрата на линии другого');
                return 777;
            }
        }
    }
    return pairs;
}

//проверка, выиграл ли игрок (gamer1 или gamer2)
//вызывается для конкретного игрока, но проверяет сначала одного, потом второго
function checkWin(gamer, array){
    var arrayGamerDots = [];//двумерный массив из всех точек игрока
    var count = 0;//номер точки

    count = recordingPoints(gamer, arrayGamerDots, count);//записываем точки в массив arrayGamerDots
    //console.log(count);


    var squares = 0;
    var arraySquares = [];


    //след функция - запись всех квадратов
    squares = recordingSquares(gamer, arrayGamerDots, count, squares, arraySquares);

    var arrayPairsSquares = [];
    var touches = []; //касания
    var pairs = 0; //число пар квадратов
    var pointsInsideOne = [];
    var pointsInsideTwo = [];
    var pointsOnLineOne = [];
    var pointsOnLineTwo = [];

    //составляет пары всех квадратов и проверяет их на проигрыш
    pairs = checkLose(gamer, squares, pairs, arraySquares, arrayPairsSquares, pointsInsideOne, pointsInsideTwo, pointsOnLineOne, pointsOnLineTwo, touches);
    if (pairs == 777){
        //добавить блок с концом игры как-то
        //console.log("777");
        return false;
    }

    for (var i = 0; i < pairs; i++){
        if (pointsInsideOne[i] == 1 && pointsOnLineOne[i] == 2 && touches[i] == 1 &&
            (arrayPairsSquares[i][1] == arrayPairsSquares[i][3] || arrayPairsSquares[i][3] == arrayPairsSquares[i][5])
            && pointsInsideTwo[i] <= 1 && pointsOnLineTwo[i] <= 2 &&
            (arrayPairsSquares[i][8] == arrayPairsSquares[i][10] || arrayPairsSquares[i][8] == arrayPairsSquares[i][12] || arrayPairsSquares[i][8] == arrayPairsSquares[i][14]))
            return true;
        if (touches[i] == 1 && pointsInsideTwo[i] == pointsInsideOne[i] && pointsOnLineOne[i] == pointsOnLineTwo[i]) return true;
        if (touches[i] == 1) {//если ровно одно касание, то игрок gamer выиграл
            return true;
        }
    }
    return false;//еще не выставлено условие для тру
}

function onLine(pointStart, pointEnd, pointBetween) {//псевдоскалярное произведение
    //равно нулю, если три точки лежат на одной прямой
    var x1, y1, x2, y2, x, y;
    x1 = pointStart[0]; y1 = pointStart[1];
    x2 = pointEnd[0]; y2 = pointEnd[1];
    x = pointBetween[0]; y = pointBetween[1];

    var dx1, dy1, dx, dy;
    dx1 = x2 - x1;
    dy1 = y2 - y1;
    dx = x - x1;
    dy = y - y1;

    var S;
    S = dx1 * dy - dx * dy1;
    var onLine = false;
    if ((S == 0) && (x <= x1 && x >= x2 || x >= x1 && x <= x2) && (y <= y1 && y >= y2 || y >= y1 && y <= y2)) onLine = !onLine;


    return onLine;

}

function inside(point, vs) {

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = 3; i < 4; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};



function distance( point1, point2 ) {
    var dist = Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2);
    dist = Math.sqrt(dist);
    return dist;
}

function nextSet(arrayGamerDots, count){
    var k = 4;//сочетания из count+1 строк по 4
    for (var i = k - 1 ; i >= 0; i--){
        if (arrayGamerDots[i][2] < count - k + i + 1){
            arrayGamerDots[i][2]++;
            for (var j = i + 1; j < k; j++){
                arrayGamerDots[j][2] = arrayGamerDots[j-1][2] + 1;
            }
            return true
        }
    }
    return false;
}

function nextSetSquares(arraySquares, squares){
    var k = 2;//сочетания из squares+1 строк по 2
    for (var i = k - 1 ; i >= 0; i--){
        if (arraySquares[i][8] < squares - k + i + 1){
            arraySquares[i][8]++;
            for (var j = i + 1; j < k; j++){
                arraySquares[j][8] = arraySquares[j-1][8] + 1;
            }
            return true
        }
    }
    return false;
}


function isWin(gamers, array){
    for(var i = 0; i < gamers.length; i++){
        if(checkWin(gamers[i], array)){
            endGame(gamers[i]);
            break;
        }
   }
}

function endGame(gamer){
    $('.win').css('display','flex');
    $('td').css('pointer-events', 'none');
    //alert("Победа!");
    //console.log("Победа игрока", gamer);
}

function fillField(field, rowsNum, colsNum){
    var array = [];
    for (var i = 0; i < rowsNum; i++){
        var tr = document.createElement('tr');

        array[i] = [];

        for (var j = 0; j < colsNum; j++){
            var td = document.createElement('td');
            tr.appendChild(td);
            td.addEventListener('click', cellClickHandler);
            array[i][j] = td;
        }
        field.appendChild(tr);
    }


    return array;
}

function cellClickHandler(){
        this.classList.add(gamers[gamerNum]);
        this.removeEventListener('click', cellClickHandler);

        isWin(gamers, array);

        gamerNum++;

        if (gamerNum == gamers.length) {
            gamerNum = 0;
        }

}

function rulesOpen(){
    var rules = document.getElementsByClassName("rules-div");
    var ruleStyle = window.getComputedStyle(rules[0]);
    var prop = ruleStyle.getPropertyValue('display');

    if(prop == 'none'){
        $('.rules-div').css('display','block');
        $('.win').css('display','none');
        $('.lose1').css('display','none');
        $('.lose2').css('display','none');
        $('.lose3').css('display','none');
    }else{
        $('.rules-div').css('display','none');
    }
}