import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Menu } from "../components.js";

function ChatHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex w-full items-center justify-center px-3 py-2 lg:p-4 bg-[#eeeeee] shadow-lg shadow-gray-800/75 lg:pr-[2rem] ">
      <div className="flex justify-center items-center cursor-pointer mb-1 ">
        <ArrowBackIosIcon
          onClick={() => {
            navigate("/");
          }}
          className="text-gray-900 hover:text-gray-700 focus:outline-none"
          aria-label="Go back to the previous menu"
        />
      </div>
      <div className="flex-1 p-1 text-end">
        <Menu />
      </div>
    </div>
  );
}

export default ChatHeader;
