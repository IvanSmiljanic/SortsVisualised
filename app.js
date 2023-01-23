function swapItems(array, index1, index2)
{
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
    return array;
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomArray()
{
    let array = [];
    for (let i = 1; i < 101; i++)
    {
        array.push(i);
    }

    for (let i = 0; i < 1000; i++)
    {
        array = swapItems(array, Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
    }

    return array;
}

function drawCurrentState(array, redBars)
{
    $("#barContainer").html("");
    for (let i = 0; i < 100; i++)
    {
        if (redBars.includes(i))
        {
            $("#barContainer").append('<div class="bar" style="background: red; height: '+array[i] * 3+'px; left: '+(i*10+10)+'px;"></div>');
        }
        else
        {
            $("#barContainer").append('<div class="bar" style="height: '+array[i] * 3+'px; left: '+(i*10+10)+'px;"></div>');
        }
    }
}

window.onload = function()
{
    let array = randomArray();
    let redBars = [];
    drawCurrentState(array, redBars);

    async function quickSort()
    {
        await quicksort_run(0, array.length - 1);
    }

    async function quicksort_run(left, right)
    {
        if (left < right)
        {
            await partition(left, right).then(async pivotIndex =>
            {
                await quicksort_run(left, pivotIndex - 1).then();
                await quicksort_run(pivotIndex + 1, right).then();
            });
        }
    }

    async function partition(left, right)
    {
        let pivotIndex = choosePivot(left, right);
        swapItems(pivotIndex, right);

        let leftPointer = left;
        let rightPointer = right - 1;

        while (leftPointer <= rightPointer)
        {
            while (array[leftPointer] <= array[right] && leftPointer <= rightPointer)
            {
                leftPointer++;
                redBars = [leftPointer - 1, rightPointer];
                drawCurrentState(array, redBars);
                redBars = [];
                await sleep(20);
            }
            
            while (array[rightPointer] >= array[right] && leftPointer <= rightPointer)
            {
                rightPointer--;
                redBars = [leftPointer, rightPointer + 1];
                drawCurrentState(array, redBars);
                redBars = [];
                await sleep(20)
            }

            if (leftPointer < rightPointer)
            {
                swapItems(array, leftPointer, rightPointer);
                redBars = [leftPointer, rightPointer];
                leftPointer++;
                rightPointer--;
                drawCurrentState(array, redBars);
                redBars = [];
                await sleep(20);
            }
        }
        swapItems(array, leftPointer, right);
        return leftPointer;
    }

    function choosePivot(left, right)
    {
        return Math.floor((left + right) / 2);
    }

    async function mergeSort()
    {
        await mergesort_run(0, array.length - 1);
    }

    async function mergesort_run(left, right)
    {
        if (left < right)
        {
            mid = Math.floor((left + right) / 2);

            await mergesort_run(left, mid);
            await mergesort_run(mid + 1, right);

            await merge(left, mid, right);
        }
    }

    async function merge(left, mid, right)
    {
        let bArray = Array(right - left + 1);

        let bCount = 0
        let lCount = left;
        let rCount = mid + 1;

        while ((lCount <= mid) && (rCount <= right))
        {
            if (array[lCount] <= array[rCount])
            {
                bArray[bCount] = array[lCount];
                bCount++; lCount++;
            }
            else
            {
                bArray[bCount] = array[rCount];
                bCount++; rCount++;
            }
            redBars = [lCount, rCount];
            drawCurrentState(array, redBars);
            redBars = [];
            await sleep(20);
        }
        if (lCount > mid)
        {
            while (rCount <= right)
            {
                bArray[bCount] = array[rCount];
                redBars = [lCount, rCount];
                drawCurrentState(array, redBars);
                redBars = [];
                bCount++; rCount++;
            }
        }
        else
        {
            while (lCount <= mid)
            {
                bArray[bCount] = array[lCount];
                redBars = [lCount, rCount];
                drawCurrentState(array, redBars);
                redBars = [];
                bCount++; lCount++;
            }
        }
        console.log(bArray);
        for (let i = 0; i < bArray.length; i++)
        {
            array[left+i] = bArray[i];
            redBars = [left+i];
            drawCurrentState(array, redBars);
            redBars = [];
        }
        console.log(array.slice(left, left + bArray.length), bArray);
    }

    async function bubbleSort()
    {
        for (let i = 0; i < array.length; i++)
        {
            for (let j = 0; j < array.length - i - 1; j++)
            {
                if (array[j] > array[j+1])
                {
                    swapItems(array, j, j+1);
                    redBars = [j, j+1];
                    drawCurrentState(array, redBars);
                    redBars = [];
                    await sleep(20);
                }
            }
        }
    }
    
    $("#random").click(function()
    {
        array = randomArray();
        drawCurrentState(array, redBars);
    });

    $("#submit").click(async function()
    {
        if ($("#sortType").val() == "quickSort")
        {
            await quickSort().then();
        }
        else if ($("#sortType").val() == "mergeSort")
        {
            await mergeSort().then();
        }
        else if ($("#sortType").val() == "bubbleSort")
        {
            await bubbleSort().then();
        };
        redBars = [];
        drawCurrentState(array, redBars);
    });
}