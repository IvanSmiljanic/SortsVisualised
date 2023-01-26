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
    let sorting = false;
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
        await mergeSortRun(0, array.length - 1);
    }

    async function mergeSortRun(left, right)
    {
        if (left < right)
        {
            let mid = Math.floor((left + right) / 2);

            await mergeSortRun(left, mid);
            await mergeSortRun(mid + 1, right);

            await merge(left, mid, right);
        }
    }

    async function merge(left, mid, right)
    {
        let bArray = Array(right - left + 1);

        let bCount = 0
        let lCount = left;
        let rCount = mid + 1

        while (lCount <= mid && rCount <= right)
        {
            if (array[lCount] <= array[rCount])
            {
                bArray[bCount] = array[lCount];
                redBars = [lCount, rCount];
                bCount++;
                lCount++;
            }
            else
            {
                bArray[bCount] = array[rCount];
                redBars = [lCount, rCount];
                bCount++;
                rCount++;
            }
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
                bCount++;
                rCount++;
                drawCurrentState(array, redBars);
                redBars = [];
                await sleep(20);
            }
        }
        else
        {
            while (lCount <= mid)
            {
                bArray[bCount] = array[lCount];
                redBars = [lCount, rCount];
                bCount++;
                lCount++;
                drawCurrentState(array, redBars);
                redBars = [];
                await sleep(20);
            }
        }
        for (let i = 0; i < bArray.length; i++)
        {
            array[left + i] = bArray[i];
            redBars = [left + i];
            drawCurrentState(array, redBars);
            redBars = [];
            await sleep(20);
        }
    }

    async function selectionSort()
    {
        let k;
        for (let i = 0; i < array.length - 1; i++)
        {
            k = i;
            for (let j = i + 1; j < array.length; j++)
            {
                redBars = [j, k];
                if (array[j] < array[k])
                {
                    k = j;
                }
                drawCurrentState(array, redBars);
                redBars = [];
                await sleep(20);
            }
            redBars = [i, k];
            swapItems(array, i, k);
            drawCurrentState(array, redBars);
            redBars = [];
            await sleep(20);
        }
    }

    async function insertionSort()
    {
        let j;
        let t;
        for (let i = 1; i < array.length; i++)
        {
            j = i;
            t = array[j];
            while (j > 0 && t < array[j-1])
            {
                redBars = [j, j-1];
                array[j] = array[j-1];
                j--;
                drawCurrentState(array, redBars);
                redBars = [];
                await sleep(20);
            }
            array[j] = t;
        }
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
        if (!sorting)
        {
            array = randomArray();
            drawCurrentState(array, redBars);
        }
    });

    $("#submit").click(async function()
    {
        if (!sorting)
        {
            sorting = true;
            if ($("#sortType").val() == "quickSort")
            {
                await quickSort();
            }
            else if ($("#sortType").val() == "mergeSort")
            {
                await mergeSort();
            }
            else if ($("#sortType").val() == "selectionSort")
            {
                await selectionSort();
            }
            else if ($("#sortType").val() == "insertionSort")
            {
                console.log("INSERTION SORT");
                await insertionSort();
            }
            else if ($("#sortType").val() == "bubbleSort")
            {
                await bubbleSort();
            };
            redBars = [];
            drawCurrentState(array, redBars);
            sorting = false;
        }
    });
}