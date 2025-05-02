// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import PropTypes from "prop-types";

const ScrollTop = ({
  showOffset,
  scrollBehaviour = "smooth", // ✅ استفاده از پارامتر پیش‌فرض
  children,
  ...rest
}) => {
  // ** State
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.pageYOffset >= showOffset);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showOffset]);

  const handleScrollToTop = () => {
    window.scroll({ top: 0, behavior: scrollBehaviour });
  };

  return (
    visible && (
      <div className="scroll-to-top" onClick={handleScrollToTop} {...rest}>
        {children}
      </div>
    )
  );
};

export default ScrollTop;

// ** PropTypes
ScrollTop.propTypes = {
  showOffset: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  scrollBehaviour: PropTypes.oneOf(["smooth", "instant", "auto"]),
};
