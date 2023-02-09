import React, { useContext, useEffect, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryEditor = () => {
  const { onCreate } = useContext(DiaryDispatchContext);

  useEffect(() => {
    console.log("DiaryEditor Render");
  });

  //사용자 입력을 리액트가 처리하기 위해 state 이용
  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });

  //HTML DOM 요소를 접근할 수 있는 기능
  //authorInput에는 React.MutableRefObject가 저장됨
  const authorInput = useRef();
  const contentInput = useRef();

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    //console.log(state);
    if (state.author.length < 1) {
      authorInput.current.focus();
      return; //더 이상 진행되지 않도록 방지
    }

    if (state.content.length < 3) {
      contentInput.current.focus();
      return;
    }

    onCreate(state.author, state.content, state.emotion);
    alert("저장 성공");
    setState({
      author: "",
      content: "",
      emotion: 1,
    });
  };

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input
          ref={authorInput}
          placeholder="작성자"
          value={state.author}
          name="author"
          onChange={handleChangeState}
        />
        {/*여기input에서 author의 입력값이 변할 때마다 setAuthor 통해 저장*/}
      </div>
      <div>
        <textarea
          ref={contentInput}
          placeholder="오늘의 일기"
          value={state.content}
          name="content"
          onChange={handleChangeState}
        />
      </div>
      <div>
        <span>오늘의 감정점수 : </span>
        <select
          name="emotion"
          value={state.emotion}
          onChange={handleChangeState}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </div>
  );
};

export default React.memo(DiaryEditor);
