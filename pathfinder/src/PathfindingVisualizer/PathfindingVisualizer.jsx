import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";

import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "./PathfindingVisualizer.css";

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

const Max_Row = 20;
const Max_col = 50;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      isVisitedNodes: [],
      mouseIsPressed: false,
      mouseIsPressedStart: false,
      mouseIsPressedFinish: false,
      isVisulized: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    let newGrid;
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      if (this.state.isVisulized) this.visualizeDijkstra();
      this.setState({ mouseIsPressedStart: true });
    } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      if (this.state.isVisulized) this.visualizeDijkstra();
      this.setState({ mouseIsPressedFinish: true });
    } else {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.mouseIsPressed) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    } else if (this.state.mouseIsPressedStart) {
      const newGrid = getNewGridWithStartToggled(
        this.state.grid,
        row,
        col,
        START_NODE_ROW,
        START_NODE_COL
      );
      START_NODE_ROW = row;
      START_NODE_COL = col;
      this.setState({ grid: newGrid });
      if (this.state.isVisulized) this.visualizeDijkstra();
    } else if (this.state.mouseIsPressedFinish) {
      const newGrid = getNewGridWithStopToggled(
        this.state.grid,
        row,
        col,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
      FINISH_NODE_ROW = row;
      FINISH_NODE_COL = col;
      this.setState({ grid: newGrid });
      if (this.state.isVisulized) this.visualizeDijkstra();
    }
  }

  handleMouseUp() {
    this.setState({
      mouseIsPressed: false,
      mouseIsPressedStart: false,
      mouseIsPressedFinish: false,
    });
  }

  handleMouseLeave(row, col) {
    if (row === Max_Row - 1 || row === 0 || col === Max_col - 1 || col === 0) {
      this.handleMouseUp();
    }
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        } else if (
          node.row === FINISH_NODE_ROW &&
          node.col === FINISH_NODE_COL
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  }

  animateDijkstraWithoutAnimation(
    visitedNodesInOrder,
    nodesInShortestPathOrder
  ) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        this.animateShortestPathWithoutAnimation(nodesInShortestPathOrder);
        return;
      }
      let node = visitedNodesInOrder[i];
      if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-start";
      } else if (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-finish";
      } else {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited-noDelay";
      }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        } else if (
          node.row === FINISH_NODE_ROW &&
          node.col === FINISH_NODE_COL
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
      }, 50 * i);
    }
  }

  animateShortestPathWithoutAnimation(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      let node = nodesInShortestPathOrder[i];
      if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-start";
      } else if (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-finish";
      } else {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }
    }
  }

  clearScreen() {
    console.log("CLEAR SCREEN");
    const { isVisitedNodes } = this.state;
    for (let i = 0; i < isVisitedNodes.length; i++) {
      let node = isVisitedNodes[i];
      if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-start";
      } else if (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-finish";
      } else {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-clear";
      }
    }
    this.setState({ isVisitedNodes: isVisitedNodes });
  }

  visualizeDijkstra() {
    if (this.state.isVisulized) {
      this.clearScreen();
    }
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    if (this.state.isVisulized) {
      this.animateDijkstraWithoutAnimation(
        visitedNodesInOrder,
        nodesInShortestPathOrder
      );
    } else {
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
    this.setState({ isVisulized: true, isVisitedNodes: visitedNodesInOrder });
    console.log("SET STATE CALLED");
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <Container fluid>
          <Button variant="success" onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </Button>
        </Container>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseLeave={() => this.handleMouseLeave(row, col)}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < Max_Row; row++) {
    const currentRow = [];
    for (let col = 0; col < Max_col; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStartToggled = (grid, row, col, prevRow, prevCol) => {
  const newGrid = grid.slice();
  const prevNode = newGrid[prevRow][prevCol];
  const prevNodeChange = {
    ...prevNode,
    isStart: false,
  };
  newGrid[prevRow][prevCol] = prevNodeChange;
  const currNode = newGrid[row][col];
  const currNodeChange = {
    ...currNode,
    isStart: true,
  };
  newGrid[row][col] = currNodeChange;

  return newGrid;
};

const getNewGridWithStopToggled = (grid, row, col, prevRow, prevCol) => {
  const newGrid = grid.slice();
  const prevNode = newGrid[prevRow][prevCol];
  const prevNodeChange = {
    ...prevNode,
    isFinish: false,
  };
  newGrid[prevRow][prevCol] = prevNodeChange;
  const currNode = newGrid[row][col];
  const currNodeChange = {
    ...currNode,
    isFinish: true,
  };
  newGrid[row][col] = currNodeChange;

  return newGrid;
};
