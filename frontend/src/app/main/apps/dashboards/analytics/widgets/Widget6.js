import { withStyles } from "@material-ui/core/styles";
import React from "react";
import Chart from "../../../../../../components/Chart";
import lightBlue from '@material-ui/core/colors/lightBlue';

const styles = theme => ({
    "chart-container": {
        height: 400
    }
});

class Widget6 extends React.Component {
    state = {
        lineChartData: {
            labels: [],
            datasets: [
                {
                    type: "line",
                    label: "KB por segundos",
                    backgroundColor: '#3C4252',
                    borderColor: lightBlue[700],
                    pointBackgroundColor: '#0091e1',
                    pointBorderColor: lightBlue[700],
                    borderWidth: "2",
                    lineTension: 0.45,
                    data: []
                }
            ]
        },
        lineChartOptions: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: true
            },
            scales: {
                xAxes: [
                    {
                        ticks: {
                            autoSkip: false,
                            maxTicksLimit: 10
                        }
                    }
                ]
            }
        }
    };

    componentDidMount() {
        const subscribe = {
            type: "subscribe",
            channels: [
                {
                    name: "ticker",
                    product_ids: ["BTC-USD"]
                }
            ]
        };

        this.ws = new WebSocket("wss://ws-feed.gdax.com");

        this.ws.onopen = () => {
            this.ws.send(JSON.stringify(subscribe));
        };

        this.ws.onmessage = e => {
            const value = JSON.parse(e.data);
            if (value.type !== "ticker") {
                return;
            }

            const oldBtcDataSet = this.state.lineChartData.datasets[0];
            const newBtcDataSet = { ...oldBtcDataSet };
            newBtcDataSet.data.push(value.price);

            const newChartData = {
                ...this.state.lineChartData,
                datasets: [newBtcDataSet],
                labels: this.state.lineChartData.labels.concat(
                    new Date().toLocaleTimeString()
                )
            };
            this.setState({ lineChartData: newChartData });
        };
    }

    componentWillUnmount() {
        this.ws.close();
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes["chart-container"]}>
                <Chart
                    data={this.state.lineChartData}
                    options={this.state.lineChartOptions}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Widget6);