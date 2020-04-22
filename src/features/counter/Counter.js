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

export function Counter() {
  const index = useSelector(selectIndex);
  const count = useSelector(selectCount);
  const question = useSelector(selectQuestion);
  const scores = useSelector(selectResult);
  const isEnd = useSelector(selectEnd);
  const dispatch = useDispatch();

  if (isEnd) {
    return (
      <>
        <div className={styles.row}>
          <h1>Your results...</h1>
        </div>
        <div className={styles.row} style={{ width: 400 }}>
          <VictoryChart domainPadding={{ x: 20 }}>
            <VictoryBar
              data={scoresToData(scores)}
              x="platform"
              y="score"
              domain={{ y: [-10, 25] }}
            />
          </VictoryChart>
        </div>
      </>
    );
  }

  return (
    <div>
      <header className="app-header">
        <div className={styles.row}>
          <h1>
            Question {index + 1} of {count}
          </h1>
        </div>
      </header>
      <article className="app-article">
        <div className={styles.row}>{question.q}</div>
        <div className={styles.row}>
          <button
            className={styles.button}
            style={{ marginRight: 20 }}
            aria-label="Yes"
            onClick={() => dispatch(answer(false))}
          >
            No
          </button>
          <button
            className={styles.button}
            style={{ marginLeft: 20 }}
            aria-label="Yes"
            onClick={() => dispatch(answer(true))}
          >
            Yes
          </button>
        </div>
        <div className={styles.row}>
          <button
            className={styles.button}
            style={{ marginRight: 20 }}
            aria-label="Back"
            onClick={() => dispatch(previous())}
          >
            Back
          </button>
        </div>
      </article>
      <aside className="app-aside">
        <div className={styles.row}>
          <h3>EC2</h3>
        </div>
        <div className={styles.row}>
          <p>{question.ec2.rationale}</p>
        </div>
        <div className={styles.row}>
          <h3>Containers</h3>
        </div>
        <div className={styles.row}>
          <p>{question.containers.rationale}</p>
        </div>
        <div className={styles.row}>
          <h3>Serverless</h3>
        </div>
        <div className={styles.row}>
          <p>{question.lambda.rationale}</p>
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
