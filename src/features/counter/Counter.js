import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  previous,
  answer,
  selectIndex,
  selectCount,
  selectQuestion,
  selectResult,
  selectEnd,
} from "./counterSlice";
import { VictoryBar, VictoryChart } from "victory";
import styles from "./Counter.module.scss";
import { assign } from "lodash";

export function Counter() {
  const index = useSelector(selectIndex);
  const count = useSelector(selectCount);
  const question = useSelector(selectQuestion);
  const scores = useSelector(selectResult);
  const isEnd = useSelector(selectEnd);
  const dispatch = useDispatch();

  // --- Basic Victory chart theming ---
  
  // Colours
  const colors = [
    "#252525",
    "#525252",
    "#737373",
    "#969696",
    "#bdbdbd",
    "#d9d9d9",
    "#f0f0f0"
  ];
  const black = '#222222';
  const greyMid = '#747474';
  const greyLight = '#d4d4d4';
  const whiteOff = '#f4f7f5';
  const white = '#ffffff';
  const orange = '#ff6100';
  
  // Typography
  const sansSerif = "'Inter', sans-serif";
  const letterSpacing = "normal";
  const fontSize = 14;
  
  // Layout
  const baseProps = {
    width: 450,
    height: 300,
    padding: 50,
    colorScale: colors
  };

  // Labels
  const baseLabelStyles = {
    fontFamily: sansSerif,
    fontSize,
    letterSpacing,
    padding: 10,
    fill: black,
    stroke: "transparent"
  };
  const centeredLabelStyles = assign({ textAnchor: "middle" }, baseLabelStyles);

  // Strokes
  const strokeLinecap = "round";
  const strokeLinejoin = "round";

  // Construct theme

  const victoryTheme = {
    axis: assign(
      {
        style: {
          axis: {
            fill: "transparent",
            stroke: greyMid,
            strokeWidth: 1,
            strokeLinecap,
            strokeLinejoin
          },
          axisLabel: assign({}, centeredLabelStyles, {
            padding: 25
          }),
          grid: {
            fill: "none",
            stroke: "none",
            pointerEvents: "painted"
          },
          ticks: {
            fill: "transparent",
            size: 1,
            stroke: "transparent"
          },
          tickLabels: baseLabelStyles
        }
      },
      baseProps
    ),
    bar: assign(
      {
        style: {
          data: {
            fill: orange,
            padding: 20,
            strokeWidth: 0
          },
          labels: baseLabelStyles
        }
      },
      baseProps
    )
  }

  // --- /theme ---

  if (isEnd) {
    return (
      <div>
        <header className="app-header">
          <div className={styles.row}>
            <h1 className={styles.results}>Your results...</h1>
          </div>
        </header>
        <article className="app-article">
          <div className={styles.row} style={{ width: 400 }}>
            <VictoryChart theme={victoryTheme} domainPadding={{ x: 20 }}>
              <VictoryBar
                data={scoresToData(scores)}
                x="platform"
                y="score"
                domain={{ y: [-10, 25] }}
              />
            </VictoryChart>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div>
      <header className="app-header">
        <div className={styles.row}>
          <button
            className={styles['button-back']}
            aria-label="Back"
            onClick={() => dispatch(previous())}
          >
            Back
          </button>
        </div>
        <div className={styles.row}>
          <h1 className={styles.progress}>
            Question <span className={styles['q-num']}>{index + 1}</span> of <span className={styles['q-total']}>{count}</span>
          </h1>
        </div>
      </header>
      <article className="app-article">
        <div className={`${styles.row} question`}>
          <h2 className={styles.question}>{question.q}</h2>
        </div>
        <div className={styles.row}>
          <button
            className={styles.button}
            aria-label="No"
            onClick={() => dispatch(answer(false))}
            >
            No
          </button>
          <button
            className={styles.button}
            aria-label="Yes"
            onClick={() => dispatch(answer(true))}
          >
            Yes
          </button>
        </div>
      </article>
      <aside className="app-aside">
        <div className={styles.row}>
          <dl className={styles.rationale}>
            <dt><h3>EC2</h3></dt>
            <dd>{question.ec2.rationale}</dd>
            <dt><h3>Containers</h3></dt>
            <dd>{question.containers.rationale}</dd>
            <dt><h3>Serverless</h3></dt>
            <dd>{question.lambda.rationale}</dd>
          </dl>
        </div>
      </aside>
    </div>
  );
}

const scoresToData = (scores) => [
  {
    platform: "ec2",
    score: scores.ec2,
  },
  {
    platform: "containers",
    score: scores.containers,
  },
  {
    platform: "lambda",
    score: scores.lambda,
  },
];
