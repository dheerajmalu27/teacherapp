import React, {useEffect} from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const ChartComponent = ({data}) => {
  useEffect(() => {
    // Apply chart themes
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    let chart = am4core.create('chartdiv', am4charts.XYChart);

    // Add data
    chart.data = data;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'category';
    series.name = 'Value';
    series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';
    series.columns.template.fillOpacity = 0.8;

    // Enable export
    chart.exporting.menu = new am4core.ExportMenu();

    // Clean up chart when component unmounts
    return () => {
      chart.dispose();
    };
  }, [data]);

  return <div id="chartdiv" style={{width: '100%', height: '500px'}}></div>;
};

export default ChartComponent;
