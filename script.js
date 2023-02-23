let main = document.querySelector('.bar__container');
let chart = echarts.init(main, null, {renderer: 'svg'});
let option;

let sumForInProgram = {
    names: ['В программе ЦП', 'В программе ИТ'],
    show: true,
    data: {
        valuesCp: data.filter(item => item.name === 'В программе ЦП'),
        valuesIt: data.filter(item => item.name === 'В программе ИТ'),
    }
}
sumForInProgram.data.valuesSum = sumForInProgram.data.valuesCp.map((item, index) => ({
    period: item.period,
    value: item.value + sumForInProgram.data.valuesIt[index].value
}));

let sumForOutProgram = {
    names: ['Вне программ ЦП', 'Вне программ ИТ'],
    show: true,
    data: {
        valuesCp: data.filter(item => item.name === 'Вне программ ЦП'),
        valuesIt: data.filter(item => item.name === 'Вне программ ИТ'),
    }
}
sumForOutProgram.data.valuesSum = sumForOutProgram.data.valuesCp.map((item, index) => ({
    period: item.period,
    value: item.value + sumForOutProgram.data.valuesIt[index].value
}));

let calcSum = (event) => {
    switch (event.name) {
        case 'В программе ЦП' : {
            sumForInProgram.data.valuesSum = sumForInProgram.data.valuesSum.map((item, index) => {
                return ({
                    ...item, value: event.selected[event.name] ?
                        item.value + sumForInProgram.data.valuesCp[index].value :
                        item.value - sumForInProgram.data.valuesCp[index].value
                })
            });
            break;
        }
        case 'В программе ИТ' : {
            sumForInProgram.data.valuesSum = sumForInProgram.data.valuesSum.map((item, index) => {
                return ({
                    ...item, value: event.selected[event.name] ?
                        item.value + sumForInProgram.data.valuesIt[index].value :
                        item.value - sumForInProgram.data.valuesIt[index].value
                })
            });
            break;
        }
        case 'Вне программ ИТ' : {
            sumForOutProgram.data.valuesSum = sumForOutProgram.data.valuesSum.map((item, index) => {
                return ({
                    ...item, value: event.selected[event.name] ?
                        item.value + sumForOutProgram.data.valuesIt[index].value :
                        item.value - sumForOutProgram.data.valuesIt[index].value
                })
            });
            break;
        }
        case 'Вне программ ЦП' : {
            sumForOutProgram.data.valuesSum = sumForOutProgram.data.valuesSum.map((item, index) => {
                return ({
                    ...item, value: event.selected[event.name] ?
                        item.value + sumForOutProgram.data.valuesCp[index].value :
                        item.value - sumForOutProgram.data.valuesCp[index].value
                })
            });
            break;
        }
    }
};

let setOption = () => {
    return {
        title: {
            text: 'Проекты в программах и вне программ',
            subtext: 'Сумма и процентное соотношение проектов, находящихся в программах и вне программ',
            textStyle: {
                fontWeight: 600,
                fontSize: '1rem',
                color: '#002033',
                fontFamily: 'Inter',
                overflow: 'break',
            },
            subtextStyle: {
                fontSize: '.875rem',
                fontWeight: 400,
                color: '#00203399',
                fontFamily: 'Inter',
                overflow: 'break',
            },
        },
        tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            },
            className: 'bar__tooltip tooltip',
            formatter: (params) => {
                let result = params.length > 2 ? `<div class="tooltip__row"><p class="row__bold">${params[0].axisValue}</p></div>` : '';
                let inProgSum = sumForInProgram.data.valuesSum[params.find(item => item.seriesIndex === 4).dataIndex].value;
                let outProgSum = sumForOutProgram.data.valuesSum[params.find(item => item.seriesIndex === 5).dataIndex].value;
                let inProgItems = params.filter(item => sumForInProgram.names.includes(item.seriesName));
                let outProgItems = params.filter(item => sumForOutProgram.names.includes(item.seriesName))
                if (inProgSum !== 0) {
                    result += `<div class="tooltip__row"><p class="row__bold">В программе</p> <p class="row__bold">${Math.round(inProgSum * 100 / (inProgSum + outProgSum))} % | ${inProgSum} шт.</p></div>`;
                    for (let item of inProgItems.reverse()) {
                        result += `<div class="tooltip__row"><p>${item.marker} ${'Проекты ' + item.seriesName.slice(-2)}</p> <p class="row__bold">${item.value.value} шт.</p></div>`
                    }
                }
                if (outProgSum !== 0) {
                    result += `<div class="tooltip__row"><p class="row__bold">Вне программ</p> <p class="row__bold">${Math.round(outProgSum * 100 / (outProgSum + inProgSum))} % | ${outProgSum} шт.</p></div>`
                    for (let item of outProgItems.reverse()) {
                        result += `<div class="tooltip__row"><p>${item.marker} ${'Проекты ' + item.seriesName.slice(-2)}</p> <p class="row__bold">${item.value.value} шт.</p></div>`
                    }
                }
                return result;
            }
        },
        legend: {
            top: 'bottom',
            itemGap: 18,
            data: [...[...sumForInProgram.names].reverse().map(item => ({name: item, icon: 'circle'})),
                ...[...sumForOutProgram.names].reverse().map(item => ({name: item, icon: 'circle'})),
            ],
            textStyle: {
                fontFamily: 'Inter',
                fontSize: '0.75rem',
            },
            formatter: '{name} П.',
        },
        dataset: [
            {
                source: sumForInProgram.data.valuesCp
            },
            {
                source: sumForInProgram.data.valuesIt
            },
            {
                source: sumForOutProgram.data.valuesIt
            },
            {
                source: sumForOutProgram.data.valuesCp,
            },
            {
                source: sumForInProgram.data.valuesSum.map(item => ({...item, value: 0})),
            },
            {
                source: sumForOutProgram.data.valuesSum.map(item => ({...item, value: 0})),
            },
        ],
        xAxis: [{
            type: 'category',
            axisLine: {show: false},
            axisTick: {
                show: false,
                alignWithLabel: true
            },
            axisLabel: {
                color: '#00203399',
                fontFamily: 'Inter'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed'
                }
            },
            axisPointer: {
                show: true,
                type: 'line'
            }
        }],
        yAxis: [{
            type: "value",
            splitLine: {
                show: false,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#00416633'
                }
            },
            axisLabel: {
                color: '#00203399',
                fontFamily: 'Inter'
            },
            axisTick: {
                show: true,
                lineStyle: {
                    color: '#00416633'
                }
            }
        }],
        series: [
            {
                type: 'bar',
                name: 'В программе ЦП',
                color: '#56B9F2',
                encode: {
                    x: 'period',
                    y: 'value',
                },
                datasetIndex: 0,
                stack: 'in program',
            },
            {
                type: 'bar',
                name: 'В программе ИТ',
                color: '#0078D2',
                encode: {
                    x: 'period',
                    y: 'value',
                },
                datasetIndex: 1,
                stack: 'in program',
            },
            {
                type: 'bar',
                name: 'Вне программ ЦП',
                color: '#22C38E',
                encode: {
                    x: 'period',
                    y: 'value',
                },
                datasetIndex: 3,
                stack: 'out program',
            },
            {
                type: 'bar',
                name: 'Вне программ ИТ',
                color: '#00724C',
                encode: {
                    x: 'period',
                    y: 'value',
                },
                datasetIndex: 2,
                stack: 'out program',
            },
            {
                type: 'bar',
                show: false,

                color: '#56B9F2',
                encode: {
                    x: 'period',
                    y: 'value',
                },
                datasetIndex: 4,
                stack: 'in program',
                label: {
                    show: sumForInProgram.show,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    color: '#002033',
                    fontSize: '0.875rem',
                    position: 'top',
                    formatter: (params) => {
                        return sumForInProgram.data.valuesSum[params.dataIndex].value || '';
                    }
                },
            },
            {
                type: 'bar',
                show: false,
                color: '#56B9F2',
                encode: {
                    x: 'period',
                    y: 'value',
                },
                datasetIndex: 5,
                stack: 'out program',
                label: {
                    show: sumForOutProgram.show,
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    color: '#002033',
                    fontSize: '0.875rem',
                    position: 'top',
                    formatter: (params) => {
                        return sumForOutProgram.data.valuesSum[params.dataIndex].value || '';
                    }
                }
            }
        ],
        grid: {
            top: 100,
            left: 46,
            right: 50,
            bottom: '16%'
        },
        toolbox: {
            itemSize: '32',
            top: 0,
            right: 0,
            iconStyle: {
                borderWidth: 0
            },
            feature: {
                myTool1: {
                    show: true,
                    icon: 'image://assets/swapicons.svg',
                    onclick: function () {
                    }
                }
            }
        }
    };
}

chart.setOption(setOption());

window.addEventListener('resize', chart.resize);

chart.on('legendselectchanged', (event) => {
    calcSum(event);
    sumForInProgram.show = Boolean(sumForInProgram.names.filter(item => event.selected[item] === true).length);
    sumForOutProgram.show = Boolean(sumForOutProgram.names.filter(item => event.selected[item] === true).length);
    chart.setOption(setOption());
});