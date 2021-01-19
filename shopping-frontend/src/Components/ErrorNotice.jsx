import React from "react";

export default function ErrorNotice(props) {
  return <div className="alert alert-danger">{props.message}</div>;
}
