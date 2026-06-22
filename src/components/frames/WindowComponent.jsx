import { useRef } from "react";
import { Rnd } from "react-rnd";
import { X, Minus } from "lucide-react";
import { useWindowManager } from "../../context/WindowManagerContext";

export default function WindowComponent({ id, children }) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager();
  const win = windows[id];
  const windowRef = useRef(null);

  if (!win || !win.isOpen) return null;

  return (
    <Rnd
      size={{ width: win.width, height: win.height }}
      position={{ x: win.x, y: win.y }}
      onDragStop={(e, d) => {
        updateWindowPosition(id, d.x, d.y);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateWindowSize(
          id,
          ref.offsetWidth,
          ref.offsetHeight,
          position.x,
          position.y,
        );
      }}
      dragHandleClassName="window-titlebar"
      bounds="parent"
      minWidth={290}
      minHeight={200}
      style={{
        zIndex: win.zIndex,
        display: win.isMinimized ? "none" : "flex",
        flexDirection: "column",
        position: "absolute",
      }}
      className="window-frame"
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar Header */}
      <div
        className="window-titlebar"
        onMouseDown={(e) => {
          focusWindow(id);
        }}
      >
        <div className="titlebar-accent-dots">
          <span
            className="dot dot-red"
            onClick={() => closeWindow(id)}
            style={{ cursor: "pointer" }}
            title="Close"
          />
          <span
            className="dot dot-yellow"
            onClick={() => minimizeWindow(id)}
            style={{ cursor: "pointer" }}
            title="Minimize"
          />
          <span className="dot dot-green" title="Active" />
        </div>
        <span className="titlebar-title">{win.title}</span>
        <div
          className="titlebar-controls"
          style={{ display: "flex", gap: "4px" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            aria-label="Minimize Window"
            className="titlebar-btn"
            style={{ width: "20px", height: "20px" }}
          >
            <Minus size={10} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            aria-label="Close Window"
            className="titlebar-btn close-btn"
            style={{ width: "20px", height: "20px" }}
          >
            <X size={10} />
          </button>
        </div>
      </div>

      {/* Content Scroll Container */}
      <div
        className="window-content"
        style={{
          flex: 1,
          height: "100%",
          overflowY: "auto",
          userSelect: "text",
        }}
      >
        {children}
      </div>
    </Rnd>
  );
}
