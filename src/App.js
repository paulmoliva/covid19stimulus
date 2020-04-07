import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Col, InputNumber, Layout, Radio, Row} from "antd";

const { Header } = Layout;

class App extends React.Component {
  constructor() {
    super();
    this.onStatusChange = this.onStatusChange.bind(this);
    this.onAGIChange = this.onAGIChange.bind(this);
    this.onQCChange = this.onQCChange.bind(this);
    this.calculatePayment = this.calculatePayment.bind(this);
    this.state = { qc: 0 };
  }

  onStatusChange(e) {
    this.setState({
      status: e.target.value
    })
  }

  onAGIChange(e) {
    this.setState({
      agi: Math.max(e, 0)
    })
  }

  onQCChange(e) {
    this.setState({
      qc: Math.max(e, 0)
    })
  }

  render() {
    return (
      <div className="App">
        <Layout>
          <Header>
            <h1 style={{color: 'whitesmoke'}}>COVID-19 Stimulus Payment Calculator</h1>
          </Header>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <h4>2019 (or 2018 if you haven't filed 2019 yet) Tax Filing Status</h4>
              <Radio checked={this.state.status === 'single'} onChange={this.onStatusChange} value={'single'}>Single</Radio><br/>
              <Radio checked={this.state.status === 'married'} onChange={this.onStatusChange} value={'married'}>Married Filing Jointly</Radio><br/>
              <Radio checked={this.state.status === 'hoh'} onChange={this.onStatusChange} value={'hoh'}>Head of Household</Radio><br/>
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <h4>2019 (or 2018) Adjusted Gross Income (Line 8b on IRS Form 1040)</h4>
              <InputNumber
                style={{width: 'fit-content'}}
                min={0}
                onChange={this.onAGIChange}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              ></InputNumber>
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <h4>How many qualifying children under 17 did you claim?</h4>
              <InputNumber
                min={0}
                onChange={this.onQCChange}
              ></InputNumber>
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              <h4>Estimated Stimulus Payment:</h4>
              <h1>${this.calculatePayment().toFixed(0)} {this.showEmoji()}</h1>
            </Col>
            <Col span={2}></Col>
          </Row>
        </Layout>
      </div>
    );
  }

  calculatePayment() {
    const reduction = (cap, mult = 1) => (Math.max(this.state.agi - cap, 0) / 100) * 5 * mult;
    const { status, agi, qc} = this.state;
    if (!(status && agi)) {
      return 1200;
    }

    if (isNaN(Number(qc)) || isNaN(Number(agi))) {
      return 0;
    }

    if (qc < 0 || agi < 0) {
      return 0;
    }
    switch (this.state.status) {
      case 'single':
        return Math.max(1200 - (reduction(75000)), 0) + (qc * 500);
      case 'married':
        return Math.max(2400 - (reduction(150000)), 0) + (qc * 500);
      case 'hoh':
        return Math.max(1200 - (reduction(112500)), 0) + (qc * 500);
    }
  }

  showEmoji() {
    if (this.calculatePayment() === '0') {
      return '🤬'
    }
    if (this.calculatePayment() > 0) {
      return '💰';
    }
    return '';
  }
}

export default App;
