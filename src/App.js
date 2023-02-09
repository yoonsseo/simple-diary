import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  //useState,
  createContext,
} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetid ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

export const DiaryStateContext = createContext();

export const DiaryDispatchContext = createContext();

function App() {
  //const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    //map: 배열의 각각 모든 요소들을 순회해서
    //map함수의 콜백 함수 안에서 리턴하는 값들을 모아 배열을 만들어
    //initData안에 집어넣겠다
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    dispatch({ type: "INIT", data: initData });
    //setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  //일기 배열에 새로운 일기를 추가해주는 함수
  //DiaryEditor에서 작성된 내용을 onCreate 함수가 받아서
  //data state에 setData통해서 반영
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });

    // const created_date = new Date().getTime();
    // const newItem = {
    //   author,
    //   content,
    //   emotion,
    //   created_date,
    //   id: dataId.current,
    // };
    dataId.current += 1;

    //setData((data) => [newItem, ...data]);
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
    //setData((data) => data.filter((it) => it.id !== targetId));
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
    // setData((data) =>
    //   data.map((it) =>
    //     it.id === targetId ? { ...it, content: newContent } : it
    //   )
    // );
  }, []);

  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []); //빈배열 -> memoizedDispatches는 절대 재생성 되지 않음
  //useMemo를 사용하지 않으면 App 컴포넌트가 재생성될 때
  //리턴하는 객체도 재생성하게 됨

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기 : {data.length}개</div>
          <div>기분 좋은 일기 : {goodCount}개</div>
          <div>기분 나쁜 일기 : {badCount}개</div>
          <div>기분 좋은 일기 비율 : {goodRatio}%</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
