import React, { Component } from "react";
// import Col from "react-bootstrap/Col";

import "./Node.css";

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      isClear,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      onMouseLeave,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : isClear
      ? "node-clear"
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        onMouseLeave={() => onMouseLeave()}
      ></div>
    );
  }
}
