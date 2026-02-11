const datasetsBase = [
    {
        label: 'BTC Price',
        data: [],
        borderColor: '#f7931a',
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'yPrice',
        order: 1
    },
    {
        label: 'Mayer Multiple',
        data: [],
        borderColor: '#4ade80',
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'yMayer',
        order: 5
    },
    {
        label: 'MVRV',
        data: [],
        borderColor: '#60a5fa',
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'yMvrv',
        order: 3
    },
    {
        label: 'Fear & Greed',
        data: [],
        borderColor: '#f87171',
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'yFearGreed',
        order: 7
    },
    {   label: '',
        data: [],
        borderWidth: 0,
        yAxisID: 'spacer1',
        order: 4
    },
    {   label: '',
        data: [],
        borderWidth: 0,
        yAxisID: 'spacer2',
        order: 6
    },
    {   label: '',
        data: [],
        borderWidth: 0,
        yAxisID: 'spacer3',
        order: 2
    },
]

export function createDataIntoDatasets(data) {
    const datasetsWithData = datasetsBase.map(ds => ({
        ...ds,
        data: []
    }));
    for (const d of data) {
        datasetsWithData[0].data.push(d.price)
        datasetsWithData[1].data.push(d.mayer)
        datasetsWithData[2].data.push(d.mvrv)
        datasetsWithData[3].data.push(Number(d.fear_greed.value))
    }

    return datasetsWithData
}

export const scales = {
    x: {
        display: false
    },

    yFearGreed: {
        type: 'linear',
        position: 'left',
        stack: 'charts',
        stackWeight: 1,
        title: { display: false, text: 'Fear & Greed', color: '#f87171' },
        grid: { drawOnChartArea: false }
    },

    spacer1: {
        stack: 'charts',
        stackWeight: 1,
        display: false
    },

    yMayer: {
        type: 'linear',
        position: 'left',
        stack: 'charts',
        stackWeight: 1,
        title: { display: false, text: 'Mayer Multiple' , color:'#4ade80' },
        grid: { drawOnChartArea: false }
    },

    spacer3: {
        stack: 'charts',
        stackWeight: 1,
        display: false
    },

    yMvrv: {
        type: 'linear',
        position: 'left',
        stack: 'charts',
        stackWeight: 1,
        title: { display: false, text: 'MVRV', color: '#60a5fa' },
        grid: { drawOnChartArea: false }
    },

    spacer2: {
        stack: 'charts',
        stackWeight: 1,
        display: false
    },

    yPrice: {
        type: 'linear',
        position: 'left',
        stack: 'charts',
        stackWeight: 5,
        title: { display: false, text: 'BTC Price', color: '#f7931a' }
    },
}