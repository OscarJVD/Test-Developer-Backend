const Toast = ({ msg, handleShow, bgColor, onlyTitle }) => {
  return (
    <div
      className={`toast show position-fixed text-light ${bgColor}`}
      style={{ top: "5px", right: "5px", minWidth: "200px", zIndex: 9998 }}
    >
      <div
        className={`toast-header justify-content-between text-light ${bgColor}`}
      >
        <strong className="mr-auto text-light">{msg.title}</strong>
        <button
          className={`${bgColor} border-0 float-right ml-2 mb-1 close text-light`}
          data-dismiss="toast"
          type="button"
          style={{ outline: "none" }}
          onClick={handleShow}
        >
          &times;
        </button>
      </div>
      {!onlyTitle && <div className="toast-body">{msg.body}</div>}
    </div>
  );
};

export default Toast;
