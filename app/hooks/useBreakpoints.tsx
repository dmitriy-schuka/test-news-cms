import { useEffect, useState } from 'react';
import { DEVICES_BREAKPOINTS } from "~/constants/common";

const useBreakpoints = () => {
  const [device, setDevice] = useState(`mobile`);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    if (typeof window === `undefined`) {
      return;
    }

    const handleResize = () => {
      switch (true) {
        case window.innerWidth <= DEVICES_BREAKPOINTS.mobile:
          setDevice('mobile');
          break;
        case window.innerWidth <= DEVICES_BREAKPOINTS.desktop:
          setDevice('tablet');
          break;
        default:
          setDevice('desktop');
          break;
      }
    };

    handleResize();

    window.addEventListener(`resize`, handleResize);

    return () => {
      window.removeEventListener(`resize`, handleResize);
    };
  }, [setDevice]);

  useEffect(() => {
    setIsDesktop(device === `desktop`);
  }, [device]);

  useEffect(() => {
    setIsMobile(device === `mobile`);
  }, [device]);

  useEffect(() => {
    setIsTablet(device === `tablet`);
  }, [device]);

  return {
    isDesktop,
    isMobile,
    isTablet,
  };
};

export default useBreakpoints;