"use client";
import React, { useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { X, Smartphone, Monitor, RefreshCw } from "lucide-react";
import { createPortal } from "react-dom";

const QRCodeComponent = ({
  apkLink,
  IosLink,
  device,
  toggleModal,
}: {
  apkLink: string;
  IosLink: string;
  device: string;
  toggleModal: Function;
}) => {
  const initialUrl = device === "Desktop" ? apkLink : IosLink;
  const [url, setUrl] = React.useState(initialUrl);
  const [isInitialDevice, setIsInitialDevice] = React.useState(true);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleUrl = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      if (isInitialDevice) {
        setUrl(device === "Desktop" ? IosLink : apkLink);
      } else {
        setUrl(initialUrl);
      }
      setIsInitialDevice(!isInitialDevice);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 200);
    }, 200);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      toggleModal(false);
    }, 300);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCurrentPlatform = () => {
    return isInitialDevice
      ? (device === "Desktop" ? "Android" : "iOS")
      : (device === "Desktop" ? "iOS" : "Android");
  };

  const getNextPlatform = () => {
    return isInitialDevice
      ? (device === "Desktop" ? "iOS" : "Android")
      : (device === "Desktop" ? "Android" : "iOS");
  };

  return createPortal(
    <div className={`
      fixed w-screen h-screen inset-0 grid place-content-center z-[9999]
      bg-black/70 backdrop-blur-sm
      transition-all duration-300 ease-out
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>


      {/* Close button */}
      <button
        aria-label="Close QR code modal"
        onClick={handleClose}
        className="absolute right-4 top-4 group border-2 cursor-pointer border-white/30 hover:border-white/60 rounded-full p-2 w-min backdrop-blur-sm bg-black/20 hover:bg-black/40"
      >
        <X className="w-5 h-5 text-white  transition-transform duration-300" />
      </button>

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          w-[400px] h-[500px] rounded-xl bg-white/95 backdrop-blur-md p-8 
          flex flex-col justify-center items-center relative overflow-hidden
          shadow-2xl border border-white/20
          transform transition-all duration-500 ease-out z-[10000]
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}
        `}
      >
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-50 rounded-lg">
            {device === "Desktop" || device === "Mac" ? (
              <Monitor className="w-6 h-6 text-primary-400" />
            ) : (
              <Smartphone className="w-6 h-6 text-primary-400" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Download App</h2>
            <p className="text-sm text-gray-500">Scan QR code with your phone</p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className={`
          relative p-4 bg-white rounded-xl shadow-lg border-2 border-gray-100
          transform transition-all duration-300 ease-out
          ${isTransitioning ? 'scale-95 opacity-50 rotate-3' : 'scale-100 opacity-100 rotate-0'}
        `}>
          {/* Platform indicator */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary-400 text-white text-xs font-semibold rounded-full">
            {getCurrentPlatform()}
          </div>

          <QRCode
            value={url}
            size={200}
            className="mx-auto"
            aria-label="QR Code for app download"
          />

          {/* Loading overlay during transition */}
          {isTransitioning && (
            <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Instructions */}
        <p className="text-center text-sm text-gray-600 my-6 leading-relaxed">
          Point your phone camera at the QR code to download the app for <span className="font-semibold text-primary-400">{getCurrentPlatform()}</span>
        </p>

        {/* Switch platform button */}
        <button
          aria-label="Switch platform"
          aria-describedby="switch-platform-description"
          onClick={toggleUrl}
          disabled={isTransitioning}
          className={`
            group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-400 to-primary-500 
            text-white rounded-lg font-semibold text-sm
            transform transition-all duration-300 ease-out
            hover:from-primary-500 hover:to-primary-600 hover:scale-105 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            ${isTransitioning ? 'animate-pulse' : ''}
          `}
        >
          <RefreshCw className={`w-4 h-4 transition-transform duration-300 ${isTransitioning ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          Switch to {getNextPlatform()}
        </button>

        {/* Footer note */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Available on both platforms</span>
        </div>

        {/* Floating particles */}
        <div className="absolute top-10 right-10 w-2 h-2 bg-primary-200 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-20 left-8 w-1 h-1 bg-primary-300 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/3 left-6 w-1.5 h-1.5 bg-primary-100 rounded-full animate-pulse"></div>
      </div>
    </div>,
    document.body
  );
};

export default QRCodeComponent;
