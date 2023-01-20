function swapItems(array, index1, index2)
{
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
    return array;
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

function wait(ms)
{
    let start = Date.now()
    while(Date.now() - start < ms) {};
    return;
}

window.onload = function()
{
    let array = randomArray();
    let redBars = [];
    drawCurrentState(array, redBars);

    function bubbleSort()
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
                    wait(20);
                }
            }
        }
    }
    
    $("#random").click(function()
    {
        array = randomArray();
        drawCurrentState(array, redBars);
    });

    $("#submit").click(function()
    {
        bubbleSort();
        redBars = [];
        drawCurrentState(array, redBars);
    });
}