// ** React Imports
import { Fragment, useEffect, memo } from "react";

// ** Third Party Components
import classnames from "classnames";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import {
  handleContentWidth,
  handleMenuCollapsed,
  handleMenuHidden,
} from "@store/layout";

// ** ThemeConfig
import themeConfig from "@configs/themeConfig";

// ** Styles
import "animate.css/animate.css";

const LayoutWrapper = (props) => {
  // ** Props
  const { children, routeMeta } = props;

  // ** Store
  const dispatch = useDispatch();
  const navbarStore = useSelector((state) => state.navbar);
  const layoutStored = useSelector((state) => state.layout.layout);
  const contentWidth = useSelector((state) => state.layout.contentWidth);
  const menuCollapsed = useSelector((state) => state.layout.menuCollapsed);
  const menuHidden = useSelector((state) => state.layout.menuHidden);

  // ** Layout conditions
  const appLayoutCondition =
    (layoutStored === "horizontal" && !routeMeta) ||
    (layoutStored === "horizontal" && routeMeta && !routeMeta.appLayout);

  const Tag = appLayoutCondition ? "div" : Fragment;

  // ** Clean up on unmount
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth === contentWidth) {
        dispatch(handleContentWidth(themeConfig.layout.contentWidth));
      }
      if (routeMeta.menuCollapsed === menuCollapsed) {
        dispatch(handleMenuCollapsed(!menuCollapsed));
      }
      if (routeMeta.menuHidden === menuHidden) {
        dispatch(handleMenuHidden(!menuHidden));
      }
    }
  };

  // ** Handle layout meta settings
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth));
      }
      if (routeMeta.menuCollapsed !== undefined) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed));
      }
      if (routeMeta.menuHidden !== undefined) {
        dispatch(handleMenuHidden(routeMeta.menuHidden));
      }
    }

    return () => cleanUp();
  }, [routeMeta]);

  return (
    <div
      className={classnames("app-content content overflow-hidden", {
        [routeMeta?.className || ""]: routeMeta?.className,
        "show-overlay": navbarStore.query?.length,
      })}
    >
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <div
        className={classnames({
          "content-wrapper": routeMeta && !routeMeta.appLayout,
          "content-area-wrapper": routeMeta && routeMeta.appLayout,
          "container-xxl p-0": contentWidth === "boxed",
        })}
      >
        <Tag {...(appLayoutCondition ? { className: "content-body" } : {})}>
          {children}
        </Tag>
      </div>
    </div>
  );
};

export default memo(LayoutWrapper);
