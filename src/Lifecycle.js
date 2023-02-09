import React, { useEffect, useState } from "react";

const UnMountTest = () => {
  useEffect(() => {
    console.log("Mount");
    //Mount 시점에 실행

    return () => {
      //UnMount 시점에 실행
      console.log("UnMount!");
    };
  }, []);

  return <div>UnMountTest Component</div>;
};

const Lifecycle = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div style={{ padding: 20 }}>
      <div>
        <button onClick={toggle}>ON/OFF</button>
        {isVisible && <UnMountTest />}
        {/*isVisible이 true이고 UnMountTest가 truthy이면 화면에 나타남*/}
      </div>
    </div>
  );
};

export default Lifecycle;
