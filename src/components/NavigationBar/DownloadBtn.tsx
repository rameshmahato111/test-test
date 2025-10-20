import { detectDevice } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import QRCodeComponent from "./QRCode";
import { AndroidDownloadLink, IOSDownloadLink } from "@/data/staticData";

const DownloadBtn = ({
  className,
  value = "Download App",
}: {
  className?: string;
  value?: string;
}) => {
  const router = useRouter();
  const [showDownloadQr, setShowDownloadQr] = React.useState(false);
  const [device, setDevice] = React.useState("Unknown");

  useEffect(() => {
    if (showDownloadQr) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [showDownloadQr]);

  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const detectedDevice = detectDevice();
    setDevice(detectedDevice);

    if (detectedDevice === "Desktop" || detectedDevice === "Mac") {
      event.preventDefault();
      setShowDownloadQr(true);
    } else {
      if (detectedDevice === "iOS Device") {
        router.push(IOSDownloadLink, { scroll: false });
      } else {
        router.push(AndroidDownloadLink, { scroll: false });
      }
    }
  };

  return (
    <>
      <button
        aria-label="Download app"
        aria-describedby="download-app-description"
        onClick={handleDownloadClick}
        className={`${className} relative group transition-all duration-300 hover:text-primary-400 transform  cursor-pointer`}
        type="button"
      >
        {value}

        {/* Animated underline - same as navbar links */}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-300 group-hover:w-full pointer-events-none"></span>

        {/* Subtle glow effect - same as navbar links */}
        <span className="absolute inset-0 bg-primary-400/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none"></span>
      </button>

      {showDownloadQr && (
        <QRCodeComponent
          apkLink={AndroidDownloadLink}
          IosLink={IOSDownloadLink}
          device={device}
          toggleModal={setShowDownloadQr}
        />
      )}
    </>
  );
};

export default DownloadBtn;
