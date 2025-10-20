  export  const stringArrayToArray = (array: string) => {
        let arr = new Array(array);
        let servicesArray = JSON.parse(arr[0]);
        return servicesArray;
    }

    export function detectDevice() {
  const userAgent = navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "iOS Device";
  }

  if (/android/i.test(userAgent)) {
    return "Android Device";
  }

  if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
    return "Mac";
  }

  if (
    /Win32|Win64|Windows|WinCE/.test(userAgent) ||
    /Linux|X11/.test(userAgent)
  ) {
    return "Desktop";
  }

  // if (/Mobi|Android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
  //   return "Mobile Device";
  // }

  // if (/Linux|X11/.test(userAgent) || /Macintosh|Windows|Win/.test(userAgent)) {
  //   return "Desktop";
  // }

  return "Unknown";
}

export function formatNumberWithCommas(numb: number): string {
  let number = numb;
    if (typeof number !== 'number') {
        throw new Error('Input must be a number');
        number = parseFloat(`${numb}`);
    }
    
    return number.toLocaleString();
}