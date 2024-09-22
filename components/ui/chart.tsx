import clsx from "clsx";
import * as Highcharts from 'highcharts';
import { HighchartsReact, HighchartsReactRefObject } from 'highcharts-react-official';
import { useEffect, useRef, useState } from "react";
import { Dictionary } from "highcharts";
import getMinMaxForYAxis from "../../lib/yaxishelper";
import getNumberInUSDFormat from "../../lib/usdformat";

interface AbstractChartProps {
    instrumentName: string;
    data: [string, number][];
    inflationData?: [string, number][];
    intrestRatesData?: [string, number][];
    SPYData?: [string, number][];
    className?: string;
};

function AbstractChart(props: AbstractChartProps) {
    const [chartVal, setChartVal] = useState<number>(props.data ? props.data[0][1] : 0);
    const stepValue = Math.ceil(props.data.length / 6);

    const dataSeries = props.data.map((record) => [new Date(record[0]).getTime(), record[1]]);

    const values = dataSeries?.map(([_, value]) => value);

    const allSeries = [
        {
            name: props.instrumentName,
            data: dataSeries,
        }
    ];

    if (props.inflationData) {
        allSeries.push({
            name: 'Inflation',
            data: props.inflationData.map((record) => [new Date(record[0]).getTime(), record[1]])
        });

        values.push(...props.inflationData.map((record) => record[1]));
    }

    if (props.intrestRatesData) {
        allSeries.push({
            name: 'Interest Rates',
            data: props.intrestRatesData.map((record) => [new Date(record[0]).getTime(), record[1]])
        });

        values.push(...props.intrestRatesData.map((record) => record[1]));
    }

    if (props.SPYData) {
        allSeries.push({
            name: 'SP 500',
            data: props.SPYData.map((record) => [new Date(record[0]).getTime(), record[1]])
        });

        values.push(...props.SPYData.map((record) => record[1]));
    }

    const { min, max } = getMinMaxForYAxis([
        { name: 'Abstract Chart', data: values }
    ]);

    const chartRef = useRef<HighchartsReactRefObject | null>(null);
    useEffect(() => {
        if (!chartRef.current) return;
        const chart = chartRef.current.chart;

        const line = chart.renderer.path(['M', 0, 0, 'L', 0, 0] as unknown as Highcharts.SVGPathArray)
        .attr({
            fill: "none",
            stroke: 'white',
            "stroke-width": 1.5,
            "stroke-dasharray": '3 3',
            zIndex: 5
        })
        .add();

        const handleMouseMove = (event: Dictionary<any> | undefined) => {
            if (!chart || !event) return;

            const chartContainer = chart.container.getBoundingClientRect();
            const xAxis = chart.xAxis[0];
        
            const mouseX = event.clientX - chartContainer.left;
        
            const x = xAxis.toValue(mouseX);
        
            line.attr({
                d: [
                    'M', 
                    xAxis.toPixels(x, false), 
                    chart.plotTop, 'L', 
                    xAxis.toPixels(x, false), 
                    chart.plotTop + chart.plotHeight
                ] as unknown as Highcharts.SVGPathArray
            });

            if (chart.tooltip) {
                const series = chart.series[0];
                if (series && series.points && series.points.length > 0) {
                    const closestPoint = series.points.reduce((prev: any, curr: any) => {
                        return (Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev);
                    });
    
                    chart.tooltip.refresh(closestPoint);
                }
            }
        };

        Highcharts.addEvent(chart.container, 'mousemove', handleMouseMove);

        const handleMouseOut = () => {
            line.attr({
                d: ['M', 0, 0, 'L', 0, 0] as unknown as Highcharts.SVGPathArray
            });
            if (chart.tooltip) {
                chart.tooltip.hide();
            }
        };

        Highcharts.addEvent(chart.container, 'mouseout', handleMouseOut);

        return () => {
            if (chart.container) {
                Highcharts.removeEvent(chart.container, 'mousemove', handleMouseMove);
                Highcharts.removeEvent(chart.container, 'mouseout', handleMouseOut);
            }
        };
    }, []);

    const options = {
        chart: {
            type: 'spline',
            events: {
                load: function () {
                    Highcharts.setOptions({
                        global: {
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        } as Highcharts.Options['global'],
                    });
                }
            },
            backgroundColor: null, 
            plotBackgroundColor: null,
            plotBorderColor: '#606063',
            spacingRight: 20
        },
        title: {
            text: null,
        },
        xAxis: {
            gridLineColor: '#707073',
            lineColor: '#707073',
            tickColor: '#707073',
            title: {
                style: {
                color: '#A0A0A3'
                }
            },
            type: 'datetime',
            labels: {
                step: stepValue,
                formatter: function () {
                    const localDate = new Date(this.value);
                    return Highcharts.dateFormat('%b %e, %H:%M', localDate.getTime());
                } as (this: { value: number }) => string,
                enabled: true,
                style: {
                    color: '#E0E0E3'
                }
            },
            maxPadding: 0.04
        },
        yAxis: {
            gridLineColor: '#707073',
            lineColor: '#707073',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
                text: null,
                style: {
                    color: '#A0A0A3'
                }
            },
            min: min,
            max: max,
            labels: {
                enabled: true,
                style: {
                    color: '#E0E0E3'
                },
                formatter: function () {
                    return '$' + this.value;
                } as (this: { value: string }) => string,
            },
        },
        tooltip: {
            shadow: false,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderRadius: 0,
            borderWidth: 0,
            zIndex: '100',
            style: {
                fontFamily: `"Aeonik", sans-serif`,
                fontSize: '11px',
                zIndex: 100,
                color: '#F0F0F0'
            },
            outside: true,
            formatter: function () {
                const localDate = new Date(this.x);
                const formattedDate = Highcharts.dateFormat('%H:%M, %A, %b %e', localDate.getTime());
                return `<b>${formattedDate}</b>`;
            } as (this: { x: number }) => string,
            positioner: function (labelWidth: number, labelHeight: number, point: Highcharts.Point) {
                const chart = this.chart;
                const xPos = point.plotX! + chart.plotLeft;
                const yPos = chart.plotTop - labelHeight + 2.5;
        
                return {
                    x: xPos - (labelWidth / 2),
                    y: yPos
                };
            } as (
                this: { chart: Highcharts.Chart }, 
                labelWidth: number, 
                labelHeight: number, 
                point: Highcharts.Point
            ) => Highcharts.PositionObject
        }, 
        legend: {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            itemStyle: {
                color: 'white',
                fontWeight: 'bold',
                fontFamily: `"Aeonik", sans-serif`,
            },
            itemHoverStyle: {
                color: '#0FF'
            }
        }, 
        series: allSeries,
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver: function () {
                            setChartVal(this.y);
                        } as (this: { y: number }) => string,
                    }
                }
            }
        }
    };

    return (
        <div className={clsx("w-full flex flex-col", props.className)}>
            <div className="mb-2">
                <p className="w-full mb-0 text-white text-2xl font-black aeonik--bold">
                    {props.instrumentName}
                </p>
                <p className="w-full mb-0 text-white text-2xl font-black aeonik--bold">
                    ${getNumberInUSDFormat(chartVal)}
                </p>
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                ref={chartRef}
            />
        </div>
    );
};

export default AbstractChart;