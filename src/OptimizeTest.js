import React, { useEffect, useState } from "react";

const CounterA = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`CounterA Update :: count : ${count}`);
  });
  return <div>{count}</div>;
});

const CounterB = React.memo(({ obj }) => {
  useEffect(() => {
    console.log(`CounterB Update :: count : ${obj.count}`);
  });
  return <div>{obj.count}</div>;
});

const areEqual = (prevProps, nextProps) => {
  if (prevProps.obj.count === nextProps.obj.count) {
    return true; //이전 Props와 현재 Props가 같다 -> 리렌더링 하지 않음
  } else {
    return false; //이전 Props와 현재 Props가 다르다 -> 리렌더링 함
  }
};

const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });

  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>CounterA</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A</button>
      </div>
      <div>
        <h2>CounterB</h2>
        <MemoizedCounterB obj={obj} />
        <button
          onClick={() =>
            setObj({
              count: obj.count,
            })
          }
        >
          B
        </button>
      </div>
    </div>
  );
};

export default OptimizeTest;
