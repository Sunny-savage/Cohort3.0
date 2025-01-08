import { ReactElement } from "react";

interface sidebar {
  text: string;
  icon: ReactElement;
}
const SideBarItem = ({ text, icon }: sidebar) => {
  return (
    <div className="flex items-center transition-all duration-200 rounded max-w-48 pl-4 text-gray-700 py-2 cursor-pointer hover:bg-gray-200">
      <div className="pr-2"> {icon}</div>
      <div> {text}</div>
    </div>
  );
};

export default SideBarItem;
