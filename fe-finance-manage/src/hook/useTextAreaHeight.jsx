import { useLayoutEffect, useState } from "react";

export const useTextAreaHeight = (textArea) => {

  const [textAreaHeight, setTextAreaHeight] = useState(0);

  useLayoutEffect(() => {
    let objResizeObserver = new ResizeObserver( (element) => {
      setTextAreaHeight(element[0].target.offsetHeight);
    });
    objResizeObserver.observe(document.getElementById(textArea));

    return () => {
      objResizeObserver.disconnect(document.getElementById(textArea));
      objResizeObserver = null;
    };
  }, [textArea])

  return textAreaHeight;
}