// import React, { ReactNode, useState } from "react";

// interface ICollapsible {
//   open?: boolean;
//   label: string;
//   children: ReactNode;
// }

// const Collapsible: React.FC<ICollapsible> = ({ open, children, label }) => {
//   const [isOpen, setIsOpen] = useState(open ?? false);

//   const toggleCollapse = () => {
//     setIsOpen((prev) => !prev);
//   };

//   return (
//     <>
//       <div className="collapsible">
//         <div>
//           <div className="border-b-2 flex justify-between">
//             <h1 className="font-bold collapsible-label">{label}</h1>
//             <button
//               type="button"
//               className="collapsible-button"
//               onClick={toggleCollapse}
//             >
//               {!isOpen ? <></> : <></>}
//             </button>
//           </div>
//         </div>

//         <div className="border-b-2">
//           <div>{isOpen && <div>{children}</div>}</div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Collapsible;
