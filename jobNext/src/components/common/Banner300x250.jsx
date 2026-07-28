import { useEffect, useRef } from "react";

export default function Banner300x250() {
  return null;
}
//     const bannerRef = useRef(null);

//     useEffect(() => {
//         if (!bannerRef.current || bannerRef.current.firstChild) return;

//         const config = document.createElement("script");
//         config.innerHTML = `
//       atOptions = {
//         'key' : '9d151a7249a0c1bc8697fd1fd48c21d4',
//         'format' : 'iframe',
//         'height' : 250,
//         'width' : 300,
//         'params' : {}
//       };
//     `;

//         const script = document.createElement("script");
//         script.src =
//             "https://www.highperformanceformat.com/9d151a7249a0c1bc8697fd1fd48c21d4/invoke.js";
//         script.async = true;

//         bannerRef.current.appendChild(config);
//         bannerRef.current.appendChild(script);
//     }, []);

//     return (
//         <div
//             ref={bannerRef}
//             style={{
//                 width: "300px",
//                 height: "250px",
//                 margin: "20px auto",
//             }}
//         />
//     );
// }