import { Button, Paper, Typography } from '@material-ui/core';
import _ from 'lodash';
import { fuseDark } from '@fuse/fuse-colors';
import React, { Component } from 'react';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { Bar, Line } from 'react-chartjs-2';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#3C4252',
            borderColor: '#424242',
            borderWidth: 1,
            hoverBackgroundColor: lightBlue[700],
            hoverBorderColor: lightBlue[700],
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};

class Widget5 extends Component {
    state = {
        currentRange: 'TW',
    };

    handleChangeRange = (currentRange) => {
        this.setState({ currentRange });
    };

    render() {
        const { widget: widgetRaw } = this.props;
        const { currentRange } = this.state;
        const widget = _.merge({}, widgetRaw);

        return (
            <Paper className="w-full rounded-8 shadow-none border-1">
                <div className="flex items-center justify-between px-16 py-16 border-b-1">
                    <Typography className="text-16">Gráfico</Typography>
                    <div className="items-center">
                        {Object.entries(widget.ranges).map(([key, n]) => {
                            return (
                                <Button
                                    key={key}
                                    className="normal-case shadow-none px-16"
                                    onClick={() => this.handleChangeRange(key)}
                                    color={currentRange === key ? "secondary" : "default"}
                                    variant={currentRange === key ? "contained" : "text"}
                                >
                                    {n}
                                </Button>
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-row flex-wrap">
                    <div className="w-full md:w-1/2 p-8 min-h-420 h-420">
                        <Bar
                            data={data}
                            options={widget.mainChart.options}
                        />
                    </div>
                    <div className="flex w-full md:w-1/2 flex-wrap p-8">
                        {Object.entries(widget.supporting).map(([key, item]) => {
                            return (
                                <div key={key} className="w-full sm:w-1/2 p-12">
                                    <Typography className="text-15 whitespace-no-wrap" color="textSecondary">{item.label}</Typography>
                                    <Typography className="text-32">{item.count[currentRange]}</Typography>
                                    <div className="h-64 w-full">
                                        <Line
                                            data={{
                                                labels: item.chart[currentRange].labels,
                                                datasets: item.chart[currentRange].datasets
                                            }}
                                            options={item.chart.options}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Paper>
        );
    }
}

export default Widget5;
