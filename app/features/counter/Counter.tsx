import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import routes from '@/config/routes';

import styles from './Counter.css';
import { Action, selectCount } from './store.renderer';

export default function Counter() {
  const dispatch = useDispatch();
  const value = useSelector(selectCount);

  return (
    <div>
      <div className={styles.backButton} data-tid="backButton">
        <Link to={routes.DATA}>
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
      </div>
      <div className={`counter ${styles.counter}`} data-tid="counter">
        {value}
      </div>
      <div className={styles.btnGroup}>
        <button
          className={styles.btn}
          onClick={() => {
            dispatch(Action.INCREMENT());
          }}
          data-tclass="btn"
          type="button"
        >
          <i className="fa fa-plus" />
        </button>
        <button
          className={styles.btn}
          onClick={() => {
            dispatch(Action.DECREMENT());
          }}
          data-tclass="btn"
          type="button"
        >
          <i className="fa fa-minus" />
        </button>
        {/* <button
          className={styles.btn}
          onClick={() => {
            dispatch(incrementIfOdd());
          }}
          data-tclass="btn"
          type="button"
        >
          odd
        </button> */}
        <button
          className={styles.btn}
          onClick={() => {
            dispatch(Action.RANDOM_REQUEST());
          }}
          data-tclass="btn"
          type="button"
        >
          random
        </button>
      </div>
    </div>
  );
}
